const DigestPipeline = require("..");

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    initialPipe: { deleteOldCrons: true, deleteGPTWorkflows: true },
    finalPipe: {
      schedulingPosts: true,
      generateGPTWorkFlow: true,
    },
  },
  {},
  null,
  false,
  true
);
pipeline.run();
