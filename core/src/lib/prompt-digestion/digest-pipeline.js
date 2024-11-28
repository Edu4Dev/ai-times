const executeStep = require("./utils/execute-step");
const debugMe = require("./utils/debug-me");
const { syncPublicFiles } = require("./lib/syncPublic");
const {
  // createNetlifyBuildYML,
  cleanOldBuildYMLFiles,
  schedulingPosts,
} = require("./lib/schedule-post");
const {
  generateGPTWorkFlow,
  deleteGPTWorkflows,
} = require("./lib/schedule-gpt");
const writeAdminConfigs = require("./lib/decap");
const writeAdsTxt = require("./lib/adsTxt");
const writeStylesScss = require("./lib/sass");
const writeRobotsTxt = require("./lib/robots");
const { writeAmpStories } = require("./lib/ampStory");
const writeAtom = require("./lib/atom");
const { writeRSS } = require("./lib/rss");
const {
  generatePostsSitemap,
  generatePagesSitemap,
  generateIndexSitemap,
  generateFeedsSitemap,
} = require("./lib/sitemaps");
// const {
//   generateUpdateYML,
//   generateMonthlyUpdateYML,
//   generateTriggerUpdateYML,
// } = require("./lib/update");
const promptsToPostProcessor = require("./prompts-to-post");
// const {
//   generateGPTWorkFlow,
//   deleteGPTWorkflows,
// } = require("../gptSchedule");
// const { gptTrainingModel } = require("./gptFineTuning");

async function initialPipe(
  config = { deleteOldCrons: true, deleteGPTWorkflows: false },
  workflowDir
) {
  if (!config) return null;

  // # GitHub Actions Workflows Generation Step
  // Cleaning and Maintenance
  config?.deleteOldCrons
    ? await executeStep("🗑️ - Delete: Old Crons", cleanOldBuildYMLFiles, [
        workflowDir,
      ])
    : null;

  // Post Scheduling
  config?.deleteGPTWorkflows
    ? await executeStep(
        "📝 - Write: Delete GPT Schedule Files",
        deleteGPTWorkflows,
        [workflowDir]
      )
    : null;
  // Update Triggers:
  // await executeStep("🔄 - Generate: Update System", generateUpdateYML);
  // await executeStep("🔄 - Generate: Monthly Update", generateMonthlyUpdateYML);
  // await executeStep("🔄 - Generate: User Update", generateTriggerUpdateYML);
}
async function promptDigestion(
  config,
  contentFolderPath,
  draftsFolder,
  ai,
  autoPostData,
  authorsData,
  general,
  gptKey,
  folderName,
  cloudName,
  cloudApiKey,
  cloudinaryApiSecret,
  autoPost,
  debug
) {
  if (!config) return null;
  debugMe(debug, "Prompt Digestion", {
    config,
    contentFolderPath,
    draftsFolder,
    // ai,
    // authorsData,
    // general,
    gptKey,
    folderName,
    cloudName,
    cloudApiKey,
    cloudinaryApiSecret,
    autoPost,
    debug,
  });

  // Content Generation Step
  // A.I. Post Generator ChatGPT + Cloudinary
  // await executeStep("🔄 - Trainig A.I.", gptTrainingModel);
  await executeStep("📝 - Generate: A.I. Posts", promptsToPostProcessor, [
    contentFolderPath,
    draftsFolder,
    ai,
    autoPostData,
    authorsData,
    general,
    gptKey,
    folderName,
    cloudName,
    cloudApiKey,
    cloudinaryApiSecret,
    autoPost,
    debug,
  ]);
}
// {
//  indexSitemap:true,
//  postSitemap:true,
//  pageSitemap:true,
//  feedsSitemaps:true,
//  atom:true,
//  rss:true,
//  ampStories:true
// }
async function staticPostFilesGenerate(
  config = {
    indexSitemap: false,
    postSitemap: false,
    pageSitemap: false,
    feedsSitemaps: false,
    atom: false,
    rss: false,
    ampStories: false,
  },
  postsDatas,
  pagesDatas,
  siteUrl,
  scope,
  i18n,
  brandName,
  brandEmail,
  siteDescription,
  logos,
  categories,
  publicSourceFolder
) {
  if (!config) return null;

  const { cardLogo, postAuthorLogo } = logos;
  // Static Content Files
  // Generate Sitemaps
  // Index Sitemaps

  config?.indexSitemap
    ? await executeStep("📝 - Generate: Index Sitemaps", generateIndexSitemap, [
        publicSourceFolder,
        siteUrl,
        scope,
      ])
    : null;
  // Posts Sitemap
  config?.postSitemap
    ? await executeStep("📝 - Generate: Posts Sitemaps", generatePostsSitemap, [
        postsDatas,
        siteUrl,
        scope,
        publicSourceFolder,
      ])
    : null;
  // Pages Sitemap
  config?.pageSitemap
    ? await executeStep("📝 - Generate: Pages Sitemaps", generatePagesSitemap, [
        pagesDatas,
        siteUrl,
        scope,
        publicSourceFolder,
      ])
    : null;
  // Feeds Sitemap
  config?.feedsSitemaps
    ? await executeStep("📝 - Generate: Feeds Sitemaps", generateFeedsSitemap, [
        cardLogo,
        siteUrl,
        scope,
        publicSourceFolder,
      ])
    : null;
  // Escrever Arquivos Essenciais
  // Feed Generation
  config?.atom
    ? await executeStep("📝 - Generate: Atom", writeAtom, [
        {
          postsDatas,
          pagesDatas,
          siteDescription,
          siteUrl,
          i18n,
          brandName,
          brandEmail,
          logos,
          categories,
        },
        publicSourceFolder,
      ])
    : console.log("fakeeeeeeee");

  config?.rss
    ? await executeStep("📝 - Generate: RSS", writeRSS, [
        {
          postsDatas,
          pagesDatas,
          siteDescription,
          siteUrl,
          i18n,
          brandName,
          brandEmail,
          logos,
          categories,
        },
        publicSourceFolder,
      ])
    : null;
  config?.ampStories
    ? await executeStep("📝 - Generate: Amp Stories", writeAmpStories, [
        {
          pagesDatas,
          postsDatas,
          siteUrl,
          postAuthorLogo,
          brandName,
          cardLogo,
          publicSourceFolder,
        },
      ])
    : null;
}
async function essentialFiles(
  config = {
    decapCMS: false,
    scss: false,
    adsTxt: false,
    robotsTxt: false,
    generateGPTWorkFlow: false,
  },
  postsDatas,
  pagesDatas,
  siteUrl,
  adsClientID,
  cloudName,
  cloudApiKey,
  markLogo,
  gitRepo,
  nextVersion,
  version,
  publicSourceFolder,
  stylesFolder,
  theme
) {
  // Write Essential Files
  config?.decapCMS
    ? await executeStep("📝 - Write: Admin Configs", writeAdminConfigs, [
        gitRepo,
        siteUrl,
        cloudName,
        cloudApiKey,
        markLogo,
        nextVersion,
        version,
        publicSourceFolder,
      ])
    : null;
  config?.scss
    ? await executeStep("📝 - Write: User Styles", writeStylesScss, [
        theme,
        stylesFolder,
      ])
    : null;
  config?.adsTxt
    ? await executeStep("📝 - Write: Ads.Txt", writeAdsTxt, [
        adsClientID.split("ca-pub-"),
        publicSourceFolder,
      ])
    : null;
  config?.robotsTxt
    ? await executeStep("📝 - Write: Robots.Txt", writeRobotsTxt, [
        postsDatas,
        pagesDatas,
        siteUrl,
        publicSourceFolder,
      ])
    : null;
}
async function finalPipe(
  config = {
    schedulingPosts: false,
    generateGPTWorkFlow: false,
    deleteGPTWorkflows: false,
    syncPublicFolder: true,
  },
  scheduledPosts,
  publicSourceFolder,
  destinationSourceFolder,
  workflowsFolderPath,
  autoPostData,
  aiSettings
) {
  // Post Scheduling
  config?.schedulingPosts
    ? await executeStep("📝 - Write: Schedule Files", schedulingPosts, [
        scheduledPosts,
      ])
    : null;

  // Post Scheduling
  config?.generateGPTWorkFlow
    ? await executeStep("📝 - Write: Schedule Files", generateGPTWorkFlow, [
        workflowsFolderPath,
        autoPostData,
      ])
    : null;

  config?.syncPublicFolder
    ? await executeStep("🔄 - Copy: Public Folder", syncPublicFiles, [
        publicSourceFolder,
        destinationSourceFolder,
      ])
    : null;
}
module.exports = {
  initialPipe,
  promptDigestion,
  staticPostFilesGenerate,
  essentialFiles,
  finalPipe,
};
