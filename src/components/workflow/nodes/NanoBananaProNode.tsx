"use client";

import { memo, useMemo, useState, useCallback, useEffect } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import Image from "next/image";
import BaseNode from "./BaseNode";
import { downloadMedia } from "./MediaSaveOverlay";
import type { NanoBananaProNodeData } from "../types";
import { getContainerHeight, NODE_WIDTH } from "../utils/aspectRatio";

const MIN_INPUTS = 5;
const MAX_INPUTS = 14;

const DownloadIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="animate-pulse text-zinc-500"
  >
    <path
      d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
      fill="currentColor"
    />
  </svg>
);

const NanoBananaProNode = memo(function NanoBananaProNode({
  id,
  data,
  selected,
}: NodeProps<Node<NanoBananaProNodeData>>) {
  const [isHovered, setIsHovered] = useState(false);
  const [sourceAspectRatio, setSourceAspectRatio] = useState<string | null>(
    null
  );
  const { setNodes, getNodes, getEdges } = useReactFlow();

  // Dynamic input count (5-14)
  const inputCount = data.inputCount || MIN_INPUTS;
  const canAddInput = inputCount < MAX_INPUTS;

  // Detect aspect ratio from connected source nodes
  useEffect(() => {
    const checkSourceAspectRatio = () => {
      const edges = getEdges();
      const nodes = getNodes();

      // Find edges connected to this node
      const incomingEdges = edges.filter((edge) => edge.target === id);

      // Check connected source nodes for aspect ratio (prioritize image inputs)
      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (sourceNode) {
          const sourceData = sourceNode.data as { aspectRatio?: string };
          if (sourceData.aspectRatio) {
            setSourceAspectRatio(sourceData.aspectRatio);
            return;
          }
        }
      }

      setSourceAspectRatio(null);
    };

    // Check immediately
    checkSourceAspectRatio();

    // Set up an interval to poll for changes
    const interval = setInterval(checkSourceAspectRatio, 500);

    return () => clearInterval(interval);
  }, [id, getNodes, getEdges]);

  // User override takes precedence, then detected, then default
  const detectedAspectRatio = data.aspectRatio || sourceAspectRatio || "1:1";

  // Generate dynamic inputs array (prompt + reference images)
  const inputs = useMemo(() => {
    const imageInputs = Array.from({ length: inputCount }, (_, i) => ({
      id: `image${i + 1}`,
      label: `Ref ${i + 1}`,
      color: "#F59E0B",
    }));
    return [
      { id: "prompt", label: "Prompt", color: "#A78BFA" },
      ...imageInputs,
    ];
  }, [inputCount]);

  // Handler to add more inputs
  const handleAddInput = useCallback(() => {
    if (inputCount < MAX_INPUTS) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  inputCount: inputCount + 1,
                },
              }
            : node
        )
      );
    }
  }, [id, inputCount, setNodes]);

  // Calculate container height based on detected aspect ratio
  const containerHeight = useMemo(
    () => getContainerHeight(detectedAspectRatio, NODE_WIDTH),
    [detectedAspectRatio]
  );

  // Calculate minimum height needed to accommodate all input handles + add button
  // Handles start at 65px and are spaced 36px apart
  // Total inputs = 1 (prompt) + inputCount (images)
  const minContentHeight = useMemo(() => {
    const totalInputs = 1 + inputCount; // prompt + image inputs
    // Last handle position + handle height + buffer - header height
    // Add extra 36px for the + button if we can add more inputs
    const addButtonSpace = canAddInput ? 36 : 0;
    const handleSpaceNeeded =
      65 + (totalInputs - 1) * 36 + 20 + addButtonSpace - 40;
    return Math.max(0, handleSpaceNeeded);
  }, [inputCount, canAddInput]);

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.imageUrl) {
        await downloadMedia(data.imageUrl, "image");
      }
    },
    [data.imageUrl]
  );

  return (
    <BaseNode
      label={data.label || "Nano Banana Pro"}
      selected={selected}
      inputs={inputs}
      outputs={[{ id: "image", label: "Image", color: "#F59E0B" }]}
      isGenerating={data.isGenerating}
      onAddInput={handleAddInput}
      canAddInput={canAddInput}
    >
      <div
        className="flex flex-col gap-3"
        style={{ minHeight: minContentHeight }}
      >
        {/* Output Container */}
        <div
          className="nodrag relative w-full overflow-hidden rounded-lg transition-all duration-300"
          style={{
            backgroundColor: "rgb(31, 31, 35)",
            height: containerHeight,
          }}
        >
          {data.isGenerating ? (
            <div className="skeleton-loader flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <ImageIcon />
                <span className="animate-pulse text-[10px] text-zinc-500">
                  Generating...
                </span>
              </div>
            </div>
          ) : data.imageUrl ? (
            <div
              className="relative h-full w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={data.imageUrl}
                alt="Generated"
                fill
                sizes="200px"
                className="object-cover"
              />
              {/* Overlay with save button */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: isHovered
                    ? "rgba(0, 0, 0, 0.4)"
                    : "transparent",
                  opacity: isHovered ? 1 : 0,
                  pointerEvents: isHovered ? "auto" : "none",
                }}
              >
                <button
                  onClick={handleSave}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                >
                  <DownloadIcon />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #1f1f23 25%, transparent 25%),
                  linear-gradient(-45deg, #1f1f23 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #1f1f23 75%),
                  linear-gradient(-45deg, transparent 75%, #1f1f23 75%)
                `,
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                backgroundColor: "#2b2b2f",
              }}
            >
              <span className="text-[10px] text-gray-500">No output yet</span>
            </div>
          )}
        </div>

        {/* Settings badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] text-gray-400">
            {detectedAspectRatio}
          </span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] text-gray-400">
            {data.resolution || "1K"}
          </span>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[8px] text-gray-400 uppercase">
            {data.outputFormat || "png"}
          </span>
        </div>
      </div>
    </BaseNode>
  );
});

export default NanoBananaProNode;
