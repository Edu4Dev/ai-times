const path = require("path");
const env = path.join(__dirname, "../../../../.env");
require("dotenv").config({
  path: env,
});
const DigestPipeline = require("..");

// const digestPaths = {
//   paths: null,
// };

// Execute the main function to start the build process
const pipeline = new DigestPipeline(
  {
    initialPipe: { deleteOldCrons: true },
    promptDigestion: true,
  },
  {
    apiKeys: {
      chatGPT: process.env.CHATGPT_API_KEY,
      cloudinary: process.env.CLOUDINARY_API_SECRET,
    },
  },
  false,
  false
);
pipeline.run();
