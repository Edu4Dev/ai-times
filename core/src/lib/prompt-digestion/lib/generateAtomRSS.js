// // const Feed = require("feed").Feed;
// // const path = require("path");
// // // const { parse } = require("node-html-parser");
// // const showdown = require("showdown");

// // const general = require("../../../../content/settings/general.json");
// // const business = require("../../../../content/settings/business.json");
// // const logos = require("../../../../content/settings/logos.json");

// // const contentFolder = path.join(__dirname, "../../../../content");
// // const cacheSourceFolder = path.join(contentFolder, "cache");
// // const postsDatas = require(cacheSourceFolder + `/allPostsData.json`);
// // const pagesDatas = require(cacheSourceFolder + `/allPagesData.json`);
// // function addHackSeconds(date, seconds) {
// //   date.setSeconds(date.getSeconds() + seconds);
// //   return date;
// // }
// // const feed =(brandName,brandEmail,brandDescription,siteUrl,i18n,cardLogo,faviconLogo)=> new Feed({
// //   title: `${brandName} Atom Feed`,
// //   description: brandDescription,
// //   id: siteUrl + "/",
// //   link: siteUrl + "/",
// //   language: i18n, // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
// //   image: cardLogo,
// //   favicon: faviconLogo,
// //   copyright: `© ${new Date().getFullYear()} ${
// //     brandName
// //   }. All Rights Reserved.`,
// //   generator: `${brandDescription} Feed`,
// //   feedLinks: {
// //     atom: siteUrl + "/atom-feed.xml",
// //     rss: siteUrl + "/rss-feed.xml",
// //   },
// //   author: {
// //     name: brandName,
// //     email: brandEmail,
// //     link: siteUrl,
// //   },
// // });

// // const converter = new showdown.Converter();
// // postsDatas?.allPosts?.concat(pagesDatas?.allPages).forEach((item, index) => {
// //   // console.log("converter.makeHtml(item?.content)");
// //   // console.log(converter.makeHtml(item?.content));
// //   let image;
// //   if (item?.frontmatter?.image === undefined) return (image = logos?.cardLogo);
// //   image = item?.frontmatter?.image;
// //   if (!item?.frontmatter?.image)
// //     return (
// //       console.log(
// //         `❌ [Generate Feed]: Failure due image from post: ${item?.frontmatter?.title}.`
// //       ),
// //       process.exit(1)
// //     );

// //   const imageExt = path.extname(item?.frontmatter?.image);
// //   if (imageExt === "") return (image = item?.frontmatter?.image + ".jpg");
// //   const content = converter.makeHtml(item?.content);
// //   try {
// //     feed.addItem({
// //       title: item?.frontmatter?.title,
// //       id: general?.siteUrl + "/" + item?.slug,
// //       link: general?.siteUrl + "/" + item?.slug,
// //       description: item?.frontmatter?.pageDescription || "no description",
// //       content: content,
// //       author: [
// //         {
// //           name: item?.frontmatter?.author || business?.brandName,
// //           email: business?.brandEmail,
// //           link: general?.siteUrl,
// //         },
// //       ],
// //       date: item?.date
// //         ? new Date(item?.date)
// //         : addHackSeconds(new Date(), index),
// //       image: general?.siteUrl + "/" + image,
// //     });
// //   } catch (error) {
// //     console.log(item?.frontmatter.title);
// //     console.log(error);
// //     console.log("❌ [Feed Add Item]: Failure.");
// //   }
// // });

// // postsDatas.categories.forEach((cat) => {
// //   feed.addCategory(cat);
// // });

// // const generateAtom = async (postsDatas, pagesDatas) => {
// //   if (!postsDatas)
// //     return console.log("❌ [Posts Robots]: ERROR."), process.exit(1);
// //   if (!pagesDatas)
// //     return console.log("❌ [Pages Robots]: ERROR."), process.exit(1);

// //   // Output: ATOM
// //   const atom = async () => feed.atom1();
// //   return await atom();
// // };

// // const generateRSS = async (postsDatas, pagesDatas) => {
// //   if (!postsDatas)
// //     return console.log("❌ [Posts Robots]: ERROR."), process.exit(1);
// //   if (!pagesDatas)
// //     return console.log("❌ [Pages Robots]: ERROR."), process.exit(1);

// //   // Output: RSS 2.0
// //   const rss = async () => feed.rss2();
// //   try {
// //     return await rss();
// //   } catch (error) {
// //     return console.log("❌ [RSS Create]: ERROR.", error), process.exit(1);
// //   }
// // };
// // module.exports = { generateAtom, generateRSS };

// const { Feed } = require("feed");
// const path = require("path");
// const showdown = require("showdown");

// /**
//  * Function to add seconds to a date.
//  *
//  * @param {Date} date - The date object to modify.
//  * @param {number} seconds - The number of seconds to add.
//  * @returns {Date} The modified date.
//  */
// function addHackSeconds(date, seconds) {
//   date.setSeconds(date.getSeconds() + seconds);
//   return date;
// }

// /**
//  * Creates a Feed instance based on the provided parameters.
//  *
//  * @param {string} brandName - The name of the brand.
//  * @param {string} brandEmail - The email of the brand.
//  * @param {string} brandDescription - The description of the brand.
//  * @param {string} siteUrl - The URL of the site.
//  * @param {string} i18n - The language of the feed.
//  * @param {string} cardLogo - The logo of the brand.
//  * @param {string} faviconLogo - The favicon of the brand.
//  * @returns {Feed} A new Feed instance.
//  */
// function createFeed({
//   brandName,
//   brandEmail,
//   brandDescription,
//   siteUrl,
//   i18n,
//   cardLogo,
//   faviconLogo,
// }) {
//   return new Feed({
//     title: `${brandName} Atom Feed`,
//     description: brandDescription,
//     id: siteUrl + "/",
//     link: siteUrl + "/",
//     language: i18n,
//     image: cardLogo,
//     favicon: faviconLogo,
//     copyright: `© ${new Date().getFullYear()} ${brandName}. All Rights Reserved.`,
//     generator: `${brandDescription} Feed`,
//     feedLinks: {
//       atom: siteUrl + "/atom-feed.xml",
//       rss: siteUrl + "/rss-feed.xml",
//     },
//     author: {
//       name: brandName,
//       email: brandEmail,
//       link: siteUrl,
//     },
//   });
// }

// /**
//  * Generates Atom feed content.
//  *
//  * @param {Object} params - The parameters needed to generate the Atom feed.
//  * @returns {Promise<string>} The generated Atom feed as a string.
//  */
// async function generateAtom(params) {
//   const {
//     postsDatas,
//     pagesDatas,
//     siteDescription,
//     siteUrl,
//     i18n,
//     brandName,
//     brandEmail,
//     logos,
//   } = params;
//   console.log({
//     siteDescription,
//     siteUrl,
//     i18n,
//     brandName,
//     brandEmail,
//     logos,
//   });

//   if (!postsDatas) {
//     console.log("❌ [Posts Atom]: ERROR.");
//     process.exit(1);
//   }
//   if (!pagesDatas) {
//     console.log("❌ [Pages Atom]: ERROR.");
//     process.exit(1);
//   }

//   const feed = createFeed({
//     brandName: brandName,
//     brandEmail: brandEmail,
//     brandDescription: siteDescription,
//     siteUrl: siteUrl,
//     i18n: i18n,
//     cardLogo: logos.cardLogo,
//     faviconLogo: logos.favicon,
//   });

//   const converter = new showdown.Converter();

//   postsDatas.allPosts.concat(pagesDatas.allPages).forEach((item, index) => {
//     let image = item.frontmatter.image || logos.cardLogo;
//     const imageExt = path.extname(image);
//     if (imageExt === "") image += ".jpg";
//     const content = converter.makeHtml(item.content);

//     try {
//       feed.addItem({
//         title: item.frontmatter.title,
//         id: `${siteUrl}/${item.slug}`,
//         link: `${siteUrl}/${item.slug}`,
//         description: item.frontmatter.pageDescription || "no description",
//         content,
//         author: [
//           {
//             name: item.frontmatter.author || brandName,
//             email: brandEmail,
//             link: siteUrl,
//           },
//         ],
//         date: new Date(item.date || addHackSeconds(new Date(), index)),
//         image: `${siteUrl}/${image}`,
//       });
//     } catch (error) {
//       console.log(`❌ [Feed Add Item]: Failure for ${item.frontmatter.title}`);
//       console.log(error);
//     }
//   });

//   postsDatas.categories.forEach((cat) => {
//     feed.addCategory(cat);
//   });

//   return feed.atom1();
// }

// /**
//  * Generates RSS feed content.
//  *
//  * @param {Object} params - Parameters needed to generate the RSS feed.
//  * @returns {Promise<string>} The generated RSS feed as a string.
//  */
// async function generateRSS(params) {
//   const {
//     postsDatas,
//     pagesDatas,
//     siteDescription,
//     siteUrl,
//     i18n,
//     brandName,
//     brandEmail,
//     logos,
//   } = params;

//   if (!postsDatas) {
//     console.log("❌ [Posts RSS]: ERROR.");
//     process.exit(1);
//   }
//   if (!pagesDatas) {
//     console.log("❌ [Pages RSS]: ERROR.");
//     process.exit(1);
//   }

//   const feed = createFeed({
//     brandName: brandName,
//     brandEmail: brandEmail,
//     brandDescription: siteDescription,
//     siteUrl: siteUrl,
//     i18n: i18n,
//     cardLogo: logos.cardLogo,
//     faviconLogo: logos.favicon,
//   });

//   const converter = new showdown.Converter();

//   postsDatas.allPosts.concat(pagesDatas.allPages).forEach((item, index) => {
//     let image = item.frontmatter.image || logos.cardLogo;
//     const imageExt = path.extname(image);
//     if (imageExt === "") image += ".jpg";
//     const content = converter.makeHtml(item.content);

//     try {
//       feed.addItem({
//         title: item.frontmatter.title,
//         id: `${siteUrl}/${item.slug}`,
//         link: `${siteUrl}/${item.slug}`,
//         description: item.frontmatter.pageDescription || "no description",
//         content,
//         author: [
//           {
//             name: item.frontmatter.author || brandName,
//             email: brandEmail,
//             link: siteUrl,
//           },
//         ],
//         date: new Date(item.date || addHackSeconds(new Date(), index)),
//         image: `${siteUrl}/${image}`,
//       });
//     } catch (error) {
//       console.log(`❌ [Feed Add Item]: Failure for ${item.frontmatter.title}`);
//       console.log(error);
//     }
//   });

//   postsDatas.categories.forEach((cat) => {
//     feed.addCategory(cat);
//   });

//   // Output: RSS 2.0
//   try {
//     return feed.rss2();
//   } catch (error) {
//     console.log("❌ [RSS Create]: ERROR.", error);
//     process.exit(1);
//   }
// }

// module.exports = { generateAtom, generateRSS };
