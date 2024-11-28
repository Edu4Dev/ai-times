import React from "react";
import Link from "next/link";
import Image from "next/image";

import logos from "@/content/settings/logos.json";
import mainMenu from "@/content/settings/mainMenu.json";
import general from "@/content/settings/general.json";
import business from "@/content/settings/business.json";
import theme from "@/content/settings/theme.json";

const Footer = ({ topCategories }) => {
  return (
    <footer>
      <div className="main-footer">
        <div className="left footer-bottom">
          <Link href="/">
            <Image
              src={logos.markLogo || "/brandimages/logomark.png"}
              alt={"logo mark"}
              width={52}
              height={52}
            />
          </Link>
        </div>
        {theme?.header?.bottomMainMenu ? (
          <div className="right footer-bottom">
            <ul style={{ flexBasis: "50%", marginBottom: "auto" }}>
              <h4>Meet Us</h4>
              {mainMenu?.mainMenu?.map((item, itemIndx) => (
                <li key={itemIndx}>
                  <Link href={"/" + item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
            <ul
              className="top-five"
              style={{ flexBasis: "50%", marginBottom: "auto" }}
            >
              <h4>Top Five Categories</h4>
              {topCategories?.map((cat, catIndx) => (
                <li key={catIndx}>
                  <Link href={"/" + cat.href}>
                    {cat.label} <span>({cat.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="bottom new-footer">
        <hr className="gray" />
        <p>
          <small>{general.footerText}</small>
        </p>
        <br />
        <p>
          © {new Date().getFullYear()} {business.brandName}. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
