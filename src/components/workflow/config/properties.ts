// Model configuration types and constants for workflow properties panels

export interface ModelConfig {
  name: string;
  color: string;
  price: number;
  durations: string[];
  aspectRatios: string[];
  resolutions?: string[];
  supportsAudio: boolean;
  supportsCfgScale: boolean;
  supportsNegativePrompt: boolean;
  supportsSpecialFx?: boolean;
  supportsPromptEnhancement?: boolean;
}

export interface SelectOption {
  value: string;
  label: string;
}

// Model configurations
export const MODEL_CONFIGS: Record<string, ModelConfig> = {
  kling26: {
    name: "Kling 2.6 Pro",
    color: "from-purple-500 to-blue-500",
    price: 0.35,
    durations: ["5", "10"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: true,
    supportsCfgScale: true,
    supportsNegativePrompt: true,
  },
  kling25Turbo: {
    name: "Kling 2.5 Turbo",
    color: "from-yellow-500 to-orange-500",
    price: 0.35,
    durations: ["5", "10"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    supportsAudio: false,
    supportsCfgScale: true,
    supportsNegativePrompt: true,
    supportsSpecialFx: true,
  },
  wan26: {
    name: "Wan 2.6",
    color: "from-cyan-500 to-teal-500",
    price: 0.25,
    durations: ["5", "10", "15"],
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    resolutions: ["720p", "1080p"],
    supportsAudio: false,
    supportsCfgScale: false,
    supportsNegativePrompt: true,
    supportsPromptEnhancement: true,
  },
};

export const SPECIAL_FX_OPTIONS: SelectOption[] = [
  { value: "", label: "None" },
  { value: "hug", label: "Hug" },
  { value: "kiss", label: "Kiss" },
  { value: "heart_gesture", label: "Heart Gesture" },
  { value: "squish", label: "Squish" },
  { value: "expansion", label: "Expansion" },
  { value: "bloombloom", label: "Bloom" },
  { value: "dizzydizzy", label: "Dizzy" },
  { value: "jelly_press", label: "Jelly Press" },
  { value: "jelly_squish", label: "Jelly Squish" },
  { value: "pixelpixel", label: "Pixel" },
  { value: "yearbook", label: "Yearbook" },
  { value: "anime_figure", label: "Anime Figure" },
];

// Video Editor configuration
export const VIDEO_EDITOR_CONFIG = {
  name: "Video Editor",
  color: "from-pink-500 to-rose-500",
  operations: [
    { value: "trim", label: "Trim & Cut" },
    { value: "concatenate", label: "Concatenate" },
    { value: "transition", label: "Add Transitions" },
    { value: "audio", label: "Add Audio" },
    { value: "subtitles", label: "Add Subtitles" },
    { value: "text", label: "Add Text" },
  ] as SelectOption[],
  transitions: [
    { value: "none", label: "None" },
    { value: "fade", label: "Fade" },
    { value: "crossfade", label: "Crossfade" },
    { value: "slideLeft", label: "Slide Left" },
    { value: "slideRight", label: "Slide Right" },
    { value: "slideUp", label: "Slide Up" },
    { value: "slideDown", label: "Slide Down" },
    { value: "zoomIn", label: "Zoom In" },
    { value: "zoomOut", label: "Zoom Out" },
    { value: "wipeLeft", label: "Wipe Left" },
    { value: "wipeRight", label: "Wipe Right" },
    { value: "blur", label: "Blur" },
    { value: "glitch", label: "Glitch" },
    { value: "flash", label: "Flash" },
  ] as SelectOption[],
  subtitleStyles: [
    { value: "classic", label: "Classic" },
    { value: "tiktok", label: "TikTok" },
    { value: "highlight", label: "Highlight" },
    { value: "minimal", label: "Minimal" },
    { value: "neon", label: "Neon" },
    { value: "karaoke", label: "Karaoke" },
  ] as SelectOption[],
  textPresets: [
    { value: "title", label: "Title" },
    { value: "hook", label: "Hook" },
    { value: "cta", label: "Call to Action" },
    { value: "lowerThird", label: "Lower Third" },
  ] as SelectOption[],
  textPositions: [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "center-left", label: "Center Left" },
    { value: "center", label: "Center" },
    { value: "center-right", label: "Center Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ] as SelectOption[],
  qualities: [
    { value: "draft", label: "Draft (2M, 24fps)" },
    { value: "normal", label: "Normal (5M, 30fps)" },
    { value: "high", label: "High (8M, 30fps)" },
    { value: "best", label: "Best (15M, 60fps)" },
  ] as SelectOption[],
  aspectRatios: [
    { value: "9:16", label: "9:16 (Vertical)" },
    { value: "16:9", label: "16:9 (Horizontal)" },
    { value: "1:1", label: "1:1 (Square)" },
    { value: "4:5", label: "4:5 (Portrait)" },
  ] as SelectOption[],
  resolutions: [
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "4k", label: "4K" },
  ] as SelectOption[],
};

// Nano Banana Pro configuration
export const NANO_BANANA_PRO_CONFIG = {
  name: "Nano Banana Pro",
  color: "from-yellow-500 to-amber-500",
  price: 0.04,
  modes: [
    { value: "text-to-image", label: "Text to Image" },
    { value: "image-edit", label: "Image Edit" },
  ] as SelectOption[],
  aspectRatios: [
    { value: "1:1", label: "1:1 (Square)" },
    { value: "16:9", label: "16:9 (Landscape)" },
    { value: "9:16", label: "9:16 (Portrait)" },
    { value: "4:3", label: "4:3" },
    { value: "3:4", label: "3:4" },
    { value: "3:2", label: "3:2" },
    { value: "2:3", label: "2:3" },
    { value: "21:9", label: "21:9 (Ultrawide)" },
    { value: "5:4", label: "5:4" },
    { value: "4:5", label: "4:5" },
  ] as SelectOption[],
  resolutions: [
    { value: "1K", label: "1K" },
    { value: "2K", label: "2K" },
    { value: "4K", label: "4K (2x cost)" },
  ] as SelectOption[],
  outputFormats: [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPEG" },
    { value: "webp", label: "WebP" },
  ] as SelectOption[],
};
