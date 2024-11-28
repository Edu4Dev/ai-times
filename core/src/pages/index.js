import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { mostPopularCategory } from "../lib/getCategory";
import postsDataJSON from "@/content/cache/postsDatas.json";
import general from "@/content/settings/general.json";
import integrations from "@/content/settings/integrations.json";
import { Adsense } from "@ctrl/react-adsense";
// import theme from "@/content/settings/theme.json";
import business from "@/content/settings/business.json";
import logos from "@/content/settings/logos.json";
import linkTree from "@/content/settings/linkTree.json";
// import Link from "next/link";

import ScrollTop from "@/components/ScrollTop";
import SeoContainer from "@/containers/SeoContainer";
const BlogList = dynamic(() => import("../containers/BlogListContainer"));

import HeaderContainer from "@/containers/HeaderContainer";
import FooterContainer from "@/containers/FooterContainer";
import SearchInputContainer from "@/containers/SearchInputContainer";
import slugify from "../lib/prompt-digestion/utils/slugify";

const brandCardImage = logos.cardLogo?.includes("http")
  ? logos.cardLogo
  : general?.scope + "/" + logos.cardLogo;

const infos = {
  slug: "",
  title: `${"Home"} - ${business?.brandName}`,
  description: business?.brandDescription,
  author: business?.brandName,
  brandPerson: business?.brandName,
  featuredImage: brandCardImage,
  questions: [],
  topology: "page",
  articleUrl: general?.siteUrl,
};

const Home = () => {
  const [btnGClick, handleBtnGClick] = useState(null);
  const [userInfos, setUserInfos] = useState(null);
  const [city, setCity] = useState(null);
  const [state, setState] = useState(null);
  const pathnameVAR = usePathname();
  const pathname = pathnameVAR === "/" ? "home" : pathnameVAR.slice(1, -1);
  const adsSlot = integrations?.googleIntegration?.adsSlot;
  const adsClientID = integrations?.googleIntegration?.adsClientID;

  const noAdsConfig = (adsSlot,
  adsClientID === "" && typeof adsSlot,
  adsClientID !== "string")
    ? false
    : true;
  // Função para remover posts já usados
  const removeUsedPosts = (usedPosts, posts) => {
    return posts.filter((post) => !usedPosts.includes(post.slug));
  };

  // Filtra apenas os posts válidos (não futuros) e organizados pela data
  const posts = postsDataJSON.filter((fps) => new Date(fps.date) <= new Date());

  // Lista de slugs de posts já usados
  let usedPosts = [];

  // Limpeza de posts (remover posts destacados)
  const cleanedPosts = posts.filter(
    (e) => e.frontmatter?.featuredPost === false
  );
  const featuredPosts = posts
    .filter((e) => e.frontmatter?.featuredPost === true)
    .slice(0, 4);
  usedPosts = [...usedPosts, ...featuredPosts.map((post) => post.slug)];

  // Posts da categoria mais popular
  let popularCategoryPosts = posts.filter((post) =>
    post.frontmatter.categories.includes(mostPopularCategory)
  );
  popularCategoryPosts = removeUsedPosts(usedPosts, popularCategoryPosts).slice(
    0,
    4
  );
  usedPosts = [...usedPosts, ...popularCategoryPosts.map((post) => post.slug)];

  // Posts de uma categoria específica escolhida manualmente (Health)
  const manualCategory = general?.homeCategory;

  // Primeiro grupo de posts "Health"
  let manualCategoryPosts1 = posts.filter((post) =>
    post.frontmatter.categories.includes(manualCategory)
  );
  manualCategoryPosts1 = removeUsedPosts(usedPosts, manualCategoryPosts1).slice(
    0,
    3
  );
  usedPosts = [...usedPosts, ...manualCategoryPosts1.map((post) => post.slug)];

  // Segundo grupo de posts "Health"
  let manualCategoryPosts2 = posts.filter((post) =>
    post.frontmatter.categories.includes(manualCategory)
  );
  manualCategoryPosts2 = removeUsedPosts(usedPosts, manualCategoryPosts2).slice(
    0,
    3
  );
  usedPosts = [...usedPosts, ...manualCategoryPosts2.map((post) => post.slug)];

  const fetchApiData = async () => {
    const res = await fetch(`${general?.scope}/geolocation`);
    const data = await res.json();
    setUserInfos(data);
    setState(data?.geo?.subdivision?.name || "California");
    return setCity(data?.geo?.city || "Los Angeles");
  };

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

  return (
    <div className="index-page">
      <Head>
        {featuredPosts.map((fif) => (
          <link
            key={fif.slug}
            rel="preload"
            href={fif.featuredImage}
            as="image"
          />
        ))}
      </Head>
      <SeoContainer killSeo={false} data={infos} />
      <div className="page-wrapper">
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
            {/* BlogList para o layout de grid (últimos posts destacados) */}
            <BlogList
              posts={featuredPosts}
              postsToShow={4}
              city={city || "Los Angeles"}
              state={state || "CA"}
              designType={1}
              gap={5}
            />

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
                <div className="tag-news-wrapper">
                  <h4 className="tag-news primary">
                    Popular in {mostPopularCategory}
                  </h4>
                  <hr className="blue" />
                </div>
                {/* BlogList para o layout de "Popular Category" */}
                <BlogList
                  posts={popularCategoryPosts}
                  postsToShow={4}
                  city={city || "Los Angeles"}
                  state={state || "CA"}
                  designType={2}
                  gap={10}
                />

                <div className="tag-news-wrapper">
                  <h4 className="tag-news primary">{general?.homeCategory}</h4>
                  <hr className="blue" />
                </div>
                <div className="news-column">
                  {/* BlogList para o primeiro bloco de "Health" */}
                  <BlogList
                    posts={manualCategoryPosts1}
                    postsToShow={3}
                    city={city || "Los Angeles"}
                    state={state || "CA"}
                    designType={3}
                    gap={10}
                  />

                  {/* BlogList para o segundo bloco de "Health" */}
                  <BlogList
                    posts={manualCategoryPosts2}
                    postsToShow={3}
                    city={city || "Los Angeles"}
                    state={state || "CA"}
                    designType={3}
                    gap={10}
                  />
                </div>
              </div>

              <div className="home-sidebar">
                <div className="tag-news-wrapper">
                  <h4 className="tag-news">Stay Connected</h4>
                  <hr />
                </div>
                {linkTree.linkTree.map((lt, il) => (
                  <a
                    key={il}
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
      </div>
      <div className="wrapper-box"></div>
      <FooterContainer />
      <ScrollTop right={20} bottom={20} />
    </div>
  );
};

export default Home;
