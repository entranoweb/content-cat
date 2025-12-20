import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Base upload directory - relative to project root
const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export interface StorageStats {
  totalFiles: number;
  totalSizeBytes: number;
  byType: {
    images: number;
    videos: number;
    other: number;
  };
}

/**
 * Ensure the uploads directory exists
 */
export async function ensureUploadDir(): Promise<void> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Get the file extension from a filename or mime type
 */
function getExtension(filename: string, mimeType?: string): string {
  // Try to get from filename first
  const ext = path.extname(filename).toLowerCase();
  if (ext) return ext;

  // Fall back to mime type
  if (mimeType) {
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/quicktime": ".mov",
    };
    return mimeToExt[mimeType] || "";
  }

  return "";
}

/**
 * Save a file to local storage
 * Returns the URL path to access the file
 */
export async function saveFile(
  file: File,
  category: string = "general"
): Promise<string> {
  await ensureUploadDir();

  // Create category subdirectory
  const categoryDir = path.join(UPLOAD_DIR, category);
  if (!existsSync(categoryDir)) {
    await mkdir(categoryDir, { recursive: true });
  }

  // Generate unique filename
  const ext = getExtension(file.name, file.type);
  const uniqueId = randomUUID();
  const filename = `${uniqueId}${ext}`;
  const filepath = path.join(categoryDir, filename);

  // Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  // Return the URL path (will be served by /api/files/[...path])
  return `/api/files/${category}/${filename}`;
}

/**
 * Save multiple files to local storage
 */
export async function saveFiles(
  files: File[],
  category: string = "general"
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    const url = await saveFile(file, category);
    urls.push(url);
  }
  return urls;
}

/**
 * Get the absolute file path from a URL path
 */
export function getFilePath(urlPath: string): string | null {
  // URL format: /api/files/{category}/{filename}
  const match = urlPath.match(/^\/api\/files\/(.+)$/);
  if (!match) return null;

  const relativePath = match[1];
  return path.join(UPLOAD_DIR, relativePath);
}

/**
 * Delete a file from storage
 */
export async function deleteFile(urlPath: string): Promise<boolean> {
  const filepath = getFilePath(urlPath);
  if (!filepath) return false;

  try {
    await unlink(filepath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<StorageStats> {
  const stats: StorageStats = {
    totalFiles: 0,
    totalSizeBytes: 0,
    byType: {
      images: 0,
      videos: 0,
      other: 0,
    },
  };

  if (!existsSync(UPLOAD_DIR)) {
    return stats;
  }

  const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const videoExts = [".mp4", ".webm", ".mov"];

  async function scanDir(dir: string): Promise<void> {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (entry.isFile()) {
        const fileStat = await stat(fullPath);
        stats.totalFiles++;
        stats.totalSizeBytes += fileStat.size;

        const ext = path.extname(entry.name).toLowerCase();
        if (imageExts.includes(ext)) {
          stats.byType.images++;
        } else if (videoExts.includes(ext)) {
          stats.byType.videos++;
        } else {
          stats.byType.other++;
        }
      }
    }
  }

  await scanDir(UPLOAD_DIR);
  return stats;
}
