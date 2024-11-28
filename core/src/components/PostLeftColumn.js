import React from "react";
import TOCContainer from "@/containers/TOCContainer";
import Image from "next/image";
import {
  FacebookShareButton,
  FacebookIcon,
  PinterestShareButton,
  PinterestIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
} from "next-share";
import general from "@/content/settings/general.json";
// import { FacebookShare } from "react-share-kit";
import { usePathname } from "next/navigation";

const PostLeftColumn = ({
  promoNOread,
  author,
  postHeadings,
  handleToggle,
  date,
  timeToRead,
}) => {
  const fullDate = new Date(date);
  const [month, day, year] = [
    fullDate.getMonth(),
    fullDate.getDate(),
    fullDate.getFullYear(),
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const pathname = usePathname();

  return (
    <div className={`left-column ${promoNOread ? "none" : ""}`}>
      <div className="post-author post-author-infos desktop-only">
        <br />
        <br />
        <br />
        <br />
        <div className="social-share-btn">
          <FacebookShareButton
            url={general.siteUrl + pathname}
            quote={"Modern Tips."}
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <PinterestShareButton
            url={general.siteUrl + pathname}
            quote={"Modern Tips."}
          >
            <PinterestIcon size={32} round />
          </PinterestShareButton>

          <TwitterShareButton
            url={general.siteUrl + pathname}
            quote={"Modern Tips."}
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <LinkedinShareButton
            url={general.siteUrl + pathname}
            quote={"Modern Tips."}
          >
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>

          <EmailShareButton
            url={general.siteUrl + pathname}
            quote={"Modern Tips."}
          >
            <EmailIcon size={32} round />
          </EmailShareButton>
        </div>
        <p>
          <strong>By {author}</strong>
        </p>
        <hr className="small-row mb0" />
        <p>
          <em>
            Published on{" "}
            <time className="post-author-date date" dateTime={date}>
              {`${monthNames[month]} ${day}, ${year}`}
            </time>
            .
          </em>
        </p>
        <p className="post-author-date read-time">
          <Image
            src={`brandimages/clock.png`}
            alt={"logomark"}
            width={15}
            height={15}
          />{" "}
          {timeToRead} minute read
        </p>
      </div>
      <TOCContainer
        author={author}
        tocs={postHeadings}
        // gtag={gtag}
        display={"desktop"}
        toggle={true}
        handleToggle={handleToggle}
        date={date}
        timeToRead={timeToRead}
      />
    </div>
  );
};

export default PostLeftColumn;
