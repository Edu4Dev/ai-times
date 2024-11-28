const fs = require("fs-extra");
var appRoot = require("app-root-path");

const publicSourceFolder = `${appRoot}/content/public`;
const cacheSourceFolder = `${appRoot}/content/cache`;

const general = require(`${appRoot}/content/settings/general.json`);
const logos = require(`${appRoot}/content/settings/logos.json`);

function sitemaps(scope) {
  return `<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/template.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${scope}/page-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${scope}/post-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
  <sitemap>
		<loc>${scope}/stories-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
  <sitemap>
		<loc>${scope}/feed-sitemap.xml</loc>
		<lastmod>${new Date().toISOString()}</lastmod>
	</sitemap>
</sitemapindex>`;
}

function feedSitemaps(siteUrl, scope, cardLogo) {
  const card = cardLogo.includes("http")
    ? cardLogo
    : siteUrl + scope + "/" + cardLogo;
  return `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="/template.xsl"?>
    <!-- Created in Sun Aug 18 2024 19:34:06 GMT+0000 (Coordinated Universal Time) -->
    <urlset
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${siteUrl}/atom-feed.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>,<url>
        <loc>${siteUrl}/rss-feed.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>,<url>
        <loc>${siteUrl}/robots.txt</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <image:image>
        <image:loc>${card}</image:loc>
      </image:image>
      </url>
    </urlset>`;
}
// TEMPLATES
const assembleXML = (data, siteUrl, scope, isStories = false) => {
  const amp = isStories ? ["amp/", ".stories.amp.html"] : ["", ""];
  return `<?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet type="text/xsl" href="/template.xsl"?>
        <!-- Created in ${new Date()} -->
        <urlset
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${data?.map((item) => {
            return `<url>
            <loc>${siteUrl + scope}/${amp[0] + item?.slug + amp[1]}</loc>
            <lastmod>${item?.date}</lastmod>
            ${
              item?.featuredImage
                ? `<image:image>
            <image:loc>${
              item?.featuredImage?.slice(0, 4) === "http"
                ? item?.featuredImage
                : siteUrl + scope + "/brandimages/" + item?.featuredImage
            }</image:loc>
          </image:image>`
                : ""
            }${
              item?.innerImgs
                ? item?.innerImgs?.map((img) => {
                    return `<image:image>
            <image:loc>${
              img?.slice(0, 4) === "http"
                ? img
                : siteUrl + scope + "/brandimages/" + img[0]
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

async function generatePostsSitemap(
  postsDatas,
  siteUrl,
  scope,
  publicSourceFolder
) {
  if (!postsDatas) {
    console.log("❌ [Post Sitemap]: ERROR.");
    return process.exit(1);
  }
  // add stories xml sitemaps write
  try {
    const sitemapPost = assembleXML(
      postsDatas,
      siteUrl, // xxx remove
      scope // xxx remove
    ).toString();
    fs.writeFileSync(publicSourceFolder + `/post-sitemap.xml`, sitemapPost);
  } catch (error) {
    console.log("❌ [Post Sitemap]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
  // add stories xml sitemaps write
  try {
    const sitemapAmpStories = assembleXML(
      postsDatas,
      siteUrl,
      scope,
      true
    ).toString();
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

async function generateIndexSitemap(publicSourceFolder, siteUrl, scope) {
  try {
    fs.writeFileSync(
      publicSourceFolder + `/sitemaps.xml`,
      sitemaps(siteUrl + scope).toString()
    ); // xxx remove for top
  } catch (error) {
    console.log("❌ [Index Sitemaps]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

async function generateFeedsSitemap(
  cardLogo,
  siteUrl,
  scope,
  publicSourceFolder
) {
  try {
    fs.writeFileSync(
      publicSourceFolder + `/feed-sitemap.xml`,
      feedSitemaps(siteUrl, scope, cardLogo).toString()
    ); // xxx remove for top
  } catch (error) {
    console.log("❌ [Feed Sitemaps]: ERROR.");
    console.log(error);
    return process.exit(1);
  }
}

async function generatePagesSitemap(
  pagesDatas,
  siteUrl,
  scope,
  publicSourceFolder
) {
  if (!pagesDatas) return process.exit(1);

  try {
    const sitemapPage = assembleXML(pagesDatas, siteUrl, scope).toString();

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
  generatePostsSitemap,
  generatePagesSitemap,
  generateIndexSitemap,
  generateFeedsSitemap,
};
