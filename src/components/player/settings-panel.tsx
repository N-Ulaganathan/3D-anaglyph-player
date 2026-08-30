import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePlayerStore } from "@/lib/anaglyph/store";
import {
  ANAGLYPH_MODE_LABELS,
  PRESET_LABELS,
  QUALITY_LABELS,
  VIEW_MODE_LABELS,
  type AnaglyphMode,
  type DepthPreset,
  type Quality,
  type StereoSettings,
  type ViewMode,
} from "@/lib/anaglyph/types";
import { cn } from "@/lib/utils";

function ControlRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label>{label}</Label>
        {value ? (
          <span className="font-sans text-xs tabular-nums text-muted-foreground">{value}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold tracking-widest text-foreground/80 uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function fmt(n: number, digits = 2) {
  return n.toFixed(digits);
}

export function SettingsPanel({ className }: { className?: string }) {
  const settings = usePlayerStore((s) => s.settings);
  const preset = usePlayerStore((s) => s.preset);
  const setSetting = usePlayerStore((s) => s.setSetting);
  const applyPreset = usePlayerStore((s) => s.applyPreset);
  const reset = usePlayerStore((s) => s.reset);

  const set = <K extends keyof StereoSettings>(key: K, value: StereoSettings[K]) => {
    setSetting(key, value);
  };

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col bg-card text-card-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <p className="font-display text-lg tracking-tight">Controls</p>
        <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground">
          <RotateCcw />
          Reset
        </Button>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-7 px-5 pt-1 pb-8">
          <Section title="View">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
              {(Object.keys(VIEW_MODE_LABELS) as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => set("viewMode", mode)}
                  className={cn(
                    "h-9 rounded-md px-2 text-xs font-medium transition-colors duration-150",
                    settings.viewMode === mode
                      ? "bg-background text-foreground shadow-[var(--shadow-border)]"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {VIEW_MODE_LABELS[mode]}
                </button>
              ))}
            </div>
            {settings.viewMode === "anaglyph" ? (
              <ControlRow label="Glasses encoding">
                <Select
                  value={settings.anaglyphMode}
                  onValueChange={(v) => set("anaglyphMode", v as AnaglyphMode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(ANAGLYPH_MODE_LABELS) as AnaglyphMode[]).map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {ANAGLYPH_MODE_LABELS[mode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ControlRow>
            ) : null}
            {settings.viewMode === "wiggle" ? (
              <ControlRow label="Wiggle speed" value={fmt(settings.wiggleSpeed)}>
                <Slider
                  min={0.15}
                  max={2}
                  step={0.05}
                  value={[settings.wiggleSpeed]}
                  onValueChange={([v]) => set("wiggleSpeed", v ?? 0.7)}
                />
              </ControlRow>
            ) : null}
          </Section>

          <Separator />

          <Section title="Stereo">
            <ControlRow label="Depth" value={fmt(settings.intensity)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.intensity]}
                onValueChange={([v]) => set("intensity", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Convergence" value={fmt(settings.convergence)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.convergence]}
                onValueChange={([v]) => set("convergence", v ?? 0.5)}
              />
            </ControlRow>
            <ControlRow label="Zoom crop" value={fmt(settings.zoom)}>
              <Slider
                min={1}
                max={1.18}
                step={0.005}
                value={[settings.zoom]}
                onValueChange={([v]) => set("zoom", v ?? 1)}
              />
            </ControlRow>
            <div className="flex items-center justify-between gap-3 py-1">
              <Label htmlFor="swap-eyes">Swap eyes</Label>
              <Switch
                id="swap-eyes"
                checked={settings.swapEyes}
                onCheckedChange={(v) => set("swapEyes", v)}
              />
            </div>
            <ControlRow label="Ghost reduction" value={fmt(settings.ghostReduce)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.ghostReduce]}
                onValueChange={([v]) => set("ghostReduce", v ?? 0)}
              />
            </ControlRow>
          </Section>

          <Separator />

          <Section title="Depth">
            <ControlRow label="Scene preset">
              <Select value={preset} onValueChange={(v) => applyPreset(v as DepthPreset)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(PRESET_LABELS) as DepthPreset[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {PRESET_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlRow>
            <ControlRow label="Luminance" value={fmt(settings.lumaWeight)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.lumaWeight]}
                onValueChange={([v]) => set("lumaWeight", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Edges" value={fmt(settings.edgeWeight)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.edgeWeight]}
                onValueChange={([v]) => set("edgeWeight", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Center bias" value={fmt(settings.centerWeight)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.centerWeight]}
                onValueChange={([v]) => set("centerWeight", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Warm colors" value={fmt(settings.warmWeight)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.warmWeight]}
                onValueChange={([v]) => set("warmWeight", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Depth contrast" value={fmt(settings.depthContrast)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.depthContrast]}
                onValueChange={([v]) => set("depthContrast", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Smoothness" value={fmt(settings.smoothness)}>
              <Slider
                min={0}
                max={1}
                step={0.01}
                value={[settings.smoothness]}
                onValueChange={([v]) => set("smoothness", v ?? 0)}
              />
            </ControlRow>
            <div className="flex items-center justify-between gap-3 py-1">
              <Label htmlFor="invert-depth">Invert depth</Label>
              <Switch
                id="invert-depth"
                checked={settings.invertDepth}
                onCheckedChange={(v) => set("invertDepth", v)}
              />
            </div>
          </Section>

          <Separator />

          <Section title="Picture">
            <ControlRow label="Brightness" value={fmt(settings.brightness)}>
              <Slider
                min={-0.4}
                max={0.4}
                step={0.01}
                value={[settings.brightness]}
                onValueChange={([v]) => set("brightness", v ?? 0)}
              />
            </ControlRow>
            <ControlRow label="Contrast" value={fmt(settings.contrast)}>
              <Slider
                min={0.5}
                max={1.6}
                step={0.01}
                value={[settings.contrast]}
                onValueChange={([v]) => set("contrast", v ?? 1)}
              />
            </ControlRow>
            <ControlRow label="Saturation" value={fmt(settings.saturation)}>
              <Slider
                min={0}
                max={1.8}
                step={0.01}
                value={[settings.saturation]}
                onValueChange={([v]) => set("saturation", v ?? 1)}
              />
            </ControlRow>
          </Section>

          <Separator />

          <Section title="Engine">
            <ControlRow label="Processing quality">
              <Select
                value={settings.quality}
                onValueChange={(v) => set("quality", v as Quality)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(QUALITY_LABELS) as Quality[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {QUALITY_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ControlRow>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Depth is estimated per frame from luminance, edges, subject position, and color
              warmth, then warped into a stereo pair in realtime.
            </p>
          </Section>
        </div>
      </ScrollArea>
    </aside>
  );
}
