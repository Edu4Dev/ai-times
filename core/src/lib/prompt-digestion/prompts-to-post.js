const fs = require("fs");
const path = require("path");
const processDraftFromFile = require("./lib/process-draft");
const processPseudoDraft = require("./lib/process-pseudo-draft");
const debugMe = require("./utils/debug-me");

/**
 * Processes prompts and generates posts from draft files or pseudo drafts.
 *
 * @param {string|null} draftsFolder - The folder containing draft files. If null, pseudo drafts will be processed.
 * @param {Object} aiSettings - Settings for the AI used in processing drafts.
 * @param {Object} authorsData - Data about authors.
 * @param {Object} general - General settings, including i18n.
 * @param {string} gptKey - The API key used for accessing the AI service.
 * @param {boolean} autoPost - Flag to determine if the drafts should be auto-posted.
 * @param {boolean} debug - Flag to enable or disable debugging.
 * @returns {Promise<void>}
 */
async function promptsToPostProcessor(
  contentFolderPath,
  draftsFolder,
  aiSettings,
  autoPostData,
  authorsData,
  general,
  gptKey,
  folderName,
  cloudName,
  cloudApiKey,
  cloudinarySecret,
  autoPost,
  debug
) {
  debugMe(debug, "GPT Prompt", {
    contentFolderPath,
    draftsFolder,
    // aiSettings,
    // authorsData,
    // general,
    gptKey,
    autoPost,
    debug,
  });

  const i18n = general.i18n;

  if (autoPost && draftsFolder === null) {
    await processPseudoDraft(
      contentFolderPath,
      null,
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
    );
  } else {
    const files = fs.readdirSync(draftsFolder); // Reads all files in the drafts folder

    for (const filename of files) {
      const filePath = path.join(draftsFolder, filename);

      // Check if the file has a .md extension
      if (path.extname(filename) === ".md") {
        await processDraftFromFile(
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
          cloudinarySecret,
          debug
        );
      }
    }
  }
}

/**
 * Main export for the module.
 */
module.exports = promptsToPostProcessor;
