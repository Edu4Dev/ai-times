// const fs = require("fs-extra");
// const { generateAtom, generateRSS } = require("./generateAtomRSS");
// const { generateAmpStories } = require("./apmStories");

// async function writeAtom(publicSourceFolder) {
//   const fileAtomPath = `${publicSourceFolder}/atom-feed.xml`;

//   try {
//     return fs.writeFileSync(fileAtomPath, await generateAtom());
//   } catch (error) {
//     process.stdout.write(error);
//     return process.stdout.write(`❌ [Atom.xml]: ERROR.`);
//   }
// }

// async function writeRSS() {
//   const fileRSSPath = `${publicSourceFolder}/rss-feed.xml`;
//   return fs.writeFileSync(fileRSSPath, await generateRSS());
// }

// async function writeAmpStories(
//   params
// ) {
//   const {pagesDatas,
//     postsDatas,
//     siteUrl,
//     postAuthorLogo,
//     brandName,
//     cardLogo,
//     publicSourceFolder}=params
//   const ampStories = await generateAmpStories(
//     pagesDatas,
//     postsDatas,
//     siteUrl,
//     postAuthorLogo,
//     brandName,
//     cardLogo
//   );
//   ampStories.forEach((storie) => {
//     const storyPath = `${publicSourceFolder}/amp/${storie?.slug}.stories.amp.html`;
//     try {
//       return fs.writeFileSync(storyPath, storie.ampStory);
//       // console.log(`✔️ [Amp Storie]: AMP Story stored successfully.`);
//     } catch (error) {
//       console.log(error);
//       console.log(`❌ [Amp Storie]: ERROR storing AMP Story.`);
//     }
//   });
// }

// module.exports = {
//   writeAtom,
//   writeRSS,
//   writeAmpStories,
// };
// const fs = require("fs-extra");
const { Feed } = require("feed");

// const { generateAtom } = require("./atom");
// const { generateRSS } = require("./rss");
// const { generateAmpStories } = require("./apmStories");

/**
 * Function to add seconds to a date.
 *
 * @param {Date} date - The date object to modify.
 * @param {number} seconds - The number of seconds to add.
 * @returns {Date} The modified date.
 */
function addHackSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

/**
 * Creates a Feed instance based on the provided parameters.
 *
 * @param {string} brandName - The name of the brand.
 * @param {string} brandEmail - The email of the brand.
 * @param {string} brandDescription - The description of the brand.
 * @param {string} siteUrl - The URL of the site.
 * @param {string} i18n - The language of the feed.
 * @param {string} cardLogo - The logo of the brand.
 * @param {string} faviconLogo - The favicon of the brand.
 * @returns {Feed} A new Feed instance.
 */
function createFeed({
  brandName,
  brandEmail,
  brandDescription,
  siteUrl,
  i18n,
  cardLogo,
  faviconLogo,
}) {
  return new Feed({
    title: `${brandName} Atom Feed`,
    description: brandDescription,
    id: siteUrl + "/",
    link: siteUrl + "/",
    language: i18n,
    image: cardLogo,
    favicon: faviconLogo,
    copyright: `© ${new Date().getFullYear()} ${brandName}. All Rights Reserved.`,
    generator: `${brandDescription} Feed`,
    feedLinks: {
      atom: siteUrl + "/atom-feed.xml",
      rss: siteUrl + "/rss-feed.xml",
    },
    author: {
      name: brandName,
      email: brandEmail,
      link: siteUrl,
    },
  });
}

module.exports = {
  createFeed,
  addHackSeconds,
};
