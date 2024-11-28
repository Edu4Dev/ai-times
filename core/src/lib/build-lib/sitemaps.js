const fs = require("fs-extra");
const path = require("path");
const contentFolder = path.join(__dirname, "../../../../content");
const publicSourceFolder = path.join(contentFolder, "public");
const cacheSourceFolder = path.join(contentFolder, "cache");

const general = require("../../../../content/cache/general.json");
const logos = require("../../../../content/cache/logos.json");

const sitemaps = `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/template.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${general?.siteUrl + general?.scope}/page-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${general?.siteUrl + general?.scope}/post-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
  <sitemap>
		<loc>${general?.siteUrl + general?.scope}/stories-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
  <sitemap>
		<loc>${general?.siteUrl + general?.scope}/feed-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
</sitemapindex>`;

const feedSitemaps = () => {
  const card = logos.cardLogo.includes("http")
    ? logos.cardLogo
    : general?.siteUrl + general?.scope + "/" + logos.cardLogo;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/template.xsl"?>
    <!-- Created in Sun Aug 18 2024 19:34:06 GMT+0000 (Coordinated Universal Time) -->
    <urlset
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${general.siteUrl}/atom-feed.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>,<url>
        <loc>${general.siteUrl}/rss-feed.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>,<url>
        <loc>${general.siteUrl}/robots.txt</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>
    </urlset>`;
};
// TEMPLATES
const dataXML = (data, isStories = false) => {
  const amp = isStories ? ["amp/", ".stories.amp.html"] : ["", ""];
  return `<?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet type="text/xsl" href="/template.xsl"?>
        <!-- Created in ${new Date()} -->
        <urlset
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${data.map((item) => {
            return `<url>
            <loc>${general?.siteUrl + general?.scope}/${
              amp[0] + item?.slug + amp[1]
            }</loc>
            <lastmod>${item?.date}</lastmod>
            ${
              item?.featuredImage
                ? `<image:image>
            <image:loc>${
              item?.featuredImage?.substring(0, 4) === "http"
                ? item?.featuredImage
                : general?.siteUrl +
                  general?.scope +
                  "/brandimages/" +
                  item?.featuredImage
            }</image:loc>
          </image:image>`
                : ""
            }${
              item?.innerImgs
                ? item?.innerImgs?.map((img) => {
                    return `<image:image>
            <image:loc>${
              img?.substring(0, 4) === "http"
                ? img
                : general?.siteUrl + general?.scope + "/brandimages/" + img[0]
            }</image:loc>
          </image:image>`;
                  })
                : ""
            }
          </url>`;
          })}
      </urlset>
      `;
};

async function writePostsSitemap() {
  const postsDatas = require(cacheSourceFolder + `/postsDatas.json`);
  if (!postsDatas) {
    console.log("❌ [Post Sitemap]: ERROR.");
    return process.exit(1);
  }
  // add stories xml sitemaps write
  try {
    const sitemapPost = dataXML(postsDatas).toString();
    fs.writeFileSync(publicSourceFolder + `/post-sitemap.xml`, sitemapPost);
  } catch (error) {
    console.log("❌ [Post Sitemap]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
  // add stories xml sitemaps write
  try {
    const sitemapAmpStories = dataXML(postsDatas, true).toString();
    return fs.writeFileSync(
      publicSourceFolder + `/stories-sitemap.xml`,
      sitemapAmpStories
    );
  } catch (error) {
    console.log("❌ [Post Sitemap]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

async function writeIndexSitemaps() {
  try {
    fs.writeFileSync(publicSourceFolder + `/sitemaps.xml`, sitemaps.toString());
  } catch (error) {
    console.log("❌ [Index Sitemaps]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

async function writeFeedSitemaps() {
  try {
    fs.writeFileSync(
      publicSourceFolder + `/feed-sitemap.xml`,
      feedSitemaps().toString()
    );
  } catch (error) {
    console.log("❌ [Feed Sitemaps]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

async function writePagesSitemap() {
  const pagesDatas = require(cacheSourceFolder + `/allPagesData.json`);
  if (!pagesDatas) return process.exit(1);

  try {
    const sitemapPage = dataXML(pagesDatas.allPages).toString();

    return fs.writeFileSync(
      publicSourceFolder + `/page-sitemap.xml`,
      sitemapPage.toString()
    );
  } catch (error) {
    console.log("❌ [Post Sitemap]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

module.exports = {
  writePostsSitemap,
  writePagesSitemap,
  writeIndexSitemaps,
  writeFeedSitemaps,
};
