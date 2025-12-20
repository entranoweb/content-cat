"use client";

import { memo } from "react";
import type {
  Kling26NodeData,
  Kling25TurboNodeData,
  Wan26NodeData,
} from "../types";
import { MODEL_CONFIGS, SPECIAL_FX_OPTIONS } from "../config/properties";
import {
  PanelContainer,
  PanelHeader,
  PanelBody,
  RunButton,
  SelectField,
  SliderField,
  CheckboxField,
  InfoIcon,
  CheckIcon,
} from "./PropertyField";

type ModelNodeData = Kling26NodeData | Kling25TurboNodeData | Wan26NodeData;

interface ExecutionState {
  canExecute: boolean;
  reason?: string;
}

interface ModelPropertiesPanelProps {
  nodeType: string;
  nodeData: Partial<ModelNodeData>;
  onUpdate: (key: string, value: unknown) => void;
  onExecute?: () => void;
  isExecuting?: boolean;
  executionState?: ExecutionState;
}

export const ModelPropertiesPanel = memo(function ModelPropertiesPanel({
  nodeType,
  nodeData,
  onUpdate,
  onExecute,
  isExecuting = false,
  executionState,
}: ModelPropertiesPanelProps) {
  const config = MODEL_CONFIGS[nodeType];
  if (!config) return null;

  const duration = nodeData.duration || "5";
  const aspectRatio = nodeData.aspectRatio || "16:9";
  const resolution = (nodeData as Wan26NodeData).resolution || "720p";
  const randomSeed = !nodeData.seed;
  const seed = nodeData.seed || 0;
  const audioEnabled = (nodeData as Kling26NodeData).audioEnabled ?? true;
  const enhanceEnabled = (nodeData as Wan26NodeData).enhanceEnabled ?? false;
  const cfgScale = (nodeData as Kling26NodeData).cfgScale ?? 0.5;
  const specialFx = (nodeData as Kling25TurboNodeData).specialFx || "";
  const negativePrompt = nodeData.negativePrompt || "";

  const durationOptions = config.durations.map((d) => ({
    value: d,
    label: `${d}s`,
  }));

  const aspectRatioOptions = config.aspectRatios.map((ar) => ({
    value: ar,
    label: ar,
  }));

  const resolutionOptions = config.resolutions?.map((r) => ({
    value: r,
    label: r,
  }));

  return (
    <PanelContainer>
      <PanelHeader
        name={config.name}
        color={config.color}
        price={config.price}
      />

      <PanelBody>
        <SelectField
          label="Duration"
          value={duration}
          options={durationOptions}
          onChange={(v) => onUpdate("duration", v)}
        />

        <SelectField
          label="Aspect Ratio"
          value={aspectRatio}
          options={aspectRatioOptions}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />

        {resolutionOptions && (
          <SelectField
            label="Resolution"
            value={resolution}
            options={resolutionOptions}
            onChange={(v) => onUpdate("resolution", v)}
          />
        )}

        {config.supportsCfgScale && (
          <SliderField
            label="CFG Scale"
            value={cfgScale}
            min={0}
            max={1}
            step={0.1}
            onChange={(v) => onUpdate("cfgScale", v)}
            formatValue={(v) => v.toFixed(1)}
          />
        )}

        {config.supportsSpecialFx && (
          <SelectField
            label="Special FX"
            value={specialFx}
            options={SPECIAL_FX_OPTIONS}
            onChange={(v) => onUpdate("specialFx", v)}
          />
        )}

        {/* Seed */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Seed</span>
            <span className="text-gray-500">
              <InfoIcon />
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5">
              <div
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  randomSeed
                    ? "border-cyan-500 bg-cyan-500 text-black"
                    : "border-zinc-600 bg-zinc-800"
                }`}
                onClick={() => {
                  if (!randomSeed) {
                    onUpdate("seed", undefined);
                  }
                }}
              >
                {randomSeed && <CheckIcon />}
              </div>
              <span className="text-xs text-gray-300">Random</span>
            </label>
            <input
              type="number"
              value={seed}
              onChange={(e) => {
                if (!randomSeed) {
                  onUpdate("seed", Number(e.target.value));
                }
              }}
              disabled={randomSeed}
              className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-white disabled:opacity-50"
            />
          </div>
        </div>

        {config.supportsAudio && (
          <CheckboxField
            label="Enable Audio"
            checked={audioEnabled}
            onChange={(v) => onUpdate("audioEnabled", v)}
            showInfo
          />
        )}

        {config.supportsPromptEnhancement && (
          <CheckboxField
            label="Prompt Expansion"
            checked={enhanceEnabled}
            onChange={(v) => onUpdate("enhanceEnabled", v)}
            showInfo
          />
        )}

        {config.supportsNegativePrompt && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Negative Prompt</span>
              <span className="text-gray-500">
                <InfoIcon />
              </span>
            </div>
            <textarea
              value={negativePrompt}
              onChange={(e) => onUpdate("negativePrompt", e.target.value)}
              placeholder="Things to avoid..."
              className="h-16 w-full resize-none rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white placeholder-gray-500"
            />
          </div>
        )}
      </PanelBody>

      <RunButton
        label="Generate Video"
        onClick={onExecute}
        isLoading={isExecuting}
        disabled={!executionState?.canExecute}
        disabledReason={executionState?.reason}
      />
    </PanelContainer>
  );
});
