const path = require("path");
const env = path.join(__dirname, "../../../../.env");
const DigestPipeline = require("..");
require("dotenv").config({
  path: env,
});

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    initialPipe: { deleteGPTWorkflows: true },
    promptDigestion: true,
    finalPipe: {
      generateGPTWorkFlow: true,
      syncPublicFolder: true,
    },
  },
  { draftsPath: null },
  {
    chatGPT: process.env.CHATGPT_API_KEY,
    cloudinary: process.env.CLOUDINARY_API_SECRET,
  },
  true, // Automatic Post
  true // Debug
);
pipeline.run();
