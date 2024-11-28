import React, { useState, useEffect } from "react";
import slugify from "slugify";
import { usePathname } from "next/navigation";
import { Adsense } from "@ctrl/react-adsense";

import BlogList from "@/containers/BlogListContainer";
import HeaderContainer from "@/containers/HeaderContainer";
import FooterContainer from "@/containers/FooterContainer";

import linkTree from "@/content/settings/linkTree.json";
// import hackPostsData from "@/content/cache/allPostsData.json";
import postsData from "@/content/cache/postsDatas.json";
import integrations from "@/content/settings/integrations.json";
import business from "@/content/settings/business.json";
import general from "@/content/settings/general.json";
import theme from "@/content/settings/theme.json";
import SearchInputContainer from "@/containers/SearchInputContainer";
import Image from "next/image";
import SeoContainer from "@/containers/SeoContainer";

const CategoryPage = () => {
  const [btnGClick, handleBtnGClick] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const [userInfos, setUserInfos] = useState(null);

  const locationURL = usePathname().slice(1, -1);
  const pathnameVAR = usePathname();
  const pathname = pathnameVAR === "/" ? "home" : pathnameVAR.slice(1, -1);

  // Variável para armazenar os slugs dos posts já exibidos
  let usedPosts = [];

  // Filtra os posts pela categoria atual
  let category = "";
  const categoryPosts = [];
  postsData.forEach((facp) =>
    facp.frontmatter.categories.forEach((catt) => {
      if (
        slugify(catt).toLowerCase() === locationURL &&
        new Date(facp.frontmatter.date) < new Date()
      ) {
        category = catt || "Uncategorized";
        categoryPosts.push(facp);
      }
    })
  );

  // Separar featured posts e posts comuns
  const featuredPosts = categoryPosts.filter(
    (e) => e.frontmatter?.featuredPost === true
  );
  usedPosts = [...usedPosts, ...featuredPosts.map((post) => post.slug)]; // Armazena slugs de posts destacados

  const cleanedPosts = categoryPosts.filter(
    (e) => e.frontmatter?.featuredPost === false && !usedPosts.includes(e.slug) // Verifica se o post já foi usado
  );

  // Agora, vamos criar as diferentes seções/grids para os posts
  const lastPosts = cleanedPosts.slice(0, 5); // Últimos posts
  const morePosts = cleanedPosts.slice(5, 11); // Mais posts
  const morePosts2 = cleanedPosts.slice(11, 17); // Mais posts

  // Combina featured e outros posts, sem repetir
  let arrPosts = featuredPosts
    .concat(cleanedPosts)
    .slice(0, theme?.postsSettings?.postsToShow || 10);

  const adClient =
    integrations?.googleIntegration?.adsClientID === "" ||
    integrations?.googleIntegration?.adsClientID === "ca-pub-"
      ? false
      : true;

  const gtagCounter = (id) => {
    if (btnGClick === null && typeof window !== "undefined" && adClient) {
      window?.gtag("event", id);
      handleBtnGClick(null);
    }
  };

  const fetchApiData = async () => {
    const res = await fetch(`${general?.siteUrl}/geolocation`);
    const data = await res.json();
    setUserInfos(data);
    setState(data?.geo?.subdivision?.name || "California");
    return setCity(data?.geo?.city || "Los Angeles");
  };

  const adsSlot = integrations?.googleIntegration?.adsSlot;
  const adsClientID = integrations?.googleIntegration?.adsClientID;
  const noAdsConfig = (adsSlot,
  adsClientID === "" && typeof adsSlot,
  adsClientID !== "string")
    ? false
    : true;

  useEffect(() => {
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
  }, [city, state]);

  const infos = {
    slug: "/" + pathname,
    title: `${category} - ${business?.brandName}`,
    description: "page?.frontmatter?.description" || business?.brandDescription,
    author: business?.brandName,
    keywords: [] || business?.brandKeywords,
    questions: [],
    topology: "page",
    articleUrl: `${general?.siteUrl}/${pathname}`,
  };

  return (
    <>
      <div className="page-wrapper">
        <SeoContainer killSeo={false} data={infos} />
        <HeaderContainer
          opt={{
            bgOne: "transparent",
            bgTwo: "transparent",
            classes: "header-block",
            pageHasMenu: true,
          }}
          hasMenu={false}
          gtag={"gtag"}
          gtagCounter={gtagCounter}
          pathname={pathname}
        />
        <div className="hero-wrapper">
          <div className="hero search-hero">
            <Image
              src={`brandimages/hero-img.jpg`}
              alt={"Hero image"}
              width={1024}
              height={650}
              className="hero-img"
            />
            <div className="row-config inner-hero">
              <h1>Search {business?.brandName}</h1>
              <SearchInputContainer />
            </div>
          </div>
        </div>
        <main className="main-container-wrapper">
          <div className="main-container">
            {/* Grid de posts destacados */}
            {featuredPosts?.length > 3 && (
              <BlogList
                posts={featuredPosts}
                postsToShow={4}
                designType={1}
                city={city || "Los Angeles"}
                state={state || "CA"}
                gap={5}
              />
            )}

            <div className={`ads-row ${noAdsConfig ? "none" : ""} `}>
              <span
                style={{
                  color: "gray",
                  fontSize: "10px",
                  textAlign: "center",
                  width: "100%",
                  display: "block",
                }}
              >
                - Advertisement -
              </span>

              <div className={`ads`}>
                <Adsense
                  slot={integrations?.googleIntegration?.adsSlot}
                  client={integrations?.googleIntegration?.adsClientID}
                  style={{
                    display: "block",
                    width: "720px",
                    height: "90px",
                    margin: "0 auto",
                  }}
                  format="auto"
                  layout="responsive"
                />
              </div>
            </div>

            <div className="row main-index-grid">
              <div className="first-row">
                {/* BlogList para o layout de "Popular Category" */}
                {/* Grid de mais posts */}
                {lastPosts?.length > 2 && (
                  <>
                    <div className="tag-news-wrapper">
                      <h4 className="tag-news primary">
                        Popular in {category}
                      </h4>
                      <hr className="blue" />
                    </div>
                    <BlogList
                      postsToShow={4}
                      posts={lastPosts}
                      city={city || "Los Angeles"}
                      state={state || "CA"}
                      designType={2}
                      gap={10}
                    />
                  </>
                )}
                {morePosts?.length > 1 && morePosts2?.length ? (
                  <div className="tag-news-wrapper">
                    <h4 className="tag-news primary">
                      Read more {category} posts
                    </h4>
                    <hr className="blue" />
                  </div>
                ) : null}

                <div className="news-column">
                  {/* BlogList para o primeiro bloco de "Health" */}
                  {morePosts?.length > 1 && morePosts2?.length > 1 ? (
                    <>
                      <BlogList
                        posts={morePosts}
                        postsToShow={3}
                        city={city || "Los Angeles"}
                        state={state || "CA"}
                        designType={3}
                        gap={10}
                      />
                      <BlogList
                        posts={morePosts2}
                        postsToShow={3}
                        city={city || "Los Angeles"}
                        state={state || "CA"}
                        designType={3}
                        gap={10}
                      />
                    </>
                  ) : null}
                </div>
              </div>

              <div className="home-sidebar">
                <div className="tag-news-wrapper">
                  <h4 className="tag-news">Stay Connected</h4>
                  <hr />
                </div>
                {linkTree.linkTree.map((lt, it) => (
                  <a
                    key={it}
                    href={lt.href}
                    className="social-icon"
                    target="_blank"
                    rel="nofollow noreferrer"
                  >
                    <Image
                      src={`brandimages/${slugify(lt.label)}.svg`}
                      alt={lt.label}
                      width={30}
                      height={30}
                      style={{ objectFit: "cover", float: "left" }}
                    />
                    <p>
                      <span>{lt.label}</span>
                    </p>
                  </a>
                ))}
                <br />
                <div
                  className={`ads-row styckyadshome ${
                    noAdsConfig ? "none" : ""
                  } `}
                  style={{
                    display: "block",
                    width: "300px",
                    height: "300px",
                    margin: "0 auto",
                  }}
                >
                  <span
                    style={{
                      color: "gray",
                      fontSize: "10px",
                      textAlign: "center",
                      width: "100%",
                      display: "block",
                    }}
                  >
                    - Advertisement -
                  </span>
                  <Adsense
                    slot={integrations?.googleIntegration?.adsSlot}
                    client={integrations?.googleIntegration?.adsClientID}
                    style={{
                      display: "block",
                      width: "300px",
                      height: "300px",
                      margin: "0 auto",
                    }}
                    format="auto"
                    layout="responsive"
                  />
                </div>
                <br />
              </div>
            </div>
          </div>
        </main>
        <FooterContainer />
      </div>
    </>
  );
};

export default CategoryPage;
