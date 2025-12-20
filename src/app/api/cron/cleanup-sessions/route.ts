import { NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/auth";
import { logger } from "@/lib/logger";

/**
 * Cleanup expired sessions endpoint
 * This can be called by a cron job service (Vercel Cron, AWS Lambda, etc.)
 *
 * For Vercel, add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-sessions",
 *     "schedule": "0 * * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  // Verify the request is from a trusted source
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // CRON_SECRET is always required - fail closed for security
  if (!cronSecret) {
    logger.error("CRON_SECRET environment variable is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Verify the secret matches
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedCount = await cleanupExpiredSessions();

    logger.info("Session cleanup completed", { deletedCount });

    return NextResponse.json({
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Session cleanup failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
}
