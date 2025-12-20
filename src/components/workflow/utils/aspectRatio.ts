// Utility functions for handling aspect ratios in workflow nodes

const NODE_WIDTH = 248;
const DEFAULT_ASPECT_RATIO = 1; // Square by default
const MAX_CONTAINER_HEIGHT = 440; // Maximum height for portrait aspect ratios
const MIN_CONTAINER_HEIGHT = 140; // Minimum height for landscape aspect ratios

/**
 * Parses an aspect ratio string (e.g., "16:9", "9:16", "1:1") and returns the ratio as a number
 */
export function parseAspectRatio(aspectRatio: string | undefined): number {
  if (!aspectRatio) return DEFAULT_ASPECT_RATIO;

  const parts = aspectRatio.split(":");
  if (parts.length !== 2) return DEFAULT_ASPECT_RATIO;

  const width = parseFloat(parts[0]);
  const height = parseFloat(parts[1]);

  if (isNaN(width) || isNaN(height) || height === 0)
    return DEFAULT_ASPECT_RATIO;

  return width / height;
}

/**
 * Calculates the container height based on aspect ratio
 * Uses NODE_WIDTH as the base and adjusts height accordingly
 * Clamps the result between MIN_CONTAINER_HEIGHT and MAX_CONTAINER_HEIGHT
 */
export function getContainerHeight(
  aspectRatio: string | undefined,
  nodeWidth: number = NODE_WIDTH
): number {
  const ratio = parseAspectRatio(aspectRatio);
  const calculatedHeight = Math.round(nodeWidth / ratio);

  // Clamp the height to reasonable bounds
  return Math.max(
    MIN_CONTAINER_HEIGHT,
    Math.min(MAX_CONTAINER_HEIGHT, calculatedHeight)
  );
}

/**
 * Gets both width and height for a container, potentially adjusting width for very tall aspect ratios
 */
export function getContainerDimensions(
  aspectRatio: string | undefined,
  maxWidth: number = NODE_WIDTH,
  maxHeight: number = 400
): { width: number; height: number } {
  const ratio = parseAspectRatio(aspectRatio);

  // Start with max width
  let width = maxWidth;
  let height = Math.round(width / ratio);

  // If height exceeds max, constrain by height and adjust width
  if (height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * ratio);
  }

  return { width, height };
}

export { NODE_WIDTH };
