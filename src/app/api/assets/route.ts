import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listUploadedFiles, deleteFile } from "@/lib/storage";
import { requireAuth } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

export interface GeneratedAsset {
  id: string;
  url: string;
  thumbnailUrl?: string | null;
  prompt: string;
  type: "image" | "video";
  aspectRatio?: string;
  createdAt: Date;
}

// GET /api/assets - List assets (uploaded or generated) with pagination
export async function GET(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "generated";
    const cursor = searchParams.get("cursor");
    const limitParam = searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "50"), 1), 100);

    if (tab === "uploaded") {
      // Get uploaded files from local storage (pagination handled client-side for local files)
      const files = await listUploadedFiles();
      return NextResponse.json({
        data: files,
        count: files.length,
        hasMore: false,
        nextCursor: null,
      });
    } else {
      // Get total counts for both types
      const [imageCount, videoCount] = await Promise.all([
        prisma.generatedImage.count({ where: { userId: user!.id } }),
        prisma.generatedVideo.count({ where: { userId: user!.id } }),
      ]);
      const totalCount = imageCount + videoCount;

      // Parse cursor to get the timestamp and last ID for stable pagination
      let cursorDate: Date | undefined;
      let cursorId: string | undefined;
      if (cursor) {
        const [timestamp, id] = cursor.split("_");
        cursorDate = new Date(parseInt(timestamp));
        cursorId = id;
      }

      // Fetch paginated data with cursor-based pagination
      const [images, videos] = await Promise.all([
        prisma.generatedImage.findMany({
          where: {
            userId: user!.id,
            ...(cursorDate && cursorId
              ? {
                  OR: [
                    { createdAt: { lt: cursorDate } },
                    { createdAt: cursorDate, id: { lt: cursorId } },
                  ],
                }
              : {}),
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: limit + 1, // Fetch one extra to check if there are more
          select: {
            id: true,
            url: true,
            prompt: true,
            aspectRatio: true,
            createdAt: true,
          },
        }),
        prisma.generatedVideo.findMany({
          where: {
            userId: user!.id,
            ...(cursorDate && cursorId
              ? {
                  OR: [
                    { createdAt: { lt: cursorDate } },
                    { createdAt: cursorDate, id: { lt: cursorId } },
                  ],
                }
              : {}),
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: limit + 1,
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            prompt: true,
            aspectRatio: true,
            createdAt: true,
          },
        }),
      ]);

      // Combine and format
      const generatedAssets: GeneratedAsset[] = [
        ...images.map((img) => ({
          id: img.id,
          url: img.url,
          prompt: img.prompt,
          type: "image" as const,
          aspectRatio: img.aspectRatio || undefined,
          createdAt: img.createdAt,
        })),
        ...videos.map((vid) => ({
          id: vid.id,
          url: vid.url,
          thumbnailUrl: vid.thumbnailUrl,
          prompt: vid.prompt,
          type: "video" as const,
          aspectRatio: vid.aspectRatio || undefined,
          createdAt: vid.createdAt,
        })),
      ];

      // Sort by creation date (newest first), then by ID for stability
      generatedAssets.sort((a, b) => {
        const dateCompare = b.createdAt.getTime() - a.createdAt.getTime();
        if (dateCompare !== 0) return dateCompare;
        return b.id.localeCompare(a.id);
      });

      // Take only the requested limit
      const paginatedAssets = generatedAssets.slice(0, limit);
      const hasMore = generatedAssets.length > limit;

      // Generate next cursor from last item
      const lastItem = paginatedAssets[paginatedAssets.length - 1];
      const nextCursor = hasMore && lastItem
        ? `${lastItem.createdAt.getTime()}_${lastItem.id}`
        : null;

      return NextResponse.json({
        data: paginatedAssets,
        count: totalCount,
        hasMore,
        nextCursor,
      });
    }
  } catch (error) {
    logger.error("Failed to fetch assets", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to fetch assets" },
      { status: 500 }
    );
  }
}

// DELETE /api/assets - Delete an asset
export async function DELETE(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type"); // "uploaded", "image", or "video"
    const url = searchParams.get("url");

    if (!id && !url) {
      return NextResponse.json(
        { error: "ID or URL is required" },
        { status: 400 }
      );
    }

    if (type === "uploaded" && url) {
      // Delete from local storage
      const success = await deleteFile(url);
      if (!success) {
        return NextResponse.json(
          { error: "Failed to delete file" },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true });
    } else if (type === "image" && id) {
      // Delete from database
      await prisma.generatedImage.delete({
        where: { id, userId: user!.id },
      });
      return NextResponse.json({ success: true });
    } else if (type === "video" && id) {
      // Delete from database
      await prisma.generatedVideo.delete({
        where: { id, userId: user!.id },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid type specified" },
      { status: 400 }
    );
  } catch (error) {
    logger.error("Failed to delete asset", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to delete asset" },
      { status: 500 }
    );
  }
}
