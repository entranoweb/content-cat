import { prisma } from "@/lib/prisma";

/**
 * Get API key from database for a given service
 * @param service - The service name (default: "fal")
 * @returns The API key if found and active, null otherwise
 */
export async function getApiKey(service: string = "fal"): Promise<string | null> {
  try {
    const storedKey = await prisma.apiKey.findUnique({
      where: { service },
    });
    if (storedKey?.isActive && storedKey.key) {
      return storedKey.key;
    }
  } catch (error) {
    console.error(`Failed to fetch API key for ${service} from database:`, error);
  }
  return null;
}

/**
 * Check if an API key exists and is active for a given service
 * @param service - The service name (default: "fal")
 * @returns True if key exists and is active
 */
export async function hasActiveApiKey(service: string = "fal"): Promise<boolean> {
  const key = await getApiKey(service);
  return key !== null;
}
