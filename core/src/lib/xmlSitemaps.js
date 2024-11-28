const general = require("../../../content/cache/general.json");

// TEMPLATES
const dataXML = (data) => `<?xml version="1.0" encoding="UTF-8"?>
      <?xml-stylesheet type="text/xsl" href="/template.xsl"?>
        <!-- Created in ${new Date()} -->
        <urlset
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
          xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
          ${data.map((item) => {
            return `<url>
            <loc>${general?.siteUrl + general?.scope}/${item?.slug}</loc>
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

module.exports = { dataXML };
