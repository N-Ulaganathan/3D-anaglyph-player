import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_SETTINGS,
  PRESETS,
  type DepthPreset,
  type StereoSettings,
} from "./types";

interface PlayerStore {
  settings: StereoSettings;
  preset: DepthPreset;
  glassesHintDismissed: boolean;
  setSetting: <K extends keyof StereoSettings>(key: K, value: StereoSettings[K]) => void;
  applyPreset: (preset: DepthPreset) => void;
  reset: () => void;
  dismissGlassesHint: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      settings: { ...DEFAULT_SETTINGS },
      preset: "balanced",
      glassesHintDismissed: false,
      setSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),
      applyPreset: (preset) =>
        set((state) => ({
          preset,
          settings: { ...state.settings, ...PRESETS[preset] },
        })),
      reset: () =>
        set({
          settings: { ...DEFAULT_SETTINGS },
          preset: "balanced",
        }),
      dismissGlassesHint: () => set({ glassesHintDismissed: true }),
    }),
    {
      name: "stereoscope-settings",
      partialize: (state) => ({
        settings: state.settings,
        preset: state.preset,
        glassesHintDismissed: state.glassesHintDismissed,
      }),
    },
  ),
);
