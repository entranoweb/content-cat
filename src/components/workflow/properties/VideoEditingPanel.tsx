"use client";

import { memo } from "react";
import type {
  VideoConcatNodeData,
  VideoSubtitlesNodeData,
  VideoTrimNodeData,
  VideoTransitionNodeData,
} from "../types";
import {
  PanelContainer,
  PanelHeader,
  PanelBody,
  RunButton,
  SelectField,
  SliderField,
} from "./PropertyField";

interface ExecutionState {
  canExecute: boolean;
  reason?: string;
}

type VideoEditingNodeData =
  | VideoConcatNodeData
  | VideoSubtitlesNodeData
  | VideoTrimNodeData
  | VideoTransitionNodeData;

interface VideoEditingPanelProps {
  nodeType: string;
  nodeData: Partial<VideoEditingNodeData>;
  onUpdate: (key: string, value: unknown) => void;
  onExecute?: () => void;
  isExecuting?: boolean;
  executionState?: ExecutionState;
}

// Aspect ratio options shared across video editing nodes
const ASPECT_RATIO_OPTIONS = [
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "9:16", label: "9:16 (Portrait)" },
  { value: "1:1", label: "1:1 (Square)" },
  { value: "4:5", label: "4:5 (Portrait)" },
];

// Transition options for concat and transition nodes
const TRANSITION_OPTIONS = [
  { value: "none", label: "None" },
  { value: "crossfade", label: "Crossfade" },
  { value: "fade", label: "Fade" },
  { value: "wipe", label: "Wipe" },
  { value: "slideLeft", label: "Slide Left" },
  { value: "slideRight", label: "Slide Right" },
  { value: "slideUp", label: "Slide Up" },
  { value: "slideDown", label: "Slide Down" },
  { value: "zoomIn", label: "Zoom In" },
  { value: "zoomOut", label: "Zoom Out" },
  { value: "blur", label: "Blur" },
  { value: "glitch", label: "Glitch" },
  { value: "flash", label: "Flash" },
];

// Subtitle style options
const SUBTITLE_STYLE_OPTIONS = [
  { value: "classic", label: "Classic" },
  { value: "tiktok", label: "TikTok" },
  { value: "highlight", label: "Highlight" },
  { value: "minimal", label: "Minimal" },
  { value: "neon", label: "Neon" },
  { value: "karaoke", label: "Karaoke" },
];

// Subtitle position options
const POSITION_OPTIONS = [
  { value: "top", label: "Top" },
  { value: "center", label: "Center" },
  { value: "bottom", label: "Bottom" },
];

// Easing options for transitions
const EASING_OPTIONS = [
  { value: "linear", label: "Linear" },
  { value: "easeIn", label: "Ease In" },
  { value: "easeOut", label: "Ease Out" },
  { value: "easeInOut", label: "Ease In Out" },
];

// Node configurations
const NODE_CONFIGS: Record<
  string,
  { name: string; color: string; runLabel: string }
> = {
  videoConcat: {
    name: "Video Concat",
    color: "from-pink-500 to-rose-500",
    runLabel: "Concatenate",
  },
  videoSubtitles: {
    name: "Video Subtitles",
    color: "from-blue-500 to-cyan-500",
    runLabel: "Add Subtitles",
  },
  videoTrim: {
    name: "Video Trim",
    color: "from-green-500 to-emerald-500",
    runLabel: "Trim Video",
  },
  videoTransition: {
    name: "Video Transition",
    color: "from-purple-500 to-violet-500",
    runLabel: "Apply Transition",
  },
};

export const VideoEditingPanel = memo(function VideoEditingPanel({
  nodeType,
  nodeData,
  onUpdate,
  onExecute,
  isExecuting = false,
  executionState,
}: VideoEditingPanelProps) {
  const config = NODE_CONFIGS[nodeType] || {
    name: "Video Editing",
    color: "from-gray-500 to-gray-600",
    runLabel: "Process",
  };

  const renderConcatSettings = () => {
    const data = nodeData as Partial<VideoConcatNodeData>;
    return (
      <>
        <SelectField
          label="Aspect Ratio"
          value={data.aspectRatio || "16:9"}
          options={ASPECT_RATIO_OPTIONS}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />
        {/* Transitions are now configured per-clip in the node itself */}
        <p className="text-[10px] text-zinc-500 italic">
          Configure transitions in the node badges
        </p>
      </>
    );
  };

  const renderSubtitlesSettings = () => {
    const data = nodeData as Partial<VideoSubtitlesNodeData>;
    return (
      <>
        <SelectField
          label="Aspect Ratio"
          value={data.aspectRatio || "9:16"}
          options={ASPECT_RATIO_OPTIONS}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />
        <SelectField
          label="Style"
          value={data.style || "tiktok"}
          options={SUBTITLE_STYLE_OPTIONS}
          onChange={(v) => onUpdate("style", v)}
        />
        <SelectField
          label="Position"
          value={data.position || "bottom"}
          options={POSITION_OPTIONS}
          onChange={(v) => onUpdate("position", v)}
        />
      </>
    );
  };

  const renderTrimSettings = () => {
    const data = nodeData as Partial<VideoTrimNodeData>;
    return (
      <>
        <SelectField
          label="Aspect Ratio"
          value={data.aspectRatio || "16:9"}
          options={ASPECT_RATIO_OPTIONS}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />
        <SliderField
          label="Start Time"
          value={data.startTime || 0}
          min={0}
          max={60}
          step={0.5}
          onChange={(v) => onUpdate("startTime", v)}
          formatValue={(v) => `${v.toFixed(1)}s`}
        />
        <SliderField
          label="End Time"
          value={data.endTime || 5}
          min={0}
          max={60}
          step={0.5}
          onChange={(v) => onUpdate("endTime", v)}
          formatValue={(v) => `${v.toFixed(1)}s`}
        />
      </>
    );
  };

  const renderTransitionSettings = () => {
    const data = nodeData as Partial<VideoTransitionNodeData>;
    return (
      <>
        <SelectField
          label="Aspect Ratio"
          value={data.aspectRatio || "16:9"}
          options={ASPECT_RATIO_OPTIONS}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />
        <SelectField
          label="Transition Type"
          value={data.transitionType || "fade"}
          options={TRANSITION_OPTIONS}
          onChange={(v) => onUpdate("transitionType", v)}
        />
        <SliderField
          label="Duration"
          value={data.duration || 0.5}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(v) => onUpdate("duration", v)}
          formatValue={(v) => `${v.toFixed(1)}s`}
        />
        <SelectField
          label="Easing"
          value={data.easing || "easeInOut"}
          options={EASING_OPTIONS}
          onChange={(v) => onUpdate("easing", v)}
        />
      </>
    );
  };

  const renderSettings = () => {
    switch (nodeType) {
      case "videoConcat":
        return renderConcatSettings();
      case "videoSubtitles":
        return renderSubtitlesSettings();
      case "videoTrim":
        return renderTrimSettings();
      case "videoTransition":
        return renderTransitionSettings();
      default:
        return null;
    }
  };

  return (
    <PanelContainer>
      <PanelHeader name={config.name} color={config.color} />

      <PanelBody>{renderSettings()}</PanelBody>

      <RunButton
        label={config.runLabel}
        onClick={onExecute}
        isLoading={isExecuting}
        disabled={!executionState?.canExecute}
        disabledReason={executionState?.reason}
      />
    </PanelContainer>
  );
});
