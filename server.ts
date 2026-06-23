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

// API to generate interactive speaking custom prompts for Grade 2 & 3 English Grammar
app.post("/api/generate-prompt", async (req: Request, res: Response) => {
  try {
    const { activityType, topic } = req.body;
    const format = activityType || 'solo';
    const chosenTopic = topic || 'grammar';

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(200).json({
        success: false,
        message: "No API Key found. Using rich local prompts pool instead.",
        errorType: "MISSING_KEY"
      });
    }

    const systemPrompt = `You are an expert English teacher specializing in teaching Grade 2 & 3 Grammar (topics like Nouns, Verbs, Plurals, Pronouns, Prepositions, and Adjectives) to young learners.
Create a highly visual, simple speaking grammar prompt suited for the requested format: '${format}' and topic: '${chosenTopic}'.

The prompt must use age-appropriate Grade 2 & 3 grammar templates where students practice filling blanks.
For format 'solo', the speaking prompt is for a single student.
For format 'pairs', the prompt is a simple conversation starter between 2 speakers (Person A and Person B) practicing grammar.
For format 'group', the prompt is an collaborative sharing/circle grammar game for 3-4 students.
For format 'quiz', the prompt is an elegant Grade 2/3 grammar trivia question with 4 options and a correct answer index (0-3).

You MUST respond strictly in JSON complying with the requested format. Choose a single illustrative emoji for the visualHint. Keep sentences clear and related to grammar.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        title: {
          type: Type.STRING,
          description: "A cute, simple, short title. Max 3 words (e.g. Pronoun Power)"
        },
        description: {
          type: Type.STRING,
          description: "The core challenge description. E.g. 'Practice pronouns with your partner'"
        },
        visualHint: {
          type: Type.STRING,
          description: "A single representative emoji (e.g. 🦸‍♂️ for pronouns, 🎨 for adjectives)"
        },
        guidelines: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 or 4 clear grammar-focused visual scaffolds. E.g. ['Look at that...!', 'He is...'] or ['Person A: Do you have a...?', 'Person B: Yes, I do! He has one too.']"
        }
      },
      required: ["title", "description", "visualHint", "guidelines"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Create a Grade 2 & 3 Grammar speaking card prompt for: format=${format}, topic=${chosenTopic}. Keep sentences age-appropriate. Maximum 3 words per title. Make the guidelines clear sentence structures.`,
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
        level: "Grade 2/3 Grammar",
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
