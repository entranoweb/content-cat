export interface Prompt {
  id: string;
  title: string;
  description: string;
  image: string;
  category: PromptCategory;
  prompt: string;
}

export type PromptCategory =
  | "all"
  | "portrait"
  | "realistic"
  | "profile"
  | "filters"
  | "enhanced"
  | "product";

export const prompts: Prompt[] = [
  // Profile / Avatar
  {
    id: "bw-side-profile",
    title: "B&W Side Profile",
    description: "Hyper-realistic black and white studio portrait",
    image: "/images/prompts/bw-side-profile.jpg",
    category: "profile",
    prompt: `Hyper-realistic side profile portrait with strong rim lighting, dark minimalist background, thoughtful expression, and cinematic lighting. High resolution black and white studio photography. Keep the subject's exact facial features from the reference photo.`,
  },
  {
    id: "mirror-selfie-aesthetic",
    title: "Mirror Selfie",
    description: "Photorealistic 8K mirror selfie with natural lighting",
    image: "/images/prompts/mirror-selfie-aesthetic.jpg",
    category: "profile",
    prompt: `Generate an 8K photorealistic mirror selfie with high face consistency based on reference image. 9:16 aspect ratio, sunlit bedroom background, face identical to reference image, polished natural makeup. Keep the subject's exact facial features.`,
  },
  {
    id: "35mm-portrait",
    title: "35mm Portrait",
    description: "Dramatic black and white top-angle close-up",
    image: "/images/prompts/35mm-portrait.jpg",
    category: "profile",
    prompt: `Generate a top-angle and close-up black and white portrait of my face, focused on the head facing forward. Use a 35mm lens look, 10.7K 4HD quality. Proud expression. Deep black shadow background - only the face, the upper chest, and the shoulder. Keep the subject's exact facial features.`,
  },
  {
    id: "corporate-editorial",
    title: "Corporate Editorial",
    description: "8K high-fashion executive portrait",
    image: "/images/prompts/corporate-editorial.jpg",
    category: "profile",
    prompt: `Ultra-realistic, 8K corporate high-fashion editorial portrait. 100% facial identity preservation from reference. Canon EOS R5 with 85mm lens style. Subject in tailored charcoal blazer, luxury modern office with floor-to-ceiling windows, soft natural window lighting, hyper-realistic 8K quality.`,
  },
  {
    id: "dramatic-bw-portrait",
    title: "Dramatic B&W",
    description: "Moody cinematic black and white portrait",
    image: "/images/prompts/dramatic-bw-portrait.jpg",
    category: "profile",
    prompt: `A dramatic black-and-white portrait with short styled hair. Side profile with strong jawline and sharp facial features. Soft studio lighting highlights skin texture and face contours. Minimal smooth background, clean cinematic atmosphere. High-resolution, realistic photography, moody tone, shallow depth of field. Keep the subject's exact facial features.`,
  },
  {
    id: "soft-grunge-cat",
    title: "Soft Grunge Cat",
    description: "E-girl aesthetic selfie with black cat",
    image: "/images/prompts/soft-grunge-cat.jpg",
    category: "profile",
    prompt: `Close-up selfie portrait in soft grunge, e-girl aesthetic, holding black cat cheek-to-cheek. Shoulder-length hair with bangs, pale skin with freckles, light eyes with winged eyeliner, white ribbed tank top, silver necklace with pendant, beige wall background, warm dim lighting. Keep the subject's exact facial features.`,
  },
  {
    id: "ig-baddie-mirror",
    title: "IG Baddie Mirror",
    description: "Hyper-realistic Instagram style mirror selfie",
    image: "/images/prompts/ig-baddie-mirror.jpg",
    category: "profile",
    prompt: `Hyper-realistic, 8K 'IG Baddie' style mirror selfie. Bathroom counter knee-up mirror selfie with phone flash domination, dark bathroom setting, confident pose, stylish outfit, flash flare effects, confident expression. Keep the subject's exact facial features.`,
  },

  // Portrait
  {
    id: "cinematic-light",
    title: "Cinematic Light",
    description: "Dramatic lighting with sharp diagonal beams",
    image: "/images/prompts/cinematic-light.jpg",
    category: "portrait",
    prompt: `Maintain the same face and person (use attached photo for accurate face). Hyper-realistic cinematic. Create an 8k photorealistic image using the attached photo. A close-up portrait with long, slightly wind-swept hair falling across the face. Striking, light-colored eyes gaze upwards and to the right, catching a sharp, diagonal beam of natural light that illuminates the high points of the cheekbone, nose, and plump, glossy, mauve-toned lips. A slightly lightweight silk texture.`,
  },
  {
    id: "window-light",
    title: "Window Light",
    description: "Intimate portrait with dramatic window shadows",
    image: "/images/prompts/window-light.jpg",
    category: "portrait",
    prompt: `Create a realistic image with the subject's face and appearance exactly as in the reference photo — do not change any physical characteristics. The person should have arms raised behind the head, in a confident pose. The lighting should come from a window, projecting streaks of light and shadow on the face and body, creating dramatic and artistic contrast. The background should be simple and neutral. The overall mood should be intimate, elegant and cinematic.`,
  },
  {
    id: "marble-bust",
    title: "Marble Bust",
    description: "Melancholic portrait with classical marble statue",
    image: "/images/prompts/marble-bust.jpg",
    category: "portrait",
    prompt: `Person in sheer embroidered ancient dress leaning head against classical marble bust, warm dramatic lighting, dusty museum setting, sepia tones, intimate melancholic mood, hyper-realistic marble and fabric textures. Keep the subject's exact facial features.`,
  },
  {
    id: "balcony-portrait",
    title: "Balcony Portrait",
    description: "8K cinematic outdoor portrait on balcony",
    image: "/images/prompts/balcony-portrait.jpg",
    category: "portrait",
    prompt: `8K ultra-realistic, cinematic outdoor portrait on old concrete balcony facing away, messy bun hairstyle, touching neck with both hands, cream-colored long-sleeve crop top with lace detailing, high-waisted blue denim jeans, green plants and modern building in blurred background, 3:4 aspect ratio. Keep the subject's exact facial features.`,
  },
  {
    id: "rembrandt-lighting",
    title: "Rembrandt Light",
    description: "Intimate portrait with classic Rembrandt lighting",
    image: "/images/prompts/rembrandt-lighting.jpg",
    category: "portrait",
    prompt: `Intimate, intense portrait with Rembrandt lighting. Vulnerable intense expression with direct eye contact, wavy hair with golden halo backlight, pale skin with warm undertones, prominent freckles, piercing eyes, hands framing face with silver jewelry, black sleeveless top, 85mm lens with soft filter, golden hour color grading. Keep the subject's exact facial features.`,
  },
  {
    id: "luxury-restaurant",
    title: "Luxury Dinner",
    description: "8K portrait in dimly lit luxury restaurant",
    image: "/images/prompts/luxury-restaurant.jpg",
    category: "portrait",
    prompt: `8K, high-night-contrast portrait posing in dimly lit, luxurious restaurant. Natural long wavy parted hair, large expressive eyes, shimmery lipstick, black strapless top, gold jewelry, hand under chin pose, white tablecloth with elegant gold lamp casting warm yellow light, spacious luxurious restaurant, dim night lighting, wide-angle lens. Keep the subject's exact facial features.`,
  },
  {
    id: "gq-editorial",
    title: "GQ Editorial",
    description: "Bold magazine cover style with dramatic lighting",
    image: "/images/prompts/gq-editorial.jpg",
    category: "portrait",
    prompt: `Create a bold, dramatic GQ-style editorial portrait with intense, directional lighting that creates striking shadows and highlights, emphasizing strong facial contours and jawline. The subject wears a sharply tailored, fashion-forward business casual outfit. Use a minimalist, high-contrast background with moody, dark gradients. The expression should be confident with a piercing gaze. Incorporate artistic shadow play and high-definition details to evoke a cinematic, magazine cover effect. Keep the subject's exact facial features.`,
  },

  // Filters
  {
    id: "3d-pastel-avatar",
    title: "3D Pastel Avatar",
    description: "Polished 3D character in soft pastel style",
    image: "/images/prompts/3d-pastel-avatar.jpg",
    category: "filters",
    prompt: `Create a highly polished 3D character portrait in a soft pastel, toy-like style. Smooth surfaces, gentle lighting, and clean gradients. Avatar should have expressive eyes, stylized hair, soft shadows, and friendly, anime-inspired facial structure. Rendered in high-quality CGI with subtle ambient glow. Keep the subject's recognizable features.`,
  },
  {
    id: "caricature-portrait",
    title: "Caricature Portrait",
    description: "Hyperrealistic caricature with exaggerated features",
    image: "/images/prompts/caricature-portrait.jpg",
    category: "filters",
    prompt: `Hyperrealistic caricature style portrait with soft studio lighting, serious dramatic mood. Exaggerated facial proportions, large exaggerated cheeks and chin, deep expression lines. Formal attire, plain dark gradient background. Maintain recognizable facial features from reference.`,
  },
  {
    id: "chibi-avatar",
    title: "Chibi Avatar",
    description: "Cute Q-version doll style avatar",
    image: "/images/prompts/chibi-avatar.jpg",
    category: "filters",
    prompt: `Generate a Q-version chibi doll that wears the same clothes and looks the same as the reference! Perfectly supports locking the face and clothes. Cute miniature proportions with oversized head and expressive eyes.`,
  },
  {
    id: "2005-digicam",
    title: "2005 Digicam",
    description: "Early digital camera mall aesthetic",
    image: "/images/prompts/2005-digicam.jpg",
    category: "filters",
    prompt: `Low-resolution digital photo aesthetic from 2005. Harsh on-camera flash, blown-out highlights, digital noise, waxy skin texture, orange date stamp in corner, early digital camera look. Mall or indoor setting with friends, Myspace-era aesthetic. Keep the subject's facial features.`,
  },
  {
    id: "y2k-arcade",
    title: "Y2K Arcade",
    description: "Y2K grunge cool girl arcade portrait",
    image: "/images/prompts/y2k-arcade.jpg",
    category: "filters",
    prompt: `Y2K grunge 'cool girl' aesthetic portrait as selfie in arcade. Styled hair with colorful tips, space buns optional, star stickers near eyes, black crop-top with graphic, plaid shorts or cargo pants, arcade environment with flashing screens and neon lighting. 9:16 aspect ratio. Keep the subject's facial features.`,
  },
  {
    id: "tumblr-2013",
    title: "Tumblr 2013",
    description: "Indie sleaze revival bedroom aesthetic",
    image: "/images/prompts/tumblr-2013.jpg",
    category: "filters",
    prompt: `2013 Tumblr bedroom aesthetic with identity preservation. Messy teen bedroom floor with fairy lights tangled, scattered Polaroids and soda cans, subject laying on stomach on carpet, striped thrift shirt and plaid or cargo pants, 9:16 aspect ratio, warm fairy lights plus phone flash lighting. Keep the subject's facial features.`,
  },
  {
    id: "polaroid-moment",
    title: "Polaroid Moment",
    description: "Vintage Polaroid style with soft flash blur",
    image: "/images/prompts/polaroid-moment.jpg",
    category: "filters",
    prompt: `Take a photo taken with a Polaroid camera. The photo should look like an ordinary photograph. The photo should have a slight blur and a consistent light source, like a flash from a dark room, scattered throughout the photo. Don't change the faces. Keep the subject's facial features.`,
  },

  // Enhanced
  {
    id: "underwater-macro",
    title: "Underwater Macro",
    description: "Surreal half-submerged face portrait",
    image: "/images/prompts/underwater-macro.jpg",
    category: "enhanced",
    prompt: `Hyper-realistic, ultra-detailed close-up portrait showing only half of my face submerged in water, one eye in sharp focus, light rays creating caustic patterns on skin, suspended water droplets and bubbles adding depth, cinematic lighting with soft shadows and sharp highlights, photorealistic textures including skin pores, wet lips, eyelashes, and subtle subsurface scattering, surreal and dreamlike atmosphere, shallow depth of field, underwater macro perspective. 3:4 aspect ratio. Keep the subject's facial features.`,
  },
  {
    id: "ethereal-sunlight",
    title: "Ethereal Sunlight",
    description: "Dreamy golden hour glow with soft sunbeams",
    image: "/images/prompts/ethereal-sunlight.jpg",
    category: "enhanced",
    prompt: `Apply an ethereal lighting filter to the uploaded photo while fully preserving every original detail of the photo unchanged except for lighting, glow, and color mood. Add diffused sunbeams striking the subject's skin, creating a glowing highlight on cheekbones, nose bridge, lips, and hair strands. Maintain clear separation between bright sunlit areas and soft, deep shadows to create a cinematic high-contrast mood. Inject subtle lens bloom, light haze, and a thin layer of atmospheric glow around the face and shoulders. Render skin with luminous translucency and gentle peachy tones. Enhance stray hair strands backlit by sunlight. Color-grade with slightly lowered saturation, and gentle film-like grain. Keep the overall background intact but allow sunlight flares and soft bokeh to wrap naturally around the subject. The result should look like a soft, ethereal daydream-sunlit, delicate, and cinematic. Hard rule: Do not change the face and hair of the subject.`,
  },
  {
    id: "cinematic-upgrade",
    title: "Cinematic Upgrade",
    description: "Premium full-frame camera quality enhancement",
    image: "/images/prompts/cinematic-upgrade.jpg",
    category: "enhanced",
    prompt: `Enhance the original photo while keeping the pose, background, face, clothing, and framing exactly the same. Transform ONLY the lighting, atmosphere, and camera quality: LIGHT + ATMOSPHERE: create a dreamy cinematic golden backlight or side-light depending on the natural light direction of the scene, add subtle atmospheric haze ONLY around the light source so the light glows but keep the overall scene clear, apply soft highlight bloom blur on bright areas (cheeks, shoulders, hair edges) without reducing detail, add clean halation glow that melts only the light edges into the background not the subject, introduce a gentle diffused ambience avoiding any heavy fog or smoke, soften transitions between light and shadow for a smooth creamy cinematic look, add controlled volumetric light rays with softly blurred edges, blur ONLY the light glow not the subject or scene. CAMERA QUALITY UPGRADE: enhance clarity, texture, and micro-contrast to match a Sony A1 / Canon R5 full-frame camera, improve dynamic range so highlights and shadows retain detail, reduce noise and artifacts for a clean high-end professional look, add rich cinematic color depth and natural skin tones, increase lens sharpness while keeping the dreamy lighting intact, simulate high-end glass with subtle lens bloom and smooth bokeh depth. Do NOT change: pose, background, facial structure, hair shape, clothes, proportions. Only enhance lighting, glow, atmosphere, and upgrade overall camera quality to a premium cinematic full-frame look.`,
  },

  // Product - Amazon Main Image (White Seamless)
  {
    id: "product-mirror-selfie",
    title: "Product Selfie",
    description: "Realistic mirror selfie holding a product",
    image: "/images/prompts/product-mirror-selfie.jpg",
    category: "product",
    prompt: `Create a hyper-realistic mirror selfie of a person holding the product in one hand. Use natural bathroom lighting with a believable handheld phone reflection in the mirror. Keep the subject's exact facial features.`,
  },
  {
    id: "amazon-packshot",
    title: "Amazon Packshot",
    description: "Clean white background product shot",
    image: "/images/prompts/amazon-packshot.jpg",
    category: "product",
    prompt: `Ultra-realistic studio photograph of the product on a pure white seamless background, centered, fills ~85–90% of frame, 85mm prime look, f/8 sharpness, ISO 100, softbox high-key lighting, gentle contact shadow under product, natural colors, no props, no text, no logos, no watermark, square composition.`,
  },
  {
    id: "footwear-packshot",
    title: "Footwear Shot",
    description: "Single shoe 3/4 angle on white",
    image: "/images/prompts/footwear-packshot.jpg",
    category: "product",
    prompt: `Photorealistic packshot of a single shoe at a 3/4 angle on white seamless, high-key diffused light, crisp edge detail, subtle ground shadow, laces tidy, product centered and fills ~85–90%, no extras, square crop.`,
  },
  {
    id: "apparel-flatlay",
    title: "Apparel Flat Lay",
    description: "Neatly folded garment on white",
    image: "/images/prompts/apparel-flatlay.jpg",
    category: "product",
    prompt: `Realistic flat-lay of a neatly folded garment on a pure white background, high-key light tent softness, accurate fabric texture, crease minimized, centered, fills ~85%, no tags or props, square composition.`,
  },
  {
    id: "beauty-bottle",
    title: "Beauty Bottle",
    description: "Pump/dropper bottle studio shot",
    image: "/images/prompts/beauty-bottle.jpg",
    category: "product",
    prompt: `Studio packshot of a beauty product bottle with pump/dropper, on white seamless, large diffused softbox overhead + front fill, controlled specular highlights, readable label, no glare, natural color, centered, fills ~85–90%, no text overlay or props, square.`,
  },
  {
    id: "skincare-jar",
    title: "Skincare Jar",
    description: "Cream jar with lid clarity",
    image: "/images/prompts/skincare-jar.jpg",
    category: "product",
    prompt: `Photorealistic packshot of a skincare jar on white seamless, soft even lighting, micro-contrast for embossed details, gentle contact shadow, centered, fills ~85–90%, no surrounding props, square.`,
  },
  {
    id: "retail-box",
    title: "Retail Box",
    description: "Front-facing product box shot",
    image: "/images/prompts/retail-box.jpg",
    category: "product",
    prompt: `Front-facing product box on a pure white background, high-key studio light free of edge spill, straightened perspective, sharp print detail, no added graphics, centered, fills ~85–90%, square.`,
  },
  {
    id: "ceramic-mug",
    title: "Ceramic Mug",
    description: "Clean mug with ceramic gloss",
    image: "/images/prompts/ceramic-mug.jpg",
    category: "product",
    prompt: `Photorealistic ceramic mug on white seamless, clean rim, accurate ceramic gloss with soft speculars, subtle contact shadow, centered, fills ~85–90%, no props, square.`,
  },
  {
    id: "backpack-packshot",
    title: "Backpack Shot",
    description: "Standing backpack front view",
    image: "/images/prompts/backpack-packshot.jpg",
    category: "product",
    prompt: `Realistic studio photo of a backpack standing upright on white seamless, high-key light tent, even illumination, visible zipper/pocket details, straight-on, centered, fills ~85–90%, no props, square.`,
  },
  {
    id: "steel-bottle",
    title: "Steel Bottle",
    description: "Stainless steel with controlled reflections",
    image: "/images/prompts/steel-bottle.jpg",
    category: "product",
    prompt: `Packshot of a brushed stainless steel water bottle on pure white, large diffused softbox to minimize harsh reflections, controlled gradient on metal, subtle ground shadow, centered, fills ~85–90%, no props, square.`,
  },
  {
    id: "toy-figurine",
    title: "Toy Figurine",
    description: "Single figurine crisp detail",
    image: "/images/prompts/toy-figurine.jpg",
    category: "product",
    prompt: `Photorealistic single toy or figurine on white seamless, high-key, crisp edge detail, accurate color, gentle contact shadow, centered, fills ~85–90%, no props or effects, square.`,
  },

  // Product - Lifestyle / Secondary Images
  {
    id: "headphones-desk",
    title: "Headphones Desk",
    description: "Minimalist desk lifestyle shot",
    image: "/images/prompts/headphones-desk.jpg",
    category: "product",
    prompt: `Realistic lifestyle image: headphones resting on a minimalist desk setup with soft window light, neutral palette, shallow depth, gentle natural shadow, no brand logos beyond the product, clean composition, square.`,
  },
  {
    id: "shoe-pavement",
    title: "Shoe on Pavement",
    description: "Sunlit street action suggestion",
    image: "/images/prompts/shoe-pavement.jpg",
    category: "product",
    prompt: `Photoreal shoe placed on sunlit pavement with soft directional light, slight motion suggestion via shadow angle, no person visible, neutral background blur, true color, square.`,
  },
  {
    id: "skincare-bathroom",
    title: "Skincare Bathroom",
    description: "Beauty bottle on bathroom tile",
    image: "/images/prompts/skincare-bathroom.jpg",
    category: "product",
    prompt: `Realistic scene: beauty bottle on matte bathroom tile, soft backlight + fill, tiny water droplets on surface, color-true label, clean reflections, square.`,
  },
  {
    id: "coffee-mug-kitchen",
    title: "Coffee Mug Kitchen",
    description: "Morning light countertop scene",
    image: "/images/prompts/coffee-mug-kitchen.jpg",
    category: "product",
    prompt: `Lifestyle: ceramic mug on light wood countertop, soft morning light, faint steam trail, neutral kitchen background, subtle depth of field, square.`,
  },
  {
    id: "backpack-hook",
    title: "Backpack Hook",
    description: "Hanging backpack lifestyle shot",
    image: "/images/prompts/backpack-hook.jpg",
    category: "product",
    prompt: `Realistic scene: backpack hanging on a chair or wall hook, soft ambient light, visible texture and stitching, neutral wall backdrop, square.`,
  },
  {
    id: "knife-cutting-board",
    title: "Chef Knife Board",
    description: "Knife on cutting board scene",
    image: "/images/prompts/knife-cutting-board.jpg",
    category: "product",
    prompt: `Photoreal close scene: chef knife on wooden cutting board with clean produce slices, side light to show metal grain, controlled reflections, square.`,
  },
  {
    id: "yoga-mat-studio",
    title: "Yoga Mat Studio",
    description: "Rolled mat serene wellness shot",
    image: "/images/prompts/yoga-mat-studio.jpg",
    category: "product",
    prompt: `Lifestyle: rolled yoga mat on studio floor, soft side lighting, subtle floor texture, clean and serene, square.`,
  },
  {
    id: "watch-wrist",
    title: "Watch on Wrist",
    description: "Close wrist shot no face",
    image: "/images/prompts/watch-wrist.jpg",
    category: "product",
    prompt: `Close, realistic shot of a watch on a wrist, neutral skin tone, soft diffused light, no face shown, background blur, color-accurate dial/hands, square.`,
  },
  {
    id: "sunglasses-towel",
    title: "Sunglasses Beach",
    description: "Beach towel lifestyle shot",
    image: "/images/prompts/sunglasses-towel.jpg",
    category: "product",
    prompt: `Photoreal scene: sunglasses on a textured beach towel, soft sunlight and gentle shadow, accurate lens tint, uncluttered composition, square.`,
  },
  {
    id: "bottle-fridge",
    title: "Bottle in Fridge",
    description: "Cool fridge door context shot",
    image: "/images/prompts/bottle-fridge.jpg",
    category: "product",
    prompt: `Realistic image: water bottle standing in a fridge door shelf, cool backlight, condensation beads, clean surroundings, square.`,
  },

  // Product - Specialty / Challenging
  {
    id: "jewelry-diffusion",
    title: "Jewelry Diffusion",
    description: "Gemstone with controlled highlights",
    image: "/images/prompts/jewelry-diffusion.jpg",
    category: "product",
    prompt: `Photoreal jewelry packshot on pure white seamless, large diffusion tent lighting, controlled specular highlights, focus on gemstone facets, minimal reflections, centered, fills ~85–90%, no props, square.`,
  },
  {
    id: "glass-bottle-backlit",
    title: "Glass Bottle Backlit",
    description: "Transparent glass with contours",
    image: "/images/prompts/glass-bottle-backlit.jpg",
    category: "product",
    prompt: `Ultra-realistic glass bottle on white seamless with soft backlight to define contours, front fill to retain label legibility, controlled edge highlights, subtle ground shadow, centered, fills ~85–90%, square.`,
  },
  {
    id: "textile-macro",
    title: "Textile Macro",
    description: "Fabric weave detail shot",
    image: "/images/prompts/textile-macro.jpg",
    category: "product",
    prompt: `Macro shot of fabric swatch on white background, soft raking light to show weave, high micro-contrast, color-accurate threads, square.`,
  },
  {
    id: "white-on-white",
    title: "White on White",
    description: "White product shadow separation",
    image: "/images/prompts/white-on-white.jpg",
    category: "product",
    prompt: `Photoreal white product on pure white background, high-key lighting with slight angled key to create soft separation shadow, micro-contrast on edges, centered, fills ~85–90%, no props, square.`,
  },
  {
    id: "cosmetics-swatches",
    title: "Cosmetics Swatches",
    description: "True color makeup swatches",
    image: "/images/prompts/cosmetics-swatches.jpg",
    category: "product",
    prompt: `Realistic cosmetics swatches on a white card, soft diffused top light, neutral white balance, accurate hues, minimal shadow, clean edges, square.`,
  },
];

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find((p) => p.id === id);
}

export function getPromptsByCategory(category: PromptCategory): Prompt[] {
  if (category === "all") return prompts;
  return prompts.filter((p) => p.category === category);
}
