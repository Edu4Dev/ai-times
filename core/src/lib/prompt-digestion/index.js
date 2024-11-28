// Core Name: Digest Pipeline
// Repo URI: https://github.com/miltonbolonha
// Description: Build init digest core
// Author: Milton Bolonha
const debugMe = require("./utils/debug-me");
const {
  initialPipe,
  promptDigestion,
  staticPostFilesGenerate,
  essentialFiles,
  finalPipe,
} = require("./digest-pipeline");
const mainProps = require(`./config`);

class DigestPipeline {
  /**
   * Creates an instance of DigestPipeline.
   *
   * @param {Object} userConfigs - Optional user-defined configurations.
   * @param {Object} userPaths - Optional user-defined paths.
   */
  constructor(
    userConfigs = {},
    userPaths = {},
    userKeys = {},
    autoPost = false,
    userDebug = false
  ) {
    // Merge user-provided paths and configurations with the defaults
    this.configs = this.mergeWithDefault(mainProps.configs, userConfigs);
    this.paths = this.mergeWithDefault(mainProps.paths, userPaths);
    this.apiKeys = this.mergeWithDefault(mainProps.apiKeys, userKeys);
    // Initialize paths from merged configurations
    this.publicSourceFolder = this.paths.publicSourcePath;
    this.destinationSourceFolder = this.paths.destinationSourcePath;
    this.workflowsDir = this.paths.workflowsDir;
    this.draftsFolder = this.paths.draftsPath;
    this.stylesFolder = this.paths.stylesPath;
    this.contentPath = this.paths.contentPath;
    this.categories = this.safeRequire(this.paths.categories).categories;
    // Load configurations and data from paths
    this.integrations = this.safeRequire(this.paths.integrationsFile);
    this.general = this.safeRequire(this.paths.generalFile);
    this.business = this.safeRequire(this.paths.businessFile);
    this.logos = this.safeRequire(this.paths.logosFile);
    this.theme = this.safeRequire(this.paths.themeFile);
    this.pagesDatas = this.safeRequire(this.paths.allPagesDataFile);
    this.postsDatas = this.safeRequire(this.paths.postsDatasFile);
    this.authorsData = this.safeRequire(this.paths.authorsDataFile);
    this.scheduledPosts = this.safeRequire(this.paths.scheduledPostsFile);
    this.version = this.safeRequire(this.paths.versionFile);
    this.ai = this.safeRequire(this.paths.aiFile);
    this.autoPostData = this.safeRequire(this.paths.autoPostFile);
    this.autoPost = autoPost || false;
    this.debug = userDebug || false; // Aceda à configuração de switchers a partir de mainProps
  }

  /**
   * Safe require function to handle module loading and error catching.
   *
   * @param {string} path - The path of the module to be required.
   * @returns {Object|null} The required module or null if loading failed.
   */
  safeRequire(path) {
    try {
      return require(path);
    } catch (error) {
      console.error(`Error loading file at ${path}:`, error);
      return null;
    }
  }

  mergeWithDefault(defaultObj, userObj) {
    const merged = { ...defaultObj }; // Comece com os valores padrão

    for (const key in userObj) {
      if (userObj.hasOwnProperty(key) && userObj[key] !== undefined) {
        merged[key] = userObj[key]; // Apenas sobrescreva se o valor de userObj for válido
      }
    }

    return merged;
  }

  /**
   * Executes the initial step of the pipeline.
   */
  async initialStep() {
    debugMe(
      true,
      "GO: initialStep()",
      Object.keys(this.configs?.initialPipe).length
    );
    Object.keys(this.configs?.initialPipe).length >= 1
      ? initialPipe(this.configs.initialPipe, this.workflowsDir)
      : null;
  }

  /**
   * Processes prompts and generates posts, images, and uploads images to Cloudinary.
   */
  async processPrompts() {
    debugMe(true, "GO: processPrompts()", this.configs.promptDigestion);

    this.configs.promptDigestion
      ? await promptDigestion(
          this.configs.promptDigestion,
          this.contentPath,
          this.draftsFolder,
          this.ai,
          this.autoPostData,
          this.authorsData,
          this.general,
          this.apiKeys.chatGPT,
          this.integrations.cloudinaryIntegration?.folderName,
          this.integrations.cloudinaryIntegration?.cloudName,
          this.integrations.cloudinaryIntegration?.cloudApiKey,
          this.apiKeys.cloudinary,
          this.autoPost,
          this.debug
        )
      : null;
  }

  /**
   * Generates static files with various options disabled.
   */
  async generateStaticFiles() {
    debugMe(
      true,
      "GO: generateStaticFiles()",
      Object.keys(this.configs?.staticFiles).length
    );

    Object.keys(this.configs?.staticFiles).length >= 1
      ? await staticPostFilesGenerate(
          this.configs.staticFiles,
          this.postsDatas,
          this.pagesDatas.allPages,
          this.general.siteUrl,
          this.general.scope,
          this.general.i18n,
          this.business.brandName,
          this.business.brandEmail,
          this.business.brandDescription,
          this.logos,
          this.categories,
          this.publicSourceFolder
        )
      : null;
  }

  /**
   * Sets up essential files with specific options.
   */
  async setupEssentialFiles() {
    debugMe(
      true,
      "GO: setupEssentialFiles()",
      Object.keys(this.configs?.essentialFiles).length
    );
    Object.keys(this.configs?.essentialFiles).length >= 1
      ? await essentialFiles(
          this.configs.essentialFiles,
          this.postsDatas,
          this.pagesDatas,
          this.general.siteUrl,
          this.integrations.googleIntegration?.adsClientID,
          this.integrations.cloudinaryIntegration?.cloudName,
          this.integrations.cloudinaryIntegration?.cloudApiKey,
          this.logos.markLogo,
          this.version.gitRepo,
          this.version.nextVersion,
          this.version.version,
          this.publicSourceFolder,
          this.stylesFolder,
          this.theme
        )
      : null;
  }

  /**
   * Final step of the build process.
   * Synchronizes the public folder and schedules posts.
   *
   * @async
   * @returns {Promise<void>}
   */
  async finalStep() {
    debugMe(
      true,
      "GO: finalStep()",
      Object.keys(this.configs.finalPipe).length
    );
    return await finalPipe(
      this.configs.finalPipe,
      this.scheduledPosts,
      this.publicSourceFolder,
      this.destinationSourceFolder,
      this.workflowsDir,
      this.autoPostData
    );
  }

  /**
   * Main build process that updates sitemaps, posts, feeds, and schedules tasks.
   *
   * @async
   * @returns {Promise<void>} Returns the final step Copy: Public Folder.
   */
  async run() {
    await this.initialStep();
    await this.processPrompts();
    await this.generateStaticFiles();
    await this.setupEssentialFiles();
    await this.finalStep();
  }
}

module.exports = DigestPipeline;
