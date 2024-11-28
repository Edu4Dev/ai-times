const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    essentialFiles: { decapCMS: true },
    finalPipe: { syncPublicFolder: true },
  },
  {},
  {},
  false,
  true
);
pipeline.run();
