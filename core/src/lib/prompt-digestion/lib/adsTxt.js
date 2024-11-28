const fs = require("fs-extra");
/**
 * Writes the ads.txt file in the specified public source folder.
 *
 * @param {string[]} adsClient - Array containing the ads client information.
 * @param {string} publicSourceFolder - The folder where the ads.txt file will be written.
 * @returns {Promise<void>}
 */
async function writeAdsTxt(adsClient, publicSourceFolder) {
  if (adsClient?.length <= 1)
    return console.log(`⚠️ [📝 - Ads.txt]: Warn, no adsClient.`);
  const adsTxt = `google.com, pub-${adsClient[1]}, DIRECT, f08c47fec0942fa0`;
  const filePath = `${publicSourceFolder}/ads.txt`;
  try {
    return fs.writeFileSync(filePath, adsTxt);
  } catch (error) {
    console.log(`❌ [Ads.txt]: ERROR.`);
    return console.log(error);
  }
}

module.exports = writeAdsTxt;
