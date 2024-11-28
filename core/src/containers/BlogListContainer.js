import React, { useState } from "react";

import Post from "@/components/Post";
import GridHighlight from "@/components/GridHighlight";
import NewsOne from "@/components/NewsOne";

const BlogList = ({
  posts,
  postsToShow,
  city,
  state,
  designType = 0,
  gap = 0,
}) => {
  // const sortedPosts = posts.sort((post1, post2) =>
  //   new Date(post1.date) > new Date(post2.date) ? -1 : 1
  // );

  const [count] = useState({
    prev: 0,
    next: 10,
  });
  const [current] = useState(posts.slice(count.prev, count.next));
  const typeSwitch = [
    "news-grid",
    "grid-post",
    "news-one-wrapper",
    "news-two-wrapper",
  ];
  return (
    <div
      className={typeSwitch[designType]}
      style={{ gap: `${gap}px`, flexBasis: "50%" }}
    >
      {current?.map((post, i) => {
        if (i >= postsToShow) {
          return null;
        }
        if (!post?.frontmatter) return null;

        if (
          !post?.frontmatter?.categories ||
          post?.frontmatter?.categories[0] === "Hide"
        ) {
          return null;
        }
        const x = i + 1;

        let title = post?.frontmatter?.title.replace("{{city}}", city);
        title = title.replace("{{state}}", state);
        const alt = `Link with highlight image, to access post: ${
          title.length > 20 ? title.slice(0, 20) : title
        }`;
        const e = post?.frontmatter?.image.split("/image/upload/");
        // const sizes = x === 1 ? ["w_529", "h_529"] : ["w_259", "h_192"];
        const highlightImage = post?.frontmatter?.image.includes("cloudinary")
          ? e[0] + `/q_65/w_724,f_auto/` + e[1]
          : post?.frontmatter?.image;

        const attrs = {
          number: x,
          slug: post?.slug || "/",
          title: title,
          alt: alt,
          image: highlightImage,
          date: post?.frontmatter?.date,
          description: post?.frontmatter?.description || post?.firstParagraph,
          firstParagraph: post.firstParagraph,
          category:
            post?.frontmatter?.categories[0] || post?.frontmatter?.categories,
        };

        switch (designType) {
          case 0:
            return <Post {...attrs} key={x} />;
          case 1:
            return <GridHighlight {...attrs} key={x} />;
          case 2:
            return <NewsOne {...attrs} key={x} />;
          default:
            return <Post {...attrs} key={x} />;
        }
      })}
    </div>
  );
};

export default BlogList;
