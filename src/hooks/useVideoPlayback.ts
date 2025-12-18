"use client";

import { useState, useRef, useCallback } from "react";

interface UseVideoPlaybackReturn {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleVideoEnd: () => void;
}

export function useVideoPlayback(): UseVideoPlaybackReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    isPlaying,
    handlePlayPause,
    handleVideoEnd,
  };
}
