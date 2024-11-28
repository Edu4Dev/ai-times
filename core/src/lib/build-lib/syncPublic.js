const fs = require("fs-extra");
const path = require("path");

const contentFolder = path.join(__dirname, "../../../../content");
const destinationSourceFolder = path.join(__dirname, "../../../../core/public");
const publicSourceFolder = path.join(contentFolder, "public");

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
