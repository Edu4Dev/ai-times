// const fs = require("fs");
const fetch = require("cross-fetch");
// const path = require("path");
// const axios = require("axios");
// const yaml = require("js-yaml");

// // // Carregar configurações do config.yml
// // const configPath = "./config.yml";
// // let config;

// // try {
// //   config = yaml.load(fs.readFileSync(configPath, "utf8"));
// // } catch (e) {
// //   console.error("Erro ao carregar config.yml:", e);
// //   process.exit(1);
// // }

// // // Função para ler o conteúdo do arquivo JSON de cache com prompts universais
// // const cacheFilePath = path.join(__dirname, config.ai_draft_settings.cache_file);
// // let promptsCache;

// // try {
// //   promptsCache = JSON.parse(fs.readFileSync(cacheFilePath, "utf8"));
// // } catch (e) {
// //   console.error("Erro ao carregar o arquivo ai.json:", e);
// //   process.exit(1);
// // }

// // // Função para monitorar a pasta de drafts
// // const draftsFolder = path.join(
// //   __dirname,
// //   config.ai_draft_settings.drafts_folder
// // );
// // const postTemplateFolder = path.join(
// //   __dirname,
// //   config.ai_draft_settings.post_template
// // );

// // async function xxx(){
// //     const filePath = path.join(draftsFolder, filename);
// //     if (path.extname(filename) === '.md') {
// //       processDraft(filePath);
// //     }
// // }
// // Função que processa o draft, envia prompts para a IA (ChatGPT) e cria o post final
// async function processDraft(filePath) {
//   try {
//     const draftContent = fs.readFileSync(filePath, "utf8");
//     const frontmatter = extractFrontmatter(draftContent);
//     const authorPrompt =
//       promptsCache[frontmatter[config.ai_draft_settings.ai_author_field]] || "";
//     const mainPrompt = frontmatter[config.ai_draft_settings.prompt_field] || "";
//     const mainImagePrompt =
//       frontmatter[config.ai_draft_settings.main_image_prompt_field] || "";
//     const additionalImagePrompts =
//       frontmatter[config.ai_draft_settings.additional_image_prompts_field] ||
//       [];

//     // Enviar prompts para o ChatGPT
//     const generatedContent = await chatGPT({
//       authorPrompt,
//       mainPrompt,
//       mainImagePrompt,
//       additionalImagePrompts,
//       universalPrompts: promptsCache.universal,
//     });

//     // Gerar o conteúdo do post com base no frontmatter do draft e resposta da IA
//     const postContent = generatePost(frontmatter, generatedContent);

//     // Salvar o post gerado na pasta de posts
//     const postFilename = `${path.basename(filePath, ".md")}-post.md`;
//     const postFilePath = path.join(postTemplateFolder, postFilename);
//     fs.writeFileSync(postFilePath, postContent, "utf8");
//     console.log(`Post gerado com sucesso: ${postFilePath}`);
//   } catch (err) {
//     console.error("Erro ao processar draft:", err);
//   }
// }

// // Função para extrair o frontmatter do markdown
// function extractFrontmatter(markdown) {
//   const frontmatterRegex = /^---\n([\s\S]+?)\n---/;
//   const match = markdown.match(frontmatterRegex);
//   if (!match) return {};

//   const frontmatter = yaml.load(match[1]);
//   return frontmatter;
// }
const path = require("path");
const contentFolder = path.join(__dirname, "../../.env.development");
require("dotenv").config({
  path: contentFolder,
});
// // Função para enviar os prompts para o ChatGPT
async function chatGPT(prompts) {
  const apiKey = process.env.CHATGPT_API_KEY; // Coloque sua chave da API aqui
  const endpoint = "https://api.openai.com/v1/chat/completions"; // Endpoint para o ChatGPT

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4", // Modelo GPT-3, ajuste conforme necessário
        // prompt: prompts,
        messages: [
          { role: "system", content: "You are an assistant for a blog." },
          { role: "user", content: prompts }, // prompts deve ser o conteúdo da mensagem
        ],
        max_tokens: 2000, // Ajuste conforme necessário
        temperature: 0.7, // Ajuste conforme necessário
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);

    // Verificação se data.choices[0] existe e contém uma mensagem
    if (
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      return {
        title: data.choices[0].message.content.trim().split("\n")[0], // O título é a primeira linha
        body: data.choices[0].message.content.trim(), // O corpo é a resposta inteira
      };
    } else {
      throw new Error("A resposta da API não contém o campo 'message'.");
    }
  } catch (error) {
    console.error("Erro ao se comunicar com o ChatGPT:", error);
    throw error;
  }
}

// async function dallE(prompt) {
//   const apiKey = "YOUR_OPENAI_API_KEY"; // Coloque sua chave da API aqui
//   const url = "https://api.openai.com/v1/images/generations"; // URL da API do DALL·E

//   const body = {
//     prompt: prompt,
//     n: 1, // Número de imagens a serem geradas
//     size: "1600x1024", // Tamanho da imagem
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${apiKey}`,
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error(`Erro: ${response.statusText}`);
//     }

//     const data = await response.json();
//     console.log("Imagem gerada com sucesso:", data);
//     return data.data[0].url; // Retorna o URL da imagem gerada
//   } catch (error) {
//     console.error("Erro ao gerar a imagem:", error);
//   }
// }

// // Função para gerar o conteúdo final do post com base no frontmatter e no conteúdo gerado
// function generatePost(frontmatter, generatedContent) {
//   const postFrontmatter = {
//     title: frontmatter.title || generatedContent.title,
//     author: frontmatter.author,
//     category: frontmatter.category || "Uncategorized",
//     tags: frontmatter.tags || [],
//     date: new Date().toISOString(),
//     draft: false,
//   };

//   const postBody = generatedContent.body;

//   return `---\n${yaml.dump(postFrontmatter)}---\n\n${postBody}`;
// }
module.exports = { chatGPT };
