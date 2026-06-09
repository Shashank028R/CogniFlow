import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ 
  model: "gemma-4-26b-a4b-it",
  systemInstruction: "You are CogniBot, a helpful, intelligent AI assistant in the CogniFlow chat app. NEVER output your internal thoughts, reasoning, or scratchpad notes. ONLY output the final conversational reply directly to the user."
});

export const generateAIResponse = async (prompt, history = [], fileUrl = null) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return "AI is not configured. Please add GEMINI_API_KEY to your .env file.";
    }

    let fullContext = "System: You are CogniBot, a helpful, intelligent AI assistant in the CogniFlow chat app. CRITICAL INSTRUCTION: You MUST wrap your final user-facing response inside <response> tags. Example: <response>Hello there!</response>. You can write whatever thoughts or reasoning you want before the tags, but ONLY the content inside <response> will be shown to the user.\n\nHere is the recent conversation history for context:\n\n";
    
    history.forEach(msg => {
      fullContext += `${msg.content}\n`;
    });

    fullContext += `\nNow, respond to the latest prompt: ${prompt}`;
    
    const parts = [fullContext];

    if (fileUrl) {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = response.headers.get('content-type') || 'image/jpeg';
        
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      } catch (e) {
        console.error("Error fetching image for AI:", e);
        parts.push("\n[System Note: The user attached a file, but it could not be downloaded for analysis.]");
      }
    }

    const result = await model.generateContent(parts);
    const text = result.response.text();

    let match = text.match(/<response>([\s\S]*?)(?:<\/response>|$)/i);
    if (match && match[1]) {
      let responseText = match[1].trim();
      responseText = responseText.replace(/^`+|`+$/g, '').trim();
      return responseText;
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0 && !line.trim().startsWith('*'));
    if (lines.length > 0) {
      return lines[lines.length - 1].replace(/^`+|`+$/g, '').replace(/<response>/i, '').trim();
    }
    
    return text.replace(/^`+|`+$/g, '').replace(/<response>/i, '').trim();
  } catch (error) {
    console.error("AI Error:", error);
    return "I'm sorry, I encountered an error while trying to process your request.";
  }
};
