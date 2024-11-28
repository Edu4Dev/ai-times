const fs = require("fs-extra");
const userRobots = require("../bin/robots");

/**
 * Writes the robots.txt file in the specified public source folder.
 *
 * @param {Object[]} postsDatas - The data for the posts.
 * @param {Object[]} pagesDatas - The data for the pages.
 * @param {string} siteUrl - The URL of the site.
 * @param {string} publicSourceFolder - The folder where the robots.txt file will be written.
 * @returns {Promise<void>}
 */
async function writeRobotsTxt(
  postsDatas,
  pagesDatas,
  siteUrl,
  publicSourceFolder
) {
  const fileRobotsPath = `${publicSourceFolder}/robots.txt`;

  try {
    return fs.writeFileSync(
      fileRobotsPath,
      await userRobots(postsDatas, pagesDatas, siteUrl)
    );
  } catch (error) {
    console.log(`❌ [robots.txt]: ERROR.`);
    return console.log(error);
  }
}

module.exports = writeRobotsTxt;
