import { z } from "zod";

// Video generation request validation
export const generateVideoSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2500, "Prompt too long"),
  model: z.enum(["kling-2.6", "kling-2.5-turbo", "wan-2.6"]).optional(),
  mode: z.enum(["text-to-video", "image-to-video"]).optional(),
  duration: z.enum(["5", "10"]).optional(),
  aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional(),
  resolution: z.enum(["480p", "720p", "1080p"]).optional(),
  audioEnabled: z.boolean().optional(),
  imageUrl: z.string().optional(),
  endImageUrl: z.string().optional(),
  specialFx: z.string().optional(),
  cfgScale: z.number().min(0).max(1).optional(),
});

export type GenerateVideoInput = z.infer<typeof generateVideoSchema>;

// Image generation request validation
export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2500, "Prompt too long"),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "9:21"]).optional(),
  resolution: z.enum(["1K", "2K"]).optional(),
  outputFormat: z.enum(["png", "jpeg", "webp"]).optional(),
  imageUrls: z.array(z.string()).max(4, "Maximum 4 reference images").optional(),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;

// Workflow validation
export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.record(z.string(), z.unknown()),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
  type: z.string().optional(),
});

export const workflowSchema = z.object({
  name: z.string().optional(),
  nodes: z.array(workflowNodeSchema),
  edges: z.array(workflowEdgeSchema),
});

export type WorkflowInput = z.infer<typeof workflowSchema>;

// Entity (Character/Product) validation
export const entitySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  referenceImages: z.array(z.string().url()).min(1, "At least one reference image required").max(10, "Maximum 10 images"),
});

export type EntityInput = z.infer<typeof entitySchema>;

// Helper to validate and parse request body
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return {
        success: false,
        error: firstError?.message || "Invalid request body",
      };
    }

    return { success: true, data: result.data };
  } catch {
    return { success: false, error: "Invalid JSON body" };
  }
}
