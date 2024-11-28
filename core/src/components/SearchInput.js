import React from "react";
import Image from "next/image";

const SearchInput = ({ siteUrl, subDomain }) => {
  return (
    <form
      action={"https://" + subDomain + "." + siteUrl + "/serp"}
      method="get"
    >
      <input type="text" name="q" id="here" placeholder="Search" />
      <button className="search-icon">
        <Image
          src={`brandimages/search-icon.png`}
          alt={"search-icon"}
          width={26}
          height={26}
          className="search-hold"
        />
        <Image
          src={`brandimages/search-icon-hover.png`}
          alt={"search-icon-hover"}
          width={26}
          height={26}
          className="search-hover"
        />
      </button>
    </form>
  );
};
export default SearchInput;
