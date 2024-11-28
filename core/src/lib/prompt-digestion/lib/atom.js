const fs = require("fs-extra");
const path = require("path");
const showdown = require("showdown");
const { createFeed, addHackSeconds } = require("./feed");

/**
 * Generates Atom feed content.
 *
 * @param {Object} params - The parameters needed to generate the Atom feed.
 * @returns {Promise<string>} The generated Atom feed as a string.
 */
async function generateAtom(params) {
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
    console.log("❌ [Posts Atom]: ERROR.");
    process.exit(1);
  }
  if (!pagesDatas) {
    console.log("❌ [Pages Atom]: ERROR.");
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

  // Output: Atom
  try {
    return feed.atom1();
  } catch (error) {
    console.log("❌ [Atom Create]: ERROR.", error);
    process.exit(1);
  }
}

/**
 * Writes the Atom feed to a file in the specified public source folder.
 *
 * @param {string} publicSourceFolder - The folder where the Atom feed file will be written.
 * @param {Object} params - The parameters needed to generate the Atom feed.
 * @returns {Promise<void>}
 */
async function writeAtom(params, publicSourceFolder) {
  const fileAtomPath = path.join(`${publicSourceFolder}`, `/atom-feed.xml`);

  try {
    return fs.writeFileSync(fileAtomPath, await generateAtom(params));
  } catch (error) {
    console.log(error);
    return process.stdout.write(`❌ [Atom.xml]: ERROR.`);
  }
}

module.exports = writeAtom;
