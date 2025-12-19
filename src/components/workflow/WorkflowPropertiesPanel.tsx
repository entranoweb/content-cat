"use client";

import { memo, useCallback } from "react";
import type {
  WorkflowNode,
  Kling26NodeData,
  Kling25TurboNodeData,
  Wan26NodeData,
  NanoBananaProNodeData,
  VideoEditorNodeData,
} from "./types";
import { MODEL_CONFIGS } from "./config/properties";
import { ModelPropertiesPanel } from "./properties/ModelPropertiesPanel";
import { VideoEditorPanel } from "./properties/VideoEditorPanel";
import { NanoBananaProPanel } from "./properties/NanoBananaProPanel";
import { PanelContainer } from "./properties/PropertyField";

type ModelNodeData = Kling26NodeData | Kling25TurboNodeData | Wan26NodeData;

interface WorkflowPropertiesPanelProps {
  selectedNode?: WorkflowNode | null;
  onUpdateNode?: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
}

function WorkflowPropertiesPanel({
  selectedNode,
  onUpdateNode,
}: WorkflowPropertiesPanelProps) {
  const nodeType = selectedNode?.type;
  const isModelNode = nodeType && nodeType in MODEL_CONFIGS;
  const isVideoEditor = nodeType === "videoEditor";
  const isNanoBananaPro = nodeType === "nanoBananaPro";

  const handleUpdate = useCallback(
    (key: string, value: unknown) => {
      if (selectedNode && onUpdateNode) {
        onUpdateNode(selectedNode.id, { [key]: value });
      }
    },
    [selectedNode, onUpdateNode]
  );

  // Empty state - no configurable node selected
  if (!isModelNode && !isVideoEditor && !isNanoBananaPro) {
    return (
      <PanelContainer>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-center text-xs text-gray-500">
            Select a node to configure its parameters
          </p>
        </div>
      </PanelContainer>
    );
  }

  // Video Editor panel
  if (isVideoEditor) {
    return (
      <VideoEditorPanel
        nodeData={(selectedNode?.data || {}) as Partial<VideoEditorNodeData>}
        onUpdate={handleUpdate}
      />
    );
  }

  // Nano Banana Pro panel
  if (isNanoBananaPro) {
    return (
      <NanoBananaProPanel
        nodeData={(selectedNode?.data || {}) as Partial<NanoBananaProNodeData>}
        onUpdate={handleUpdate}
      />
    );
  }

  // Model node panel (Kling, Wan, etc.)
  return (
    <ModelPropertiesPanel
      nodeType={nodeType!}
      nodeData={(selectedNode?.data || {}) as Partial<ModelNodeData>}
      onUpdate={handleUpdate}
    />
  );
}

export default memo(WorkflowPropertiesPanel);
