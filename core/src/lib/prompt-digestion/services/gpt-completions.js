const dJSON = require("dirty-json");
const OpenAI = require("openai");
const debugMe = require("../utils/debug-me");

// // Função para enviar os prompts para o ChatGPT
async function chatGPT(gptModel = "gpt-4o", prompts, apiKey, debug) {
  debugMe(debug, "ChatGPT", { gptModel, prompts, apiKey, debug });
  // Configuração do cliente OpenAI
  const openai = new OpenAI({
    apiKey: apiKey, // Sua chave da API
  });
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are an assistant for a blog." },
        { role: "user", content: prompts },
      ],
      model: gptModel,
    });
    // TODO: Remove answer treatment
    // Create a new place
    // Leave only services in services
    const content = chatCompletion?.choices[0]?.message?.content;

    debugMe(debug, "ChatGPT Response", content);

    try {
      // Parseando o conteúdo JSON
      const parsedContent = dJSON.parse(content);

      // Sanitizar apenas `title`, `author`, `categories` e `tags`
      const sanitizedTitle = parsedContent?.title?.replace(/\n+/g, " ") || null;
      const sanitizedAuthor =
        parsedContent?.author?.replace(/\n+/g, " ") || null;
      const sanitizedCategories =
        parsedContent?.categories?.map((cat) => cat.replace(/\n+/g, " ")) ||
        null;
      const sanitizedTags =
        (parsedContent?.tags || parsedContent?.tag)?.map((tag) =>
          tag.replace(/\n+/g, " ")
        ) || [];

      // Deixar o campo `body` sem alterações
      const bodyContent = parsedContent?.body || null;

      const res = {
        title: sanitizedTitle,
        author: sanitizedAuthor,
        categories: sanitizedCategories,
        tags: sanitizedTags,
        body: bodyContent, // Não modificar o corpo
      };
      debugMe(debug, "Function Return", res);
      return res;
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      console.error("Conteúdo retornado:", content);
      throw parseError;
    }
  } catch (error) {
    console.error("Erro ao se comunicar com o ChatGPT:", error);
    throw error;
  }
}

module.exports = chatGPT;
