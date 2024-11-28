import { visit } from "unist-util-visit";

const reWriteCloudinary = options => tree => {
  return visit(
    tree,
    // only visit p tags that contain an img element
    node =>
      node.tagName === "p" && node.children.some(n => n.tagName === "img"),
    node => {
      const children = node.children;
      const src = children[0]?.properties?.src || null;
      let finalSrc = src;
      if (src?.includes("cloudinary")) {
        finalSrc = src.split("/image/upload/");
        finalSrc = finalSrc[0] + `/q_90/w_840,f_auto/` + finalSrc[1];
        children[0].properties.src = finalSrc;
      }
    }
  );
};

export default reWriteCloudinary;
