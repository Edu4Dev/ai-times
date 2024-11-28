"use client";
// import { CloudinaryImage } from "@cloudinary/url-gen";
// import {Cloudinary} from '@cloudinary/url-gen';

// const CloudinaryImage = require("@cloudinary/url-gen");
// const quality = require("@cloudinary/url-gen/actions/delivery");
// const auto = require("@cloudinary/url-gen/qualifiers/quality");
// import { quality } from "@cloudinary/url-gen/actions/delivery";
// import { auto } from "@cloudinary/url-gen/qualifiers/quality";
// Create your instance
// const cld = new Cloudinary({
//   cloud: {
//     cloudName: 'demo'
//   },
//   url: {
//     secure: true // force https, set to false to force http
//   }
// });
export default function myImageLoader({ src, width, height, quality }) {
  let finalSrc = "";
  let src01 = "";

  if (!src.includes("https")) src01 = "/" + src;

  finalSrc =
    src01 + `?w=${width || 150}&h=${height || 150}&q=${quality || "auto"}`;

  if (src.includes("cloudinary") && !src.includes("w_")) {
    finalSrc = src.split("/image/upload/");
    finalSrc =
      finalSrc[0] +
      `/q_${quality || "auto"}/w_${width || "620"},f_auto/` +
      finalSrc[1];
  }
  const objReturn = `${finalSrc || "placeholder.png"}`;

  return `${objReturn}`;
}
