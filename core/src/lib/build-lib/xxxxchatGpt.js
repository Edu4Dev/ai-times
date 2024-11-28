require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

export default async function handler(req, res) {
  // Verificar se o método da requisição é POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const apiKey = process.env.CHATGPT_API_KEY;
  const endpoint = "https://api.openai.com/v1/completions";

  const {
    authorName,
    authorPrompt,
    mainPrompt,
    mainImagePrompt,
    additionalImagePrompts,
    universalPrompts,
  } = req.body;

  const prompt = `
      Author Name: ${authorName}
      Author Prompt: ${authorPrompt}
      Main Prompt: ${mainPrompt}
      Main Image Prompt: ${mainImagePrompt}
      Additional Image Prompts: ${additionalImagePrompts.join(", ")}
      Universal Prompts: ${universalPrompts.join(", ")}
    `;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Verificar se houve erro na resposta da API do OpenAI
    if (response.status !== 200) {
      return res.status(response.status).json({ message: data.error.message });
    }

    const result = {
      title: data.choices[0].text.trim().split("\n")[0], // Ajuste conforme necessário
      body: data.choices[0].text.trim(),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao se comunicar com o ChatGPT:", error);
    res.status(500).json({ message: "Erro ao se comunicar com o ChatGPT" });
  }
}
