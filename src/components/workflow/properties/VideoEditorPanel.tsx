"use client";

import { memo, useCallback } from "react";
import type { VideoEditorNodeData } from "../types";
import { VIDEO_EDITOR_CONFIG } from "../config/properties";
import {
  PanelContainer,
  PanelHeader,
  PanelBody,
  RunButton,
  SelectField,
  SliderField,
  CheckboxField,
  SectionDivider,
} from "./PropertyField";

interface VideoEditorPanelProps {
  nodeData: Partial<VideoEditorNodeData>;
  onUpdate: (key: string, value: unknown) => void;
}

export const VideoEditorPanel = memo(function VideoEditorPanel({
  nodeData,
  onUpdate,
}: VideoEditorPanelProps) {
  const operation = nodeData.operation || "trim";
  const transitionType = nodeData.transition?.type || "fade";
  const transitionDuration = nodeData.transition?.duration || 0.3;
  const audioEnabled = nodeData.audio?.enabled ?? true;
  const audioVolume = nodeData.audio?.volume ?? 1;
  const audioDucking = nodeData.audio?.ducking ?? false;
  const subtitleStyle = nodeData.subtitleStyle || "tiktok";
  const textPreset = nodeData.textPreset || "title";
  const textPosition = nodeData.textPosition || "bottom-center";
  const outputQuality = nodeData.outputQuality || "high";
  const outputAspectRatio = nodeData.outputAspectRatio || "9:16";
  const outputResolution = nodeData.outputResolution || "1080p";

  const handleTransitionUpdate = useCallback(
    (type: string, duration: number) => {
      onUpdate("transition", { type, duration, easing: "easeInOut" });
    },
    [onUpdate]
  );

  const handleAudioUpdate = useCallback(
    (enabled: boolean, volume: number, ducking: boolean) => {
      onUpdate("audio", { enabled, volume, ducking });
    },
    [onUpdate]
  );

  return (
    <PanelContainer>
      <PanelHeader
        name={VIDEO_EDITOR_CONFIG.name}
        color={VIDEO_EDITOR_CONFIG.color}
      />

      <PanelBody>
        <SelectField
          label="Operation"
          value={operation}
          options={VIDEO_EDITOR_CONFIG.operations}
          onChange={(v) => onUpdate("operation", v)}
        />

        <SelectField
          label="Transition"
          value={transitionType}
          options={VIDEO_EDITOR_CONFIG.transitions}
          onChange={(v) => handleTransitionUpdate(v, transitionDuration)}
        />

        <SliderField
          label="Duration"
          value={transitionDuration}
          min={0.1}
          max={2}
          step={0.1}
          onChange={(v) => handleTransitionUpdate(transitionType, v)}
          formatValue={(v) => `${v.toFixed(1)}s`}
        />

        {(operation === "subtitles" || operation === "text") && (
          <SelectField
            label="Subtitle Style"
            value={subtitleStyle}
            options={VIDEO_EDITOR_CONFIG.subtitleStyles}
            onChange={(v) => onUpdate("subtitleStyle", v)}
          />
        )}

        {operation === "text" && (
          <>
            <SelectField
              label="Text Preset"
              value={textPreset}
              options={VIDEO_EDITOR_CONFIG.textPresets}
              onChange={(v) => onUpdate("textPreset", v)}
            />
            <SelectField
              label="Text Position"
              value={textPosition}
              options={VIDEO_EDITOR_CONFIG.textPositions}
              onChange={(v) => onUpdate("textPosition", v)}
            />
          </>
        )}

        {operation === "audio" && (
          <>
            <CheckboxField
              label="Enable Audio"
              checked={audioEnabled}
              onChange={(v) => handleAudioUpdate(v, audioVolume, audioDucking)}
            />
            <SliderField
              label="Volume"
              value={audioVolume}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => handleAudioUpdate(audioEnabled, v, audioDucking)}
              formatValue={(v) => `${Math.round(v * 100)}%`}
            />
            <CheckboxField
              label="Audio Ducking"
              checked={audioDucking}
              onChange={(v) => handleAudioUpdate(audioEnabled, audioVolume, v)}
              showInfo
            />
          </>
        )}

        <SectionDivider label="Output" />

        <SelectField
          label="Quality"
          value={outputQuality}
          options={VIDEO_EDITOR_CONFIG.qualities}
          onChange={(v) => onUpdate("outputQuality", v)}
          showInfo={false}
        />

        <SelectField
          label="Aspect Ratio"
          value={outputAspectRatio}
          options={VIDEO_EDITOR_CONFIG.aspectRatios}
          onChange={(v) => onUpdate("outputAspectRatio", v)}
          showInfo={false}
        />

        <SelectField
          label="Resolution"
          value={outputResolution}
          options={VIDEO_EDITOR_CONFIG.resolutions}
          onChange={(v) => onUpdate("outputResolution", v)}
          showInfo={false}
        />
      </PanelBody>

      <RunButton label="Process Video" />
    </PanelContainer>
  );
});
