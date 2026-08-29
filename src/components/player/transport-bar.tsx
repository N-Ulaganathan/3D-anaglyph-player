import {
  Camera,
  Download,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatTimecode } from "@/lib/utils";

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function TransportBar({
  isDemo,
  fileName,
  playing,
  currentTime,
  duration,
  volume,
  muted,
  playbackRate,
  fullscreen,
  onTogglePlay,
  onSeek,
  onVolume,
  onToggleMute,
  onCycleRate,
  onToggleFullscreen,
  onCapture,
  onConvert,
  converting,
}: {
  isDemo: boolean;
  fileName: string | null;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  fullscreen: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onVolume: (volume: number) => void;
  onToggleMute: () => void;
  onCycleRate: () => void;
  onToggleFullscreen: () => void;
  onCapture: () => void;
  onConvert: () => void;
  converting: boolean;
}) {
  const canSeek = !isDemo && duration > 0 && Number.isFinite(duration);

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-3 md:px-5">
      <div className="flex items-center gap-3">
        <span className="w-10 shrink-0 text-right font-sans text-xs tabular-nums text-muted-foreground">
          {isDemo ? "Live" : formatTimecode(currentTime)}
        </span>
        <Slider
          min={0}
          max={canSeek ? duration : 1}
          step={0.05}
          value={[canSeek ? currentTime : 0]}
          disabled={!canSeek}
          onValueChange={([v]) => onSeek(v ?? 0)}
          className={cn(!canSeek && "opacity-40")}
        />
        <span className="w-10 shrink-0 font-sans text-xs tabular-nums text-muted-foreground">
          {isDemo ? "∞" : formatTimecode(duration)}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePlay}
              aria-label={playing ? "Pause" : "Play"}
              className="size-11"
            >
              {playing ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5 translate-x-px" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{playing ? "Pause" : "Play"} · Space</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSeek(Math.max(0, currentTime - 10))}
              disabled={!canSeek}
              aria-label="Seek backward 10 seconds"
            >
              <RotateCcw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>−10 seconds</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSeek(Math.min(duration, currentTime + 10))}
              disabled={!canSeek}
              aria-label="Seek forward 10 seconds"
            >
              <RotateCw />
            </Button>
          </TooltipTrigger>
          <TooltipContent>+10 seconds</TooltipContent>
        </Tooltip>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mute</TooltipContent>
          </Tooltip>
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={[muted ? 0 : volume]}
            onValueChange={([v]) => onVolume(v ?? 0)}
            className="hidden w-24 sm:flex"
            disabled={isDemo}
          />
          <p className="min-w-0 truncate text-xs text-muted-foreground">
            {isDemo ? "Built-in stereo reel" : fileName || "No file"}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onCycleRate}
          disabled={isDemo}
          className="hidden tabular-nums sm:inline-flex"
        >
          {playbackRate}×
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onConvert}
          disabled={converting}
          className="hidden sm:inline-flex"
        >
          <Download />
          Convert
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onCapture} aria-label="Save frame">
              <Camera />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save frame</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleFullscreen}
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {fullscreen ? <Minimize /> : <Maximize />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fullscreen · F</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export { RATES };
