const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    essentialFiles: { scss: true },
  },
  {},
  {},
  false,
  false
);
pipeline.run();
