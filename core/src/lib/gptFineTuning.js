const fs = require("fs");
const FormData = require("form-data");
const fetch = require("cross-fetch");
const path = require("path");
const matter = require("gray-matter"); // Importando 'matter'
const contentFolder = path.join(__dirname, "../../../content");

require("dotenv").config({
  path: contentFolder + "/.env.development",
});

const cachePath = path.join(contentFolder, "cache");
const aiSettingsPath = path.join(contentFolder, "settings/ai.json");
const authorsFolder = path.join(contentFolder, "ai_authors");
const allPostsData = path.join(contentFolder, "cache/allPostsData.json");
const postsData = path.join(contentFolder, "cache/postsData.json");
const aiSettings = require(aiSettingsPath);

// Função para ler e atualizar o ai.json
function updateAiCacheFile(fileId) {
  const aiData = JSON.parse(fs.readFileSync(aiSettingsPath, "utf-8"));
  aiData.fileId = fileId;
  fs.writeFileSync(aiSettingsPath, JSON.stringify(aiData, null, 2), "utf-8");
  console.log(
    "Arquivo ai.json atualizado com sucesso com o novo fileId:",
    fileId
  );
}

// Função para gerar o arquivo de treinamento `.jsonl`
function generateTrainingFile(data, filePath) {
  const jsonlData = data
    .map((item) =>
      JSON.stringify({
        prompt: item.prompt,
        completion: item.completion,
      })
    )
    .join("\n");

  fs.writeFileSync(filePath, jsonlData, "utf-8");
  console.log(`Arquivo de treinamento gerado com sucesso em: ${filePath}`);
}

// Função para fazer o upload do arquivo de treinamento
async function uploadTrainingFile(filePath) {
  const apiKey = process.env.CHATGPT_API_KEY;

  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("purpose", "fine-tune");

  try {
    const response = await fetch("https://api.openai.com/v1/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      console.log("File uploaded successfully:", data);
      updateAiCacheFile(data.id);
    } else {
      console.error("Erro ao fazer upload do arquivo:", data);
    }

    return data;
  } catch (error) {
    console.error("Erro durante o upload do arquivo:", error);
  }
}

// Função para gerar dados de treinamento no formato .jsonl
// Função para gerar dados de treinamento no formato .jsonl
async function generateTrainingData() {
  const authors = fs.readdirSync(authorsFolder);
  const universalPrompt = aiSettings.body;

  let trainingData = [];

  // Adiciona o prompt universal apenas uma vez no início
  if (universalPrompt) {
    const universalPromptItem = {
      prompt: `Instructions for an AI assistant designed to generate blog posts and return responses in JSON format.`,
      completion: `
      - The AI should consider multiple prompts in the process of generating posts.
      - There is a "Universal Prompt" that must be used in every blog post, which sets the general tone and theme for the blog.
      - There is also an "Author Prompt," which is specific to each author and should be used when generating posts for that author. 
      - Ensure that the AI pays attention to using the correct "Author Prompt" based on the author information provided in the prompt.
      - The AI should integrate the Universal Prompt to establish the blog environment feel and mention the blog name naturally in the generated post.
      - The authors may sometimes use phrases like "Here at [blog name], we..." or any other within their posts.
      - When generating blog posts, make sure to reference internal blog posts by adding links to related topics. 
      - Use the slug of internal content for generate links within blog posts to create cross-references between similar posts.

      Universal Prompt: ${universalPrompt.trim()}
      
      This is the JSON response model:{title:'string',author:'string',categories:['array values'],tag:['array values'],body:'string md format content post'}
      `,
    };
    trainingData.push(universalPromptItem);
  }

  const responseFormat = {
    prompt: `Provide a JSON response in the following format:`,
    completion: `{title:'string',author:'string',categories:['array values'],tag:['array values'],body:'string'}`,
  };

  trainingData.push(responseFormat);

  // Itera sobre cada arquivo de autor
  for (const author of authors) {
    const authorPath = path.join(authorsFolder, author);

    if (path.extname(author) === ".md") {
      const { frontmatter, content } = await readFileAndExtractFrontmatter(
        authorPath
      );

      // Cria o prompt apenas com as informações do autor, sem o universalPrompt
      const prompt = `Author: ${frontmatter.title}`;

      const trainingItem = {
        prompt: prompt.trim(),
        completion: `\n\n${content.trim()}`,
      };

      trainingData.push(trainingItem);
    }
  }

  const allBlogPostsData = {
    prompt: `
            Provide all categories within the blog posts.
            Provide the complete data for all blog posts, including:
              - title
              - slug
              - date
              - author
              - categories
              - tag
              - image
              - featuredPost
              - featuredImage
              - innerImgs
              - headings
              - content
              `,
    completion: {
      categories: allPostsData.categories,
      allPostsData: postsData,
    },
  };
  trainingData.push(allBlogPostsData);
  // const imgGeneration = {
  //   prompt: `
  //           Provide all categories within the blog posts.
  //           Provide the complete data for all blog posts, including:
  //             - title
  //             - slug
  //             - date
  //             - author
  //             - categories
  //             - tags
  //             - image
  //             - featuredPost
  //             - featuredImage
  //             - innerImgs
  //             - headings
  //             - content
  //             `,
  //   completion: {
  //     categories: allPostsData.categories,
  //     allPostsData: postsData,
  //   },
  // };
  // trainingData.push(imgGeneration);

  /*

Follow the image generation model below when generating image prompts. 
Ensure that the image prompt is focused and descriptive.

Image Prompt: [Command to generate the main image post.]

  */
  // console.log(trainingData);

  return trainingData;
}

// Função para ler o arquivo e extrair o frontmatter e conteúdo
async function readFileAndExtractFrontmatter(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const matterContent = matter(fileContent);
    const { data, content } = matterContent;

    return { frontmatter: data, content };
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, error);
    throw error;
  }
}

// Função principal para orquestrar o processo
async function processTrainingFlow() {
  try {
    // Gerar os dados de treinamento
    const trainingData = await generateTrainingData();

    // Caminho do arquivo de treinamento
    const trainingFilePath = path.join(cachePath, "ai_training_data.jsonl");

    // Gera o arquivo de treinamento
    generateTrainingFile(trainingData, trainingFilePath);

    // Faz o upload do arquivo gerado
    const response = await uploadTrainingFile(trainingFilePath);
    console.log("Processo finalizado com sucesso:", response);
  } catch (error) {
    console.error("Erro no processo:", error);
  }
}

// Executar o processo
const gptTrainingModel = processTrainingFlow();
module.exports = { gptTrainingModel };
