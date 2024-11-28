// Core Name: Milton's Core
// Repo URI: https://github.com/schindyguy/ht
// Description: Build init blog core
// Author: Milton Bolonha
const {
  syncPublicFiles,
  writePostsSitemap,
  writePagesSitemap,
  cleanOldBuildYMLFiles,
  schedulingPosts,
  writeAdsTxt,
  writeStylesScss,
  writeRobotsTxt,
  writeAtom,
  writeRSS,
  writeAmpStories,
  writeIndexSitemaps,
  writeFeedSitemaps,
  writeAdminConfigs,
  writeCommomUpdate,
  writeMonthlyUpdateYML,
  writeUserUpdateYML,
} = require("./build-lib");

async function executeStep(stepName, stepFunction) {
  try {
    await stepFunction();
    process.stdout.write(`✔️ [${stepName}] - success.\n`);
  } catch (error) {
    console.log(`❌ [${stepName}]: ERROR.`, error);
  }
}

async function main() {
  // Sitemaps
  await executeStep("🔄 - Update System", writeCommomUpdate);
  await executeStep("🔄 - Monthly Update", writeMonthlyUpdateYML);
  await executeStep("🔄 - User Update", writeUserUpdateYML);
  await executeStep("📝 - Write Index Sitemaps", writeIndexSitemaps);
  await executeStep("📝 - Write Posts Sitemaps", writePostsSitemap);
  await executeStep("📝 - Write Pages Sitemaps", writePagesSitemap);
  await executeStep("📝 - Write Feeds Sitemaps", writeFeedSitemaps);
  // Arquivos Essenciais
  // Essential Files
  await executeStep("📝 - Write Admin Configs", writeAdminConfigs);
  await executeStep("📝 - Write User Styles", writeStylesScss);
  await executeStep("📝 - Write Ads.Txt", writeAdsTxt);
  await executeStep("📝 - Write Robots.Txt", writeRobotsTxt);
  // Geração de Feeds
  // Feed Generation
  await executeStep("📝 - Write Atom", writeAtom);
  await executeStep("📝 - Write RSS", writeRSS);
  await executeStep("📝 - Write Amp Stories", writeAmpStories);
  // Sincronização de Arquivos Públicos
  // Public File Synchronization
  await executeStep("🔄 - Copy Public Folder", syncPublicFiles);
  // Limpeza e Manutenção
  // Cleaning and Maintenance
  await executeStep("🗑️ - Delete Old Crons", cleanOldBuildYMLFiles);
  // Agendamento de Postagens
  // Post Scheduling
  await executeStep("📝 - Write Schedule Files", schedulingPosts);
}

main();
