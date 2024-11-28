import React, { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parse } from "node-html-parser";
import { useCampaignContext } from "../services/context";

import business from "@/content/settings/business.json";
import general from "@/content/settings/general.json";
import integrations from "@/content/settings/integrations.json";

import SeoContainer from "@/containers/SeoContainer";
import PostContainer from "@/containers/PostContainer";
import HeaderContainer from "@/containers/HeaderContainer";
import FooterContainer from "@/containers/FooterContainer";
import DraftMode from "@/components/DraftMode";

const SinglePost = ({ post, killSEO = false, draftMode = false }) => {
  const [promoVisitState, setPromoVisitState] = useState(null);
  const [btnGClick, setBtnGClick] = useState(null);
  const [readMore, setReadMore] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [userInfos, setUserInfos] = useState(null);
  const { setCampaignMode } = useCampaignContext();
  const getRef = useSearchParams().getAll("ref");
  const doc = parse(post.content);
  const pathname = usePathname() === "/" ? "home" : usePathname().slice(1, -1);
  const fetchApiData = async () => {
    const res = await fetch(`${general?.siteUrl}/geolocation`);
    const data = await res.json();
    // setMensen(data);
    setUserInfos(data);
    setState(data?.geo?.subdivision?.name || "California");
    return setCity(data?.geo?.city || "Los Angeles");
  };
  // console.log("doc::::");
  // console.log(doc);

  const pSelect = doc?.querySelector("p");
  const excerpt = pSelect?.childNodes[0]?._rawText || "";

  let title = post?.frontmatter?.title?.replace(
    "{{city}}",
    city || "Los Angeles"
  );
  title = title?.replace("{{state}}", state || "California");

  const postHeadings =
    doc?.querySelectorAll("h2").length > 0
      ? doc?.querySelectorAll("h2")
      : doc?.querySelectorAll("h3");

  let headingsTexts = [];
  postHeadings?.forEach((e) => (headingsTexts += e?.innerText + ", "));

  // ads terms
  const terms = headingsTexts?.slice(0, -1);
  let termsString;
  let adsTerms;
  if (post?.frontmatter?.tag) {
    adsTerms = post?.frontmatter?.tag.toString();
  } else {
    adsTerms = postHeadings;
  }

  if (
    adsTerms === "Test Term 1, Test Term 2, Test Term 3, Test Term 4" ||
    adsTerms === "" ||
    !adsTerms
  ) {
    termsString = terms;
  } else {
    termsString = adsTerms;
  }

  const infos = {
    slug: "/" + post?.slug,
    title: killSEO ? "NO SEO" : `${title} - ${business?.brandName}`,
    description: excerpt || post?.frontmatter?.description,
    author: post?.frontmatter?.author || business?.brandName,
    featuredImage: post?.frontmatter?.image.includes("http")
      ? post?.frontmatter?.image
      : `${general?.siteUrl}/posts/${post?.frontmatter?.image}`,
    datePublished: post?.frontmatter?.date || general?.publishedDate,
    keywords: termsString || post?.frontmatter?.tag || business?.brandKeywords,
    questions: [],
    topology: "post",
    articleUrl: `${general?.siteUrl}/${post.slug}`,
    articleBody: doc,
  };
  const adClient =
    integrations?.googleIntegration?.adsClientID === "" ||
    integrations?.googleIntegration?.adsClientID === "ca-pub-"
      ? false
      : true;

  const gtagCounter = (id) => {
    if (btnGClick === null && typeof window !== "undefined" && adClient) {
      window?.gtag("event", id);
      setBtnGClick(null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      getRef?.length === 1 && promoVisitState === null
        ? setPromoVisitState(true)
        : null;
      getRef?.length === 1 && promoVisitState === null
        ? setReadMore(false)
        : null;
    }
    // Fetch data from API if `location` object is set
    if (!city || !state) {
      fetchApiData()
        .then(function (response) {
          if (!response.ok) {
            return null;
          }
        })
        .catch(function () {
          return null;
        });
    }
  }, [city, state, promoVisitState, getRef]);

  return (
    <div className="single-post post-container">
      <DraftMode on={draftMode} isDraft={post?.frontmatter?.draft} />
      <SeoContainer killSeo={killSEO ? true : false} data={infos} />
      <HeaderContainer
        opt={{
          bgOne: "transparent",
          bgTwo: "transparent",
          classes: "header-block",
          pageHasMenu: false,
        }}
        // mainMenu={mainMenu}
        hasMenu={false}
        // hasMenu={index?.hasMenu}
        // scheduleLink={index.calendlyLink}
        gtag={"gtag"}
        gtagCounter={gtagCounter}
        pathname={pathname}
      />

      <PostContainer
        siteKeywords={business.brandKeywords}
        highlightImage={post?.frontmatter?.image || null}
        authorImg={"imgHolder"}
        date={post?.frontmatter?.date || null}
        author={post?.frontmatter?.author || business?.brandName}
        html={post?.content || null}
        title={title || post?.frontmatter?.title}
        slug={post?.slug}
        category={
          post?.frontmatter?.categories[0] ||
          post?.frontmatter?.categories ||
          []
        }
        wordCount={10}
        promoVisitState={promoVisitState}
        setReadMore={setReadMore}
        readMore={readMore}
        tag={post?.frontmatter?.tag || []}
        excerpt={excerpt}
        parseContent={doc}
        relatedPosts={[]}
        city={city}
        state={state}
        killSEO={killSEO}
      />
      <FooterContainer />
    </div>
  );
};

export default SinglePost;
