const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

const contentFolder = path.join(__dirname, "../../../../content");
const cacheSourceFolder = path.join(contentFolder, "cache");

const general = require(cacheSourceFolder + "/general.json");
const business = require(cacheSourceFolder + "/business.json");
const logos = require(cacheSourceFolder + "/logos.json");
const postsDatas = require(cacheSourceFolder + `/postsDatas.json`);
const pagesDatas = require(cacheSourceFolder + `/allPagesData.json`);

const converter = new showdown.Converter();

const ampStoryPage = (srcImg, title, index, canonical) => {
  const image = srcImg.includes("http")
    ? srcImg
    : general.siteUrl + "/posts/" + srcImg;
  if (index === 1)
    return `<amp-story-page id="nun-page-${index}" auto-advance-after="7s">
        <amp-story-grid-layer template="fill">
          <amp-img src="${image}" alt="${title}" width="900" class="image-fit-cover" style="color: #FFFFFF;opacity: 1;object-fit: cover;" layout="responsive" height="675">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer class="center" template="vertical">
          <div style="position:relative;z-index:5;">
            <h1 style="color: #ffffff;font-family: Calistoga;font-size: 1.75em;text-align: center;font-weight:900;padding-top:60%;text-shadow: 2px 2px 4px rgba(0,0,0,0.7);relative;z-index:5;">
            ${title}
            </h1>
          </div>
          <div style="position:relative;z-index:5;">
            <p style="color: #ffffff;font-family: Roboto;font-size: 1.125em;text-align: center;">
              Tap right and left to read the story.<br />Click below to read the post.
            </p>
          </div>
        </amp-story-grid-layer>
        <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
      </amp-story-page>`;

  if (index === 2)
    return `<amp-story-page id="page-${index}" auto-advance-after="7s">
        <amp-story-grid-layer template="fill">
          <amp-img height="675" src="${image}" alt="${title}" width="900" class="image-fit-cover" style="color: #FFFFFF;opacity: 0.5;object-fit: cover;" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer class="center" template="vertical">
          <div style="">
            <p style="color: #ffffff;font-family: Oswald;font-size: 1.5625em;text-align: left;">
            ${title}
            </p>
          </div>
        </amp-story-grid-layer>
        <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
      </amp-story-page>`;

  if (index >= 3)
    return `<amp-story-page id="nun-page-${index}" auto-advance-after="7s">
            <amp-story-grid-layer template="fill">
              <amp-img src="${image}" alt="${title}" width="900" class="image-fit-cover" style="color: #FFFFFF;opacity: 1;object-fit: cover;" layout="responsive" height="675">
              </amp-img>
            </amp-story-grid-layer>
            <amp-story-grid-layer class="center" template="vertical">
              <div style="position:relative;z-index:5;">
                <h1 style="color: #ffffff;font-family: Calistoga;font-size: 1.75em;text-align: center;font-weight:900;padding-top:60%;text-shadow: 2px 2px 4px rgba(0,0,0,0.7);relative;z-index:5;">
                ${title}
                </h1>
              </div>
              <div style="position:relative;z-index:5;">
                <p style="color: #ffffff;font-family: Roboto;font-size: 1.125em;text-align: center;">
                  Tap right and left to read the story.<br />Click below to read the post.
                </p>
              </div>
            </amp-story-grid-layer>
            <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
          </amp-story-page>`;

  // if (index >= 3)
  //   return `<amp-story-page id="page-${index}" auto-advance-after="7s">
  //       <amp-story-grid-layer class="top" template="vertical">
  //         <div style="">
  //           <p style="color: #ffffff;font-family: Calistoga;font-size: 1.875em;text-align: left;">
  //           ${title}
  //           </p>
  //         </div>
  //       </amp-story-grid-layer>
  //       <amp-story-grid-layer template="fill">
  //         <div class="absolute" style="position: absolute;top: 0%;left: 0%;width: 135.13513513513513%;height: 61.53846153846154%;">
  //           <amp-img height="400" src="${image}" alt="${title}" width="500" class="image-fit-contain" style="color: #FFFFFF;opacity: 1;object-fit: contain;margin-top: 250px;position: absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 4;" layout="responsive">
  //           </amp-img>
  //         </div>
  //       </amp-story-grid-layer>
  //       <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
  //     </amp-story-page>`;
  // return `
  //   <amp-story-page id="page-${index}" auto-advance-after="7s">
  //     <amp-story-grid-layer template="vertical">
  //       <amp-img src="${srcImg}" alt="${title}" width="900" height="675" layout="responsive"></amp-img>
  //     </amp-story-grid-layer>
  //     <amp-story-grid-layer class="story-page" template="vertical">
  //       <div class="inner-page-wrapper">
  //       <h1>${title}</h1>
  //       </div>
  //     </amp-story-grid-layer>
  //     <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
  //   </amp-story-page>`;
};
const lastStory = (index, srcImg, title, canonical) => {
  const image = srcImg.includes("http")
    ? srcImg
    : general.siteUrl + "/posts/" + srcImg;

  return `<amp-story-page id="page-${index}">
        <amp-story-grid-layer template="fill">
          <amp-img height="1024" src="${image}" alt="${title}" width="1024" class="image-fit-cover" style="color: #FFFFFF;opacity: 1;object-fit: cover;" layout="responsive">
          </amp-img>
        </amp-story-grid-layer>
        <amp-story-grid-layer class="center" template="vertical">
          <div>
            <h1 style="color: #ffffff;font-family: Calistoga;font-size: 1.75em;text-align: center;font-weight:900;text-shadow: 1px 1px 2px black;">
            ${business.brandName}
            </h1>
          </div>
        </amp-story-grid-layer>
        <amp-story-cta-layer><a href="${canonical}">Visit ${business.brandName}</a></amp-story-cta-layer>
      </amp-story-page>`;
};
const theAmpStories = (
  title,
  srcImg,
  mainText,
  postImages,
  canonical,
  headings
) => {
  return `<!DOCTYPE html>
<html amp lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <link rel="canonical" type="text/html" href="${canonical}" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <style amp-boilerplate>
      body {
        -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
        animation: -amp-start 8s steps(1, end) 0s 1 normal both;
      }
      @-webkit-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-moz-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-ms-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @-o-keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
      @keyframes -amp-start {
        from {
          visibility: hidden;
        }
        to {
          visibility: visible;
        }
      }
    </style>
    <noscript>
      <style amp-boilerplate>
        body {
          -webkit-animation: none;
          -moz-animation: none;
          -ms-animation: none;
          animation: none;
        }
      </style>
    </noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async src="https://cdn.ampproject.org/v0/amp-video-0.1.js" custom-element="amp-video">
    </script>
    <script async src="https://cdn.ampproject.org/v0/amp-story-1.0.js" custom-element="amp-story">
    </script>
    <script async src="https://cdn.ampproject.org/v0/amp-font-0.1.js" custom-element="amp-font">
    </script>
    <script async src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" custom-element="amp-analytics">
    </script>
    <script async src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js" custom-element="amp-iframe">
    </script>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Oswald" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Calistoga" rel="stylesheet">
    <style amp-custom>
      body amp-story {
        visibility: unset !important;
      }
      body amp-img{
        width: 100% !important;
        height: 200px !important;
        top: 10px;
        border-radius: 5px;
        border: 2px solid white;
        box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.15);
        position: relative;
      }
      body amp-img:before{
        content: '';
        width: 100%;
        height: 100%;
        display: block;
        position: absolute;
        bottom:0;
        z-index: 3;
        background: rgba(0,0,0,0.3);
      }
      body amp-story-page{
        position: relative;
      }
      body amp-story-page:before{
        content: '';
        width: 100%;
        height:50%;
        display: block;
        position: absolute;
        bottom:0;
        z-index: 3;
        background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 75%);
      }
      .story-page { position:relative; }
      .inner-page-wrapper { 
        position:absolute; width:100%; height:50%; background:linear-gradient(1deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0) 100%);
        bottom:0;
      }
      .inner-page-wrapper h1, .inner-page-wrapper h2, .inner-page-wrapper p { 
        color:#fff; width:90%; margin-left:auto; margin-right:auto; 
      }
      .inner-page-wrapper h1 {
        font-size:28px; font-weight:900; margin-top:0px; background:white; color:black; border-radius:5px; padding:5px 10px; text-align:left;
      }
      .inner-page-wrapper h2 {
        font-size:22px; font-weight:600; background:white; color:black; border-radius:5px; padding:5px 10px; text-align:center;
      }
      .inner-page-wrapper p {
        text-align:center; font-size:16px; font-weight:400; text-shadow:1px 2px black; margin-top:20px;
      }
          :root {
        --color-error: #B00020;
        --color-primary: #005AF0;
      }
      amp-story {
          color: white;
          border: none;
      }
      
      .image-fit-contain img {
        object-fit: contain;
      }
      
      .image-fit-cover img {
        object-fit: cover;
      }
      
      .image-fit-fill img {
        object-fit: fill;
      }
      
      div.center {
        justify-content: center;
        align-items: center;
      }
      
      div.top-center {
        justify-content: center;
        align-items: flex-start;
      }
    
      div.bottom-center {
        justify-content: center;
        align-items: flex-end;
      }
      
      div.center-left {
        justify-content: start;
        align-items: center;
      }
      
      div.top-left {
        justify-content: start;
        align-items: flex-start;
      }
    
      div.bottom-left {
        justify-content: start;
        align-items: flex-end;
      }
      
      div.center-right {
        justify-content: flex-end;
        align-items: center;
      }
      
      div.top-right {
        justify-content: flex-end;
        align-items: flex-start;
      }
    
      div.bottom-right {
        justify-content: flex-end;
        align-items: flex-end;
      }

      .bottom  {
          align-content: end;
      }
      .start {
        align-content: start;
        text-align: left;
      }
      .end {
        align-content: end;
        text-align: right;
      }
      .center {
        align-content: center;
        text-align: center;
      }
      .fill {
        text-align: justify;
      }
      @media screen
        and (max-width: 767px)
        and (min-width: 375px){
            :root {
          --color-error: #B00020;
          --color-primary: #005AF0;
      }
      amp-story {
          color: white;
          border: none;
      }
      .bottom  {
          align-content: end;
      }
      .start {
        align-content: start;
        text-align: left;
      }
      .end {
        align-content: end;
        text-align: right;
      }
      .center {
        align-content: center;
        text-align: center;
      }
      .fill {
        text-align: justify;
      }
    }

    </style>
  </head>
  <body>
    <amp-story title="${title}" publisher="${
    business.brandName
  }" publisher-logo-src="${logos?.postAuthorLogo}" poster-portrait-src="${
    logos?.cardLogo
  }"> 
      ${ampStoryPage(srcImg, title, 1, canonical)}
      ${postImages
        .map((img, indx) =>
          ampStoryPage(
            img,
            headings[indx] || `Visit ${general.siteUrl}`,
            indx + 2,
            canonical
          )
        )
        .join("")}
      ${lastStory(99, srcImg, title, canonical)}
    </amp-story>
  </body>
</html>`;
};

const generateAmpStories = async () => {
  const storiesArray = [];

  postsDatas?.concat(pagesDatas?.allPages).forEach((item, index) => {
    const title = item?.frontmatter?.title;
    const mainText = converter.makeHtml(item?.content);
    const srcImg = item?.frontmatter?.image || logos?.postAuthorLogo;
    const postImages = item?.innerImgs || [];
    const headings = item?.headings || [];
    const canonical = general?.siteUrl + "/" + item?.slug;
    const slug = item?.slug;

    const ampStory = theAmpStories(
      title,
      srcImg,
      mainText,
      postImages,
      canonical,
      headings
    );
    storiesArray.push({ title, slug, canonical, ampStory });
  });

  return storiesArray;
};

module.exports = { generateAmpStories };
