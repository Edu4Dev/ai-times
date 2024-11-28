// // const fs = require("fs-extra");
// // const userRobots = require("./robots");
// // const { userVarSass, userSass } = require("./sass");
// // const decapConfig = require("./admin");

// // async function writeAdsTxt(adsClient, publicSourceFolder) {
// //   if (adsClient?.length <= 1)
// //     return console.log(`⚠️ [📝 - Ads.txt]: Warn, no adsClient.`);
// //   const adsTxt = `google.com, pub-${adsClient[1]}, DIRECT, f08c47fec0942fa0`;
// //   const filePath = `${publicSourceFolder}/ads.txt`;
// //   try {
// //     return fs.writeFileSync(filePath, adsTxt);
// //   } catch (error) {
// //     console.log(`❌ [Ads.txt]: ERROR.`);
// //     return console.log(error);
// //   }
// // }

// // async function writeRobotsTxt(
// //   postsDatas,
// //   pagesDatas,
// //   siteUrl,
// //   publicSourceFolder
// // ) {
// //   const fileRobotsPath = `${publicSourceFolder}/robots.txt`;

// //   try {
// //     return fs.writeFileSync(
// //       fileRobotsPath,
// //       await userRobots(postsDatas, pagesDatas, siteUrl)
// //     );
// //   } catch (error) {
// //     console.log(`❌ [robots.txt]: ERROR.`);
// //     return console.log(error);
// //   }
// // }

// // async function writeStylesScss(stylesFolder) {
// //   if (!stylesFolder) return null;
// //   const fileVarsScssPath = `${stylesFolder}/user-vars.scss`;
// //   try {
// //     fs.writeFileSync(fileVarsScssPath, userVarSass());
// //   } catch (error) {
// //     console.log(error);
// //     console.log(`❌ [user-vars.SCSS]: ERROR.`);
// //   }
// //   const fileScssPath = `${stylesFolder}/user-helpers.scss`;

// //   try {
// //     return fs.writeFileSync(fileScssPath, userSass());
// //   } catch (error) {
// //     console.log(error);
// //     return console.log(`❌ [user-helpers.SCSS]: ERROR.`);
// //   }
// // }

// // async function writeAdminConfigs(
// //   gitRepo,
// //   siteUrl,
// //   cloudName,
// //   cloudApiKey,
// //   markLogo,
// //   nextVersion,
// //   version,
// //   publicSourceFolder
// // ) {
// //   const configYmlPath = `${publicSourceFolder}/admin/config.yml`;
// //   try {
// //     return fs.writeFileSync(
// //       configYmlPath,
// //       decapConfig(
// //         gitRepo,
// //         siteUrl,
// //         cloudName,
// //         cloudApiKey,
// //         markLogo,
// //         nextVersion,
// //         version
// //       )
// //     );
// //   } catch (error) {
// //     console.log(error);
// //     return console.log(`❌ [User Admin]: ERROR.`);
// //   }
// // }

// // module.exports = {
// //   writeAdsTxt,
// //   writeStylesScss,
// //   writeRobotsTxt,
// //   writeAdminConfigs,
// // };
// const fs = require("fs-extra");

// module.exports = {
//   writeAdsTxt,
//   writeStylesScss,
//   writeRobotsTxt,
//   writeAdminConfigs,
// };
