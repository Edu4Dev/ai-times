const fs = require("fs-extra");
const decapConfig = require("../bin/decap");

/**
 * Writes the admin configuration files.
 *
 * @param {string} gitRepo - The Git repository URL.
 * @param {string} siteUrl - The URL of the site.
 * @param {string} cloudName - The cloud name.
 * @param {string} cloudApiKey - The cloud API key.
 * @param {string} markLogo - The logo.
 * @param {string} nextVersion - The next version number.
 * @param {string} version - The current version number.
 * @param {string} publicSourceFolder - The folder where the admin configuration files will be written.
 * @returns {Promise<void>}
 */
async function writeAdminConfigs(
  gitRepo,
  siteUrl,
  cloudName,
  cloudApiKey,
  markLogo,
  nextVersion,
  version,
  publicSourceFolder
) {
  const configYmlPath = `${publicSourceFolder}/admin/config.yml`;
  try {
    return fs.writeFileSync(
      configYmlPath,
      decapConfig(
        gitRepo,
        siteUrl,
        cloudName,
        cloudApiKey,
        markLogo,
        nextVersion,
        version
      )
    );
  } catch (error) {
    console.log(error);
    return console.log(`❌ [User Admin]: ERROR.`);
  }
}

module.exports = writeAdminConfigs;
