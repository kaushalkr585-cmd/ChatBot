import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-flash";


const API_KEY = "AIzaSyCw5ZprPvJuyQZjX8Ul_pLJxk_He03ifJU";

async function runChat(prompt) {
  if (!prompt || !prompt.trim()) {
    return "";
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
     
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    console.log("User:", prompt);

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    const text = response.text();
    console.log("Gemini:", text);

    return text;
  } catch (err) {
    console.error("Gemini API error:", err);
    
    return "Sorry, something went wrong while contacting the AI (maybe quota limit). Please try again in a bit.";
  }
}

export default runChat;
