/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Image Generation Script for Products Page
 * Uses Kie.ai Seedream 4.5 API to generate product photography
 *
 * Usage: node generate-images.js
 */

const fs = require("fs");
const path = require("path");

const API_KEY = "4c6bec602d48c03944dc57c88d39dee3";
const BASE_URL = "https://api.kie.ai";
const OUTPUT_DIR = path.join(__dirname);

// All images to generate
const imagesToGenerate = [
  // Preview images (4) - showcase variety of product types
  // Aspect ratio 3:4 (portrait for the card layout)
  {
    filename: "product-1.jpg",
    aspectRatio: "3:4",
    prompt:
      "Minimalist product photography of a premium white cotton t-shirt neatly folded on clean white marble surface, soft diffused studio lighting, subtle shadow, luxury fashion brand aesthetic, photorealistic, sharp focus, commercial quality",
  },
  {
    filename: "product-2.jpg",
    aspectRatio: "3:4",
    prompt:
      "Elegant skincare product photography, frosted glass serum bottle with gold cap on white pedestal, soft gradient background in cream and white tones, professional beauty product lighting, subtle reflections, photorealistic, commercial photography",
  },
  {
    filename: "product-3.jpg",
    aspectRatio: "3:4",
    prompt:
      "High-end sneaker product shot, single white minimalist sneaker on elevated white platform, clean studio lighting with soft shadows, contemporary footwear photography, sharp detail on texture, photorealistic, luxury brand aesthetic",
  },
  {
    filename: "product-4.jpg",
    aspectRatio: "3:4",
    prompt:
      "Premium coffee bag product photography, matte black coffee bag with minimal branding on natural wood surface, soft morning light, clean white background, artisan brand aesthetic, photorealistic, commercial quality shot",
  },

  // Gallery images (5) - UNIFIED AESTHETIC
  // Same clean white studio, same lighting, same minimalist style
  // Different products but cohesive look throughout
  // Aspect ratio 2:3 (taller portrait for h-72 w-48 gallery cards)
  {
    filename: "product-gallery-1.jpg",
    aspectRatio: "2:3",
    prompt:
      "Clean product photography on pure white seamless background, premium wireless earbuds case in matte white finish, centered composition, soft even studio lighting from above, no harsh shadows, minimal and modern, photorealistic, e-commerce style product shot",
  },
  {
    filename: "product-gallery-2.jpg",
    aspectRatio: "2:3",
    prompt:
      "Clean product photography on pure white seamless background, luxury perfume bottle with clear glass and gold accents, centered composition, soft even studio lighting from above, no harsh shadows, minimal and modern, photorealistic, e-commerce style product shot",
  },
  {
    filename: "product-gallery-3.jpg",
    aspectRatio: "2:3",
    prompt:
      "Clean product photography on pure white seamless background, premium leather wallet in tan brown color, centered composition, soft even studio lighting from above, no harsh shadows, minimal and modern, photorealistic, e-commerce style product shot",
  },
  {
    filename: "product-gallery-4.jpg",
    aspectRatio: "2:3",
    prompt:
      "Clean product photography on pure white seamless background, minimalist wristwatch with white dial and leather strap, centered composition, soft even studio lighting from above, no harsh shadows, minimal and modern, photorealistic, e-commerce style product shot",
  },
  {
    filename: "product-gallery-5.jpg",
    aspectRatio: "2:3",
    prompt:
      "Clean product photography on pure white seamless background, premium sunglasses with black frame, centered composition, soft even studio lighting from above, no harsh shadows, minimal and modern, photorealistic, e-commerce style product shot",
  },
];

async function createTask(prompt, aspectRatio) {
  const response = await fetch(`${BASE_URL}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "seedream/4.5-text-to-image",
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
        quality: "high",
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create task: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data?.taskId || data.taskId;
}

async function getTaskResult(taskId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/jobs/recordInfo?taskId=${taskId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get task: ${response.status} - ${error}`);
  }

  const json = await response.json();
  return json.data || json;
}

async function downloadImage(url, filename) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  console.log(`  Saved: ${filePath}`);
}

async function waitForTask(taskId, maxAttempts = 60, intervalMs = 5000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getTaskResult(taskId);

    if (result.state === "success") {
      if (result.resultJson) {
        const parsed = JSON.parse(result.resultJson);
        result.imageUrls = parsed.resultUrls || [];
      }
      return result;
    } else if (result.state === "failed" || result.state === "error") {
      throw new Error(`Task failed: ${result.failMsg || "Unknown error"}`);
    }

    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Task timed out");
}

async function generateImage(imageConfig) {
  const { filename, prompt, aspectRatio } = imageConfig;

  console.log(`\nGenerating: ${filename}`);
  console.log(`  Prompt: ${prompt.substring(0, 80)}...`);
  console.log(`  Aspect Ratio: ${aspectRatio}`);

  try {
    const taskId = await createTask(prompt, aspectRatio);
    console.log(`  Task ID: ${taskId}`);

    console.log(`  Waiting for completion...`);
    const result = await waitForTask(taskId);

    const imageUrl = result.imageUrls?.[0];
    if (!imageUrl) {
      console.log("  Result:", JSON.stringify(result, null, 2));
      throw new Error("No image URL in result");
    }
    console.log("");

    await downloadImage(imageUrl, filename);
    console.log(`  Complete!`);

    return { success: true, filename };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { success: false, filename, error: error.message };
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Products Page Image Generator");
  console.log("Using Kie.ai Seedream 4.5 API");
  console.log("=".repeat(60));
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`Total images to generate: ${imagesToGenerate.length}`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  for (let i = 0; i < imagesToGenerate.length; i++) {
    console.log(`\n[${i + 1}/${imagesToGenerate.length}]`);
    const result = await generateImage(imagesToGenerate[i]);
    results.push(result);

    if (i < imagesToGenerate.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("GENERATION COMPLETE");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${results.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed images:`);
    failed.forEach((f) => console.log(`  - ${f.filename}: ${f.error}`));
  }

  const logPath = path.join(OUTPUT_DIR, "generation-log.json");
  fs.writeFileSync(
    logPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        results,
      },
      null,
      2
    )
  );
  console.log(`\nLog saved to: ${logPath}`);
}

main().catch(console.error);
