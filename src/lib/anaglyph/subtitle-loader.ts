export type SubtitleCue = {
  start: number;
  end: number;
  text: string;
};

function parseTimestamp(value: string): number {
  const v = value.trim().replace(",", ".");
  const match = v.match(/^(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/);
  if (!match) throw new Error(`Invalid subtitle timestamp: ${value}`);
  return (
    Number(match[1] ?? 0) * 3600 +
    Number(match[2]) * 60 +
    Number(match[3]) +
    Number(match[4]) / 1000
  );
}

function cleanText(value: string): string {
  return value.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").trim();
}

export function parseSubtitleText(text: string, extension: string): SubtitleCue[] {
  const normalized = text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const blocks = normalized.split(/\n{2,}/);
  const cues: SubtitleCue[] = [];

  for (const block of blocks) {
    if (extension === ".vtt" && /^WEBVTT\b/i.test(block.trim())) continue;
    const lines = block.split("\n");
    const timingIndex = lines.findIndex((line) => line.includes("-->"));
    if (timingIndex < 0) continue;

    const timing = lines[timingIndex].split("-->");
    if (timing.length < 2) continue;

    try {
      const start = parseTimestamp(timing[0]);
      const end = parseTimestamp(timing[1].trim().split(/\s+/)[0]);
      const subtitleText = cleanText(lines.slice(timingIndex + 1).join("\n"));
      if (subtitleText && end > start) cues.push({ start, end, text: subtitleText });
    } catch {
      // Ignore malformed cue.
    }
  }

  return cues.sort((x, y) => x.start - y.start);
}

export async function parseSubtitleFile(file: File): Promise<SubtitleCue[]> {
  const lower = file.name.toLowerCase();
  if (!lower.endsWith(".srt") && !lower.endsWith(".vtt")) {
    throw new Error("Only SRT and VTT subtitle files are supported.");
  }
  return parseSubtitleText(
    await file.text(),
    lower.endsWith(".vtt") ? ".vtt" : ".srt",
  );
}

export function findSubtitleCue(
  cues: SubtitleCue[],
  time: number,
): SubtitleCue | null {
  let low = 0;
  let high = cues.length - 1;
  let index = -1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (cues[mid].start <= time) {
      index = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  if (index >= 0) {
    const cue = cues[index];
    if (time >= cue.start && time < cue.end) return cue;
  }

  return null;
}
