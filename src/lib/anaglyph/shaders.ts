export const VERT = `#version 300 es
in vec2 aPos;
in vec2 aUv;
out vec2 vUv;
void main() {
  vUv = aUv;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const DEPTH_FRAG = `#version 300 es
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

export const COPY_DEPTH_FRAG = `#version 300 es
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

export const BLUR_FRAG = `#version 300 es
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

export const COMPOSITE_FRAG = `#version 300 es
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
