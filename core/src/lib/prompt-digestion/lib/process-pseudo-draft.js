const generatePostContent = require("./generate-content");
const debugMe = require("../utils/debug-me");

// const fs = require("fs");
// const path = require("path");
// const matter = require("gray-matter");
// const yaml = require("js-yaml");
// const { slugify } = require("../utils");

// const { uploadCloudinary } = require("./cloudinary");
// const { chatGPT, dallE } = require("./requests");
// const { webScraping } = require("./web-scraping");
// const prompts = require("./prompts");

// const contentFolder = path.join(__dirname, "../../../../content");

/**
 * Processes direct data input, generates a blog post using AI tools, and saves the post.
 *
 * @param {object} dataInput - The direct data input containing necessary information for the post.
 * @param {object} aiSettings - AI configuration settings.
 * @param {object} authorsData - Data related to post authors.
 * @param {object} i18n - Internationalization settings.
 * @param {boolean} debug - Enables debug mode for logging additional information.
 */
async function processPseudoDraft(
  contentFolderPath,
  dataInput,
  aiSettings,
  autoPostData,
  authorsData,
  i18n,
  gptKey,
  folderName,
  cloudName,
  cloudApiKey,
  cloudinarySecret,
  debug
) {
  debugMe(debug, "Pseudo Draft", {
    dataInput,
    gptKey,
    i18n,
    debug,
  });

  try {
    // Step 1: Construct pseudo frontmatter from direct data input
    const pseudoFrontmatter = {
      frontmatter: {},
      content: "",
      draftFilePath: null,
    };

    // Generate the post content
    await generatePostContent(
      contentFolderPath,
      pseudoFrontmatter,
      aiSettings,
      autoPostData,
      authorsData,
      i18n,
      gptKey,
      folderName,
      cloudName,
      cloudApiKey,
      cloudinarySecret,
      true,
      debug
    );
  } catch (err) {
    console.error("Error processing direct data:", err);
  }
}
module.exports = processPseudoDraft;
