const fs = require("fs-extra");
const path = require("path");
const showdown = require("showdown");
const { createFeed, addHackSeconds } = require("./feed");
/**
 * Generates RSS feed content.
 *
 * @param {Object} params - Parameters needed to generate the RSS feed.
 * @returns {Promise<string>} The generated RSS feed as a string.
 */
async function generateRSS(params) {
  const {
    postsDatas,
    pagesDatas,
    siteDescription,
    siteUrl,
    i18n,
    brandName,
    brandEmail,
    logos,
    categories,
  } = params;

  if (!postsDatas) {
    console.log("❌ [Posts RSS]: ERROR.");
    process.exit(1);
  }
  if (!pagesDatas) {
    console.log("❌ [Pages RSS]: ERROR.");
    process.exit(1);
  }

  const feed = createFeed({
    brandName: brandName,
    brandEmail: brandEmail,
    brandDescription: siteDescription,
    siteUrl: siteUrl,
    i18n: i18n,
    cardLogo: logos.cardLogo,
    faviconLogo: logos.favicon,
  });

  const converter = new showdown.Converter();

  postsDatas.concat(pagesDatas).forEach((item, index) => {
    let image = item.frontmatter.image || logos.cardLogo;
    const imageExt = path.extname(image);
    if (imageExt === "") image += ".jpg";
    const content = converter.makeHtml(item.content);

    try {
      feed.addItem({
        title: item.frontmatter.title,
        id: `${siteUrl}/${item.slug}`,
        link: `${siteUrl}/${item.slug}`,
        description: item.frontmatter.pageDescription || "no description",
        content,
        author: [
          {
            name: item.frontmatter.author || brandName,
            email: brandEmail,
            link: siteUrl,
          },
        ],
        date: new Date(item.date || addHackSeconds(new Date(), index)),
        image: `${siteUrl}/${image}`,
      });
    } catch (error) {
      console.log(`❌ [Feed Add Item]: Failure for ${item.frontmatter.title}`);
      console.log(error);
    }
  });

  categories.forEach((cat) => {
    feed.addCategory(cat);
  });

  // Output: RSS 2.0
  try {
    return feed.rss2();
  } catch (error) {
    console.log("❌ [RSS Create]: ERROR.", error);
    process.exit(1);
  }
}

/**
 * Writes the RSS feed to a file in the specified public source folder.
 *
 * @param {string} publicSourceFolder - The folder where the RSS feed file will be written.
 * @param {Object} params - The parameters needed to generate the RSS feed.
 * @returns {Promise<void>}
 */
async function writeRSS(params, publicSourceFolder) {
  const fileRSSPath = path.join(`${publicSourceFolder}`, `/rss-feed.xml`);
  try {
    return fs.writeFileSync(fileRSSPath, await generateRSS(params));
  } catch (error) {
    console.log(error);
    return process.stdout.write(`❌ [RSS.xml]: ERROR.`);
  }
}

module.exports = { generateRSS, writeRSS };
