const fs = require("fs-extra");
const { userVarSass, userSass } = require("../bin/sass");

/**
 * Writes the styles SCSS files in the specified styles folder.
 *
 * @param {string} stylesFolder - The folder where the SCSS files will be written.
 * @returns {Promise<void|null>}
 */
async function writeStylesScss(theme, stylesFolder) {
  if (!stylesFolder) return null;
  const fileVarsScssPath = `${stylesFolder}/user-vars.scss`;
  try {
    fs.writeFileSync(fileVarsScssPath, userVarSass(theme));
  } catch (error) {
    console.log(error);
    console.log(`❌ [user-vars.SCSS]: ERROR.`);
  }
  const fileScssPath = `${stylesFolder}/user-helpers.scss`;

  try {
    return fs.writeFileSync(fileScssPath, userSass(theme));
  } catch (error) {
    console.log(error);
    return console.log(`❌ [user-helpers.SCSS]: ERROR.`);
  }
}
module.exports = writeStylesScss;
