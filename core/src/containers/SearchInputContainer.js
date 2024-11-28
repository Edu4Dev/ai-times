import React from "react";
import SearchInput from "../components/SearchInput";
const general = require("../../../content/settings/general.json");
const custom = require("../../../content/settings/custom.json");

const SearchInputContainer = () => {
  const siteUrl = general.siteUrl.split("https://")[1];
  const cleansiteUrl = siteUrl.includes("www.")
    ? general.siteUrl.split("www.")[1]
    : siteUrl;
  return (
    <SearchInput siteUrl={cleansiteUrl} subDomain={custom.rampSubdomain} />
  );
};
export default SearchInputContainer;
