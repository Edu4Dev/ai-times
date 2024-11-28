const fs = require("fs-extra");
const path = require("path");
const general = require("../../../../content/cache/general.json");
const theme = require("../../../../content/cache/theme.json");
const { userRobots } = require("./robots");
const { userVarSass, userSass } = require("./sass");
const { userAdmin } = require("./admin");

async function writeAdsTxt() {
  const adsClient = general?.adsClientID.split("ca-pub-");

  if (adsClient?.length <= 1)
    return console.log(`⚠️ [📝 - Ads.txt]: Warn, no adsClient.`);
  const adsTxt = `google.com, pub-${adsClient[1]}, DIRECT, f08c47fec0942fa0`;
  const filePath = path.join(__dirname, "../../../../content/public/ads.txt");
  try {
    return fs.writeFileSync(filePath, adsTxt);
  } catch (error) {
    console.log(`❌ [Ads.txt]: ERROR.`);
    return console.log(error);
  }
}

async function writeRobotsTxt() {
  const fileRobotsPath = path.join(
    __dirname,
    "../../../../content/public/robots.txt"
  );

  try {
    return fs.writeFileSync(fileRobotsPath, await userRobots());
  } catch (error) {
    console.log(`❌ [robots.txt]: ERROR.`);
    return console.log(error);
  }
}

async function writeStylesScss() {
  if (!theme) return console.log(`❌ [user.SCSS]: ERROR.`);
  const fileVarsScssPath = path.join(
    __dirname,
    "../../../../content/styles/user-vars.scss"
  );
  try {
    fs.writeFileSync(fileVarsScssPath, userVarSass());
  } catch (error) {
    console.log(error);
    console.log(`❌ [user-vars.SCSS]: ERROR.`);
  }
  const fileScssPath = path.join(
    __dirname,
    "../../../../content/styles/user-helpers.scss"
  );
  try {
    return fs.writeFileSync(fileScssPath, userSass());
  } catch (error) {
    console.log(error);
    return console.log(`❌ [user-helpers.SCSS]: ERROR.`);
  }
}

async function writeAdminConfigs() {
  if (!theme) return console.log(`❌ [user.SCSS]: ERROR.`);
  const fileScssPath = path.join(
    __dirname,
    "../../../../content/public/admin/config.yml"
  );
  try {
    return fs.writeFileSync(fileScssPath, userAdmin());
  } catch (error) {
    console.log(error);
    return console.log(`❌ [User Admin]: ERROR.`);
  }
}

module.exports = {
  writeAdsTxt,
  writeStylesScss,
  writeRobotsTxt,
  writeAdminConfigs,
};
