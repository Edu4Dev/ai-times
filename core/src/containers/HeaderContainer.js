import React, { useState, useRef } from "react";
import { useCampaignContext } from "../services/context";

import logos from "@/content/settings/logos.json";

import Header from "@/components/Header";

const HeaderContainer = ({
  mainMenu,
  opt,
  hasMenu,
  scheduleLink,
  gtag,
  gtagCounter,
  pathname,
}) => {
  const [refState, setRefState] = useState(false);
  const wrapperRef = useRef(null);
  const [promoVisitState, setPromoVisitState] = useState(null);
  const [readMore, setReadMore] = useState(null);
  const { campaignMode } = useCampaignContext();

  const menuActive = refState ? "visible" : "not-visible";
  const navClasses = "main-nav menu-state-" + menuActive;
  function handleRefState(e) {
    e.preventDefault();
    setRefState(!refState);
  }

  const logoHeader = opt ? opt.logoHeader : null;
  const logoDimensions = logos?.mainLogoWH.split("x");
  const logoW = logoDimensions[0];
  const logoH = logoDimensions[1];

  return (
    <Header
      promoVisitState={promoVisitState}
      logoW={logoW}
      logoH={logoH}
      pageHasMenu={opt.pageHasMenu}
      refState={refState}
      handleRefState={handleRefState}
      logoComponent={logoHeader}
      mainMenu={mainMenu}
      wrapperRef={wrapperRef}
      bgOne={opt.bgOne || "#e9e9ed"}
      hasMenu={hasMenu}
      scheduleLink={scheduleLink}
      gtagCounter={gtagCounter}
      pathname={pathname}
      menuActive={menuActive}
      campaignMode={campaignMode}
      navClasses={navClasses}
    />
  );
};
export default HeaderContainer;
