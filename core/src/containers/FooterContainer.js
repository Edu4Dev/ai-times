import React from "react";
import Footer from "@/components/Footer";
import { sortedCategories } from "../lib/getCategory";
import slugify from "../lib/prompt-digestion/utils/slugify";

const FooterContainer = () => {
  const topCategories = sortedCategories.slice(0, 5).map((e) => {
    return { href: slugify(e.category), label: e.category, count: e.count };
  });
  return (
    <div className="footer-wrapper">
      <Footer topCategories={topCategories} />
    </div>
  );
};
export default FooterContainer;
