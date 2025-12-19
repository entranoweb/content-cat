"use client";

import { memo } from "react";
import type { NanoBananaProNodeData } from "../types";
import { NANO_BANANA_PRO_CONFIG } from "../config/properties";
import {
  PanelContainer,
  PanelHeader,
  PanelBody,
  RunButton,
  SelectField,
  SliderField,
  CheckboxField,
} from "./PropertyField";

interface NanoBananaProPanelProps {
  nodeData: Partial<NanoBananaProNodeData>;
  onUpdate: (key: string, value: unknown) => void;
}

export const NanoBananaProPanel = memo(function NanoBananaProPanel({
  nodeData,
  onUpdate,
}: NanoBananaProPanelProps) {
  const mode = nodeData.mode || "text-to-image";
  const aspectRatio = nodeData.aspectRatio || "1:1";
  const resolution = nodeData.resolution || "1K";
  const outputFormat = nodeData.outputFormat || "png";
  const numImages = nodeData.numImages || 1;
  const enableWebSearch = nodeData.enableWebSearch ?? false;
  const enableSafetyChecker = nodeData.enableSafetyChecker ?? true;

  return (
    <PanelContainer>
      <PanelHeader
        name={NANO_BANANA_PRO_CONFIG.name}
        color={NANO_BANANA_PRO_CONFIG.color}
        price={NANO_BANANA_PRO_CONFIG.price}
      />

      <PanelBody>
        <SelectField
          label="Mode"
          value={mode}
          options={NANO_BANANA_PRO_CONFIG.modes}
          onChange={(v) => onUpdate("mode", v)}
        />

        <SelectField
          label="Aspect Ratio"
          value={aspectRatio}
          options={NANO_BANANA_PRO_CONFIG.aspectRatios}
          onChange={(v) => onUpdate("aspectRatio", v)}
        />

        <SelectField
          label="Resolution"
          value={resolution}
          options={NANO_BANANA_PRO_CONFIG.resolutions}
          onChange={(v) => onUpdate("resolution", v)}
        />

        <SelectField
          label="Output Format"
          value={outputFormat}
          options={NANO_BANANA_PRO_CONFIG.outputFormats}
          onChange={(v) => onUpdate("outputFormat", v)}
        />

        <SliderField
          label="Number of Images"
          value={numImages}
          min={1}
          max={4}
          step={1}
          onChange={(v) => onUpdate("numImages", v)}
        />

        <CheckboxField
          label="Enable Web Search"
          checked={enableWebSearch}
          onChange={(v) => onUpdate("enableWebSearch", v)}
          showInfo
        />

        <CheckboxField
          label="Safety Checker"
          checked={enableSafetyChecker}
          onChange={(v) => onUpdate("enableSafetyChecker", v)}
          showInfo
        />
      </PanelBody>

      <RunButton label="Generate Image" />
    </PanelContainer>
  );
});
