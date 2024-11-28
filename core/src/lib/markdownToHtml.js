// import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
// import { rehypeExtendedTable } from "rehype-extended-table";
// import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeRaw from "rehype-raw";
import { unified } from "unified";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeExternalLinks from "rehype-external-links";
// import rehypeAutoAds from "rehype-auto-ads";
import reWriteCloudinary from "../lib/reWriteCloudinary";
// import { rehypeCloudinaryImageSize } from "@bradgarropy/rehype-cloudinary-image-size";

// import html from "remark-html";
import headings from "remark-autolink-headings";
// import slug from "remark-slug";
import remarkOembed from "remark-oembed";
import rehypeStringify from "rehype-stringify";
import supersub from "remark-supersub";

// const options = {
//   adCode: "<div id='rampjs_slot5'></div>",
//   countFrom: 94,
//   paragraphInterval: 99,
// };
export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(supersub)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(remarkOembed)
    .use(rehypeAutolinkHeadings)
    .use(rehypeRaw)
    .use(reWriteCloudinary)
    // .use(() => tree => console.log("zum" + JSON.stringify(tree, null, 2)))
    .use(rehypeSanitize)
    // .use(rehypeCloudinaryImageSize)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeExternalLinks, {
      target: "_blank",
      properties: {
        class: "external-link",
      },
      protocols: ["https"],
    })
    .use(headings, {
      behavior: "wrap",
      linkProperties: {
        className: "anchor",
      },
    })
    // .use(rehypeAutoAds, options)
    .process(markdown);

  return String(result) || markdown;
}
