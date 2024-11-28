const path = require("path");
// Define the paths
const contentFolder = path.join(__dirname, "../../../../../content");
// Load configuration and data files
const authorsJson = require(contentFolder + "/cache/authorsData.json");

/**
 * Generates prompts for post creation.
 * It combines various aspects such as categories, author information, links, and the content body.
 *
 * @param {object} frontmatter - The frontmatter of the post.
 * @param {string} content - The main content of the post.
 * @param {boolean} autoPost - Indicates if the post is being processed automatically.
 * @param {object} webScrape - Contains the Web Scrape data, if available.
 * @returns {object} An object containing all the necessary prompts for post generation.
 */
async function prompts(
  universalPromptTxt,
  authorsData,
  draftContent,
  mdTransformPrompt,
  jsonResponse,
  i18n,
  autoPost,
  webScrape
) {
  return {
    universalPrompt: universalPrompt(universalPromptTxt), // Universal prompt for the blog post
    contentPrompt: contentPrompt(mdTransformPrompt || null, i18n), // Content generation guidelines
    author: authorPrompt(authorsData, autoPost), // Author information
    scrapeContentPrompt: webScrape ? scrapeContentPrompt(webScrape) : null,
    draftPrompt: draftPrompt(draftContent || null),
    responsePrompt: responsePrompt(jsonResponse || "{}"),
  };
}

/**
 * Generates the universal prompt for post creation.
 * It defines the guidelines that will be followed when generating a blog post.
 *
 * @returns {string} The universal prompt for blog post generation.
 */
function universalPrompt(body) {
  return body
    ? `
You write blog posts.
To generate a post you will follow these prompts, sources and steps:
[PROMPT 1] - Universal Prompt [Command to generate every blog posts.]: ${
        body || ""
      }`
    : "You write blog posts.";
}
/**
 * Generates the content prompt with detailed instructions for the blog post.
 * This includes guidelines for headlines, paragraphs, length, SEO, and citations.
 *
 * @returns {string} The content settings prompt for blog post generation.
 */
function contentPrompt(settings, i18n) {
  return `
[PROMPT 2] - Content Settings [use this to prepare to write the content body]:

i18n: Check the source main post language.
i18n: If the source content has a different i18n language then '${
    i18n || "en-us"
  }', your answer must be in the post language (Content reference in english will generate english post, spanish content has to generate spanish post, etc).
${settings}
Blog content: Avoid generate poor blog post. Do your best.
    `;
}

/**
 * Determines the author of the post.
 * If in auto-post mode, it randomly selects an author from the list if there are multiple.
 * Otherwise, it uses the author defined in the frontmatter if available.
 *
 * @param {object} frontmatter - The frontmatter of the post.
 * @param {boolean} autoPost - Indicates if the post is being processed automatically.
 * @returns {string} The prompt for the author's name.
 */
function authorPrompt(authorData, autoPost) {
  let author = { name: "", content: "" };

  // Caso haja apenas um autor, seleciona esse autor
  if (authorData.length === 1) {
    author = {
      name: authorData[0]?.frontmatter?.title || null,
      content: authorData[0]?.content || null,
    };
  }
  // Caso haja mais de um autor, seleciona aleatoriamente quando autoPost for verdadeiro
  else if (authorData.length > 1 && autoPost) {
    const randomIndex = Math.floor(Math.random() * authorData.length);
    author = {
      name: authorData[randomIndex]?.frontmatter?.title || null,
      content: authorData[randomIndex]?.content || null,
    };
  }

  if (!authorData.length && authorsJson.length) {
    author = {
      name: authorsJson[randomIndex]?.frontmatter?.title || null,
      content: authorsJson[randomIndex]?.content || null,
    };
  }
  let name = "";
  let content = "";
  if (!authorData.length) {
    const authorDataFetch =
      authorsJson.map((au, ia) => au.frontmatter.title === author) || null;
    name = authorDataFetch ? authorDataFetch.title : author || "Random Name";
    content = authorDataFetch ? authorDataFetch.content : "";
  } else {
    name = author.name;
    content = author.content;
  }

  return `
[PROMPT 3] - This is  the Post Author's Information Card
Author Name: ${name || "Create a new name"}
Author Prompt: ${content || "no content"}`;
}

/**
 * Generates a draft prompt based on the content of the post.
 *
 * @param {string} content - The user prompt for the post.
 * @returns {string} The user prompt for content generation.
 */
function draftPrompt(content) {
  if (!content) return null;
  return content
    ? `[Prompt 4] - User Prompt [User command to generate the post.]: ${content}`
    : "";
}

/**
 * Generates a response prompt structure based on the JSON response template.
 *
 * @param {string} {
  "title": "string",
  "author": "string",
  "categories": ["array values"],
  "tag": ["array values"],
  "body": "string (i18n: generate the response in the language of the source post content if it is in another language. content must be in markdown format; avoid use the post title within the content, I don't want the main title inside body content; avoid using any heading/title (#) in the very first line of the body content)"
  } - The template for the JSON response.
 * @returns {string} The text formatted response prompt.
 */
function responsePrompt(json) {
  return `
[RESPONSE] - Please provide the result in **pure JSON format and MD format within the body string value**, without additional explanations or headers, or explanations. 
Avoid using any other code, such as \`\`\`\ (do not use this) or other thing, give me only the pure JSON format. Again, please avoid answer using structures like \`\`\`json{}, this is not I want. I want just return the json text "{...}" directly.
Ensure the response is a valid and pure JSON object with the following structure: 
${json}`;
}

/**
 * Generates a prompt for regenerating a blog post from mixed content.
 * The content may include extraneous elements such as headers, footers,
 * privacy policy text, copyright notices, and other unrelated text.
 *
 * @param {object} scrape - An object containing the following properties:
 *   - {string} content - The mixed content that includes both relevant blog post material and non-relevant text.
 *   - {string} scrapeLink - The source URL where the content was obtained.
 * @returns {string} A formatted prompt that instructs the generation of a clean blog post
 *                   from the specified mixed content.
 */
function scrapeContentPrompt(scrape) {
  console.log("scrapeContentPrompt::scrape");
  console.log(scrape);

  return `
[BLOG POST REGENERATOR] - The following text contains a blog post mixed with page structure content such as header, footer, privacy policy text, copyright and some random text. 
Separe what is blog post content and generate a new blog post based on this relevant content.
DIRTY Content: ${scrape.content}
URL Source: ${scrape.scrapeLink}
`;
}

module.exports = prompts;
