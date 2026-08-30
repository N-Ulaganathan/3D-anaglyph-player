export const DEMO_EXPORT_SECONDS = 8;

export type ExportProgress = {
  ratio: number;
  currentTime: number;
  duration: number;
};

export function pickRecorderMime(): { mime: string; ext: "webm" | "mp4" } {
  const candidates: Array<{ mime: string; ext: "webm" | "mp4" }> = [
    { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mime: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mime: "video/webm;codecs=vp9", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
    { mime: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
  ];
  for (const candidate of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(candidate.mime)) {
      return candidate;
    }
  }
  return { mime: "video/webm", ext: "webm" };
}

export function exportFileName(sourceName: string | null, ext: string) {
  const base = (sourceName ?? "demo-reel").replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-");
  return `stereoscope-3d-${base}.${ext}`;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function aborted(signal: AbortSignal) {
  return new DOMException("Aborted", "AbortError");
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(aborted(signal));
      return;
    }
    const id = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(id);
      reject(aborted(signal));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function seekTo(video: HTMLVideoElement, time: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(aborted(signal));
      return;
    }
    if (Math.abs(video.currentTime - time) < 0.04) {
      resolve();
      return;
    }
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Could not rewind the film"));
    };
    const onAbort = () => {
      cleanup();
      reject(aborted(signal));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      signal.removeEventListener("abort", onAbort);
    };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);
    signal.addEventListener("abort", onAbort);
    video.currentTime = time;
  });
}

function makeStream(canvas: HTMLCanvasElement, video: HTMLVideoElement | null, fps: number) {
  const canvasStream = canvas.captureStream(fps);
  const picture = canvasStream.getVideoTracks()[0];
  if (!picture) throw new Error("Could not capture the converted picture");
  const tracks: MediaStreamTrack[] = [picture];
  const capture = (
    video as (HTMLVideoElement & { captureStream?: (frameRate?: number) => MediaStream }) | null
  )?.captureStream;
  if (video && typeof capture === "function") {
    const audio = capture.call(video).getAudioTracks()[0];
    if (audio) tracks.push(audio);
  }
  return new MediaStream(tracks);
}

function recordStream(
  stream: MediaStream,
  mime: string,
  bitsPerSecond: number,
  signal: AbortSignal,
) {
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: mime || undefined,
    videoBitsPerSecond: bitsPerSecond,
  });
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const stopped = new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error("Recording failed"));
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime || "video/webm" }));
  });
  const onAbort = () => {
    if (recorder.state !== "inactive") recorder.stop();
  };
  signal.addEventListener("abort", onAbort);
  recorder.start(200);
  return {
    stop: () => {
      signal.removeEventListener("abort", onAbort);
      if (recorder.state !== "inactive") recorder.stop();
      return stopped;
    },
  };
}

export async function convertToVideo(options: {
  canvas: HTMLCanvasElement;
  video: HTMLVideoElement | null;
  isDemo: boolean;
  duration: number;
  fps?: number;
  bitsPerSecond?: number;
  onProgress: (progress: ExportProgress) => void;
  signal: AbortSignal;
}): Promise<{ blob: Blob; mime: string; ext: "webm" | "mp4" }> {
  if (typeof MediaRecorder === "undefined") {
    throw new Error("This browser cannot record video");
  }
  const { mime, ext } = pickRecorderMime();
  const fps = options.fps ?? 30;
  const bits = options.bitsPerSecond ?? 6_000_000;
  const stream = makeStream(options.canvas, options.isDemo ? null : options.video, fps);
  const session = recordStream(stream, mime, bits, options.signal);

  try {
    if (options.isDemo || !options.video) {
      const start = performance.now();
      const duration = Math.max(1, options.duration);
      while (!options.signal.aborted) {
        const elapsed = (performance.now() - start) / 1000;
        options.onProgress({
          ratio: Math.min(1, elapsed / duration),
          currentTime: Math.min(elapsed, duration),
          duration,
        });
        if (elapsed >= duration) break;
        await wait(80, options.signal);
      }
    } else {
      const video = options.video;
      const wasMuted = video.muted;
      video.muted = false;
      video.playbackRate = 1;
      await seekTo(video, 0, options.signal);
      await video.play();
      try {
        await new Promise<void>((resolve, reject) => {
          const onEnded = () => {
            cleanup();
            resolve();
          };
          const onAbort = () => {
            cleanup();
            video.pause();
            reject(aborted(options.signal));
          };
          const onTime = () => {
            const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : options.duration;
            options.onProgress({
              ratio: duration > 0 ? Math.min(1, video.currentTime / duration) : 0,
              currentTime: video.currentTime,
              duration,
            });
          };
          const cleanup = () => {
            video.removeEventListener("ended", onEnded);
            video.removeEventListener("timeupdate", onTime);
            options.signal.removeEventListener("abort", onAbort);
          };
          video.addEventListener("ended", onEnded);
          video.addEventListener("timeupdate", onTime);
          options.signal.addEventListener("abort", onAbort);
          if (options.signal.aborted) onAbort();
        });
      } finally {
        video.muted = wasMuted;
      }
    }
    const blob = await session.stop();
    if (options.signal.aborted) throw aborted(options.signal);
    if (blob.size < 64) throw new Error("The converted file was empty");
    return { blob, mime, ext };
  } catch (error) {
    await session.stop().catch(() => undefined);
    throw error;
  }
}
