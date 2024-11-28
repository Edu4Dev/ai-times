const Feed = require("feed").Feed;
const path = require("path");
// const { parse } = require("node-html-parser");
const showdown = require("showdown");

const general = require("../../../../content/cache/general.json");
const business = require("../../../../content/cache/business.json");
const logos = require("../../../../content/cache/logos.json");

const contentFolder = path.join(__dirname, "../../../../content");
const cacheSourceFolder = path.join(contentFolder, "cache");
const postsDatas = require(cacheSourceFolder + `/allPostsData.json`);
const pagesDatas = require(cacheSourceFolder + `/allPagesData.json`);
function addHackSeconds(date, seconds) {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}
const feed = new Feed({
  title: `${business?.brandName} Atom Feed`,
  description: business?.brandDescription,
  id: general?.siteUrl + "/",
  link: general?.siteUrl + "/",
  language: general.i18n, // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
  image: logos.cardLogo,
  favicon: logos.faviconLogo,
  copyright: `© ${new Date().getFullYear()} ${
    business?.brandName
  }. All Rights Reserved.`,
  generator: `${business?.brandDescription} Feed`,
  feedLinks: {
    atom: general?.siteUrl + "/atom-feed.xml",
    rss: general?.siteUrl + "/rss-feed.xml",
  },
  author: {
    name: business?.brandName,
    email: business?.brandEmail,
    link: general?.siteUrl,
  },
});

const converter = new showdown.Converter();
postsDatas?.allPosts?.concat(pagesDatas?.allPages).forEach((item, index) => {
  // console.log("converter.makeHtml(item?.content)");
  // console.log(converter.makeHtml(item?.content));
  let image;
  if (item?.frontmatter?.image === undefined) return (image = logos?.cardLogo);
  image = item?.frontmatter?.image;
  if (!item?.frontmatter?.image)
    return (
      console.log(
        `❌ [Generate Feed]: Failure due image from post: ${item?.frontmatter?.title}.`
      ),
      process.exit(1)
    );

  const imageExt = path.extname(item?.frontmatter?.image);
  if (imageExt === "") return (image = item?.frontmatter?.image + ".jpg");
  const content = converter.makeHtml(item?.content);
  try {
    feed.addItem({
      title: item?.frontmatter?.title,
      id: general?.siteUrl + "/" + item?.slug,
      link: general?.siteUrl + "/" + item?.slug,
      description: item?.frontmatter?.pageDescription || "no description",
      content: content,
      author: [
        {
          name: item?.frontmatter?.author || business?.brandName,
          email: business?.brandEmail,
          link: general?.siteUrl,
        },
      ],
      date: item?.date
        ? new Date(item?.date)
        : addHackSeconds(new Date(), index),
      image: general?.siteUrl + "/" + image,
    });
  } catch (error) {
    console.log(item?.frontmatter.title);
    console.log(error);
    console.log("❌ [Feed Add Item]: Failure.");
  }
});

postsDatas.categories.forEach((cat) => {
  feed.addCategory(cat);
});

const generateAtom = async () => {
  if (!postsDatas?.allPosts)
    return console.log("❌ [Posts Robots]: ERROR."), process.exit(1);
  if (!pagesDatas)
    return console.log("❌ [Pages Robots]: ERROR."), process.exit(1);

  // Output: ATOM
  const atom = async () => feed.atom1();
  return await atom();
};

const generateRSS = async () => {
  if (!postsDatas?.allPosts)
    return console.log("❌ [Posts Robots]: ERROR."), process.exit(1);
  if (!pagesDatas)
    return console.log("❌ [Pages Robots]: ERROR."), process.exit(1);

  // Output: RSS 2.0
  const rss = async () => feed.rss2();
  try {
    return await rss();
  } catch (error) {
    return (
      console.log("Error in: " + image),
      console.log("❌ [RSS Create]: ERROR."),
      process.exit(1)
    );
  }
};
module.exports = { generateAtom, generateRSS };
