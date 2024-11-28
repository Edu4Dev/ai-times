import React from "react";
import Image from "next/image";

import business from "@/content/settings/business.json";
import general from "@/content/settings/general.json";
import linkTree from "@/content/settings/linkTree.json";

import SeoContainer from "@/containers/SeoContainer";
import HeaderContainer from "@/containers/HeaderContainer";
import FooterContainer from "@/containers/FooterContainer";
import SearchInputContainer from "@/containers/SearchInputContainer";

const infos = {
  slug: "/404",
  title: `Error Page - ${business?.brandName}`,
  description: "This is a 404 error page.",
  author: business?.brandName,
  questions: [],
  topology: null,
  articleUrl: `${general?.siteUrl}/404`,
};

const NotFoundPage = ({ type }) => {
  return (
    <div className="error-page">
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
              <h1>Error 404</h1>
              <SearchInputContainer />
            </div>
          </div>
        </div>
      </div>
      <div className="wrapper-link-tree">
        <h2>Contact Us</h2>
        <ul className="link-tree">
          {linkTree.linkTree.map((lt, it) => (
            <li key={it}>
              <a href={lt.href} target="_blank" rel="nofollow noreferrer">
                {lt.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="wrapper-box"></div>
      <FooterContainer />
    </div>
  );
};

export default NotFoundPage;
