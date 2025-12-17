/**
 * Script to extract prompts from youmind.com and format them for our prompts library
 * Run with: npx ts-node scripts/extract-prompts.ts
 */

// Profile/Avatar prompts extracted from youmind.com
const extractedPrompts = [
  {
    id: "bw-side-profile",
    title: "B&W Side Profile",
    description: "Hyper-realistic black and white studio portrait",
    category: "profile",
    prompt:
      "Hyper-realistic side profile portrait with strong rim lighting, dark minimalist background, thoughtful expression, and cinematic lighting. High resolution black and white studio photography.",
  },
  {
    id: "mirror-selfie-aesthetic",
    title: "Mirror Selfie",
    description: "Photorealistic 8K mirror selfie with natural lighting",
    category: "profile",
    prompt:
      "Generate an 8K photorealistic mirror selfie with high face consistency based on reference image. 9:16 aspect ratio, sunlit bedroom background, face identical to reference image, polished natural makeup. Keep the subject's exact facial features.",
  },
  {
    id: "35mm-portrait",
    title: "35mm Portrait",
    description: "Dramatic black and white top-angle close-up",
    category: "profile",
    prompt:
      "Generate a top-angle and close-up black and white portrait of my face, focused on the head facing forward. Use a 35mm lens look, 10.7K 4HD quality. Proud expression. Deep black shadow background - only the face, the upper chest, and the shoulder.",
  },
  {
    id: "corporate-editorial",
    title: "Corporate Editorial",
    description: "8K high-fashion executive portrait",
    category: "profile",
    prompt:
      "Ultra-realistic, 8K corporate high-fashion editorial portrait. 100% facial identity preservation from reference. Canon EOS R5 with 85mm lens style. Subject in tailored charcoal blazer, luxury modern office with floor-to-ceiling windows, soft natural window lighting, hyper-realistic 8K quality.",
  },
  {
    id: "dramatic-bw-portrait",
    title: "Dramatic B&W",
    description: "Moody cinematic black and white portrait",
    category: "profile",
    prompt:
      "A dramatic black-and-white portrait with short styled hair. Side profile with strong jawline and sharp facial features. Soft studio lighting highlights skin texture and face contours. Minimal smooth background, clean cinematic atmosphere. High-resolution, realistic photography, moody tone, shallow depth of field.",
  },
  {
    id: "3d-pastel-avatar",
    title: "3D Pastel Avatar",
    description: "Polished 3D character in soft pastel style",
    category: "filters",
    prompt:
      "Create a highly polished 3D character portrait in a soft pastel, toy-like style. Smooth surfaces, gentle lighting, and clean gradients. Avatar should have expressive eyes, stylized hair, soft shadows, and friendly, anime-inspired facial structure. Rendered in high-quality CGI with subtle ambient glow.",
  },
  {
    id: "caricature-portrait",
    title: "Caricature Portrait",
    description: "Hyperrealistic caricature with exaggerated features",
    category: "filters",
    prompt:
      "Hyperrealistic caricature style portrait with soft studio lighting, serious dramatic mood. Exaggerated facial proportions, large exaggerated cheeks and chin, deep expression lines. Formal attire, plain dark gradient background. Maintain recognizable facial features from reference.",
  },
  {
    id: "marble-bust",
    title: "Marble Bust",
    description: "Melancholic portrait with classical marble statue",
    category: "portrait",
    prompt:
      "Person in sheer embroidered ancient dress leaning head against classical marble bust, warm dramatic lighting, dusty museum setting, sepia tones, intimate melancholic mood, hyper-realistic marble and fabric textures.",
  },
  {
    id: "balcony-portrait",
    title: "Balcony Portrait",
    description: "8K cinematic outdoor portrait on balcony",
    category: "portrait",
    prompt:
      "8K ultra-realistic, cinematic outdoor portrait on old concrete balcony facing away, messy bun hairstyle, touching neck with both hands, cream-colored long-sleeve crop top with lace detailing, high-waisted blue denim jeans, green plants and modern building in blurred background, 3:4 aspect ratio.",
  },
  {
    id: "rembrandt-lighting",
    title: "Rembrandt Light",
    description: "Intimate portrait with classic Rembrandt lighting",
    category: "portrait",
    prompt:
      "Intimate, intense portrait with Rembrandt lighting. Vulnerable intense expression with direct eye contact, wavy hair with golden halo backlight, pale skin with warm undertones, prominent freckles, piercing eyes, hands framing face with silver jewelry, black sleeveless top, 85mm lens with soft filter, golden hour color grading.",
  },
  {
    id: "luxury-restaurant",
    title: "Luxury Dinner",
    description: "8K portrait in dimly lit luxury restaurant",
    category: "portrait",
    prompt:
      "8K, high-night-contrast portrait posing in dimly lit, luxurious restaurant. Natural long wavy parted hair, large expressive eyes, shimmery lipstick, black strapless top, gold jewelry (bracelets, earrings, necklace), hand under chin pose, white tablecloth with elegant gold lamp casting warm yellow light, spacious luxurious restaurant, dim night lighting, wide-angle lens, high night contrast.",
  },
  {
    id: "underwater-macro",
    title: "Underwater Macro",
    description: "Surreal half-submerged face portrait",
    category: "enhanced",
    prompt:
      "Hyper-realistic, ultra-detailed close-up portrait showing only half of my face submerged in water, one eye in sharp focus, light rays creating caustic patterns on skin, suspended water droplets and bubbles adding depth, cinematic lighting with soft shadows and sharp highlights, photorealistic textures including skin pores, wet lips, eyelashes, and subtle subsurface scattering, surreal and dreamlike atmosphere, shallow depth of field, underwater macro perspective. 3:4 aspect ratio.",
  },
  {
    id: "chibi-avatar",
    title: "Chibi Avatar",
    description: "Cute Q-version doll style avatar",
    category: "filters",
    prompt:
      "Generate a Q-version chibi doll that wears the same clothes and looks the same as the reference! Perfectly supports locking the face and clothes. Cute miniature proportions with oversized head and expressive eyes.",
  },
  {
    id: "soft-grunge-cat",
    title: "Soft Grunge Cat",
    description: "E-girl aesthetic selfie with black cat",
    category: "profile",
    prompt:
      "Close-up selfie portrait in soft grunge, e-girl aesthetic, holding black cat cheek-to-cheek. Shoulder-length hair with bangs, pale skin with freckles, light eyes with winged eyeliner, white ribbed tank top, silver necklace with pendant, beige wall background, warm dim lighting. Keep the subject's exact facial features.",
  },
  {
    id: "2005-digicam",
    title: "2005 Digicam",
    description: "Early digital camera mall aesthetic",
    category: "filters",
    prompt:
      "Low-resolution digital photo aesthetic from 2005. Harsh on-camera flash, blown-out highlights, digital noise, waxy skin texture, orange date stamp in corner, early digital camera look. Mall or indoor setting with friends, Myspace-era aesthetic.",
  },
  {
    id: "y2k-arcade",
    title: "Y2K Arcade",
    description: "Y2K grunge cool girl arcade portrait",
    category: "filters",
    prompt:
      "Y2K grunge 'cool girl' aesthetic portrait as selfie in arcade. Styled hair with colorful tips, space buns optional, star stickers near eyes, black crop-top with graphic, plaid shorts or cargo pants, arcade environment with flashing screens and neon lighting. 9:16 aspect ratio.",
  },
  {
    id: "ig-baddie-mirror",
    title: "IG Baddie Mirror",
    description: "Hyper-realistic Instagram style mirror selfie",
    category: "profile",
    prompt:
      "Hyper-realistic, 8K 'IG Baddie' style mirror selfie. Bathroom counter knee-up mirror selfie with phone flash domination, dark bathroom setting, confident pose, low-rise or stylish outfit, flash flare effects, confident expression. Keep the subject's exact facial features.",
  },
  {
    id: "tumblr-2013",
    title: "Tumblr 2013",
    description: "Indie sleaze revival bedroom aesthetic",
    category: "filters",
    prompt:
      "2013 Tumblr bedroom aesthetic with identity preservation. Messy teen bedroom floor with fairy lights tangled, scattered Polaroids and soda cans, subject laying on stomach on carpet, striped thrift shirt and plaid or cargo pants, 9:16 aspect ratio, warm fairy lights plus phone flash lighting.",
  },
  {
    id: "product-mirror-selfie",
    title: "Product Selfie",
    description: "Realistic mirror selfie holding a product",
    category: "product",
    prompt:
      "Create a hyper-realistic mirror selfie of a person holding the product in one hand. Use natural bathroom lighting with a believable handheld phone reflection in the mirror. Keep the subject's exact facial features.",
  },
];

// Output in format ready for prompts.ts
console.log("// Add these to src/lib/prompts.ts\n");
console.log("export const profileAvatarPrompts: Prompt[] = [");
extractedPrompts.forEach((p) => {
  console.log(`  {
    id: "${p.id}",
    title: "${p.title}",
    description: "${p.description}",
    image: "/images/prompt-placeholder.jpg",
    category: "${p.category}",
    prompt: \`${p.prompt}\`,
  },`);
});
console.log("];");
