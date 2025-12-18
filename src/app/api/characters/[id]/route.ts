import {
  createGetByIdHandler,
  createDeleteHandler,
  createUpdateHandler,
} from "@/lib/api/entity-handlers";

export const GET = createGetByIdHandler("character");
export const DELETE = createDeleteHandler("character");
export const PATCH = createUpdateHandler("character");
