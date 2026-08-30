import {
  BLUR_FRAG,
  COMPOSITE_FRAG,
  COPY_DEPTH_FRAG,
  DEPTH_FRAG,
  VERT,
} from "./shaders";
import { QUALITY_MAX_WIDTH, type StereoSettings } from "./types";

type Program = {
  prog: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
  aPos: number;
  aUv: number;
};

type Fbo = {
  fb: WebGLFramebuffer;
  tex: WebGLTexture;
  w: number;
  h: number;
};

const ANAGLYPH_INDEX: Record<StereoSettings["anaglyphMode"], number> = {
  dubois: 0,
  color: 1,
  half: 2,
  gray: 3,
  "amber-blue": 4,
  "green-magenta": 5,
};

const VIEW_INDEX: Record<StereoSettings["viewMode"], number> = {
  anaglyph: 0,
  original: 1,
  depth: 2,
  sbs: 3,
  wiggle: 4,
};

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
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

function makeProgram(
  gl: WebGL2RenderingContext,
  frag: string,
  uniformNames: string[],
): Program {
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
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  for (const name of uniformNames) {
    uniforms[name] = gl.getUniformLocation(prog, name);
  }
  return {
    prog,
    uniforms,
    aPos: 0,
    aUv: 1,
  };
}

function makeTexture(gl: WebGL2RenderingContext): WebGLTexture {
  const tex = gl.createTexture();
  if (!tex) throw new Error("Unable to create texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

function makeFbo(gl: WebGL2RenderingContext, w: number, h: number): Fbo {
  const tex = makeTexture(gl);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  const fb = gl.createFramebuffer();
  if (!fb) throw new Error("Unable to create framebuffer");
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error("Framebuffer incomplete");
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { fb, tex, w, h };
}

function sourceSize(src: TexImageSource): { w: number; h: number } | null {
  if (src instanceof HTMLVideoElement) {
    if (src.readyState < 2 || src.videoWidth === 0) return null;
    return { w: src.videoWidth, h: src.videoHeight };
  }
  if (src instanceof HTMLCanvasElement) {
    return { w: src.width, h: src.height };
  }
  if (typeof OffscreenCanvas !== "undefined" && src instanceof OffscreenCanvas) {
    return { w: src.width, h: src.height };
  }
  if (src instanceof HTMLImageElement) {
    if (!src.naturalWidth) return null;
    return { w: src.naturalWidth, h: src.naturalHeight };
  }
  return null;
}

export class AnaglyphRenderer {
  private gl: WebGL2RenderingContext;
  private glCanvas: HTMLCanvasElement;
  private display: HTMLCanvasElement;
  private vao: WebGLVertexArrayObject;
  private depthProg: Program;
  private copyProg: Program;
  private blurProg: Program;
  private compositeProg: Program;
  private videoTex: WebGLTexture;
  private trueDepthTex: WebGLTexture;
  private depthFbo: Fbo | null = null;
  private blurFbo: Fbo | null = null;
  private colorSource: TexImageSource | null = null;
  private depthSource: TexImageSource | null = null;
  private settings: StereoSettings | null = null;
  private texW = 0;
  private texH = 0;
  private startMs = performance.now();
  private destroyed = false;

  constructor(display: HTMLCanvasElement) {
    this.display = display;
    const glCanvas = document.createElement("canvas");
    const gl = glCanvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
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
      "uDepthContrast",
    ]);
    this.copyProg = makeProgram(gl, COPY_DEPTH_FRAG, ["uDepth", "uInvert", "uDepthContrast"]);
    this.blurProg = makeProgram(gl, BLUR_FRAG, ["uTex", "uDir", "uRadius"]);
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
      "uAnaglyphMode",
    ]);

    const vao = gl.createVertexArray();
    if (!vao) throw new Error("Unable to create VAO");
    this.vao = vao;
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

    this.videoTex = makeTexture(gl);
    this.trueDepthTex = makeTexture(gl);
  }

  setSource(color: TexImageSource | null, depth: TexImageSource | null = null) {
    this.colorSource = color;
    this.depthSource = depth;
  }

  setSettings(settings: StereoSettings) {
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
      gl.clearColor(0.043, 0.043, 0.047, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      this.blit();
      return;
    }

    const size = sourceSize(src);
    if (!size) return;

    const maxW = QUALITY_MAX_WIDTH[settings.quality];
    const scale = Math.min(1, maxW / size.w);
    const procW = Math.max(2, Math.round(size.w * scale) & ~1);
    const procH = Math.max(2, Math.round(size.h * scale) & ~1);

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

    if (this.depthSource) {
      this.drawCopyDepth(depthFbo, settings);
    } else {
      this.drawEstimate(depthFbo, procW, procH, settings);
    }

    if (settings.smoothness > 0.02) {
      const radius = 0.4 + settings.smoothness * 2.6;
      this.drawBlur(depthFbo, blurFbo, procW, procH, radius, true);
      this.drawBlur(blurFbo, depthFbo, procW, procH, radius, false);
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, procW, procH);
    this.drawComposite(depthFbo, settings);
    this.blit();
  }

  private blit() {
    const src = this.glCanvas;
    const dest = this.display;
    if (dest.width !== src.width) dest.width = src.width;
    if (dest.height !== src.height) dest.height = src.height;
    const ctx = dest.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.drawImage(src, 0, 0);
  }

  captureFrame(): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.render();
      this.display.toBlob((blob) => resolve(blob), "image/png");
    });
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    const gl = this.gl;
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
  }

  private ensureFbos(w: number, h: number) {
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

  private uploadColor(src: TexImageSource, w: number, h: number) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
    if (this.texW !== w || this.texH !== h) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      this.texW = w;
      this.texH = h;
    } else {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, src);
    }
  }

  private uploadDepth(src: TexImageSource) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.trueDepthTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  }

  private drawEstimate(target: Fbo, w: number, h: number, settings: StereoSettings) {
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

  private drawCopyDepth(target: Fbo, settings: StereoSettings) {
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

  private drawBlur(src: Fbo, dest: Fbo, w: number, h: number, radius: number, horizontal: boolean) {
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

  private drawComposite(depth: Fbo, settings: StereoSettings) {
    const gl = this.gl;
    const p = this.compositeProg;
    gl.useProgram(p.prog);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.videoTex);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depth.tex);
    gl.uniform1i(p.uniforms.uVideo, 0);
    gl.uniform1i(p.uniforms.uDepth, 1);
    gl.uniform1f(p.uniforms.uStrength, settings.intensity * 0.048);
    gl.uniform1f(p.uniforms.uConvergence, settings.convergence);
    gl.uniform1f(p.uniforms.uSwap, settings.swapEyes ? 1 : 0);
    gl.uniform1f(p.uniforms.uGhost, settings.ghostReduce);
    gl.uniform1f(p.uniforms.uBrightness, settings.brightness);
    gl.uniform1f(p.uniforms.uContrast, settings.contrast);
    gl.uniform1f(p.uniforms.uSaturation, settings.saturation);
    gl.uniform1f(p.uniforms.uZoom, settings.zoom);
    gl.uniform1f(p.uniforms.uTime, (performance.now() - this.startMs) / 1000);
    gl.uniform1f(p.uniforms.uWiggleSpeed, settings.wiggleSpeed);
    gl.uniform1i(p.uniforms.uViewMode, VIEW_INDEX[settings.viewMode]);
    gl.uniform1i(p.uniforms.uAnaglyphMode, ANAGLYPH_INDEX[settings.anaglyphMode]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
