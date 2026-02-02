import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

export interface AiTaskDecomposition {
    text: string;
    estimatedSeconds: number;
    emotionalEffort: "zero" | "minimal";
}

export class AiService {
    private client: OpenAI;
    private readonly model = "google/gemini-2.0-flash-001";

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });
    }

    async decomposeTask(
        title: string,
        description?: string | null
    ): Promise<AiTaskDecomposition[]> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: `You are an empathic productivity assistant for users with executive dysfunction. 
              Break down the following task into 3-5 "Nano-Steps".
              
              TASK: ${title}
              DESCRIPTION: ${description || "None"}
              
              Guidelines:
              1. The FIRST step must be "impossible to refuse": under 2 minutes, zero emotional effort (e.g., "Open the app", "Look at the blank page").
              2. Each step must be tiny and concrete.
              3. Total steps: 3-5.
              4. Return JSON array of objects with fields: text, estimatedSeconds, emotionalEffort (zero or minimal).
              
              Example:
              [
                {"text": "Open word document", "estimatedSeconds": 30, "emotionalEffort": "zero"},
                {"text": "Write the date", "estimatedSeconds": 45, "emotionalEffort": "zero"},
                {"text": "Summarize first point", "estimatedSeconds": 90, "emotionalEffort": "minimal"}
              ]`,
                    },
                ],
                response_format: { type: "json_object" },
            });

            const content = response.choices[0].message.content || "[]";
            const parsed = JSON.parse(content);
            const steps = Array.isArray(parsed) ? parsed : parsed.steps || [];
            return steps;
        } catch (error) {
            console.error("AI Decomposition error:", error);
            return [
                { "text": "Take a breath", "estimatedSeconds": 10, "emotionalEffort": "zero" },
                { "text": "Open the task", "estimatedSeconds": 30, "emotionalEffort": "zero" },
                { "text": "Do the first tiny part", "estimatedSeconds": 120, "emotionalEffort": "minimal" }
            ];
        }
    }

    async analyzeDocument(extractedText: string, documentType: string, fileName: string) {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: `Analyze this ${documentType} document (${fileName}) and extract:
              
              Document content:
              ${extractedText.substring(0, 8000)}
              
              Instructions:
              1. Extract all actionable tasks with deadlines.
              2. Identify important dates and events.
              3. Find key information.
              4. Provide confidence scores (0.0-1.0).
              5. Return structured JSON with fields: extractedText, parsedTasks, confidence.`,
                    },
                ],
                response_format: { type: "json_object" },
            });

            return JSON.parse(response.choices[0].message.content || "{}");
        } catch (error) {
            console.error("AI Document Analysis error:", error);
            return {
                extractedText: extractedText,
                parsedTasks: [],
                confidence: 0,
                error: "AI Analysis failed - using raw text extraction only."
            };
        }
    }

    async generateCompellingEvent(title: string, motivationCategory: string): Promise<string> {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: "user",
                        content: `Generate a short, encouraging "Compelling Event" (one sentence) for the task "${title}".
              The user's motivation category is "${motivationCategory}".
              
              Tone: Warm, empathetic, non-punitive. Avoid "urgent" or "deadline" focus unless it's a celebration. // design-ignore
              Focus on: how they will feel after, or a small positive milestone.`,
                    },
                ],
            });

            return response.choices[0].message.content?.trim() || "You're doing great!";
        } catch (error) {
            console.error("AI service error (generateCompellingEvent):", error);
            return "You're doing great! One step at a time.";
        }
    }
}

export const aiService = new AiService();
