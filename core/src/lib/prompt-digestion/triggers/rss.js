const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    staticFiles: {
      rss: true,
    },
    finalPipe: { syncPublicFolder: true },
  },
  {},
  {},
  false,
  false
);
pipeline.run();
