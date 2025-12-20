"use client";

import { memo, useRef, useState, useEffect, useCallback, useMemo } from "react";
import type { NodeProps, Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import BaseNode from "./BaseNode";
import { downloadMedia } from "./MediaSaveOverlay";
import type { Kling25TurboNodeData } from "../types";
import { getContainerHeight, NODE_WIDTH } from "../utils/aspectRatio";

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

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

const VideoIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="animate-pulse text-zinc-500"
  >
    <path
      d="M17 10.5V7C17 6.45 16.55 6 16 6H4C3.45 6 3 6.45 3 7V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V13.5L21 17.5V6.5L17 10.5Z"
      fill="currentColor"
    />
  </svg>
);

const Kling25TurboNode = memo(function Kling25TurboNode({
  id,
  data,
  selected,
}: NodeProps<Node<Kling25TurboNodeData>>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [duration, setDuration] = useState<string>("0:00");
  const [sourceAspectRatio, setSourceAspectRatio] = useState<string | null>(
    null
  );
  const { getNodes, getEdges } = useReactFlow();

  // Detect aspect ratio from connected source nodes
  useEffect(() => {
    const checkSourceAspectRatio = () => {
      const edges = getEdges();
      const nodes = getNodes();

      // Find edges connected to this node
      const incomingEdges = edges.filter((edge) => edge.target === id);

      // Check all incoming edges for a source node with aspectRatio
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
  const detectedAspectRatio = data.aspectRatio || sourceAspectRatio || "16:9";

  // Calculate container height based on detected aspect ratio
  const containerHeight = useMemo(
    () => getContainerHeight(detectedAspectRatio, NODE_WIDTH),
    [detectedAspectRatio]
  );

  useEffect(() => {
    if (data.videoUrl && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
        const mins = Math.floor(video.duration / 60);
        const secs = Math.floor(video.duration % 60);
        setDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () =>
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }
  }, [data.videoUrl]);

  const togglePlayback = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleSave = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data.videoUrl) {
        await downloadMedia(data.videoUrl, "video");
      }
    },
    [data.videoUrl]
  );

  return (
    <BaseNode
      label={data.label || "Kling 2.5 Turbo"}
      selected={selected}
      inputs={[
        { id: "prompt", label: "Prompt", color: "#A78BFA" },
        { id: "video", label: "Video", color: "#EF9092" },
        { id: "firstFrame", label: "First Frame", color: "#F59E0B" },
        { id: "lastFrame", label: "Last Frame", color: "#F59E0B" },
      ]}
      outputs={[{ id: "video", label: "Video", color: "#EF9092" }]}
      isGenerating={data.isGenerating}
    >
      <div className="flex flex-col gap-3">
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
                <VideoIcon />
                <span className="animate-pulse text-[10px] text-zinc-500">
                  Generating...
                </span>
              </div>
            </div>
          ) : data.videoUrl ? (
            <div
              className="relative h-full w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <video
                ref={videoRef}
                src={data.videoUrl}
                className="h-full w-full object-cover"
                onClick={togglePlayback}
                onEnded={handleVideoEnded}
              />
              {/* Overlay - shows when paused or hovered */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor:
                    !isPlaying || isHovered
                      ? "rgba(0, 0, 0, 0.4)"
                      : "transparent",
                  opacity: !isPlaying || isHovered ? 1 : 0,
                  pointerEvents: !isPlaying || isHovered ? "auto" : "none",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Play Button */}
                  <button
                    onClick={togglePlayback}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                  >
                    <PlayIcon />
                  </button>
                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </div>
              <div className="absolute right-2 bottom-2 rounded bg-black/60 px-1.5 py-0.5 text-[8px] text-white">
                {duration}
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
            {data.duration || "5"}s
          </span>
        </div>
      </div>
    </BaseNode>
  );
});

export default Kling25TurboNode;
