const fs = require("fs-extra");
const path = require("path");
const { generateAtom, generateRSS } = require("./generateAtomRSS");
const { generateAmpStories } = require("./apmStories");

async function writeAtom() {
  const fileAtomPath = path.join(
    __dirname,
    "../../../../content/public/atom-feed.xml"
  );

  try {
    return fs.writeFileSync(fileAtomPath, await generateAtom());
  } catch (error) {
    process.stdout.write(error);
    return process.stdout.write(`❌ [Atom.xml]: ERROR.`);
  }
}

async function writeRSS() {
  const fileRSSPath = path.join(
    __dirname,
    "../../../../content/public/rss-feed.xml"
  );
  return fs.writeFileSync(fileRSSPath, await generateRSS());
}

async function writeAmpStories() {
  const ampStories = await generateAmpStories();
  ampStories.forEach((storie) => {
    const storyPath = path.join(
      __dirname,
      `../../../../content/public/amp/${storie?.slug}.stories.amp.html`
    );
    try {
      return fs.writeFileSync(storyPath, storie.ampStory);
      // console.log(`✔️ [Amp Storie]: AMP Story stored successfully.`);
    } catch (error) {
      console.log(error);
      console.log(`❌ [Amp Storie]: ERROR storing AMP Story.`);
    }
  });
}

module.exports = {
  writeAtom,
  writeRSS,
  writeAmpStories,
};
