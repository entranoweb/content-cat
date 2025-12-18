import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/images - List all images
export async function GET() {
  try {
    const images = await prisma.generatedImage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch images:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/images - Create a new image
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url, prompt, aspectRatio } = body;

    if (!url || !prompt) {
      return NextResponse.json(
        { error: "URL and prompt are required" },
        { status: 400 }
      );
    }

    const image = await prisma.generatedImage.create({
      data: {
        url,
        prompt,
        aspectRatio: aspectRatio || "1:1",
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Failed to create image:", error);
    return NextResponse.json(
      { error: "Failed to create image" },
      { status: 500 }
    );
  }
}
