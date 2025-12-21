"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PresetSelector from "@/components/PresetSelector";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import {
  VideoSidebar,
  VideoHistoryView,
  HowItWorksSection,
  FolderIcon,
  BookIcon,
} from "@/components/video";
import { useVideoGeneration, useVideos, useImageUpload } from "@/hooks";
import type { VideoModelId } from "@/lib/fal";

export default function VideoPage() {
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Video history management (SWR-cached)
  const {
    videos: generatedVideos,
    isLoading: isLoadingVideos,
    showResults,
    setShowResults,
    hasMore,
    isLoadingMore,
    addVideo,
    loadMore: loadMoreVideos,
    deleteVideo,
    downloadVideo,
    copyPrompt,
  } = useVideos();

  // Video generation state
  const {
    videoState,
    modelConfig,
    credits,
    pendingCount,
    isGenerating,
    updateVideoState,
    handleModelChange,
    handleDurationChange,
    handleAspectChange,
    handleResolutionChange,
    handleGenerate,
    handleRerunVideo,
  } = useVideoGeneration({
    onVideoGenerated: (video) => {
      addVideo(video);
    },
  });

  // Image upload handling
  const {
    startImageUrl,
    endImageUrl,
    isSwapping,
    startImageInputRef,
    endImageInputRef,
    handleImageUpload,
    clearImage,
    swapImages,
    resetImages,
    attachImageFromResult,
  } = useImageUpload({
    onStartImageChange: (url) => updateVideoState({ imageUrl: url }),
    onEndImageChange: (url) => updateVideoState({ endImageUrl: url }),
    onSingleImageChange: (url) => updateVideoState({ imageUrl: url }),
    onModeChange: (mode) => updateVideoState({ mode }),
  });

  // Handle model change with image reset
  const handleModelChangeWithReset = (modelId: VideoModelId) => {
    handleModelChange(modelId, {
      onStartEndFrameReset: resetImages,
    });
  };

  // Handle generate with results view
  const handleGenerateWithView = async () => {
    const success = await handleGenerate();
    if (success) {
      setShowResults(true);
    }
  };

  // Handle attach images from video result
  const handleAttachImages = (imageUrl?: string) => {
    if (imageUrl) {
      attachImageFromResult(imageUrl, modelConfig.supportsStartEndFrames);
    }
  };

  // Video delete with confirmation
  const handleDeleteWithConfirm = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId) {
      deleteVideo(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <VideoSidebar
          videoState={videoState}
          modelConfig={modelConfig}
          credits={credits}
          isGenerating={isGenerating}
          startImageUrl={startImageUrl}
          endImageUrl={endImageUrl}
          isSwapping={isSwapping}
          startImageInputRef={startImageInputRef}
          endImageInputRef={endImageInputRef}
          onUpdateVideoState={updateVideoState}
          onModelChange={handleModelChangeWithReset}
          onDurationChange={handleDurationChange}
          onAspectChange={handleAspectChange}
          onResolutionChange={handleResolutionChange}
          onImageUpload={handleImageUpload}
          onClearImage={clearImage}
          onSwapImages={swapImages}
          onGenerate={handleGenerateWithView}
        />

        {/* Main Content */}
        <main className="relative flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 pb-4">
          {showPresetSelector ? (
            /* Preset Selector View */
            <PresetSelector
              isOpen={showPresetSelector}
              onClose={() => setShowPresetSelector(false)}
              onSelectPreset={() => {}}
            />
          ) : (
            <>
              {/* Shared Tabs with sliding indicator */}
              <div className="z-10 mb-4 w-fit">
                <nav className="relative flex gap-1 rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-xl">
                  {/* Sliding indicator */}
                  <div
                    className={`absolute top-1 bottom-1 left-1 w-[120px] rounded-lg border border-white/10 bg-white/10 transition-all duration-200 ease-out ${
                      showResults || pendingCount > 0
                        ? "translate-x-0"
                        : "translate-x-[124px]"
                    }`}
                  />
                  <button
                    onClick={() => setShowResults(true)}
                    className={`relative z-10 flex w-[120px] items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      showResults || pendingCount > 0
                        ? "text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <FolderIcon />
                    History
                  </button>
                  <button
                    onClick={() => setShowResults(false)}
                    className={`relative z-10 flex w-[120px] items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                      showResults || pendingCount > 0
                        ? "text-zinc-400 hover:text-white"
                        : "text-white"
                    }`}
                  >
                    <BookIcon />
                    How it works
                  </button>
                </nav>
              </div>

              {/* Content area */}
              {showResults || pendingCount > 0 ? (
                <VideoHistoryView
                  videos={generatedVideos}
                  isLoading={isLoadingVideos}
                  pendingCount={pendingCount}
                  hasMore={hasMore}
                  isLoadingMore={isLoadingMore}
                  onRerun={handleRerunVideo}
                  onDelete={handleDeleteWithConfirm}
                  onDownload={downloadVideo}
                  onCopy={copyPrompt}
                  onAttachImages={handleAttachImages}
                  onLoadMore={loadMoreVideos}
                />
              ) : (
                <HowItWorksSection />
              )}
            </>
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
