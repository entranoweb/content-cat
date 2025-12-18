"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/Header";
import ImagePromptForm from "@/components/ImagePromptForm";
import {
  ImageCard,
  ImageGridSkeleton,
  ImageEmptyState,
  ImageDetailOverlay,
  type GeneratedImage,
} from "@/components/image";

export default function ImagePage() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || "";
  const initialModel = searchParams.get("model") || undefined;
  const initialCharacterId = searchParams.get("characterId") || undefined;
  const initialProductId = searchParams.get("productId") || undefined;
  const initialSubModel = initialCharacterId || initialProductId || undefined;
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [recreateData, setRecreateData] = useState<{ prompt: string } | null>(
    null
  );
  const [editData, setEditData] = useState<{ imageUrl: string } | null>(null);

  // Fetch images from database on mount
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch("/api/images");
      if (response.ok) {
        const images = await response.json();
        setGeneratedImages(images);
      } else {
        toast.error("Failed to load images");
      }
    } catch {
      toast.error("Failed to load images");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const toggleSelectImage = (id: string) => {
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDownload = async (url: string, prompt: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        toast.error("Failed to download image");
        return;
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${prompt.slice(0, 30).replace(/[^a-z0-9]/gi, "_")}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download image");
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistically update UI
    setGeneratedImages((prev) => prev.filter((img) => img.id !== id));
    setSelectedImages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    // Delete from database
    try {
      const response = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (!response.ok) {
        toast.error("Failed to delete image");
        fetchImages(); // Restore state
      }
    } catch {
      toast.error("Failed to delete image");
      fetchImages(); // Restore state
    }
  };

  const handleGenerate = (data: {
    prompt: string;
    model: string;
    count: number;
    aspectRatio: string;
    resolution: string;
    outputFormat: string;
    referenceImages: string[];
  }) => {
    // Add to pending count immediately (fire-and-forget style)
    setPendingCount((prev) => prev + data.count);

    // Process generation in background without blocking
    const generateImages = async () => {
      let successCount = 0;

      for (let i = 0; i < data.count; i++) {
        try {
          const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: data.prompt,
              aspectRatio: data.aspectRatio,
              resolution: data.resolution,
              outputFormat: data.outputFormat,
              imageUrls: data.referenceImages,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            toast.error(result.error || "Failed to generate image");
            // Decrement pending count for this failed generation
            setPendingCount((prev) => Math.max(0, prev - 1));
            continue; // Try next one instead of breaking
          }

          if (result.resultUrls && result.resultUrls.length > 0) {
            for (const url of result.resultUrls) {
              // Save to database
              const saveResponse = await fetch("/api/images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url,
                  prompt: data.prompt,
                  aspectRatio: data.aspectRatio,
                }),
              });

              if (saveResponse.ok) {
                const savedImage = await saveResponse.json();
                // Add each image immediately as it's generated
                setGeneratedImages((prev) => [savedImage, ...prev]);
                successCount++;
              }
            }
          }

          // Decrement pending count after successful generation
          setPendingCount((prev) => Math.max(0, prev - 1));
        } catch (err) {
          toast.error(
            err instanceof Error ? err.message : "Something went wrong. Try again."
          );
          // Decrement pending count for this failed generation
          setPendingCount((prev) => Math.max(0, prev - 1));
        }
      }

      if (successCount > 0) {
        toast.success(`Generated ${successCount} image${successCount > 1 ? 's' : ''}`);
      }
    };

    // Start generation without awaiting (fire-and-forget)
    generateImages();
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0a0a0a]">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col p-4">
        {/* Gallery Grid - scrollable container */}
        <div
          id="soul-feed-scroll"
          className="hide-scrollbar min-h-0 flex-1 overflow-y-auto pb-48"
        >
            {/* Loading state */}
            {isLoading && (
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="size-8 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                  <span className="text-sm text-zinc-400">
                    Loading images...
                  </span>
                </div>
              </div>
            )}

            {/* Generated Images Display */}
            {!isLoading && (generatedImages.length > 0 || pendingCount > 0) ? (
              <div
                className="grid w-full grid-cols-2 gap-1.5 md:grid-cols-4"
                style={{ gridAutoRows: "320px" }}
              >
                {/* Skeleton loaders while generating */}
                {pendingCount > 0 && <ImageGridSkeleton count={pendingCount} />}

                {/* Generated images */}
                {generatedImages.map((img, index) => (
                  <ImageCard
                    key={img.id}
                    image={img}
                    isSelected={selectedImages.has(img.id)}
                    isPriority={index < 4}
                    onSelect={() => toggleSelectImage(img.id)}
                    onClick={() => setSelectedImage(img)}
                    onDownload={() => handleDownload(img.url, img.prompt)}
                    onDelete={() => handleDelete(img.id)}
                    onEdit={() => setEditData({ imageUrl: img.url })}
                  />
                ))}
              </div>
            ) : !isLoading ? (
              <ImageEmptyState />
            ) : null}
        </div>
      </div>

      {/* Bottom Prompt Form */}
      <ImagePromptForm
        onSubmit={handleGenerate}
        initialPrompt={initialPrompt}
        initialModel={initialModel}
        initialSubModel={initialSubModel}
        recreateData={recreateData}
        editData={editData}
      />

      {/* Image Detail Overlay */}
      {selectedImage && (
        <ImageDetailOverlay
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={(id) => {
            handleDelete(id);
            setSelectedImage(null);
          }}
          onDownload={handleDownload}
          onRecreate={(prompt) => {
            setRecreateData({ prompt });
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
}
