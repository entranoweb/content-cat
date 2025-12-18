import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type EntityType = "character" | "product";

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// GET handler - List all entities
export function createListHandler(entityType: EntityType) {
  return async function GET() {
    try {
      const entities =
        entityType === "character"
          ? await prisma.character.findMany({ orderBy: { createdAt: "desc" } })
          : await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

      return NextResponse.json(entities);
    } catch (error) {
      console.error(`Failed to fetch ${entityType}s:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${entityType}s` },
        { status: 500 }
      );
    }
  };
}

// POST handler - Create a new entity
export function createCreateHandler(entityType: EntityType) {
  return async function POST(request: Request) {
    try {
      const body = await request.json();
      const { name, referenceImages } = body;

      if (!name || !referenceImages || referenceImages.length === 0) {
        return NextResponse.json(
          { error: "Name and at least one reference image are required" },
          { status: 400 }
        );
      }

      const data = {
        name,
        referenceImages,
        thumbnailUrl: referenceImages[0],
      };

      const entity =
        entityType === "character"
          ? await prisma.character.create({ data })
          : await prisma.product.create({ data });

      return NextResponse.json(entity, { status: 201 });
    } catch (error) {
      console.error(`Failed to create ${entityType}:`, error);
      return NextResponse.json(
        { error: `Failed to create ${entityType}` },
        { status: 500 }
      );
    }
  };
}

// GET by ID handler
export function createGetByIdHandler(entityType: EntityType) {
  return async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const entity =
        entityType === "character"
          ? await prisma.character.findUnique({ where: { id } })
          : await prisma.product.findUnique({ where: { id } });

      if (!entity) {
        return NextResponse.json(
          { error: `${capitalizeFirst(entityType)} not found` },
          { status: 404 }
        );
      }

      return NextResponse.json(entity);
    } catch (error) {
      console.error(`Failed to fetch ${entityType}:`, error);
      return NextResponse.json(
        { error: `Failed to fetch ${entityType}` },
        { status: 500 }
      );
    }
  };
}

// DELETE handler
export function createDeleteHandler(entityType: EntityType) {
  return async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      if (entityType === "character") {
        await prisma.character.delete({ where: { id } });
      } else {
        await prisma.product.delete({ where: { id } });
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error);
      return NextResponse.json(
        { error: `Failed to delete ${entityType}` },
        { status: 500 }
      );
    }
  };
}

// PATCH handler - Update entity
export function createUpdateHandler(entityType: EntityType) {
  return async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const body = await request.json();
      const { name, referenceImages } = body;

      const updateData: {
        name?: string;
        referenceImages?: string[];
        thumbnailUrl?: string;
      } = {};
      if (name) updateData.name = name;
      if (referenceImages) {
        updateData.referenceImages = referenceImages;
        updateData.thumbnailUrl = referenceImages[0];
      }

      const entity =
        entityType === "character"
          ? await prisma.character.update({ where: { id }, data: updateData })
          : await prisma.product.update({ where: { id }, data: updateData });

      return NextResponse.json(entity);
    } catch (error) {
      console.error(`Failed to update ${entityType}:`, error);
      return NextResponse.json(
        { error: `Failed to update ${entityType}` },
        { status: 500 }
      );
    }
  };
}
