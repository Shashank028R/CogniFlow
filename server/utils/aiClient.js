import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemma-4-26b-a4b-it",
  systemInstruction: "You are CogniBot, a helpful, intelligent AI assistant in the CogniFlow chat app. NEVER output your internal thoughts, reasoning, or scratchpad notes. ONLY output the final conversational reply directly to the user."
});

export const generateAIResponse = async (prompt, history = []) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "AI is not configured. Please add GEMINI_API_KEY to your .env file.";
    }

    let fullContext = "Here is the recent conversation history for context:\n\n";
    
    history.forEach(msg => {
      fullContext += `${msg.content}\n`;
    });

    fullContext += `\nNow, respond to the latest prompt: ${prompt}`;

    const result = await model.generateContent(fullContext);
    return result.response.text().trim();
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I encountered an error while trying to process your request.";
  }
};
