const fs = require("fs");
const matter = require("gray-matter");
const generatePostContent = require("./generate-content");
const debugMe = require("../utils/debug-me");

/**
 * Processes a draft file, scrapes web content, and generates a blog post using AI tools.
 *
 * @param {string} filePath - Path to the draft markdown file.
 * @param {object} aiSettings - AI configuration settings.
 * @param {object} authorsData - Data related to post authors.
 * @param {object} i18n - Internationalization settings.
 * @param {boolean} debug - Enables debug mode for logging additional information.
 */
async function processDraftFromFile(
  contentFolderPath,
  filePath,
  aiSettings,
  autoPostData,
  authorsData,
  i18n,
  gptKey,
  folderName,
  cloudName,
  cloudApiKey,
  cloudinaryApiSecret,
  debug
) {
  debugMe(debug, "Process Draft", {
    filePath,
    aiSettings,
    autoPostData,
    authorsData,
    i18n,
    gptKey,
    cloudName,
    cloudApiKey,
    cloudinaryApiSecret,
    debug,
  });

  try {
    // Step 1: Extract frontmatter and content from the draft file
    const draftFrontmatter = await readDraftFrontmatter(filePath, false, debug);
    if (!draftFrontmatter) return null;

    // Generate the post content
    await generatePostContent(
      contentFolderPath,
      draftFrontmatter,
      aiSettings,
      autoPostData,
      authorsData,
      i18n,
      gptKey,
      folderName,
      cloudName,
      cloudApiKey,
      cloudinaryApiSecret,
      false,
      debug
    );
  } catch (err) {
    console.error("Error processing draft file:", err);
  }
}

/**
 * Reads the frontmatter and content from a draft markdown file.
 * If 'autoPost' is true, it returns an empty structure.
 *
 * @param {string} filePath - Path to the draft markdown file.
 * @param {boolean} autoPost - Indicates if the post is being processed automatically without a specific draft.
 * @param {boolean} debug - Enables debug mode for logging additional information.
 * @returns {object|null} An object containing the frontmatter, content, and draft file path, or null if an error occurs.
 */
async function readDraftFrontmatter(filePath, autoPost, debug) {
  debugMe(debug, "Read Draft", { filePath, autoPost, debug });
  if (autoPost) {
    return { frontmatter: {}, content: "", draftFilePath: null };
  }
  try {
    // Read the content of the draft file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent); // Extract frontmatter and content using gray-matter
    const draftData = { frontmatter: data, content, draftFilePath: filePath };
    debugMe(debug, "Assemble Draft", draftData); // Log the extracted data if debugging
    return draftData;
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, error);
    return null;
  }
}

module.exports = processDraftFromFile;
