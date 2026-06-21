import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to prevent crashes if key is initially blank
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to pre-defined local prompts.");
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API to generate interactive speaking custom prompts for Level 1 English
app.post("/api/generate-prompt", async (req: Request, res: Response) => {
  try {
    const { activityType, topic } = req.body;
    const format = activityType || 'solo';
    const chosenTopic = topic || 'general';

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        message: "No API Key found. Using rich local prompts pool instead.",
        errorType: "MISSING_KEY"
      });
    }

    const systemPrompt = `You are an expert English teacher specializing in teaching Level 1 English (absolute starter/begginner speaking skills) to kids / young learners.
Create a highly visual, simple speaking prompt suited for the requested format: '${format}' and topic: '${chosenTopic}'.

The prompt must be super simple, using elementary English scaffolding templates because students only speak basic Level 1 phrases.
For format 'solo', the speaking prompt is for a single student.
For format 'pairs', the prompt is a simple conversation starter between 2 speakers (Person A and Person B).
For format 'group', the prompt is an collaborative sharing/circle game for 3-4 students.
For format 'quiz', the prompt is an elegant, basic level 1 language trivia question with 4 options and a correct answer index (0-3).

You MUST respond strictly in JSON complying with the requested format. Choose a single illustrative emoji for the visualHint. Keep vocab terms extremely simple (e.g., cat, dog, apple, school, ball, big, happy, cold).`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A cute, simple, short title. Max 3 words (e.g. My Favorite Pet)"
        },
        description: {
          type: Type.STRING,
          description: "The core challenge description. E.g. 'Tell the class' or 'Ask your partner'"
        },
        visualHint: {
          type: Type.STRING,
          description: "A single representative emoji (e.g. 🐶 for pets, 🍎 for food)"
        },
        guidelines: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "2 or 3 extremely easy visual scaffolds. E.g. ['I like...', 'It is green.'] or ['Person A: Do you see the red bird?', 'Person B: Yes, I do!']"
        }
      },
      required: ["title", "description", "visualHint", "guidelines"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a Level 1 speaking card prompt for: format=${format}, topic=${chosenTopic}. Keep sentences short, using simple words. Maximum 3 words per title. Make the guidelines extremely easy template fillings.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response string from Gemini API");
    }

    const promptData = JSON.parse(text.trim());
    return res.json({
      success: true,
      data: {
        id: `ai_${Date.now()}`,
        topic: chosenTopic,
        format: format,
        level: "Level 1 Starter",
        ...promptData
      }
    });

  } catch (err: any) {
    console.error("Gemini API error generating prompt:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate dynamic prompt"
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded and ready. Hosting at http://localhost:${PORT}`);
  });
}

startServer();
