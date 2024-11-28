const DigestPipeline = require("..");
const digestConfig = {
  staticFiles: {
    atom: true,
  },
  finalPipe: { syncPublicFolder: true },
};

// Execute the main function to start the build process
const pipeline = new DigestPipeline(digestConfig, {}, {}, false, false);
pipeline.run();
