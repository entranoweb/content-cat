import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Checking videos without thumbnails...\n");

  // Get stats
  const [withoutThumbnail, withStartImage, total] = await Promise.all([
    prisma.generatedVideo.count({ where: { thumbnailUrl: null } }),
    prisma.generatedVideo.count({
      where: { thumbnailUrl: null, startImageUrl: { not: null } },
    }),
    prisma.generatedVideo.count(),
  ]);

  console.log(`Total videos: ${total}`);
  console.log(`Without thumbnail: ${withoutThumbnail}`);
  console.log(`Can be fixed (has startImageUrl): ${withStartImage}`);
  console.log(`Cannot be fixed (no source image): ${withoutThumbnail - withStartImage}\n`);

  if (withStartImage === 0) {
    console.log("No videos to update.");
    return;
  }

  console.log(`Updating ${withStartImage} videos...\n`);

  // Prisma doesn't support field references in updateMany, so we update one by one
  const videosToUpdate = await prisma.generatedVideo.findMany({
    where: {
      thumbnailUrl: null,
      startImageUrl: { not: null },
    },
    select: { id: true, startImageUrl: true },
  });

  let updated = 0;
  for (const video of videosToUpdate) {
    await prisma.generatedVideo.update({
      where: { id: video.id },
      data: { thumbnailUrl: video.startImageUrl },
    });
    updated++;
    process.stdout.write(`\rUpdated ${updated}/${videosToUpdate.length}`);
  }

  console.log(`\n\nDone! Updated ${updated} videos with thumbnails.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
