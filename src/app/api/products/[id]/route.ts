import {
  createGetByIdHandler,
  createDeleteHandler,
  createUpdateHandler,
} from "@/lib/api/entity-handlers";

export const GET = createGetByIdHandler("product");
export const DELETE = createDeleteHandler("product");
export const PATCH = createUpdateHandler("product");
