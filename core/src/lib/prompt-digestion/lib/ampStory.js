const path = require("path");
const fs = require("fs-extra");
const showdown = require("showdown");
const { ampStorieHTML, ampStoryPage, lastStory } = require("../bin/ampStories");

// const converter = new showdown.Converter();

/**
 * Constructs an AMP story from the given content.
 *
 * @param {string} title - The title of the story.
 * @param {string} srcImg - The source image URL for the story.
 * @param {string[]} postImages - An array of image URLs to be included in the story.
 * @param {string} canonical - The canonical URL of the story.
 * @param {string[]} headings - An array of headings for each page of the story.
 * @param {string} brandName - The name of the brand.
 * @param {string} cardLogo - The URL of the card logo.
 * @param {string} postAuthorLogo - The URL of the post author's logo.
 * @returns {string} The constructed AMP story in HTML format.
 */
function storyConstructor(
  title,
  srcImg,
  postImages,
  canonical,
  headings,
  brandName,
  cardLogo,
  postAuthorLogo,
  siteUrl
) {
  return `<amp-story title="${title}" publisher="${brandName}" publisher-logo-src="${postAuthorLogo}" poster-portrait-src="${cardLogo}"> 
      ${ampStoryPage(srcImg, title, 1, canonical, brandName)}
      ${postImages
        .map((img, indx) =>
          ampStoryPage(
            img,
            headings[indx] || `Visit ${canonical}`,
            indx + 2,
            canonical,
            brandName
          )
        )
        .join("")}
      ${lastStory(99, srcImg, title, canonical, brandName, siteUrl)}
    </amp-story>`;
}

/**
 * Generates AMP stories content.
 *
 * @param {Object[]} pagesDatas - The data for the pages.
 * @param {Object[]} postsDatas - The data for the posts.
 * @param {string} siteUrl - The URL of the site.
 * @param {string} postAuthorLogo - The logo of the post author.
 * @param {string} brandName - The name of the brand.
 * @param {string} cardLogo - The logo for AMP story cards.
 * @returns {Promise<Object[]>} The generated AMP stories as an array of objects.
 */
const generateAmpStories = async (
  pagesDatas,
  postsDatas,
  siteUrl,
  postAuthorLogo,
  brandName,
  cardLogo
) => {
  const storiesArray = [];

  postsDatas?.concat(pagesDatas).forEach((item, index) => {
    const title = item?.frontmatter?.title;
    // const content = converter.makeHtml(item?.content);
    const srcImg = item?.frontmatter?.image || postAuthorLogo;
    const postImages = item?.innerImgs || [];
    const headings = item?.headings || [];
    const canonical = siteUrl + "/" + item?.slug;
    const slug = item?.slug;

    const ampAssembleContent = ampStorieHTML(
      title,
      canonical,
      storyConstructor(
        title,
        srcImg,
        postImages,
        canonical,
        headings,
        brandName,
        cardLogo,
        postAuthorLogo,
        siteUrl
      )
    );
    storiesArray.push({ title, slug, canonical, ampAssembleContent });
  });

  return storiesArray;
};

/**
 * Writes AMP stories to files in the specified public source folder.
 *
 * @param {Object} params - The parameters for generating AMP stories.
 * @param {Object[]} params.pagesDatas - The data for the pages.
 * @param {Object[]} params.postsDatas - The data for the posts.
 * @param {string} params.siteUrl - The URL of the site.
 * @param {string} params.postAuthorLogo - The logo of the post author.
 * @param {string} params.brandName - The name of the brand.
 * @param {string} params.cardLogo - The logo for AMP story cards.
 * @param {string} params.publicSourceFolder - The folder where the AMP stories will be written.
 * @returns {Promise<void>}
 */
async function writeAmpStories({
  pagesDatas,
  postsDatas,
  siteUrl,
  postAuthorLogo,
  brandName,
  cardLogo,
  publicSourceFolder,
}) {
  const ampFolder = path.join(publicSourceFolder, "amp");

  // Step 1: Ensure the folder exists and clean it
  if (!fs.existsSync(ampFolder)) {
    fs.mkdirSync(ampFolder, { recursive: true });
  } else {
    const files = fs.readdirSync(ampFolder);
    for (const file of files) {
      fs.unlinkSync(path.join(ampFolder, file));
    }
  }

  // Step 2: Generate AMP stories
  const ampStories = await generateAmpStories(
    pagesDatas,
    postsDatas,
    siteUrl,
    postAuthorLogo,
    brandName,
    cardLogo
  );

  // Step 3: Write new AMP stories to the folder
  ampStories.forEach((storie, index) => {
    const slug = storie?.slug;

    if (!slug) {
      console.error(
        `❌ [Amp Storie]: Missing slug for AMP story at index ${index}, skipping file generation.`
      );
      return; // Skip if no slug is available
    }

    const storyPath = `${ampFolder}/${slug}.stories.amp.html`;
    try {
      fs.writeFileSync(storyPath, storie.ampAssembleContent);
      // console.log(`✔️ [Amp Storie]: AMP Story "${slug}" stored successfully.`);
    } catch (error) {
      console.error(
        `❌ [Amp Storie]: ERROR storing AMP Story "${slug}".`,
        error
      );
    }
  });
}

module.exports = { generateAmpStories, writeAmpStories };
