import pagesData from "@/content/cache/allPagesData.json";
import postsData from "@/content/cache/allPostsData.json";
import draftJSON from "@/content/cache/allPostsDraftMode.json";
import scheduledPosts from "@/content/cache/scheduledPosts.json";

export function getDataBySlug(slug) {
  if (!slug) return null;
  let fileContents;
  // concat posts n pages n filter by slug, return content
  try {
    fileContents =
      postsData?.allPosts
        ?.concat(pagesData.allPages)
        .filter((fc) => fc.slug === slug) || null;
  } catch (err) {
    fileContents = false;
  }
  return fileContents[0];
}

export function getDraftDataBySlug(slug) {
  if (!slug) return null;
  let fileContents;
  // concat posts n pages n filter by slug, return content
  try {
    fileContents =
      draftJSON?.concat(scheduledPosts).filter((fc) => fc.slug === slug) ||
      null;
  } catch (err) {
    fileContents = false;
  }
  return fileContents[0];
}
// const date = format(new Date(data.date), "MMMM' 'dd', 'yyyy", {
//   locale: usa,
// });
