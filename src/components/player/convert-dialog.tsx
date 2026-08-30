import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_EXPORT_SECONDS } from "@/lib/anaglyph/exporter";
import { formatTimecode } from "@/lib/utils";

export function ConvertDialog({
  open,
  isDemo,
  fileName,
  duration,
  formatLabel,
  viewLabel,
  converting,
  progress,
  onClose,
  onStart,
  onCancel,
}: {
  open: boolean;
  isDemo: boolean;
  fileName: string | null;
  duration: number;
  formatLabel: string;
  viewLabel: string;
  converting: boolean;
  progress: { ratio: number; currentTime: number; duration: number } | null;
  onClose: () => void;
  onStart: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  const length = isDemo ? DEMO_EXPORT_SECONDS : duration;
  const ratio = Math.round((progress?.ratio ?? 0) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-background/70"
        aria-label="Close convert"
        onClick={converting ? onCancel : onClose}
      />
      <div className="relative w-full max-w-md rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="font-display text-2xl tracking-tight">
            {converting ? "Converting" : "Convert & download"}
          </h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={converting ? onCancel : onClose}
            aria-label={converting ? "Cancel convert" : "Close"}
          >
            <X />
          </Button>
        </div>

        {converting ? (
          <div className="space-y-4">
            <p className="text-sm text-pretty text-muted-foreground">
              Rendering stereo frames with your current settings. Keep this tab open.
            </p>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-primary transition-[width] duration-150"
                style={{ width: `${ratio}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
              <span>
                {formatTimecode(progress?.currentTime ?? 0)} /{" "}
                {formatTimecode(progress?.duration || length)}
              </span>
              <span>{ratio}%</span>
            </div>
            <Button variant="outline" className="w-full" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-pretty text-muted-foreground">
              Writes a 3D video using the live stereo settings — glasses type, depth, and
              picture. Original and depth views export as anaglyph.
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Source</dt>
                <dd className="truncate font-medium">{isDemo ? "Demo reel" : fileName || "Film"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Length</dt>
                <dd className="font-medium tabular-nums">
                  {isDemo ? `${DEMO_EXPORT_SECONDS}s clip` : formatTimecode(length)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Format</dt>
                <dd className="font-medium">{formatLabel}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">View</dt>
                <dd className="font-medium">{viewLabel}</dd>
              </div>
            </dl>
            <Button className="w-full" onClick={onStart}>
              <Download />
              Convert & download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
