const fetch = require("cross-fetch");
const debugMe = require("../utils/debug-me");
// TODO: Universal Prompt
// TODO: Translate and jsDocs
// TODO: Remove hack
async function dallE(prompt, apiKey, debug) {
  debugMe(debug, "DALL-E Prompt", { prompt, apiKey });
  // Configuração do cliente OpenAI
  // const apiKey = process.env.CHATGPT_API_KEY; // Coloque sua chave da API aqui
  const url = "https://api.openai.com/v1/images/generations"; // URL da API do DALL·E

  const body = {
    prompt:
      prompt +
      "; Create a photorealistic image. Not use text, words and phrases in the created images, not at all, only images. Avoid images with text, please!",
    n: 1, // Número de imagens a serem geradas
    size: "1792x1024", // Tamanho da imagem
    model: "dall-e-3",
    quality: "standard",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Erro: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Imagem gerada com sucesso:", data);
    return data.data[0].url; // Retorna o URL da imagem gerada
  } catch (error) {
    console.error("Erro ao gerar a imagem:", error);
  }
}

module.exports = dallE;
