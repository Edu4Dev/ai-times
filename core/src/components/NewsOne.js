import React from "react";
import Link from "next/link";
import slugify from "slugify";

const NewsOne = ({
  slug,
  date,
  title,
  alt,
  description,
  image,
  number,
  category,
  firstParagraph,
}) => {
  return (
    <div id={`item-${number}`} className={`post highlight-0${number}`}>
      <Link href={slug} passHref className="media" alt={alt} aria-label={alt}>
        <div
          className="media colorME"
          style={{
            backgroundImage: image.includes("http")
              ? `url(${image})`
              : `url(/posts/${image})`,
          }}
        ></div>
      </Link>
      <div className="main-post-inner caption">
        <Link href={slug} passHref className="post-link" alt={title}>
          {title.length >= 120 && (number === 4 || number === 5) ? (
            <>
              <h2 className="title title-desktop-only">{title}</h2>
              <h2 className="title title-mobile-only">
                {title.length >= 90 ? title.slice(0, 90) : title}...
              </h2>
            </>
          ) : (
            <h2 className="title">{title}</h2>
          )}
        </Link>
        <p className="excerpt">
          {number === 1
            ? firstParagraph.slice(0, 225)
            : firstParagraph.slice(0, 75)}
          ...
        </p>
      </div>
    </div>
  );
};

export default NewsOne;
