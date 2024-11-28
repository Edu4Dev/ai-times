const { syncPublicFiles } = require("./build-lib/syncPublic");
const {
  createNetlifyBuildYML,
  cleanOldBuildYMLFiles,
  schedulingPosts,
} = require("./build-lib/schedule");
const {
  writeAdminConfigs,
  writeAdsTxt,
  writeStylesScss,
  writeRobotsTxt,
} = require("./build-lib/configWriters");
const { writeAtom, writeRSS, writeAmpStories } = require("./build-lib/feed");
const {
  writePostsSitemap,
  writePagesSitemap,
  writeIndexSitemaps,
  writeFeedSitemaps,
} = require("./build-lib/sitemaps");
const {
  writeCommomUpdate,
  writeMonthlyUpdateYML,
  writeUserUpdateYML,
} = require("./build-lib/update");
module.exports = {
  syncPublicFiles,
  writePostsSitemap,
  writePagesSitemap,
  createNetlifyBuildYML,
  cleanOldBuildYMLFiles,
  schedulingPosts,
  writeAdminConfigs,
  writeAdsTxt,
  writeStylesScss,
  writeRobotsTxt,
  writeAtom,
  writeRSS,
  writeAmpStories,
  writeIndexSitemaps,
  writeFeedSitemaps,
  writeCommomUpdate,
  writeMonthlyUpdateYML,
  writeUserUpdateYML,
};
