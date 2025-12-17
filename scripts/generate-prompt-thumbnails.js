/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generate Thumbnail Images for Prompts Library
 * Creates reference images and styled "after" images for each prompt
 *
 * Usage: node scripts/generate-prompt-thumbnails.js
 */

const fs = require("fs");
const path = require("path");

const API_KEY = "4c6bec602d48c03944dc57c88d39dee3";
const BASE_URL = "https://api.kie.ai";
const OUTPUT_DIR = path.join(__dirname, "../public/images/prompts");

// Reference image prompts for face-based categories
const referencePrompts = {
  female: `Photorealistic portrait of a young woman with natural beauty, clear skin, neutral expression, soft studio lighting, clean background, professional headshot quality, 8K resolution`,
  male: `Photorealistic portrait of a young man with clean features, neutral expression, soft studio lighting, clean background, professional headshot quality, 8K resolution`,
  product: `Professional product photography of a sleek cosmetic bottle on white background, studio lighting, commercial quality`,
};

// All prompts from prompts.ts - categorized by type
const promptsToGenerate = [
  // Profile / Avatar - face-based
  {
    id: "bw-side-profile",
    category: "profile",
    refType: "female",
    prompt: `Hyper-realistic side profile portrait with strong rim lighting, dark minimalist background, thoughtful expression, and cinematic lighting. High resolution black and white studio photography.`,
  },
  {
    id: "mirror-selfie-aesthetic",
    category: "profile",
    refType: "female",
    prompt: `Generate an 8K photorealistic mirror selfie with high face consistency based on reference image. 9:16 aspect ratio, sunlit bedroom background, polished natural makeup.`,
  },
  {
    id: "35mm-portrait",
    category: "profile",
    refType: "male",
    prompt: `Generate a top-angle and close-up black and white portrait, focused on the head facing forward. Use a 35mm lens look, 10.7K 4HD quality. Proud expression. Deep black shadow background.`,
  },
  {
    id: "corporate-editorial",
    category: "profile",
    refType: "male",
    prompt: `Ultra-realistic, 8K corporate high-fashion editorial portrait. Canon EOS R5 with 85mm lens style. Subject in tailored charcoal blazer, luxury modern office with floor-to-ceiling windows, soft natural window lighting.`,
  },
  {
    id: "dramatic-bw-portrait",
    category: "profile",
    refType: "male",
    prompt: `A dramatic black-and-white portrait with short styled hair. Side profile with strong jawline and sharp facial features. Soft studio lighting highlights skin texture and face contours. Minimal smooth background, clean cinematic atmosphere.`,
  },
  {
    id: "soft-grunge-cat",
    category: "profile",
    refType: "female",
    prompt: `Close-up selfie portrait in soft grunge, e-girl aesthetic, holding black cat cheek-to-cheek. Shoulder-length hair with bangs, pale skin with freckles, light eyes with winged eyeliner, white ribbed tank top.`,
  },
  {
    id: "ig-baddie-mirror",
    category: "profile",
    refType: "female",
    prompt: `Hyper-realistic, 8K 'IG Baddie' style mirror selfie. Bathroom counter knee-up mirror selfie with phone flash domination, dark bathroom setting, confident pose, stylish outfit.`,
  },

  // Portrait - face-based
  {
    id: "cinematic-light",
    category: "portrait",
    refType: "female",
    prompt: `Hyper-realistic cinematic 8k photorealistic image. A close-up portrait with long, slightly wind-swept hair falling across the face. Striking, light-colored eyes gaze upwards, catching a sharp diagonal beam of natural light illuminating cheekbones, nose, and glossy mauve-toned lips.`,
  },
  {
    id: "window-light",
    category: "portrait",
    refType: "female",
    prompt: `Realistic image with arms raised behind the head in a confident pose. Lighting from a window projecting streaks of light and shadow on face and body, creating dramatic artistic contrast. Simple neutral background, intimate elegant cinematic mood.`,
  },
  {
    id: "marble-bust",
    category: "portrait",
    refType: "female",
    prompt: `Person in sheer embroidered ancient dress leaning head against classical marble bust, warm dramatic lighting, dusty museum setting, sepia tones, intimate melancholic mood, hyper-realistic marble and fabric textures.`,
  },
  {
    id: "balcony-portrait",
    category: "portrait",
    refType: "female",
    prompt: `8K ultra-realistic, cinematic outdoor portrait on old concrete balcony facing away, messy bun hairstyle, touching neck with both hands, cream-colored long-sleeve crop top with lace detailing, high-waisted blue denim jeans, green plants in background.`,
  },
  {
    id: "rembrandt-lighting",
    category: "portrait",
    refType: "female",
    prompt: `Intimate, intense portrait with Rembrandt lighting. Vulnerable intense expression with direct eye contact, wavy hair with golden halo backlight, pale skin with warm undertones, prominent freckles, piercing eyes, hands framing face with silver jewelry.`,
  },
  {
    id: "luxury-restaurant",
    category: "portrait",
    refType: "female",
    prompt: `8K high-night-contrast portrait posing in dimly lit luxurious restaurant. Natural long wavy parted hair, large expressive eyes, shimmery lipstick, black strapless top, gold jewelry, hand under chin pose, elegant gold lamp casting warm light.`,
  },
  {
    id: "gq-editorial",
    category: "portrait",
    refType: "male",
    prompt: `Bold dramatic GQ-style editorial portrait with intense directional lighting creating striking shadows, emphasizing strong facial contours and jawline. Sharply tailored fashion-forward business casual outfit, minimalist high-contrast dark gradient background, confident piercing gaze.`,
  },

  // Filters - face-based
  {
    id: "3d-pastel-avatar",
    category: "filters",
    refType: "female",
    prompt: `Highly polished 3D character portrait in soft pastel toy-like style. Smooth surfaces, gentle lighting, clean gradients. Expressive eyes, stylized hair, soft shadows, friendly anime-inspired facial structure. High-quality CGI with subtle ambient glow.`,
  },
  {
    id: "caricature-portrait",
    category: "filters",
    refType: "male",
    prompt: `Hyperrealistic caricature style portrait with soft studio lighting, serious dramatic mood. Exaggerated facial proportions, large exaggerated cheeks and chin, deep expression lines. Formal attire, plain dark gradient background.`,
  },
  {
    id: "chibi-avatar",
    category: "filters",
    refType: "female",
    prompt: `Q-version chibi doll with cute miniature proportions, oversized head and expressive eyes. Polished 3D style with soft lighting and adorable expression.`,
  },
  {
    id: "2005-digicam",
    category: "filters",
    refType: "female",
    prompt: `Low-resolution digital photo aesthetic from 2005. Harsh on-camera flash, blown-out highlights, digital noise, waxy skin texture, orange date stamp in corner. Mall indoor setting, Myspace-era aesthetic.`,
  },
  {
    id: "y2k-arcade",
    category: "filters",
    refType: "female",
    prompt: `Y2K grunge cool girl aesthetic portrait selfie in arcade. Styled hair with colorful tips, space buns, star stickers near eyes, black crop-top with graphic, plaid shorts, arcade environment with flashing screens and neon lighting.`,
  },
  {
    id: "tumblr-2013",
    category: "filters",
    refType: "female",
    prompt: `2013 Tumblr bedroom aesthetic. Messy teen bedroom floor with fairy lights tangled, scattered Polaroids and soda cans, subject laying on stomach on carpet, striped thrift shirt, warm fairy lights plus phone flash lighting.`,
  },
  {
    id: "polaroid-moment",
    category: "filters",
    refType: "female",
    prompt: `Photo taken with a Polaroid camera. Slight blur and consistent light source like flash from dark room scattered throughout. Vintage authentic Polaroid aesthetic with white border frame.`,
  },

  // Enhanced - face-based
  {
    id: "underwater-macro",
    category: "enhanced",
    refType: "female",
    prompt: `Hyper-realistic ultra-detailed close-up portrait showing half of face submerged in water, one eye in sharp focus, light rays creating caustic patterns on skin, suspended water droplets and bubbles, cinematic lighting, surreal dreamlike atmosphere.`,
  },
  {
    id: "ethereal-sunlight",
    category: "enhanced",
    refType: "female",
    prompt: `Ethereal lighting with diffused sunbeams striking skin, creating glowing highlights on cheekbones, nose bridge, lips, and hair strands. Cinematic high-contrast mood with lens bloom, light haze, luminous skin with peachy tones. Soft ethereal daydream-sunlit delicate cinematic look.`,
  },
  {
    id: "cinematic-upgrade",
    category: "enhanced",
    refType: "female",
    prompt: `Dreamy cinematic golden backlight, subtle atmospheric haze, soft highlight bloom on bright areas, clean halation glow, controlled volumetric light rays. Sony A1 / Canon R5 full-frame camera quality, premium cinematic look.`,
  },

  // Product - direct generation (no face reference)
  {
    id: "product-mirror-selfie",
    category: "product",
    refType: "product",
    prompt: `Hyper-realistic mirror selfie of a person holding a skincare product bottle. Natural bathroom lighting with believable handheld phone reflection in mirror. Clean modern bathroom setting.`,
  },
  {
    id: "amazon-packshot",
    category: "product",
    refType: null,
    prompt: `Ultra-realistic studio photograph of a sleek cosmetic bottle on pure white seamless background, centered, fills 85-90% of frame, 85mm prime look, f/8 sharpness, softbox high-key lighting, gentle contact shadow.`,
  },
  {
    id: "footwear-packshot",
    category: "product",
    refType: null,
    prompt: `Photorealistic packshot of a single modern sneaker at 3/4 angle on white seamless, high-key diffused light, crisp edge detail, subtle ground shadow, product centered and fills 85-90%.`,
  },
  {
    id: "apparel-flatlay",
    category: "product",
    refType: null,
    prompt: `Realistic flat-lay of a neatly folded premium t-shirt on pure white background, high-key light tent softness, accurate fabric texture, crease minimized, centered.`,
  },
  {
    id: "beauty-bottle",
    category: "product",
    refType: null,
    prompt: `Studio packshot of a beauty product serum bottle with dropper, on white seamless, large diffused softbox overhead, controlled specular highlights, readable label, no glare.`,
  },
  {
    id: "skincare-jar",
    category: "product",
    refType: null,
    prompt: `Photorealistic packshot of a luxury skincare cream jar on white seamless, soft even lighting, micro-contrast for embossed details, gentle contact shadow, centered.`,
  },
  {
    id: "retail-box",
    category: "product",
    refType: null,
    prompt: `Front-facing elegant product box on pure white background, high-key studio light, straightened perspective, sharp print detail, centered.`,
  },
  {
    id: "ceramic-mug",
    category: "product",
    refType: null,
    prompt: `Photorealistic ceramic coffee mug on white seamless, clean rim, accurate ceramic gloss with soft speculars, subtle contact shadow, centered.`,
  },
  {
    id: "backpack-packshot",
    category: "product",
    refType: null,
    prompt: `Realistic studio photo of a modern backpack standing upright on white seamless, high-key light tent, even illumination, visible zipper and pocket details.`,
  },
  {
    id: "steel-bottle",
    category: "product",
    refType: null,
    prompt: `Packshot of a brushed stainless steel water bottle on pure white, large diffused softbox to minimize harsh reflections, controlled gradient on metal, subtle ground shadow.`,
  },
  {
    id: "toy-figurine",
    category: "product",
    refType: null,
    prompt: `Photorealistic single anime figurine on white seamless, high-key lighting, crisp edge detail, accurate color, gentle contact shadow.`,
  },

  // Product - Lifestyle
  {
    id: "headphones-desk",
    category: "product",
    refType: null,
    prompt: `Realistic lifestyle image: premium wireless headphones resting on minimalist desk setup with soft window light, neutral palette, shallow depth, gentle natural shadow.`,
  },
  {
    id: "shoe-pavement",
    category: "product",
    refType: null,
    prompt: `Photoreal sneaker placed on sunlit pavement with soft directional light, slight motion suggestion via shadow angle, no person visible, neutral background blur.`,
  },
  {
    id: "skincare-bathroom",
    category: "product",
    refType: null,
    prompt: `Realistic scene: beauty serum bottle on matte bathroom tile, soft backlight plus fill, tiny water droplets on surface, clean reflections.`,
  },
  {
    id: "coffee-mug-kitchen",
    category: "product",
    refType: null,
    prompt: `Lifestyle: ceramic mug on light wood countertop, soft morning light, faint steam trail, neutral kitchen background, subtle depth of field.`,
  },
  {
    id: "backpack-hook",
    category: "product",
    refType: null,
    prompt: `Realistic scene: modern backpack hanging on wall hook, soft ambient light, visible texture and stitching, neutral wall backdrop.`,
  },
  {
    id: "knife-cutting-board",
    category: "product",
    refType: null,
    prompt: `Photoreal close scene: chef knife on wooden cutting board with clean vegetable slices, side light to show metal grain, controlled reflections.`,
  },
  {
    id: "yoga-mat-studio",
    category: "product",
    refType: null,
    prompt: `Lifestyle: rolled yoga mat on studio floor, soft side lighting, subtle floor texture, clean and serene atmosphere.`,
  },
  {
    id: "watch-wrist",
    category: "product",
    refType: null,
    prompt: `Close realistic shot of a luxury watch on wrist, neutral skin tone, soft diffused light, no face shown, background blur, color-accurate dial and hands.`,
  },
  {
    id: "sunglasses-towel",
    category: "product",
    refType: null,
    prompt: `Photoreal scene: designer sunglasses on textured beach towel, soft sunlight and gentle shadow, accurate lens tint, uncluttered composition.`,
  },
  {
    id: "bottle-fridge",
    category: "product",
    refType: null,
    prompt: `Realistic image: water bottle standing in fridge door shelf, cool backlight, condensation beads, clean surroundings.`,
  },

  // Product - Specialty
  {
    id: "jewelry-diffusion",
    category: "product",
    refType: null,
    prompt: `Photoreal jewelry packshot of diamond ring on pure white seamless, large diffusion tent lighting, controlled specular highlights, focus on gemstone facets, minimal reflections.`,
  },
  {
    id: "glass-bottle-backlit",
    category: "product",
    refType: null,
    prompt: `Ultra-realistic glass perfume bottle on white seamless with soft backlight to define contours, front fill to retain label legibility, controlled edge highlights.`,
  },
  {
    id: "textile-macro",
    category: "product",
    refType: null,
    prompt: `Macro shot of premium fabric swatch on white background, soft raking light to show weave, high micro-contrast, color-accurate threads.`,
  },
  {
    id: "white-on-white",
    category: "product",
    refType: null,
    prompt: `Photoreal white AirPods case on pure white background, high-key lighting with slight angled key to create soft separation shadow, micro-contrast on edges.`,
  },
  {
    id: "cosmetics-swatches",
    category: "product",
    refType: null,
    prompt: `Realistic cosmetics lipstick swatches on white card, soft diffused top light, neutral white balance, accurate hues, minimal shadow, clean edges.`,
  },
];

// Store generated reference URLs to reuse
const referenceCache = {};

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
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

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

async function generateImage(prompt, aspectRatio = "1:1", imageRef = null) {
  const taskId = await createTask(prompt, aspectRatio, imageRef);
  const url = await waitForTask(taskId);
  console.log(""); // newline after progress dots
  return url;
}

async function generateReference(refType) {
  if (referenceCache[refType]) {
    console.log(`  Using cached ${refType} reference`);
    return referenceCache[refType];
  }

  console.log(`\n  Generating ${refType} reference image...`);
  const url = await generateImage(referencePrompts[refType]);
  referenceCache[refType] = url;

  // Also save the reference image
  const refFilename = `ref-${refType}.jpg`;
  await downloadImage(url, refFilename);
  console.log(`  Saved reference: ${refFilename}`);

  return url;
}

async function generatePromptThumbnail(promptConfig) {
  const { id, prompt, refType } = promptConfig;
  const filename = `${id}.jpg`;

  console.log(`\nGenerating: ${id}`);
  console.log(`  Prompt: ${prompt.substring(0, 60)}...`);

  try {
    let imageUrl;

    if (refType && refType !== null) {
      // Face-based prompt - need reference first
      const refUrl = await generateReference(refType);
      console.log(`  Generating styled image with reference...`);
      imageUrl = await generateImage(prompt, "1:1", refUrl);
    } else {
      // Direct generation (product shots)
      console.log(`  Generating direct...`);
      imageUrl = await generateImage(prompt);
    }

    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    await downloadImage(imageUrl, filename);
    console.log(`  Saved: ${filename}`);

    return { success: true, id, filename };
  } catch (error) {
    console.error(`  Error: ${error.message}`);
    return { success: false, id, error: error.message };
  }
}

async function main() {
  console.log("=".repeat(60));
  console.log("Prompt Thumbnail Generator");
  console.log("Using Kie.ai Seedream 4.5 API");
  console.log("=".repeat(60));
  console.log(`\nOutput directory: ${OUTPUT_DIR}`);
  console.log(`Total prompts to generate: ${promptsToGenerate.length}`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const results = [];

  // Generate images sequentially to avoid rate limits
  for (let i = 0; i < promptsToGenerate.length; i++) {
    console.log(`\n[${i + 1}/${promptsToGenerate.length}]`);
    const result = await generatePromptThumbnail(promptsToGenerate[i]);
    results.push(result);

    // Small delay between requests
    if (i < promptsToGenerate.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("GENERATION COMPLETE");
  console.log("=".repeat(60));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`\nSuccessful: ${successful.length}/${results.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed prompts:`);
    failed.forEach((f) => console.log(`  - ${f.id}: ${f.error}`));
  }

  // Save results log
  const logPath = path.join(OUTPUT_DIR, "generation-log.json");
  fs.writeFileSync(
    logPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        results,
        referencesCached: Object.keys(referenceCache),
      },
      null,
      2
    )
  );
  console.log(`\nLog saved to: ${logPath}`);

  // Output update instructions for prompts.ts
  console.log("\n" + "=".repeat(60));
  console.log("UPDATE prompts.ts images:");
  console.log("=".repeat(60));
  console.log('\nReplace image paths with: "/images/prompts/{id}.jpg"');
  successful.forEach((s) => {
    console.log(`  ${s.id}: "/images/prompts/${s.filename}"`);
  });
}

main().catch(console.error);
