const fs = require("fs-extra");
const matter = require("gray-matter");
const { parse } = require("node-html-parser");
const path = require("path");
const slugify = require("slugify");
const showdown = require("showdown");
const { log } = require("console");

const contentFolder = path.join(__dirname, "../../../content");
const postFolder = path.join(__dirname, "../../../content/posts");
const pageFolder = path.join(__dirname, "../../../content/pages");
const promptFolder = path.join(__dirname, "../../../content/ai_drafts");
const authorFolder = path.join(__dirname, "../../../content/ai_authors");

function* readMDFiles(dir, type) {
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      yield* readMDFiles(filePath);
    } else if (path.extname(file.name) === ".md") {
      const isWindowsOS = path.sep === "\\";
      const folderSlash = isWindowsOS ? "\\" : "/";
      const readFile = fs.readFileSync(filePath, "utf8");

      const fileContents = {
        path: dir,
        fileName: file.name,
        parentFolder: dir.split(folderSlash).pop(),
        content: type === "prompt" ? readFile + "\r\nBody\r\n" : readFile,
      };
      // if (type === "prompt") {
      //   console.log("fileContents>>>>>>>>", fileContents);
      // }

      const matterContent = matter(fileContents?.content, { excerpt: true });

      if (!matterContent?.content || matterContent.isEmpty) {
        console.error("Error: Invalid frontmatter content.");
        process.exit(1);
      }

      const { data, content } = matterContent;
      const date = data?.layout === "post" ? data?.date : new Date();
      // if (type === "prompt") {

      //   console.log({
      //     slug: fileContents.fileName.replace(/\.md$/, ""),
      //     date,
      //     frontmatter: { ...data, date },
      //     filePath,
      //     fileName: fileContents.fileName,
      //     parentFolder: fileContents.parentFolder,
      //     draftMode: data?.draft || false,
      //     content,
      //   });
      // }
      yield {
        slug: fileContents.fileName.replace(/\.md$/, ""),
        date,
        frontmatter: { ...data, date },
        filePath,
        fileName: fileContents.fileName,
        parentFolder: fileContents.parentFolder,
        draftMode: data?.draft || false,
        content,
        excerpt: matterContent.excerpt,
      };
    }
  }
}

async function mdDatas(allMDdata, draftMode = false) {
  return JSON.stringify(
    allMDdata.map((ps) => {
      const converter = new showdown.Converter();
      const htmlParse = parse(converter.makeHtml(ps?.content));

      const innerImgs = htmlParse
        .querySelectorAll("img")
        .map((img) => img.getAttribute("src"));

      const innerHeadingstext = htmlParse
        .querySelectorAll("h1, h2, h3, h4, h5, h6")
        .map((heading) => heading.text.trim())
        .filter((text) => text !== "Citations:");

      const firstParagraph = htmlParse.querySelector("p")?.textContent || "";

      return {
        frontmatter: ps?.frontmatter,
        slug: ps?.slug,
        date: ps?.frontmatter.date || new Date(),
        featuredImage: ps?.frontmatter.image || "cover.jpg",
        innerImgs: innerImgs || [],
        headings: innerHeadingstext || [],
        content: ps?.content,
        filePath: ps?.filePath,
        fileName: ps?.fileName,
        parentFolder: ps?.parentFolder,
        excerpt: ps?.excerpt,
        draftMode,
        firstParagraph: firstParagraph,
      };
    })
  );
}

async function createJsonAllMDFiles() {
  const files = [];

  try {
    if (fs.existsSync(postFolder)) {
      for (const file of readMDFiles(postFolder, "post")) {
        files.push(file);
      }
    }
    if (fs.existsSync(pageFolder)) {
      for (const file of readMDFiles(pageFolder, "page")) {
        files.push(file);
      }
    }
    if (fs.existsSync(promptFolder)) {
      for (const file of readMDFiles(promptFolder, "prompt")) {
        files.push(file);
      }
    }
    if (fs.existsSync(authorFolder)) {
      for (const file of readMDFiles(authorFolder, "author")) {
        files.push(file);
      }
    }
  } catch (error) {
    console.error("Error reading files:", error);
    // process.exit(1);
  }

  const dataOrdered = files.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? -1 : 1
  );

  const validData = dataOrdered.filter((file) => !file.frontmatter.draft);

  const allPagesData = files.filter((file) =>
    file.parentFolder.includes("pages")
  );
  const allPostsData = validData.filter(
    (file) =>
      file.parentFolder.includes("posts") &&
      new Date(file.frontmatter.date) <= new Date()
  );
  const scheduledPosts = validData.filter(
    (file) =>
      file.parentFolder.includes("posts") &&
      new Date(file.frontmatter.date) > new Date()
  );
  const allPostsDraftMode = dataOrdered
    .filter((file) => file.frontmatter.draft)
    .concat(scheduledPosts);

  const allAIauthorsData = files.filter((file) =>
    file.parentFolder.includes("ai_authors")
  );

  const allPromptsData = files.filter((file) =>
    file.parentFolder.includes("ai_drafts")
  );

  const postsCategories = [
    ...new Set(
      allPostsData.flatMap((file) =>
        file.frontmatter.categories.map((category) =>
          slugify(category).toLowerCase()
        )
      )
    ),
  ];

  const allPagesDataJSON = JSON.stringify({ allPages: allPagesData });
  const allPostsDataJSON = JSON.stringify({
    categories: postsCategories,
    allPosts: allPostsData,
  });

  const writeJson = (fileName, data, description) => {
    const filePath = path.join(contentFolder, "cache/" + fileName);
    // if (fileName === "prompts.json") {
    //   console.log("data:::::::::::");
    //   console.log(data);
    // }

    try {
      fs.writeFileSync(filePath, data);
      console.log(`✔️ [${description}] - ${fileName} stored successfully.`);
    } catch (error) {
      console.error(`❌ [${description}] - ERROR`);
      process.exit(1);
    }
  };

  writeJson("allPagesData.json", allPagesDataJSON, "Pages MD to JSON");

  writeJson("allPostsData.json", allPostsDataJSON, "Posts MD to JSON");

  try {
    const postsData = await mdDatas(allPostsData);
    writeJson("postsDatas.json", postsData, "Posts MD to JSON");

    const draftPostsData = await mdDatas(allPostsDraftMode, true);
    writeJson("allPostsDraftMode.json", draftPostsData, "Draft Posts to JSON");

    const scheduledPostsData = await mdDatas(scheduledPosts);
    writeJson(
      "scheduledPosts.json",
      scheduledPostsData,
      "Scheduled Posts to JSON"
    );

    const authorsData = await mdDatas(allAIauthorsData);

    writeJson("authorsData.json", authorsData, "Ai Authors Data to JSON");

    const promptsData = await mdDatas(allPromptsData);
    writeJson("prompts.json", promptsData, "Prompts Data to JSON");
  } catch (error) {
    console.error("❌ [MD Datas] - ERROR\nLOG:", error);
    process.exit(1);
  }

  return process.exit(0);
}

module.exports = {
  readMDFiles,
  createJsonAllMDFiles,
};
