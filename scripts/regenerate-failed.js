/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Regenerate Failed Prompt Thumbnails
 * Retries the 3 prompts that failed during initial generation
 */

const fs = require("fs");
const path = require("path");

const API_KEY = "4c6bec602d48c03944dc57c88d39dee3";
const BASE_URL = "https://api.kie.ai";
const OUTPUT_DIR = path.join(__dirname, "../public/images/prompts");

// Failed prompts to regenerate
const failedPrompts = [
  {
    id: "underwater-macro",
    prompt: `Hyper-realistic ultra-detailed close-up portrait showing half of face submerged in crystal clear water, one eye in sharp focus above waterline, light rays creating caustic patterns on skin, suspended water droplets and bubbles, cinematic lighting, surreal dreamlike atmosphere, underwater macro perspective.`,
  },
  {
    id: "backpack-packshot",
    prompt: `Realistic studio photo of a modern hiking backpack standing upright on white seamless background, high-key light tent, even illumination, visible zipper and pocket details, centered, professional product photography.`,
  },
  {
    id: "jewelry-diffusion",
    prompt: `Photoreal jewelry packshot of elegant diamond engagement ring on pure white seamless background, large diffusion tent lighting, controlled specular highlights, focus on gemstone facets and brilliance, minimal reflections, centered, luxury jewelry photography.`,
  },
];

async function createTask(prompt, aspectRatio, imageUrl = null) {
  const input = {
    prompt,
    aspect_ratio: aspectRatio,
    quality: "high",
  };

  if (imageUrl) {
    input.image_urls = [imageUrl];
  }

  const response = await fetch(`${BASE_URL}/api/v1/jobs/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "seedream/4.5-text-to-image",
      input,
    }),
  });

  const data = await response.json();
  return data.data?.taskId || data.taskId;
}

async function getTaskResult(taskId) {
  const response = await fetch(
    `${BASE_URL}/api/v1/jobs/recordInfo?taskId=${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();
  return json.data || json;
}

async function downloadImage(url, filename) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filePath, Buffer.from(buffer));
  return filePath;
}

async function waitForTask(taskId, maxAttempts = 120, intervalMs = 5000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getTaskResult(taskId);

    if (result.state === "success") {
      if (result.resultJson) {
        const parsed = JSON.parse(result.resultJson);
        return parsed.resultUrls?.[0];
      }
      return null;
    } else if (result.state === "failed" || result.state === "fail") {
      throw new Error(`Task failed: ${result.failMsg || "Unknown error"}`);
    }

    process.stdout.write(".");
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("Task timed out");
}

async function generateImage(promptConfig, retries = 3) {
  const { id, prompt } = promptConfig;
  const filename = `${id}.jpg`;

  console.log(`\nGenerating: ${id}`);
  console.log(`  Prompt: ${prompt.substring(0, 60)}...`);

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`  Attempt ${attempt + 1}/${retries}...`);

      const taskId = await createTask(prompt, "1:1", null);
      const url = await waitForTask(taskId);
      console.log("");

      if (!url) {
        throw new Error("No image URL returned");
      }

      await downloadImage(url, filename);
      console.log(`  Saved: ${filename}`);
      return { success: true, id, filename };
    } catch (error) {
      console.error(`  Error: ${error.message}`);
      if (attempt < retries - 1) {
        console.log(`  Retrying in 5 seconds...`);
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }

  return { success: false, id, error: "All retries failed" };
}

async function main() {
  console.log("=".repeat(50));
  console.log("Regenerating Failed Prompt Thumbnails");
  console.log("=".repeat(50));

  const results = [];

  for (let i = 0; i < failedPrompts.length; i++) {
    console.log(`\n[${i + 1}/${failedPrompts.length}]`);
    const result = await generateImage(failedPrompts[i]);
    results.push(result);

    if (i < failedPrompts.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("COMPLETE");
  console.log("=".repeat(50));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${results.length}`);
  if (failed.length > 0) {
    console.log(`Failed:`);
    failed.forEach((f) => console.log(`  - ${f.id}`));
  }
}

main().catch(console.error);
