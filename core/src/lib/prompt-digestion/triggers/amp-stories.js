const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline({
  staticFiles: {
    ampStories: true,
  },
  finalPipe: { syncPublicFolder: true },
});
pipeline.run();
