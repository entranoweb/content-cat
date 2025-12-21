import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

// POST /api/admin/backfill-thumbnails
// Backfills thumbnails for existing videos using their startImageUrl
export async function POST() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    // Find all videos without thumbnails that have a startImageUrl
    const videosToUpdate = await prisma.generatedVideo.findMany({
      where: {
        userId: user!.id,
        thumbnailUrl: null,
        startImageUrl: { not: null },
      },
      select: {
        id: true,
        startImageUrl: true,
      },
    });

    if (videosToUpdate.length === 0) {
      return NextResponse.json({
        message: "No videos to update",
        updated: 0,
      });
    }

    // Update each video with its startImageUrl as thumbnail
    let updated = 0;
    for (const video of videosToUpdate) {
      await prisma.generatedVideo.update({
        where: { id: video.id },
        data: { thumbnailUrl: video.startImageUrl },
      });
      updated++;
    }

    logger.info("Backfilled video thumbnails", {
      userId: user!.id,
      updated,
    });

    return NextResponse.json({
      message: `Updated ${updated} videos with thumbnails`,
      updated,
    });
  } catch (error) {
    logger.error("Failed to backfill thumbnails", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Failed to backfill thumbnails" },
      { status: 500 }
    );
  }
}

// GET - Check how many videos need thumbnails
export async function GET() {
  const { user, error } = await requireAuth();
  if (error) return error;

  try {
    const [withoutThumbnail, withStartImage, total] = await Promise.all([
      prisma.generatedVideo.count({
        where: { userId: user!.id, thumbnailUrl: null },
      }),
      prisma.generatedVideo.count({
        where: {
          userId: user!.id,
          thumbnailUrl: null,
          startImageUrl: { not: null },
        },
      }),
      prisma.generatedVideo.count({
        where: { userId: user!.id },
      }),
    ]);

    return NextResponse.json({
      total,
      withoutThumbnail,
      canBeFixed: withStartImage,
      needsManualFix: withoutThumbnail - withStartImage,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check thumbnails" },
      { status: 500 }
    );
  }
}
