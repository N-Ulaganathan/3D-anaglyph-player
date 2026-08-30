export type AnaglyphMode =
  | "dubois"
  | "color"
  | "half"
  | "gray"
  | "amber-blue"
  | "green-magenta";

export type ViewMode = "anaglyph" | "original" | "depth" | "sbs" | "wiggle";

export type Quality = "low" | "medium" | "high";

export type DepthPreset =
  | "balanced"
  | "portrait"
  | "landscape"
  | "action"
  | "subtle"
  | "dramatic";

export interface StereoSettings {
  anaglyphMode: AnaglyphMode;
  viewMode: ViewMode;
  quality: Quality;
  intensity: number;
  convergence: number;
  swapEyes: boolean;
  invertDepth: boolean;
  smoothness: number;
  lumaWeight: number;
  edgeWeight: number;
  centerWeight: number;
  warmWeight: number;
  depthContrast: number;
  ghostReduce: number;
  brightness: number;
  contrast: number;
  saturation: number;
  zoom: number;
  wiggleSpeed: number;
}

export const QUALITY_MAX_WIDTH: Record<Quality, number> = {
  low: 640,
  medium: 1280,
  high: 1920,
};

export const ANAGLYPH_MODE_LABELS: Record<AnaglyphMode, string> = {
  dubois: "Red–cyan · Dubois",
  color: "Red–cyan · Color",
  half: "Red–cyan · Half-color",
  gray: "Red–cyan · Gray",
  "amber-blue": "Amber–blue",
  "green-magenta": "Green–magenta",
};

export const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  anaglyph: "Anaglyph",
  original: "Original",
  depth: "Depth",
  sbs: "Side by side",
  wiggle: "Wiggle 3D",
};

export const QUALITY_LABELS: Record<Quality, string> = {
  low: "Fast · 640",
  medium: "Cinema · 1280",
  high: "Full · 1920",
};

export const PRESET_LABELS: Record<DepthPreset, string> = {
  balanced: "Balanced",
  portrait: "Portrait",
  landscape: "Landscape",
  action: "Action",
  subtle: "Subtle",
  dramatic: "Dramatic",
};

export const DEFAULT_SETTINGS: StereoSettings = {
  anaglyphMode: "dubois",
  viewMode: "anaglyph",
  quality: "medium",
  intensity: 0.42,
  convergence: 0.48,
  swapEyes: false,
  invertDepth: false,
  smoothness: 0.55,
  lumaWeight: 0.2,
  edgeWeight: 0.25,
  centerWeight: 0.4,
  warmWeight: 0.15,
  depthContrast: 0.65,
  ghostReduce: 0.35,
  brightness: 0,
  contrast: 1,
  saturation: 1,
  zoom: 1.04,
  wiggleSpeed: 0.7,
};

export const PRESETS: Record<DepthPreset, Partial<StereoSettings>> = {
  balanced: {
    lumaWeight: 0.2,
    edgeWeight: 0.25,
    centerWeight: 0.4,
    warmWeight: 0.15,
    invertDepth: false,
    intensity: 0.55,
    smoothness: 0.55,
    depthContrast: 0.65,
    convergence: 0.42,
  },
  portrait: {
    lumaWeight: 0.25,
    edgeWeight: 0.12,
    centerWeight: 0.5,
    warmWeight: 0.13,
    invertDepth: false,
    intensity: 0.46,
    smoothness: 0.68,
    depthContrast: 0.58,
    convergence: 0.48,
  },
  landscape: {
    lumaWeight: 0.38,
    edgeWeight: 0.22,
    centerWeight: 0.22,
    warmWeight: 0.18,
    invertDepth: true,
    intensity: 0.5,
    smoothness: 0.5,
    depthContrast: 0.7,
    convergence: 0.4,
  },
  action: {
    lumaWeight: 0.14,
    edgeWeight: 0.48,
    centerWeight: 0.26,
    warmWeight: 0.12,
    invertDepth: false,
    intensity: 0.72,
    smoothness: 0.32,
    depthContrast: 0.78,
    convergence: 0.38,
  },
  subtle: {
    intensity: 0.28,
    smoothness: 0.72,
    depthContrast: 0.42,
    convergence: 0.5,
    ghostReduce: 0.5,
  },
  dramatic: {
    intensity: 0.86,
    smoothness: 0.34,
    depthContrast: 0.88,
    convergence: 0.32,
    ghostReduce: 0.2,
  },
};
