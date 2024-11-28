const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    initialPipe: { deleteOldCrons: true },
    staticFiles: {
      indexSitemap: true,
      postSitemap: true,
      pageSitemap: true,
      feedsSitemaps: true,
      atom: true,
      rss: true,
      ampStories: true,
    },
    finalPipe: { schedulingPosts: true, syncPublicFolder: true },
  },
  {},
  null,
  false,
  true
);
pipeline.run();
