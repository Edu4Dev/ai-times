import React, { useState } from "react";

import scheduledPosts from "@/content/cache/scheduledPosts.json";
import draftJSON from "@/content/cache/allPostsDraftMode.json";

import { getDraftDataBySlug } from "@/src/lib/getDatas";
import markdownToHtml from "@/src/lib/markdownToHtml";
import SinglePost from "@/src/templates/single-post";

import RestrictedPageContainer from "@/containers/RestrictedPageContainer";

const DraftPost = (mdDraftFile) => {
  const [password, setPassword] = useState(null);
  if (mdDraftFile.content === "") return null;
  if (mdDraftFile?.parentFolder !== "posts") return null;
  // if password set
  function setNewPassword(newPass) {
    setPassword(newPass);
  }
  if (!password)
    return <RestrictedPageContainer setPassword={setNewPassword} />;

  return <SinglePost post={mdDraftFile} draftMode={true} killSEO={true} />;
};

export default DraftPost;

export const getStaticProps = async (draftContext) => {
  if (!draftContext) {
    throw new Error("Error: No !context!");
  }
  if (!draftContext.params) {
    throw new Error("Error: No !context.params!");
  }

  const draftSlug = draftContext.params.slug;
  if (!draftSlug) {
    throw new Error("Error: No !slug!");
  }
  const mdDraftFileData = getDraftDataBySlug(draftSlug);
  let contentDraft = await markdownToHtml(mdDraftFileData?.content || "");
  return {
    props: {
      ...mdDraftFileData,
      content: contentDraft,
    },
  };
};

export const getStaticPaths = async () => {
  const draftPostsSlugs = [
    ...new Set(
      draftJSON
        .concat(scheduledPosts)
        .map((po) => po?.slug)
        .flat()
    ),
  ];
  const concatDraftPaths = draftPostsSlugs;
  let draftPaths = [];
  concatDraftPaths.forEach((cat) => {
    draftPaths.push({ params: { slug: cat } });
  });
  return {
    paths: draftPaths,
    fallback: false,
  };
};
