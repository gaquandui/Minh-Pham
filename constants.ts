
// Model selection for image generation tasks
export const MODEL_NAME_IMAGE_GENERATION = 'gemini-2.5-flash-image';

// Standard aspect ratio for portrait images (TikTok style)
export const ASPECT_RATIO_9_16 = '9:16';

// Base appearance for the character "An" (Only used if NO reference image is provided)
export const DEFAULT_CHARACTER_APPEARANCE = `
Generate a high-quality image of a 20-year-old beautiful Vietnamese woman named "An". 
- Heart-shaped face, slim straight nose, almond-shaped eyes.
- Fair skin, 160cm tall, 49kg.
- Long silk-black hair with 6-4 parting.
`;

// Instruction to lock the background when a reference is provided
export const STRICT_BACKGROUND_PRESERVATION_INSTRUCTION = `
**STRICT BACKGROUND & SCENE LOCK:**
- The background in the reference image MUST NOT CHANGE. 
- Keep the exact kitchen/hallway furniture, refrigerator, and lighting.
`;

// Instruction for EXTREME CLOTHING ACCURACY including LENGTH and PROPORTIONS
export const EXTREME_CLOTHING_COPY_INSTRUCTION = `
**ULTRA-PRECISE CLOTHING REPLICATION:**
- MANDATORY: Copy EVERY SINGLE DETAIL from the NEW CLOTHING STYLE image (Image 2).
- Match the exact fabric texture, buttons, stitching, collar shape, and any patterns.
- **CLOTHING LENGTH & PROPORTIONS:** Replicate the exact length of the garment relative to the body. 
  - If it is a crop top, it must end above the waist. 
  - If it is a long dress or tunic, it must reach the specific length shown in Image 2 (thigh, knee, or ankle).
  - The fit (oversized, slim, or regular) must be identical to Image 2.
- This is a pixel-perfect clothing swap.
`;

// Instruction to prevent tucking in (Không sơ vin)
export const UNTUCKED_STYLE_INSTRUCTION = `
**STYLE: UNTUCKED (BỎ ÁO NGOÀI)**
- The shirt/top MUST flow naturally OVER the waistband of the skirt or pants.
- The bottom hem of the shirt MUST be fully visible.
- ABSOLUTELY NO TUCKING. The top must NOT be inside the skirt/pants.
`;

// Specific instruction for Outfit Consistency (when keeping the same outfit as image 1)
export const STRICT_OUTFIT_LOCK_INSTRUCTION = `
**STRICT OUTFIT LOCK:**
- YOU MUST USE THE EXACT SAME CLOTHING SEEN IN REFERENCE IMAGE 1. 
- DO NOT CHANGE THE PATTERN, COLOR, BUTTONS, OR FABRIC TEXTURE.
- MAINTAIN THE EXACT LENGTH AND FIT AS SEEN IN IMAGE 1.
`;

// Framing and composition
export const FULL_BODY_EXPANSION_INSTRUCTION = `
**COMPOSITION: FRAME EXPANSION (FULL BODY)**
- EXTEND the frame downwards to show the character's entire legs and feet.
- Ensure the clothing length is respected in this full view (e.g., if it's a long dress, show it all the way down).
- Show the feet standing on the same dark wood floor from the reference.
`;

export const STRICT_THREE_QUARTER_BODY_COMPOSITION_INSTRUCTION = `
**COMPOSITION:** Knee-up (3/4 body). Maintain focus from head to mid-thigh.
`;

export const STRAIGHT_FORWARD_POSE_INSTRUCTION = "Standing straight, facing camera directly, natural expression.";

export const RANDOM_POSE_OPTIONS = [
  "Standing with a natural smile, looking at camera.",
  "Slightly leaning weight on one leg, relaxed pose.",
  "Elegantly standing with hands at her sides.",
  "Calm and professional posture."
];

export const CRITICAL_WATERMARK_REMOVAL_INSTRUCTION = "MANDATORY: NO watermarks, NO text, NO logos, NO signatures.";
