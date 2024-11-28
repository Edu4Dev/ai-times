import React, { useEffect, useState, useRef } from "react";
import { Adsense } from "@ctrl/react-adsense";
import integrations from "@/content/settings/integrations.json";
import theme from "@/content/settings/theme.json";
import { renderToString } from "react-dom/server";

import SinglePostWrapper from "@/components/SinglePostWrapper";
import allPostsData from "@/content/cache/allPostsData.json";
import custom from "@/content/settings/custom.json";

const PostContainer = ({
  highlightImage,
  authorImg,
  date,
  author,
  html,
  category,
  title,
  slug,
  promoVisitState,
  setReadMore,
  readMore,
  excerpt,
  parseContent,
  city,
  killSEO,
  state,
  siteKeywords,
  tag,
  setCampaignMode,
}) => {
  const [toggle, setToggle] = useState(false);
  const injectionJSref = useRef(null);
  const doc = parseContent;
  const postHeadings =
    doc?.querySelectorAll("h2").length > 0
      ? doc?.querySelectorAll("h2")
      : doc?.querySelectorAll("h3");

  function handleToggle() {
    return setToggle(!toggle);
  }
  const timeToRead = (text) => {
    const words = text.split(" ");
    const minutes = Math.floor(words.length / 200) + 1;
    return minutes;
  };

  const headingAds = renderToString(
    <div className={`ads-inner-post`}>
      {integrations?.googleIntegration?.adsClientID &&
      integrations?.googleIntegration?.adsSlot ? (
        <Adsense
          slot={integrations?.googleIntegration?.adsSlot}
          client={integrations?.googleIntegration?.adsClientID}
          style={{ display: "block", width: "300px", height: "300px" }}
          format="auto"
          layout="responsive"
        />
      ) : null}
    </div>
  );
  const relatedPosts = allPostsData.allPosts
    .filter((post) => post?.frontmatter?.categories[0] === category)
    .slice(0, 10);
  if (theme.postsSettings.adsInsidePost) {
    const h2Count = doc?.querySelectorAll("h2").length;
    const h3Count = doc?.querySelectorAll("h3").length;
    doc?.querySelectorAll("h2").forEach((heading, index) => {
      if (h2Count <= 13) return null;

      if (index === 8) {
        heading.insertAdjacentHTML("beforebegin", headingAds);
      }
    });
    doc?.querySelectorAll("h3").forEach((heading, index) => {
      if (h3Count <= 12) return null;

      if (index === 8) {
        heading.insertAdjacentHTML("beforebegin", headingAds);
        // console.log("h3Count <= 17::::");
        // console.log(h3Count <= 17);
      }
    });
  }

  const content = doc;
  // console.log("content");
  // console.log(content.toString());

  // const content = useRemarkSync(doc || "", {
  //   rehypeReactOptions: {
  //     passNode: {
  //       h2: (props) => {
  //         return console.log(props.node);
  //       },
  //     },
  //   },
  // });
  // console.log(content);
  // const searchReplace =
  //   reduce && postHeadings[reduce]?.id
  //     ? `<h2 id="${postHeadings[reduce]?.id}`
  //     : null;
  // const replacedHtml = `${ReactDOMServer.renderToString(<div id='rampjs_slot1'></div>)}${html}`;
  const promoNOread = promoVisitState === true && readMore === false;
  const promoNEVERread = promoVisitState === true && readMore !== null;
  const noPromoNEVERread = promoVisitState === false && readMore === null;

  let termsCount = tag.length <= 5;
  let termsString = [];
  postHeadings.forEach((x) =>
    x?.innerText.split(" ").length <= 1 ? null : termsString.push(x?.innerText)
  );
  termsString = termsCount ? tag.concat(termsString) : tag.concat(siteKeywords);
  termsString =
    termsString?.length >= 6
      ? termsString?.slice(0, 5).toString()
      : termsString;

  const script = `<script id="js-injection">
          (function () {
            function rampjsInt () {
              (function(w,r){w[r]=w[r]||function(){(w[r]['q']=w[r]['q']||[]).push(
                arguments)},w[r]['t']=1*new Date})(window,'_rampJs');
                _rampJs({ testMode: ${custom.rampTestMode}, "targetDivs":["rampjs_slot1","rampjs_slot5"], 
                terms: "${termsString}", init: {segment: "${custom.rampSegment}"} });
            }
            rampjsInt();
            console.log('ramp init');
          })();
        </script>`;
  useEffect(() => {
    if (injectionJSref) {
      // creates a document range (grouping of nodes in the document). In this case, we instantiate it as empty, on purpose
      const range = document.createRange();
      // creates a mini-document (lightweight version), in our range with our script in it
      const documentFragment = range.createContextualFragment(script);
      // appends it on the same level of annex div - so that it renders in the correct location
      injectionJSref.current.appendChild(documentFragment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [injectionJSref]);

  return (
    <SinglePostWrapper
      highlightImage={highlightImage}
      authorImg={authorImg}
      date={date}
      author={author}
      category={category}
      title={title}
      slug={slug}
      promoVisitState={promoVisitState}
      setReadMore={setReadMore}
      readMore={readMore}
      topic={tag[0] || "General"}
      excerpt={excerpt}
      promoNOread={promoNOread}
      promoNEVERread={promoNEVERread}
      noPromoNEVERread={noPromoNEVERread}
      postHeadings={postHeadings}
      handleToggle={handleToggle}
      timeToRead={timeToRead(doc.text)}
      toggle={toggle}
      replacedHtml={content}
      relatedPosts={relatedPosts}
      city={city}
      state={state}
      killSEO={killSEO}
      injectionJSref={injectionJSref}
    />
  );
};

export default PostContainer;
