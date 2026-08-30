import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as Camera, a as SlidersHorizontal, c as Pause, d as FolderOpen, f as Download, g as Check, h as ChevronDown, l as Minimize, m as CircleHelp, n as VolumeX, o as RotateCcw, p as Clapperboard, r as Volume2, s as Play, t as X, u as Maximize } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
import { t as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbNB7LRe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTimecode(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const s = Math.floor(seconds);
	const h = Math.floor(s / 3600);
	const m = Math.floor(s % 3600 / 60);
	const r = s % 60;
	if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
	return `${m}:${String(r).padStart(2, "0")}`;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "text-foreground hover:bg-secondary",
			outline: "shadow-[var(--shadow-border)] bg-transparent hover:bg-secondary",
			destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-11 rounded-lg px-5",
			icon: "size-11",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function TooltipProvider({ delayDuration = 250, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
function Tooltip({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root3, { ...props });
}
function TooltipTrigger({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, { ...props });
}
function TooltipContent({ className, sideOffset = 6, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 overflow-hidden rounded-md bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-[var(--shadow-border)]", className),
		...props
	}) });
}
function clamp01(v) {
	return Math.min(1, Math.max(0, v));
}
function depthGray(z, near = 2.4, far = 12) {
	const d = 1 - clamp01((z - near) / (far - near));
	const g = Math.round(40 + d * 215);
	return `rgb(${g}, ${g}, ${g})`;
}
var DemoScene = class {
	color;
	depth;
	cw;
	dw;
	width;
	height;
	constructor(width = 1280, height = 720) {
		this.width = width;
		this.height = height;
		this.color = document.createElement("canvas");
		this.depth = document.createElement("canvas");
		this.color.width = width;
		this.color.height = height;
		this.depth.width = width;
		this.depth.height = height;
		const cw = this.color.getContext("2d", { alpha: false });
		const dw = this.depth.getContext("2d", { alpha: false });
		if (!cw || !dw) throw new Error("Canvas 2D is not available");
		this.cw = cw;
		this.dw = dw;
	}
	draw(time) {
		this.drawPass(this.cw, time, "color");
		this.drawPass(this.dw, time, "depth");
	}
	destroy() {
		this.color.width = 1;
		this.color.height = 1;
		this.depth.width = 1;
		this.depth.height = 1;
	}
	project(p, time) {
		const a = time * .22;
		const ca = Math.cos(a);
		const sa = Math.sin(a);
		const rx = p.x * ca - p.z * sa;
		const camZ = p.x * sa + p.z * ca + 5.6;
		const camY = p.y - .05 + Math.sin(time * .4) * .06;
		const s = 2.6 / camZ;
		return {
			x: this.width * .5 + rx * s * this.width * .46,
			y: this.height * .5 + camY * s * this.width * .46,
			z: camZ,
			s
		};
	}
	drawPass(ctx, time, pass) {
		const { width: w, height: h } = this;
		if (pass === "color") {
			const sky = ctx.createLinearGradient(0, 0, 0, h);
			sky.addColorStop(0, "#2a3140");
			sky.addColorStop(.42, "#1b2028");
			sky.addColorStop(1, "#12141a");
			ctx.fillStyle = sky;
			ctx.fillRect(0, 0, w, h);
		} else {
			ctx.fillStyle = "#1a1a1a";
			ctx.fillRect(0, 0, w, h);
		}
		const sprites = [];
		if (pass === "color") sprites.push({
			z: 12,
			draw: (c) => {
				c.save();
				for (let i = 0; i < 70; i++) {
					const seed = i * 17.17;
					const x = seed * 73.1 % 1 * w;
					const y = seed * 29.7 % 1 * h * .5;
					c.fillStyle = `rgba(236,240,246,${.35 + (.35 + Math.sin(time * 1.6 + seed) * .2)})`;
					c.beginPath();
					c.arc(x, y, 1.1 + i % 3 * .5, 0, Math.PI * 2);
					c.fill();
				}
				c.restore();
			}
		});
		for (let i = -7; i <= 7; i++) for (let k = 0; k < 10; k++) {
			const z0 = .8 + k * .7;
			const z1 = z0 + .7;
			const x = i * .7;
			sprites.push({
				z: z0 + 3,
				draw: (c) => {
					const a = this.project({
						x,
						y: 1.05,
						z: z0
					}, time);
					const b = this.project({
						x,
						y: 1.05,
						z: z1
					}, time);
					const fade = clamp01(1.2 - k / 10);
					if (pass === "depth") {
						c.strokeStyle = depthGray((a.z + b.z) * .5);
						c.lineWidth = 3;
					} else {
						c.strokeStyle = `rgba(210,218,228,${.16 + fade * .38})`;
						c.lineWidth = 1.6;
					}
					c.beginPath();
					c.moveTo(a.x, a.y);
					c.lineTo(b.x, b.y);
					c.stroke();
				}
			});
		}
		for (let k = 0; k < 10; k++) {
			const z = .8 + k * .7;
			sprites.push({
				z: z + 3,
				draw: (c) => {
					const a = this.project({
						x: -4.9,
						y: 1.05,
						z
					}, time);
					const b = this.project({
						x: 4.9,
						y: 1.05,
						z
					}, time);
					const fade = clamp01(1.2 - k / 10);
					if (pass === "depth") {
						c.strokeStyle = depthGray(a.z);
						c.lineWidth = 3;
					} else {
						c.strokeStyle = `rgba(210,218,228,${.16 + fade * .38})`;
						c.lineWidth = 1.6;
					}
					c.beginPath();
					c.moveTo(a.x, a.y);
					c.lineTo(b.x, b.y);
					c.stroke();
				}
			});
		}
		for (const x of [
			-2.4,
			-1.2,
			1.2,
			2.4
		]) sprites.push({
			z: 4.4,
			draw: (c) => {
				const top = this.project({
					x,
					y: -1.15,
					z: .9
				}, time);
				const bot = this.project({
					x,
					y: 1.05,
					z: .9
				}, time);
				const r = Math.max(10, 22 * top.s * 7);
				if (pass === "depth") {
					c.fillStyle = depthGray(top.z);
					c.fillRect(top.x - r * .32, top.y, r * .64, bot.y - top.y);
				} else {
					const g = c.createLinearGradient(top.x - r, top.y, top.x + r, bot.y);
					g.addColorStop(0, "#3a3f48");
					g.addColorStop(.45, "#e4e8ee");
					g.addColorStop(1, "#23262c");
					c.fillStyle = g;
					c.fillRect(top.x - r * .32, top.y, r * .64, bot.y - top.y);
				}
			}
		});
		for (const orb of [
			{
				p: {
					x: -1.35,
					y: -.05,
					z: -.55
				},
				hue: "#e06a58",
				r: .58
			},
			{
				p: {
					x: 1.45,
					y: .12,
					z: .35
				},
				hue: "#3db4c0",
				r: .48
			},
			{
				p: {
					x: .05,
					y: -.48,
					z: 1.15
				},
				hue: "#f2f4f7",
				r: .32
			},
			{
				p: {
					x: -2.15,
					y: .28,
					z: 1.7
				},
				hue: "#a8b0ba",
				r: .24
			},
			{
				p: {
					x: 2.2,
					y: -.28,
					z: -.9
				},
				hue: "#c5ced6",
				r: .36
			}
		]) {
			const bob = Math.sin(time * .9 + orb.p.x) * .1;
			const p = {
				...orb.p,
				y: orb.p.y + bob
			};
			const q = this.project(p, time);
			sprites.push({
				z: q.z,
				draw: (c) => {
					const radius = Math.max(18, orb.r * q.s * this.width * .46);
					if (pass === "depth") {
						c.fillStyle = depthGray(q.z);
						c.beginPath();
						c.arc(q.x, q.y, radius, 0, Math.PI * 2);
						c.fill();
						return;
					}
					const g = c.createRadialGradient(q.x - radius * .32, q.y - radius * .34, radius * .08, q.x, q.y, radius);
					g.addColorStop(0, "#ffffff");
					g.addColorStop(.28, orb.hue);
					g.addColorStop(1, "#14161c");
					c.fillStyle = g;
					c.beginPath();
					c.arc(q.x, q.y, radius, 0, Math.PI * 2);
					c.fill();
				}
			});
		}
		sprites.sort((a, b) => b.z - a.z);
		for (const sprite of sprites) sprite.draw(ctx, pass);
	}
};
function pickRecorderMime() {
	for (const candidate of [
		{
			mime: "video/webm;codecs=vp9,opus",
			ext: "webm"
		},
		{
			mime: "video/webm;codecs=vp8,opus",
			ext: "webm"
		},
		{
			mime: "video/webm;codecs=vp9",
			ext: "webm"
		},
		{
			mime: "video/webm",
			ext: "webm"
		},
		{
			mime: "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
			ext: "mp4"
		},
		{
			mime: "video/mp4",
			ext: "mp4"
		}
	]) if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(candidate.mime)) return candidate;
	return {
		mime: "video/webm",
		ext: "webm"
	};
}
function exportFileName(sourceName, ext) {
	return `stereoscope-3d-${(sourceName ?? "demo-reel").replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "-")}.${ext}`;
}
function downloadBlob(blob, name) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function aborted(signal) {
	return new DOMException("Aborted", "AbortError");
}
function wait(ms, signal) {
	return new Promise((resolve, reject) => {
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
function seekTo(video, time, signal) {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(aborted(signal));
			return;
		}
		if (Math.abs(video.currentTime - time) < .04) {
			resolve();
			return;
		}
		const onSeeked = () => {
			cleanup();
			resolve();
		};
		const onError = () => {
			cleanup();
			reject(/* @__PURE__ */ new Error("Could not rewind the film"));
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
function makeStream(canvas, video, fps) {
	const picture = canvas.captureStream(fps).getVideoTracks()[0];
	if (!picture) throw new Error("Could not capture the converted picture");
	const tracks = [picture];
	const capture = video?.captureStream;
	if (video && typeof capture === "function") {
		const audio = capture.call(video).getAudioTracks()[0];
		if (audio) tracks.push(audio);
	}
	return new MediaStream(tracks);
}
function recordStream(stream, mime, bitsPerSecond, signal) {
	const chunks = [];
	const recorder = new MediaRecorder(stream, {
		mimeType: mime || void 0,
		videoBitsPerSecond: bitsPerSecond
	});
	recorder.ondataavailable = (event) => {
		if (event.data.size > 0) chunks.push(event.data);
	};
	const stopped = new Promise((resolve, reject) => {
		recorder.onerror = () => reject(/* @__PURE__ */ new Error("Recording failed"));
		recorder.onstop = () => resolve(new Blob(chunks, { type: mime || "video/webm" }));
	});
	const onAbort = () => {
		if (recorder.state !== "inactive") recorder.stop();
	};
	signal.addEventListener("abort", onAbort);
	recorder.start(200);
	return { stop: () => {
		signal.removeEventListener("abort", onAbort);
		if (recorder.state !== "inactive") recorder.stop();
		return stopped;
	} };
}
async function convertToVideo(options) {
	if (typeof MediaRecorder === "undefined") throw new Error("This browser cannot record video");
	const { mime, ext } = pickRecorderMime();
	const fps = options.fps ?? 30;
	const bits = options.bitsPerSecond ?? 6e6;
	const session = recordStream(makeStream(options.canvas, options.isDemo ? null : options.video, fps), mime, bits, options.signal);
	try {
		if (options.isDemo || !options.video) {
			const start = performance.now();
			const duration = Math.max(1, options.duration);
			while (!options.signal.aborted) {
				const elapsed = (performance.now() - start) / 1e3;
				options.onProgress({
					ratio: Math.min(1, elapsed / duration),
					currentTime: Math.min(elapsed, duration),
					duration
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
				await new Promise((resolve, reject) => {
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
							duration
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
		return {
			blob,
			mime,
			ext
		};
	} catch (error) {
		await session.stop().catch(() => void 0);
		throw error;
	}
}
var VERT = `#version 300 es
in vec2 aPos;
in vec2 aUv;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;
var DEPTH_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVideo;
uniform vec2 uTexel;
uniform float uLumaWeight;
uniform float uEdgeWeight;
uniform float uCenterWeight;
uniform float uWarmWeight;
uniform float uInvert;
uniform float uDepthContrast;
in vec2 vUv;
out vec4 fragColor;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
  vec3 c = texture(uVideo, vUv).rgb;
  float L = luma(c);

  float lL = luma(texture(uVideo, vUv + vec2(-uTexel.x, 0.0)).rgb);
  float lR = luma(texture(uVideo, vUv + vec2(uTexel.x, 0.0)).rgb);
  float lD = luma(texture(uVideo, vUv + vec2(0.0, -uTexel.y)).rgb);
  float lU = luma(texture(uVideo, vUv + vec2(0.0, uTexel.y)).rgb);
  float edge = clamp(length(vec2(lR - lL, lU - lD)) * 2.2, 0.0, 1.0);

  float radial = 1.0 - smoothstep(0.0, 0.78, length(vUv - 0.5) * 1.55);
  float warm = clamp((c.r - c.b) * 0.65 + 0.5, 0.0, 1.0);

  float w = uLumaWeight + uEdgeWeight + uCenterWeight + uWarmWeight;
  float depth = w > 0.0
    ? (L * uLumaWeight + edge * uEdgeWeight + radial * uCenterWeight + warm * uWarmWeight) / w
    : 0.5;

  if (uInvert > 0.5) depth = 1.0 - depth;
  depth = clamp((depth - 0.5) * (0.35 + uDepthContrast * 1.8) + 0.5, 0.0, 1.0);
  fragColor = vec4(depth, depth, depth, 1.0);
}
`;
var COPY_DEPTH_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uDepth;
uniform float uInvert;
uniform float uDepthContrast;
in vec2 vUv;
out vec4 fragColor;
void main() {
  float d = texture(uDepth, vUv).r;
  if (uInvert > 0.5) d = 1.0 - d;
  d = clamp((d - 0.5) * (0.35 + uDepthContrast * 1.8) + 0.5, 0.0, 1.0);
  fragColor = vec4(d, d, d, 1.0);
}
`;
var BLUR_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uTex;
uniform vec2 uDir;
uniform float uRadius;
in vec2 vUv;
out vec4 fragColor;
void main() {
  vec2 off = uDir * uRadius;
  float w0 = 0.227027;
  float w1 = 0.1945946;
  float w2 = 0.1216216;
  float w3 = 0.054054;
  float w4 = 0.016216;
  float d = texture(uTex, vUv).r * w0;
  d += texture(uTex, vUv + off).r * w1;
  d += texture(uTex, vUv - off).r * w1;
  d += texture(uTex, vUv + off * 2.0).r * w2;
  d += texture(uTex, vUv - off * 2.0).r * w2;
  d += texture(uTex, vUv + off * 3.0).r * w3;
  d += texture(uTex, vUv - off * 3.0).r * w3;
  d += texture(uTex, vUv + off * 4.0).r * w4;
  d += texture(uTex, vUv - off * 4.0).r * w4;
  fragColor = vec4(d, d, d, 1.0);
}
`;
var COMPOSITE_FRAG = `#version 300 es
precision highp float;
uniform sampler2D uVideo;
uniform sampler2D uDepth;
uniform float uStrength;
uniform float uConvergence;
uniform float uSwap;
uniform float uGhost;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uZoom;
uniform float uTime;
uniform float uWiggleSpeed;
uniform int uViewMode;
uniform int uAnaglyphMode;
in vec2 vUv;
out vec4 fragColor;

float luma(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

vec3 adjust(vec3 c) {
  c = (c - 0.5) * uContrast + 0.5 + uBrightness;
  float l = luma(c);
  c = mix(vec3(l), c, uSaturation);
  return clamp(c, 0.0, 1.0);
}

vec3 warpEye(vec2 uv, float sign) {
  float d = texture(uDepth, uv).r;
  float disp = (d - uConvergence) * uStrength;
  vec2 p = uv + vec2(sign * disp, 0.0);
  p = clamp(p, 0.0, 1.0);
  return adjust(texture(uVideo, p).rgb);
}

vec3 dubois(vec3 l, vec3 r) {
  vec3 o;
  o.r =  0.437 * l.r + 0.449 * l.g + 0.164 * l.b
      - 0.011 * r.r - 0.032 * r.g - 0.007 * r.b;
  o.g = -0.062 * l.r - 0.062 * l.g - 0.024 * l.b
      + 0.377 * r.r + 0.761 * r.g + 0.009 * r.b;
  o.b = -0.048 * l.r - 0.050 * l.g - 0.017 * l.b
      - 0.026 * r.r - 0.093 * r.g + 1.234 * r.b;
  return clamp(o, 0.0, 1.0);
}

vec3 encodeAnaglyph(vec3 l, vec3 r, int mode) {
  float ll = luma(l);
  float rl = luma(r);
  if (mode == 0) return dubois(l, r);
  if (mode == 1) return vec3(l.r, r.g, r.b);
  if (mode == 2) return vec3(ll, r.g, r.b);
  if (mode == 3) return vec3(ll, rl, rl);
  if (mode == 4) return vec3(l.r, l.g * 0.85 + l.r * 0.15, r.b);
  return vec3(r.r, l.g, r.b);
}

void main() {
  vec2 uv = (vUv - 0.5) / max(uZoom, 1.0) + 0.5;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  if (uViewMode == 1) {
    fragColor = vec4(adjust(texture(uVideo, uv).rgb), 1.0);
    return;
  }
  if (uViewMode == 2) {
    float d = texture(uDepth, uv).r;
    fragColor = vec4(vec3(d), 1.0);
    return;
  }

  float signL = uSwap > 0.5 ? 1.0 : -1.0;
  float signR = -signL;

  if (uViewMode == 3) {
    vec2 suv = vec2(uv.x < 0.5 ? uv.x * 2.0 : (uv.x - 0.5) * 2.0, uv.y);
    vec3 eye = warpEye(suv, uv.x < 0.5 ? signL : signR);
    fragColor = vec4(eye, 1.0);
    return;
  }

  vec3 left = warpEye(uv, signL);
  vec3 right = warpEye(uv, signR);

  float g = uGhost;
  float lLuma = luma(left);
  float rLuma = luma(right);
  left = mix(left, vec3(lLuma), vec3(0.0, g, g));
  right = mix(right, vec3(rLuma), vec3(g, 0.0, 0.0));

  if (uViewMode == 4) {
    float w = sin(uTime * uWiggleSpeed * 6.28318) * 0.5 + 0.5;
    fragColor = vec4(mix(left, right, w), 1.0);
    return;
  }

  fragColor = vec4(encodeAnaglyph(left, right, uAnaglyphMode), 1.0);
}
`;
var QUALITY_MAX_WIDTH = {
	low: 640,
	medium: 1280,
	high: 1920
};
var ANAGLYPH_MODE_LABELS = {
	dubois: "Red–cyan · Dubois",
	color: "Red–cyan · Color",
	half: "Red–cyan · Half-color",
	gray: "Red–cyan · Gray",
	"amber-blue": "Amber–blue",
	"green-magenta": "Green–magenta"
};
var VIEW_MODE_LABELS = {
	anaglyph: "Anaglyph",
	original: "Original",
	depth: "Depth",
	sbs: "Side by side",
	wiggle: "Wiggle 3D"
};
var QUALITY_LABELS = {
	low: "Fast · 640",
	medium: "Cinema · 1280",
	high: "Full · 1920"
};
var PRESET_LABELS = {
	balanced: "Balanced",
	portrait: "Portrait",
	landscape: "Landscape",
	action: "Action",
	subtle: "Subtle",
	dramatic: "Dramatic"
};
var DEFAULT_SETTINGS = {
	anaglyphMode: "dubois",
	viewMode: "anaglyph",
	quality: "medium",
	intensity: .42,
	convergence: .48,
	swapEyes: false,
	invertDepth: false,
	smoothness: .55,
	lumaWeight: .2,
	edgeWeight: .25,
	centerWeight: .4,
	warmWeight: .15,
	depthContrast: .65,
	ghostReduce: .35,
	brightness: 0,
	contrast: 1,
	saturation: 1,
	zoom: 1.04,
	wiggleSpeed: .7
};
var PRESETS = {
	balanced: {
		lumaWeight: .2,
		edgeWeight: .25,
		centerWeight: .4,
		warmWeight: .15,
		invertDepth: false,
		intensity: .55,
		smoothness: .55,
		depthContrast: .65,
		convergence: .42
	},
	portrait: {
		lumaWeight: .25,
		edgeWeight: .12,
		centerWeight: .5,
		warmWeight: .13,
		invertDepth: false,
		intensity: .46,
		smoothness: .68,
		depthContrast: .58,
		convergence: .48
	},
	landscape: {
		lumaWeight: .38,
		edgeWeight: .22,
		centerWeight: .22,
		warmWeight: .18,
		invertDepth: true,
		intensity: .5,
		smoothness: .5,
		depthContrast: .7,
		convergence: .4
	},
	action: {
		lumaWeight: .14,
		edgeWeight: .48,
		centerWeight: .26,
		warmWeight: .12,
		invertDepth: false,
		intensity: .72,
		smoothness: .32,
		depthContrast: .78,
		convergence: .38
	},
	subtle: {
		intensity: .28,
		smoothness: .72,
		depthContrast: .42,
		convergence: .5,
		ghostReduce: .5
	},
	dramatic: {
		intensity: .86,
		smoothness: .34,
		depthContrast: .88,
		convergence: .32,
		ghostReduce: .2
	}
};
var ANAGLYPH_INDEX = {
	dubois: 0,
	color: 1,
	half: 2,
	gray: 3,
	"amber-blue": 4,
	"green-magenta": 5
};
var VIEW_INDEX = {
	anaglyph: 0,
	original: 1,
	depth: 2,
	sbs: 3,
	wiggle: 4
};
function compile(gl, type, src) {
	const sh = gl.createShader(type);
	if (!sh) throw new Error("Unable to create shader");
	gl.shaderSource(sh, src);
	gl.compileShader(sh);
	if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
		const log = gl.getShaderInfoLog(sh) ?? "shader compile failed";
		gl.deleteShader(sh);
		throw new Error(log);
	}
	return sh;
}
function makeProgram(gl, frag, uniformNames) {
	const vs = compile(gl, gl.VERTEX_SHADER, VERT);
	const fs = compile(gl, gl.FRAGMENT_SHADER, frag);
	const prog = gl.createProgram();
	if (!prog) throw new Error("Unable to create program");
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.bindAttribLocation(prog, 0, "aPos");
	gl.bindAttribLocation(prog, 1, "aUv");
	gl.linkProgram(prog);
	gl.deleteShader(vs);
	gl.deleteShader(fs);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		const log = gl.getProgramInfoLog(prog) ?? "program link failed";
		gl.deleteProgram(prog);
		throw new Error(log);
	}
	const uniforms = {};
	for (const name of uniformNames) uniforms[name] = gl.getUniformLocation(prog, name);
	return {
		prog,
		uniforms,
		aPos: 0,
		aUv: 1
	};
}
function makeTexture(gl) {
	const tex = gl.createTexture();
	if (!tex) throw new Error("Unable to create texture");
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return tex;
}
function makeFbo(gl, w, h) {
	const tex = makeTexture(gl);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	const fb = gl.createFramebuffer();
	if (!fb) throw new Error("Unable to create framebuffer");
	gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("Framebuffer incomplete");
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return {
		fb,
		tex,
		w,
		h
	};
}
function sourceSize(src) {
	if (src instanceof HTMLVideoElement) {
		if (src.readyState < 2 || src.videoWidth === 0) return null;
		return {
			w: src.videoWidth,
			h: src.videoHeight
		};
	}
	if (src instanceof HTMLCanvasElement) return {
		w: src.width,
		h: src.height
	};
	if (typeof OffscreenCanvas !== "undefined" && src instanceof OffscreenCanvas) return {
		w: src.width,
		h: src.height
	};
	if (src instanceof HTMLImageElement) {
		if (!src.naturalWidth) return null;
		return {
			w: src.naturalWidth,
			h: src.naturalHeight
		};
	}
	return null;
}
var AnaglyphRenderer = class {
	gl;
	glCanvas;
	display;
	vao;
	depthProg;
	copyProg;
	blurProg;
	compositeProg;
	videoTex;
	trueDepthTex;
	depthFbo = null;
	blurFbo = null;
	colorSource = null;
	depthSource = null;
	settings = null;
	texW = 0;
	texH = 0;
	startMs = performance.now();
	destroyed = false;
	constructor(display) {
		this.display = display;
		const glCanvas = document.createElement("canvas");
		const gl = glCanvas.getContext("webgl2", {
			alpha: false,
			antialias: false,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true,
			powerPreference: "high-performance"
		});
		if (!gl) throw new Error("WebGL2 is not available in this browser");
		this.glCanvas = glCanvas;
		this.gl = gl;
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		this.depthProg = makeProgram(gl, DEPTH_FRAG, [
			"uVideo",
			"uTexel",
			"uLumaWeight",
			"uEdgeWeight",
			"uCenterWeight",
			"uWarmWeight",
			"uInvert",
			"uDepthContrast"
		]);
		this.copyProg = makeProgram(gl, COPY_DEPTH_FRAG, [
			"uDepth",
			"uInvert",
			"uDepthContrast"
		]);
		this.blurProg = makeProgram(gl, BLUR_FRAG, [
			"uTex",
			"uDir",
			"uRadius"
		]);
		this.compositeProg = makeProgram(gl, COMPOSITE_FRAG, [
			"uVideo",
			"uDepth",
			"uStrength",
			"uConvergence",
			"uSwap",
			"uGhost",
			"uBrightness",
			"uContrast",
			"uSaturation",
			"uZoom",
			"uTime",
			"uWiggleSpeed",
			"uViewMode",
			"uAnaglyphMode"
		]);
		const vao = gl.createVertexArray();
		if (!vao) throw new Error("Unable to create VAO");
		this.vao = vao;
		gl.bindVertexArray(vao);
		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-1,
			-1,
			0,
			0,
			1,
			-1,
			1,
			0,
			-1,
			1,
			0,
			1,
			1,
			1,
			1,
			1
		]), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);
		this.videoTex = makeTexture(gl);
		this.trueDepthTex = makeTexture(gl);
	}
	setSource(color, depth = null) {
		this.colorSource = color;
		this.depthSource = depth;
	}
	setSettings(settings) {
		this.settings = settings;
	}
	render() {
		if (this.destroyed) return;
		const gl = this.gl;
		const src = this.colorSource;
		const settings = this.settings;
		if (!src || !settings) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
			gl.clearColor(.043, .043, .047, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			this.blit();
			return;
		}
		const size = sourceSize(src);
		if (!size) return;
		const maxW = QUALITY_MAX_WIDTH[settings.quality];
		const scale = Math.min(1, maxW / size.w);
		const procW = Math.max(2, Math.round(size.w * scale) & -2);
		const procH = Math.max(2, Math.round(size.h * scale) & -2);
		if (this.glCanvas.width !== procW || this.glCanvas.height !== procH) {
			this.glCanvas.width = procW;
			this.glCanvas.height = procH;
		}
		this.ensureFbos(procW, procH);
		this.uploadColor(src, size.w, size.h);
		if (this.depthSource) this.uploadDepth(this.depthSource);
		const depthFbo = this.depthFbo;
		const blurFbo = this.blurFbo;
		if (!depthFbo || !blurFbo) return;
		gl.bindVertexArray(this.vao);
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.BLEND);
		if (this.depthSource) this.drawCopyDepth(depthFbo, settings);
		else this.drawEstimate(depthFbo, procW, procH, settings);
		if (settings.smoothness > .02) {
			const radius = .4 + settings.smoothness * 2.6;
			this.drawBlur(depthFbo, blurFbo, procW, procH, radius, true);
			this.drawBlur(blurFbo, depthFbo, procW, procH, radius, false);
		}
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.viewport(0, 0, procW, procH);
		this.drawComposite(depthFbo, settings);
		this.blit();
	}
	blit() {
		const src = this.glCanvas;
		const dest = this.display;
		if (dest.width !== src.width) dest.width = src.width;
		if (dest.height !== src.height) dest.height = src.height;
		const ctx = dest.getContext("2d", { alpha: false });
		if (!ctx) return;
		ctx.drawImage(src, 0, 0);
	}
	captureFrame() {
		return new Promise((resolve) => {
			this.render();
			this.display.toBlob((blob) => resolve(blob), "image/png");
		});
	}
	destroy() {
		if (this.destroyed) return;
		this.destroyed = true;
		this.gl.getExtension("WEBGL_lose_context")?.loseContext();
	}
	ensureFbos(w, h) {
		if (this.depthFbo && this.depthFbo.w === w && this.depthFbo.h === h) return;
		const gl = this.gl;
		if (this.depthFbo) {
			gl.deleteFramebuffer(this.depthFbo.fb);
			gl.deleteTexture(this.depthFbo.tex);
		}
		if (this.blurFbo) {
			gl.deleteFramebuffer(this.blurFbo.fb);
			gl.deleteTexture(this.blurFbo.tex);
		}
		this.depthFbo = makeFbo(gl, w, h);
		this.blurFbo = makeFbo(gl, w, h);
	}
	uploadColor(src, w, h) {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
		if (this.texW !== w || this.texH !== h) {
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
			this.texW = w;
			this.texH = h;
		} else gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, src);
	}
	uploadDepth(src) {
		const gl = this.gl;
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.trueDepthTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
	}
	drawEstimate(target, w, h, settings) {
		const gl = this.gl;
		const p = this.depthProg;
		gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
		gl.viewport(0, 0, target.w, target.h);
		gl.useProgram(p.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
		gl.uniform1i(p.uniforms.uVideo, 0);
		gl.uniform2f(p.uniforms.uTexel, 1 / w, 1 / h);
		gl.uniform1f(p.uniforms.uLumaWeight, settings.lumaWeight);
		gl.uniform1f(p.uniforms.uEdgeWeight, settings.edgeWeight);
		gl.uniform1f(p.uniforms.uCenterWeight, settings.centerWeight);
		gl.uniform1f(p.uniforms.uWarmWeight, settings.warmWeight);
		gl.uniform1f(p.uniforms.uInvert, settings.invertDepth ? 1 : 0);
		gl.uniform1f(p.uniforms.uDepthContrast, settings.depthContrast);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	drawCopyDepth(target, settings) {
		const gl = this.gl;
		const p = this.copyProg;
		gl.bindFramebuffer(gl.FRAMEBUFFER, target.fb);
		gl.viewport(0, 0, target.w, target.h);
		gl.useProgram(p.prog);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.trueDepthTex);
		gl.uniform1i(p.uniforms.uDepth, 1);
		gl.uniform1f(p.uniforms.uInvert, settings.invertDepth ? 1 : 0);
		gl.uniform1f(p.uniforms.uDepthContrast, settings.depthContrast);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	drawBlur(src, dest, w, h, radius, horizontal) {
		const gl = this.gl;
		const p = this.blurProg;
		gl.bindFramebuffer(gl.FRAMEBUFFER, dest.fb);
		gl.viewport(0, 0, dest.w, dest.h);
		gl.useProgram(p.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, src.tex);
		gl.uniform1i(p.uniforms.uTex, 0);
		if (horizontal) gl.uniform2f(p.uniforms.uDir, 1 / w, 0);
		else gl.uniform2f(p.uniforms.uDir, 0, 1 / h);
		gl.uniform1f(p.uniforms.uRadius, radius);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
	drawComposite(depth, settings) {
		const gl = this.gl;
		const p = this.compositeProg;
		gl.useProgram(p.prog);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, depth.tex);
		gl.uniform1i(p.uniforms.uVideo, 0);
		gl.uniform1i(p.uniforms.uDepth, 1);
		gl.uniform1f(p.uniforms.uStrength, settings.intensity * .048);
		gl.uniform1f(p.uniforms.uConvergence, settings.convergence);
		gl.uniform1f(p.uniforms.uSwap, settings.swapEyes ? 1 : 0);
		gl.uniform1f(p.uniforms.uGhost, settings.ghostReduce);
		gl.uniform1f(p.uniforms.uBrightness, settings.brightness);
		gl.uniform1f(p.uniforms.uContrast, settings.contrast);
		gl.uniform1f(p.uniforms.uSaturation, settings.saturation);
		gl.uniform1f(p.uniforms.uZoom, settings.zoom);
		gl.uniform1f(p.uniforms.uTime, (performance.now() - this.startMs) / 1e3);
		gl.uniform1f(p.uniforms.uWiggleSpeed, settings.wiggleSpeed);
		gl.uniform1i(p.uniforms.uViewMode, VIEW_INDEX[settings.viewMode]);
		gl.uniform1i(p.uniforms.uAnaglyphMode, ANAGLYPH_INDEX[settings.anaglyphMode]);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
};
var usePlayerStore = create()(persist((set) => ({
	settings: { ...DEFAULT_SETTINGS },
	preset: "balanced",
	glassesHintDismissed: false,
	setSetting: (key, value) => set((state) => ({ settings: {
		...state.settings,
		[key]: value
	} })),
	applyPreset: (preset) => set((state) => ({
		preset,
		settings: {
			...state.settings,
			...PRESETS[preset]
		}
	})),
	reset: () => set({
		settings: { ...DEFAULT_SETTINGS },
		preset: "balanced"
	}),
	dismissGlassesHint: () => set({ glassesHintDismissed: true })
}), {
	name: "stereoscope-settings",
	partialize: (state) => ({
		settings: state.settings,
		preset: state.preset,
		glassesHintDismissed: state.glassesHintDismissed
	})
}));
function ConvertDialog({ open, isDemo, fileName, duration, formatLabel, viewLabel, converting, progress, onClose, onStart, onCancel }) {
	if (!open) return null;
	const length = isDemo ? 8 : duration;
	const ratio = Math.round((progress?.ratio ?? 0) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-background/70",
			"aria-label": "Close convert",
			onClick: converting ? onCancel : onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md rounded-xl bg-card p-6 shadow-[var(--shadow-border)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: converting ? "Converting" : "Convert & download"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon-sm",
					onClick: converting ? onCancel : onClose,
					"aria-label": converting ? "Cancel convert" : "Close",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}), converting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted-foreground",
						children: "Rendering stereo frames with your current settings. Keep this tab open."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-1.5 overflow-hidden rounded-full bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-[width] duration-150",
							style: { width: `${ratio}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs tabular-nums text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							formatTimecode(progress?.currentTime ?? 0),
							" /",
							" ",
							formatTimecode(progress?.duration || length)
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [ratio, "%"] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						onClick: onCancel,
						children: "Cancel"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-pretty text-muted-foreground",
						children: "Writes a 3D video using the live stereo settings — glasses type, depth, and picture. Original and depth views export as anaglyph."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Source"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "truncate font-medium",
									children: isDemo ? "Demo reel" : fileName || "Film"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Length"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium tabular-nums",
									children: isDemo ? `8s clip` : formatTimecode(length)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Format"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: formatLabel
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "View"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: viewLabel
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: onStart,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Convert & download"]
					})
				]
			})]
		})]
	});
}
function Slider({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
		className: cn("relative flex w-full touch-none select-none items-center", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
			className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-secondary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block size-4 rounded-full bg-primary shadow-[var(--shadow-border)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none" })]
	});
}
var RATES = [
	.5,
	.75,
	1,
	1.25,
	1.5,
	2
];
function TransportBar({ isDemo, fileName, playing, currentTime, duration, volume, muted, playbackRate, fullscreen, onTogglePlay, onSeek, onVolume, onToggleMute, onCycleRate, onToggleFullscreen, onCapture, onConvert, converting }) {
	const canSeek = !isDemo && duration > 0 && Number.isFinite(duration);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 border-t border-border bg-card px-4 py-3 md:px-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-10 shrink-0 text-right font-sans text-xs tabular-nums text-muted-foreground",
					children: isDemo ? "Live" : formatTimecode(currentTime)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
					min: 0,
					max: canSeek ? duration : 1,
					step: .05,
					value: [canSeek ? currentTime : 0],
					disabled: !canSeek,
					onValueChange: ([v]) => onSeek(v ?? 0),
					className: cn(!canSeek && "opacity-40")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-10 shrink-0 font-sans text-xs tabular-nums text-muted-foreground",
					children: isDemo ? "∞" : formatTimecode(duration)
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: onTogglePlay,
						"aria-label": playing ? "Pause" : "Play",
						className: "size-11",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 translate-x-px" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, { children: [playing ? "Pause" : "Play", " · Space"] })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon-sm",
								onClick: onToggleMute,
								"aria-label": muted ? "Unmute" : "Mute",
								children: muted || volume === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Mute" })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							min: 0,
							max: 1,
							step: .01,
							value: [muted ? 0 : volume],
							onValueChange: ([v]) => onVolume(v ?? 0),
							className: "hidden w-24 sm:flex",
							disabled: isDemo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-w-0 truncate text-xs text-muted-foreground",
							children: isDemo ? "Built-in stereo reel" : fileName || "No file"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onCycleRate,
					disabled: isDemo,
					className: "hidden tabular-nums sm:inline-flex",
					children: [playbackRate, "×"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onConvert,
					disabled: converting,
					className: "hidden sm:inline-flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Convert"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: onCapture,
						"aria-label": "Save frame",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Save frame" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: onToggleFullscreen,
						"aria-label": fullscreen ? "Exit fullscreen" : "Fullscreen",
						children: fullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Fullscreen · F" })] })
			]
		})]
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
		...props
	});
}
function ScrollArea({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$1, {
		className: cn("relative overflow-hidden", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
			orientation: "vertical",
			className: "flex w-2.5 touch-none p-px select-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
		})]
	});
}
function Select({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select$1, { ...props });
}
function SelectValue({ ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue$1, { ...props });
}
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-10 w-full items-center justify-between gap-2 rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-40 [&>span]:line-clamp-1", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 opacity-60" })
		})]
	});
}
function SelectContent({ className, children, position = "popper", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("relative z-50 max-h-72 min-w-32 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-[var(--shadow-border)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
		position,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pr-8 pl-2 text-sm outline-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-40", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-2 flex size-4 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root$2, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full shadow-[var(--shadow-border)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:cursor-not-allowed disabled:opacity-40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-background transition-transform duration-150 data-[state=checked]:translate-x-[22px]" })
	});
}
function ControlRow({ label, value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-xs tabular-nums text-muted-foreground",
				children: value
			}) : null]
		}), children]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xs font-semibold tracking-widest text-foreground/80 uppercase",
			children: title
		}), children]
	});
}
function fmt(n, digits = 2) {
	return n.toFixed(digits);
}
function SettingsPanel({ className }) {
	const settings = usePlayerStore((s) => s.settings);
	const preset = usePlayerStore((s) => s.preset);
	const setSetting = usePlayerStore((s) => s.setSetting);
	const applyPreset = usePlayerStore((s) => s.applyPreset);
	const reset = usePlayerStore((s) => s.reset);
	const set = (key, value) => {
		setSetting(key, value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("flex h-full min-h-0 flex-col bg-card text-card-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-5 pt-5 pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg tracking-tight",
				children: "Controls"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: reset,
				className: "text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {}), "Reset"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
			className: "min-h-0 flex-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-7 px-5 pt-1 pb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "View",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1",
								children: Object.keys(VIEW_MODE_LABELS).map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => set("viewMode", mode),
									className: cn("h-9 rounded-md px-2 text-xs font-medium transition-colors duration-150", settings.viewMode === mode ? "bg-background text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground hover:text-foreground"),
									children: VIEW_MODE_LABELS[mode]
								}, mode))
							}),
							settings.viewMode === "anaglyph" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Glasses encoding",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: settings.anaglyphMode,
									onValueChange: (v) => set("anaglyphMode", v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(ANAGLYPH_MODE_LABELS).map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: mode,
										children: ANAGLYPH_MODE_LABELS[mode]
									}, mode)) })]
								})
							}) : null,
							settings.viewMode === "wiggle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Wiggle speed",
								value: fmt(settings.wiggleSpeed),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: .15,
									max: 2,
									step: .05,
									value: [settings.wiggleSpeed],
									onValueChange: ([v]) => set("wiggleSpeed", v ?? .7)
								})
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Stereo",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Depth",
								value: fmt(settings.intensity),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.intensity],
									onValueChange: ([v]) => set("intensity", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Convergence",
								value: fmt(settings.convergence),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.convergence],
									onValueChange: ([v]) => set("convergence", v ?? .5)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Zoom crop",
								value: fmt(settings.zoom),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 1,
									max: 1.18,
									step: .005,
									value: [settings.zoom],
									onValueChange: ([v]) => set("zoom", v ?? 1)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "swap-eyes",
									children: "Swap eyes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: "swap-eyes",
									checked: settings.swapEyes,
									onCheckedChange: (v) => set("swapEyes", v)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Ghost reduction",
								value: fmt(settings.ghostReduce),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.ghostReduce],
									onValueChange: ([v]) => set("ghostReduce", v ?? 0)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Depth",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Scene preset",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: preset,
									onValueChange: (v) => applyPreset(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(PRESET_LABELS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: key,
										children: PRESET_LABELS[key]
									}, key)) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Luminance",
								value: fmt(settings.lumaWeight),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.lumaWeight],
									onValueChange: ([v]) => set("lumaWeight", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Edges",
								value: fmt(settings.edgeWeight),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.edgeWeight],
									onValueChange: ([v]) => set("edgeWeight", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Center bias",
								value: fmt(settings.centerWeight),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.centerWeight],
									onValueChange: ([v]) => set("centerWeight", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Warm colors",
								value: fmt(settings.warmWeight),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.warmWeight],
									onValueChange: ([v]) => set("warmWeight", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Depth contrast",
								value: fmt(settings.depthContrast),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.depthContrast],
									onValueChange: ([v]) => set("depthContrast", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Smoothness",
								value: fmt(settings.smoothness),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1,
									step: .01,
									value: [settings.smoothness],
									onValueChange: ([v]) => set("smoothness", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "invert-depth",
									children: "Invert depth"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: "invert-depth",
									checked: settings.invertDepth,
									onCheckedChange: (v) => set("invertDepth", v)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Picture",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Brightness",
								value: fmt(settings.brightness),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: -.4,
									max: .4,
									step: .01,
									value: [settings.brightness],
									onValueChange: ([v]) => set("brightness", v ?? 0)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Contrast",
								value: fmt(settings.contrast),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: .5,
									max: 1.6,
									step: .01,
									value: [settings.contrast],
									onValueChange: ([v]) => set("contrast", v ?? 1)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
								label: "Saturation",
								value: fmt(settings.saturation),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
									min: 0,
									max: 1.8,
									step: .01,
									value: [settings.saturation],
									onValueChange: ([v]) => set("saturation", v ?? 1)
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Engine",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ControlRow, {
							label: "Processing quality",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: settings.quality,
								onValueChange: (v) => set("quality", v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(QUALITY_LABELS).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: key,
									children: QUALITY_LABELS[key]
								}, key)) })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-muted-foreground",
							children: "Depth is estimated per frame from luminance, edges, subject position, and color warmth, then warped into a stereo pair in realtime."
						})]
					})
				]
			})
		})]
	});
}
var ACCEPT = ".mp4,.mkv,.webm,.mov,.m4v,video/mp4,video/webm,video/quicktime,video/x-matroska";
function GlassesMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-lens-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "-ml-1 size-2.5 rounded-full bg-lens-cyan" })]
	});
}
function StereoscopeApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const rootRef = (0, import_react.useRef)(null);
	const stageRef = (0, import_react.useRef)(null);
	const videoRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const rendererRef = (0, import_react.useRef)(null);
	const demoRef = (0, import_react.useRef)(null);
	const objectUrlRef = (0, import_react.useRef)(null);
	const sourceRef = (0, import_react.useRef)("none");
	const settings = usePlayerStore((s) => s.settings);
	const settingsRef = (0, import_react.useRef)(settings);
	settingsRef.current = settings;
	const glassesHintDismissed = usePlayerStore((s) => s.glassesHintDismissed);
	const dismissGlassesHint = usePlayerStore((s) => s.dismissGlassesHint);
	const [source, setSource] = (0, import_react.useState)("none");
	const [fileName, setFileName] = (0, import_react.useState)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [currentTime, setCurrentTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [volume, setVolume] = (0, import_react.useState)(.9);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [playbackRate, setPlaybackRate] = (0, import_react.useState)(1);
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [helpOpen, setHelpOpen] = (0, import_react.useState)(false);
	const [engineError, setEngineError] = (0, import_react.useState)(null);
	const [convertOpen, setConvertOpen] = (0, import_react.useState)(false);
	const [converting, setConverting] = (0, import_react.useState)(false);
	const [exportProgress, setExportProgress] = (0, import_react.useState)(null);
	const abortRef = (0, import_react.useRef)(null);
	const exportSettingsRef = (0, import_react.useRef)(null);
	const convertingRef = (0, import_react.useRef)(false);
	sourceRef.current = source;
	const clearObjectUrl = (0, import_react.useCallback)(() => {
		if (objectUrlRef.current) {
			URL.revokeObjectURL(objectUrlRef.current);
			objectUrlRef.current = null;
		}
	}, []);
	const startDemo = (0, import_react.useCallback)(() => {
		const video = videoRef.current;
		if (video) {
			video.pause();
			video.removeAttribute("src");
			video.load();
		}
		clearObjectUrl();
		setFileName(null);
		setSource("demo");
		setPlaying(true);
		setCurrentTime(0);
		setDuration(0);
	}, [clearObjectUrl]);
	const loadFile = (0, import_react.useCallback)((file) => {
		const video = videoRef.current;
		if (!video) return;
		const lower = file.name.toLowerCase();
		if (!(file.type.startsWith("video/") || /\.(mp4|mkv|webm|mov|m4v|avi)$/.test(lower))) {
			toast.error("That file does not look like a video.");
			return;
		}
		clearObjectUrl();
		const url = URL.createObjectURL(file);
		objectUrlRef.current = url;
		video.src = url;
		video.load();
		setFileName(file.name);
		setSource("file");
		video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
	}, [clearObjectUrl]);
	const demoPausedRef = (0, import_react.useRef)(false);
	demoPausedRef.current = source === "demo" && !playing;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		let raf = 0;
		let running = true;
		let demoClock = 0;
		let lastT = performance.now();
		const lastUi = {
			time: -1,
			playing: true,
			duration: 0
		};
		try {
			demoRef.current = new DemoScene(1280, 720);
			rendererRef.current = new AnaglyphRenderer(canvas);
		} catch (err) {
			setEngineError(err instanceof Error ? err.message : "Graphics engine failed");
			return;
		}
		sourceRef.current = "demo";
		setSource("demo");
		setPlaying(true);
		demoRef.current.draw(0);
		rendererRef.current.setSettings(settingsRef.current);
		rendererRef.current.setSource(demoRef.current.color, demoRef.current.depth);
		rendererRef.current.render();
		const loop = (t) => {
			if (!running) return;
			const dt = (t - lastT) / 1e3;
			lastT = t;
			const renderer = rendererRef.current;
			const demo = demoRef.current;
			if (renderer) {
				renderer.setSettings(exportSettingsRef.current ?? settingsRef.current);
				if (sourceRef.current === "demo" && demo) {
					if (!demoPausedRef.current) demoClock += dt;
					demo.draw(demoClock);
					renderer.setSource(demo.color, demo.depth);
				} else if (sourceRef.current === "file" && videoRef.current) renderer.setSource(videoRef.current, null);
				else renderer.setSource(null, null);
				renderer.render();
			}
			const video = videoRef.current;
			if (video && sourceRef.current === "file") {
				const time = video.currentTime;
				const dur = Number.isFinite(video.duration) ? video.duration : 0;
				const isPlaying = !video.paused;
				if (Math.abs(time - lastUi.time) > .12 || isPlaying !== lastUi.playing || dur !== lastUi.duration) {
					lastUi.time = time;
					lastUi.playing = isPlaying;
					lastUi.duration = dur;
					setCurrentTime(time);
					setDuration(dur);
					setPlaying(isPlaying);
				}
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => {
			running = false;
			cancelAnimationFrame(raf);
			rendererRef.current?.destroy();
			rendererRef.current = null;
			demoRef.current?.destroy();
			demoRef.current = null;
			clearObjectUrl();
		};
	}, [clearObjectUrl]);
	const togglePlay = (0, import_react.useCallback)(() => {
		if (sourceRef.current === "demo") {
			setPlaying((p) => !p);
			return;
		}
		const video = videoRef.current;
		if (!video || sourceRef.current !== "file") return;
		if (video.paused) {
			video.play();
			setPlaying(true);
		} else {
			video.pause();
			setPlaying(false);
		}
	}, []);
	const toggleFullscreen = (0, import_react.useCallback)(async () => {
		const root = rootRef.current;
		if (!root) return;
		if (!document.fullscreenElement) await root.requestFullscreen().catch(() => void 0);
		else await document.exitFullscreen().catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			const tag = e.target?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
			if (e.key === " " || e.code === "Space") {
				e.preventDefault();
				if (!convertingRef.current) togglePlay();
			} else if (e.key === "f" || e.key === "F") {
				e.preventDefault();
				toggleFullscreen();
			} else if (e.key === "e" || e.key === "E") {
				if (!convertingRef.current) setConvertOpen(true);
			} else if (e.key === "o" || e.key === "O") fileRef.current?.click();
			else if (e.key === "d" || e.key === "D") startDemo();
			else if (e.key === "?" || e.key === "h" || e.key === "H") setHelpOpen((v) => !v);
			else if (e.key === "Escape") {
				setHelpOpen(false);
				setSettingsOpen(false);
				if (convertingRef.current) abortRef.current?.abort();
				else setConvertOpen(false);
			} else if (e.key === "ArrowRight" && sourceRef.current === "file" && videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 5);
			else if (e.key === "ArrowLeft" && sourceRef.current === "file" && videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
			else if (e.key === "[") usePlayerStore.getState().setSetting("intensity", Math.max(0, usePlayerStore.getState().settings.intensity - .04));
			else if (e.key === "]") usePlayerStore.getState().setSetting("intensity", Math.min(1, usePlayerStore.getState().settings.intensity + .04));
			else if (e.key === "1") usePlayerStore.getState().setSetting("viewMode", "anaglyph");
			else if (e.key === "2") usePlayerStore.getState().setSetting("viewMode", "wiggle");
			else if (e.key === "3") usePlayerStore.getState().setSetting("viewMode", "sbs");
			else if (e.key === "4") usePlayerStore.getState().setSetting("viewMode", "depth");
			else if (e.key === "5") usePlayerStore.getState().setSetting("viewMode", "original");
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		togglePlay,
		startDemo,
		toggleFullscreen
	]);
	(0, import_react.useEffect)(() => {
		const onFs = () => setFullscreen(Boolean(document.fullscreenElement));
		document.addEventListener("fullscreenchange", onFs);
		return () => document.removeEventListener("fullscreenchange", onFs);
	}, []);
	const onDrop = (e) => {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) loadFile(file);
	};
	const captureFrame = async () => {
		const blob = await rendererRef.current?.captureFrame();
		if (!blob) {
			toast.error("Could not capture this frame.");
			return;
		}
		downloadBlob(blob, `stereoscope-${Date.now()}.png`);
		toast.success("Frame saved");
	};
	const startConvert = async () => {
		const canvas = canvasRef.current;
		if (!canvas || convertingRef.current) return;
		const video = videoRef.current;
		const isDemo = sourceRef.current === "demo";
		if (!isDemo && (!video || !video.duration)) {
			toast.error("Open a film before converting.");
			return;
		}
		const snapshot = video ? {
			time: video.currentTime,
			paused: video.paused,
			rate: video.playbackRate,
			muted: video.muted
		} : null;
		const settings = { ...settingsRef.current };
		if (settings.viewMode === "original" || settings.viewMode === "depth") settings.viewMode = "anaglyph";
		exportSettingsRef.current = settings;
		convertingRef.current = true;
		setConverting(true);
		setExportProgress({
			ratio: 0,
			currentTime: 0,
			duration: isDemo ? 8 : duration
		});
		setPlaying(true);
		const abort = new AbortController();
		abortRef.current = abort;
		const bits = settings.quality === "high" ? 12e6 : settings.quality === "low" ? 25e5 : 8e6;
		try {
			const result = await convertToVideo({
				canvas,
				video: isDemo ? null : video,
				isDemo,
				duration: isDemo ? 8 : video?.duration || duration,
				bitsPerSecond: bits,
				onProgress: setExportProgress,
				signal: abort.signal
			});
			downloadBlob(result.blob, exportFileName(fileName, result.ext));
			toast.success("3D video saved");
			setConvertOpen(false);
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) toast.error(error instanceof Error ? error.message : "Convert failed");
		} finally {
			convertingRef.current = false;
			exportSettingsRef.current = null;
			abortRef.current = null;
			setConverting(false);
			setExportProgress(null);
			if (video && snapshot) {
				video.playbackRate = snapshot.rate;
				video.muted = snapshot.muted;
				video.currentTime = snapshot.time;
				if (snapshot.paused) video.pause();
				else video.play();
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: rootRef,
		className: "flex h-dvh flex-col overflow-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassesMark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-lg leading-none tracking-tight md:text-xl",
							children: "Stereoscope"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden text-xs tracking-widest text-muted-foreground uppercase sm:block",
							children: "Realtime 2D to 3D"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: startDemo,
						className: "hidden sm:inline-flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, {}), "Demo"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => fileRef.current?.click(),
						disabled: converting,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Open film"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setConvertOpen(true),
						disabled: converting,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}), "Convert"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						className: "lg:hidden",
						onClick: () => setSettingsOpen(true),
						"aria-label": "Open controls",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: () => setHelpOpen(true),
						"aria-label": "Keyboard shortcuts",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, {})
					})
				]
			}),
			!glassesHintDismissed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 border-b border-border bg-card px-4 py-3 md:items-center md:px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassesMark, { className: "mt-1 md:mt-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "min-w-0 flex-1 text-sm text-pretty text-muted-foreground",
						children: [
							"Red lens on the left eye. No glasses? Switch the view to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-foreground underline decoration-border underline-offset-4",
								onClick: () => usePlayerStore.getState().setSetting("viewMode", "wiggle"),
								children: "Wiggle 3D"
							}),
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon-sm",
						onClick: dismissGlassesHint,
						"aria-label": "Dismiss",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: stageRef,
						className: "relative min-h-0 flex-1 bg-background",
						onDragOver: (e) => {
							e.preventDefault();
							setDragging(true);
						},
						onDragLeave: () => setDragging(false),
						onDrop,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
								ref: canvasRef,
								className: "absolute inset-0 size-full bg-background object-contain"
							}),
							engineError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground",
								children: engineError
							}) : null,
							dragging ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-3 flex items-center justify-center rounded-xl border border-dashed border-primary/40 bg-background/80",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-2xl tracking-tight",
									children: "Drop a film to convert"
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								ref: videoRef,
								className: "hidden",
								playsInline: true,
								onError: () => {
									toast.error("This file could not be decoded. Try MP4 (H.264) or WebM. MKV plays when the browser can decode its codec.");
								},
								onLoadedMetadata: () => {
									const v = videoRef.current;
									if (v && Number.isFinite(v.duration)) setDuration(v.duration);
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ACCEPT,
								className: "hidden",
								onChange: (e) => {
									const file = e.target.files?.[0];
									if (file) loadFile(file);
									e.target.value = "";
								}
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransportBar, {
						isDemo: source === "demo",
						fileName,
						playing,
						currentTime,
						duration,
						volume,
						muted,
						playbackRate,
						fullscreen,
						onTogglePlay: togglePlay,
						onSeek: (t) => {
							if (videoRef.current) videoRef.current.currentTime = t;
						},
						onVolume: (v) => {
							setVolume(v);
							setMuted(v === 0);
							if (videoRef.current) {
								videoRef.current.volume = v;
								videoRef.current.muted = v === 0;
							}
						},
						onToggleMute: () => {
							const next = !muted;
							setMuted(next);
							if (videoRef.current) videoRef.current.muted = next;
						},
						onCycleRate: () => {
							const next = RATES[(RATES.indexOf(playbackRate) + 1) % RATES.length] ?? 1;
							setPlaybackRate(next);
							if (videoRef.current) videoRef.current.playbackRate = next;
						},
						onToggleFullscreen: () => void toggleFullscreen(),
						onCapture: () => void captureFrame(),
						onConvert: () => setConvertOpen(true),
						converting
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, { className: "hidden w-80 shrink-0 border-l border-border lg:flex" })]
			}),
			settingsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-background/70",
					"aria-label": "Close controls",
					onClick: () => setSettingsOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 flex h-5/6 flex-col overflow-hidden rounded-t-xl border-t border-border bg-card shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setSettingsOpen(false),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, { className: "min-h-0 flex-1" })]
				})]
			}) : null,
			helpOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "absolute inset-0 bg-background/70",
					"aria-label": "Close help",
					onClick: () => setHelpOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md rounded-xl bg-card p-6 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl tracking-tight",
							children: "Shortcuts"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setHelpOpen(false),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2 text-sm",
						children: [
							["Space", "Play / pause"],
							["O", "Open a file"],
							["D", "Play the demo reel"],
							["E", "Convert & download"],
							["F", "Fullscreen"],
							["1–5", "Anaglyph / Wiggle / SBS / Depth / Original"],
							["[ ]", "Depth intensity"],
							["← →", "Seek five seconds"]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: v
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium tabular-nums",
								children: k
							})]
						}, k))
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConvertDialog, {
				open: convertOpen,
				isDemo: source === "demo",
				fileName,
				duration,
				formatLabel: pickRecorderMime().ext.toUpperCase(),
				viewLabel: VIEW_MODE_LABELS[settings.viewMode === "original" || settings.viewMode === "depth" ? "anaglyph" : settings.viewMode],
				converting,
				progress: exportProgress,
				onClose: () => setConvertOpen(false),
				onStart: () => void startConvert(),
				onCancel: () => abortRef.current?.abort()
			})
		]
	}) });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StereoscopeApp, {});
}
//#endregion
export { Home as component };
