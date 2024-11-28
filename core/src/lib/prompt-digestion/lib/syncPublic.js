const fs = require("fs-extra");
var appRoot = require("app-root-path");

const publicSourceFolder = `${appRoot}/content/public`;
const destinationSourceFolder = `${appRoot}/core/public`;

async function syncPublicFiles() {
  try {
    return fs.copySync(publicSourceFolder, destinationSourceFolder, {
      recursive: true,
    });
  } catch (error) {
    console.log("❌ [copySync Public files]: copy ERROR.");
    return console.log(error);
  }
}

module.exports = {
  syncPublicFiles,
};
