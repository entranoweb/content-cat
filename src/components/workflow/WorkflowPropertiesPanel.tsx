"use client";

import { memo, useCallback } from "react";
import type {
  WorkflowNode,
  Kling26NodeData,
  Kling25TurboNodeData,
  Wan26NodeData,
  NanoBananaProNodeData,
  VideoConcatNodeData,
  VideoSubtitlesNodeData,
  VideoTrimNodeData,
  VideoTransitionNodeData,
} from "./types";
import { MODEL_CONFIGS } from "./config/properties";
import { ModelPropertiesPanel } from "./properties/ModelPropertiesPanel";
import { NanoBananaProPanel } from "./properties/NanoBananaProPanel";
import { VideoEditingPanel } from "./properties/VideoEditingPanel";

type ModelNodeData = Kling26NodeData | Kling25TurboNodeData | Wan26NodeData;
type VideoEditingNodeData =
  | VideoConcatNodeData
  | VideoSubtitlesNodeData
  | VideoTrimNodeData
  | VideoTransitionNodeData;

// Video editing node types
const VIDEO_EDITING_NODES = new Set([
  "videoConcat",
  "videoSubtitles",
  "videoTrim",
  "videoTransition",
]);

interface ExecutionState {
  canExecute: boolean;
  reason?: string;
}

interface WorkflowPropertiesPanelProps {
  selectedNode?: WorkflowNode | null;
  onUpdateNode?: (nodeId: string, data: Partial<WorkflowNode["data"]>) => void;
  onExecute?: () => void;
  isExecuting?: boolean;
  executionState?: ExecutionState;
}

function WorkflowPropertiesPanel({
  selectedNode,
  onUpdateNode,
  onExecute,
  isExecuting = false,
  executionState,
}: WorkflowPropertiesPanelProps) {
  const nodeType = selectedNode?.type;
  const isModelNode = nodeType && nodeType in MODEL_CONFIGS;
  const isNanoBananaPro = nodeType === "nanoBananaPro";
  const isVideoEditing = nodeType && VIDEO_EDITING_NODES.has(nodeType);

  const handleUpdate = useCallback(
    (key: string, value: unknown) => {
      if (selectedNode && onUpdateNode) {
        onUpdateNode(selectedNode.id, { [key]: value });
      }
    },
    [selectedNode, onUpdateNode]
  );

  // If no configurable node, don't render (parent component should handle this)
  if (!isModelNode && !isNanoBananaPro && !isVideoEditing) {
    return null;
  }

  // Video editing panel
  if (isVideoEditing) {
    return (
      <VideoEditingPanel
        nodeType={nodeType!}
        nodeData={(selectedNode?.data || {}) as Partial<VideoEditingNodeData>}
        onUpdate={handleUpdate}
        onExecute={onExecute}
        isExecuting={isExecuting}
        executionState={executionState}
      />
    );
  }

  // Nano Banana Pro panel
  if (isNanoBananaPro) {
    return (
      <NanoBananaProPanel
        nodeData={(selectedNode?.data || {}) as Partial<NanoBananaProNodeData>}
        onUpdate={handleUpdate}
        onExecute={onExecute}
        isExecuting={isExecuting}
        executionState={executionState}
      />
    );
  }

  // Model node panel (Kling, Wan, etc.)
  return (
    <ModelPropertiesPanel
      nodeType={nodeType!}
      nodeData={(selectedNode?.data || {}) as Partial<ModelNodeData>}
      onUpdate={handleUpdate}
      onExecute={onExecute}
      isExecuting={isExecuting}
      executionState={executionState}
    />
  );
}

export default memo(WorkflowPropertiesPanel);
