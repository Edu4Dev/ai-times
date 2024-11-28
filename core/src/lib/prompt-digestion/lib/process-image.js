const dallE = require("../services/dalle-images");
const debugMe = require("../utils/debug-me");
/**
 * Handles image generation by sending prompts to DALL-E.
 * The main image prompt and additional prompts are processed, and the generated image URLs are returned.
 *
 * @param {string} main_image_prompt - The main prompt used to generate the primary image.
 * @param {array} additional_image_prompts - An array of additional prompts for generating more images.
 * @returns {array} An array of URLs for the generated images.
 */
async function processImageGeneration(
  main_image_prompt,
  additional_image_prompts,
  gptKey,
  debug
) {
  debugMe(debug, "Prompts to Image", {
    main_image_prompt,
    additional_image_prompts,
    gptKey,
    debug,
  });

  const imagesPrompts = [];

  if (main_image_prompt) {
    imagesPrompts.push(main_image_prompt);
  }

  if (additional_image_prompts?.length) {
    imagesPrompts.push(...additional_image_prompts);
  }

  const generatedImageUrls = [];

  for (const prompt of imagesPrompts) {
    console.log("!!!prompt.image_prompt || prompt, gptKey, debug!!!!");
    console.log("prompt.image_prompt");
    console.log(prompt.image_prompt);
    console.log("prompt");
    console.log(prompt);
    console.log("gptKey");
    console.log(gptKey);
    console.log("debug");
    console.log(debug);

    // Generate the image using DALL-E
    const imageUrl = await dallE(prompt?.image_prompt || prompt, gptKey, debug);
    if (imageUrl) {
      generatedImageUrls.push(imageUrl);
    }
  }
  debugMe(debug, "DALL-E Images", generatedImageUrls);

  return generatedImageUrls;
}
module.exports = processImageGeneration;
