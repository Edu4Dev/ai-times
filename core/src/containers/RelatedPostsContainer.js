import React from "react";
import RelatedPosts from "@/components/RelatedPosts";
import slugify from "slugify";
const RelatedPostsContainer = ({
  mainPostSlug,
  relatedPosts,
  from,
  to,
  city,
  state,
}) => {
  return (
    <>
      {relatedPosts.map((rp, rind) => {
        if (rind >= from && rind <= to) {
          if (rp.slug === mainPostSlug) return null;
          const categorySlug = slugify(
            rp?.frontmatter?.categories[0]
          ).toLowerCase();
          let titleRp = rp?.frontmatter?.title?.replace(
            "{{city}}",
            city || "Los Angeles"
          );

          titleRp = titleRp?.replace("{{state}}", state || "California");
          return (
            <RelatedPosts
              categorySlug={categorySlug}
              slug={rp.slug}
              image={rp?.frontmatter?.image}
              category={rp?.frontmatter?.categories[0]}
              title={titleRp}
              key={rind}
            />
          );
        }
      })}
    </>
  );
};

export default RelatedPostsContainer;
