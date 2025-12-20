"use client";

import { memo } from "react";

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const LoadingSpinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="animate-spin"
  >
    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
);

interface RunAllButtonProps {
  onRunAll: () => void;
  isExecuting: boolean;
  executingCount?: number;
}

const RunAllButton = memo(function RunAllButton({
  onRunAll,
  isExecuting,
  executingCount = 0,
}: RunAllButtonProps) {
  return (
    <div className="absolute bottom-4 left-4 z-10">
      <button
        onClick={onRunAll}
        disabled={isExecuting}
        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-lg backdrop-blur-xl transition-all duration-200 ${
          isExecuting
            ? "cursor-wait border-cyan-500/30 bg-cyan-500/20 text-cyan-400"
            : "border-white/10 bg-zinc-900/90 text-white hover:border-cyan-500/50 hover:bg-zinc-800/90"
        } `}
      >
        {isExecuting ? (
          <>
            <LoadingSpinner />
            <span>
              Running{executingCount > 0 ? ` (${executingCount})` : "..."}
            </span>
          </>
        ) : (
          <>
            <PlayIcon />
            <span>Run All</span>
          </>
        )}
      </button>
    </div>
  );
});

export default RunAllButton;
