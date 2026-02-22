import OpenAI from "openai";
import dotenv from "dotenv";
import type { CreateTask } from "@spurtalk/shared";

dotenv.config();

export interface AiTaskDecomposition {
    text: string;
    estimatedSeconds: number;
    emotionalEffort: "zero" | "minimal";
}

export class AiService {
    private client: OpenAI;
    private readonly models = [
        "nvidia/nemotron-3-nano-30b-a3b:free",
        "google/gemini-2.0-flash-lite-preview-02-05:free",
        "mistralai/mistral-nemo:free",
        "stepfun/step-3.5-flash:free",
        "nvidia/llama-3.1-nemotron-70b-instruct:free"
    ];

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
        });
    }

    private async callWithFallback(messages: any[], responseFormat?: any): Promise<any> {
        let lastError: any;
        for (const model of this.models) {
            try {
                return await this.client.chat.completions.create({
                    model,
                    messages,
                    response_format: responseFormat,
                }, { timeout: 10000 });
            } catch (error: any) {
                // If model explicitly doesn't support json_object, try again without it
                if (responseFormat && error.status === 400 && error.message?.includes('json_object')) {
                    try {
                        console.warn(`Model ${model} rejected JSON format, retrying without response_format...`);
                        return await this.client.chat.completions.create({
                            model,
                            messages,
                        }, { timeout: 10000 });
                    } catch (retryError) {
                        console.warn(`Retry failed for ${model}`, retryError);
                    }
                }
                console.warn(`AI model ${model} failed, trying next...`, error.message);
                lastError = error;
            }
        }
        throw lastError || new Error("All AI models failed");
    }

    async decomposeTask(
        title: string,
        description?: string | null
    ): Promise<AiTaskDecomposition[]> {
        try {
            const response = await this.callWithFallback([
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
              4. Return JSON array of objects with fields: text, estimatedSeconds, emotionalEffort (zero or minimal).`,
                },
            ], { type: "json_object" });

            const content = response.choices[0].message.content || "[]";
            const cleanContent = content.replace(/```(json|)/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanContent);
            return Array.isArray(parsed) ? parsed : parsed.steps || [];
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
            const response = await this.callWithFallback([
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
            ], { type: "json_object" });

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
            const response = await this.callWithFallback([
                {
                    role: "user",
                    content: `Generate a short, encouraging "Compelling Event" (one sentence) for the task "${title}".
              The user's motivation category is "${motivationCategory}".
              
              Tone: Warm, empathetic, non-punitive. Avoid "urgent" or "deadline" focus unless it's a celebration.
              Focus on: how they will feel after, or a small positive milestone.`,
                },
            ]);

            return response.choices[0].message.content?.trim() || "You're doing great!";
        } catch (error) {
            console.error("AI service error (generateCompellingEvent):", error);
            return "You're doing great! One step at a time.";
        }
    }

    async planSubtasks(
        title: string,
        description?: string | null
    ): Promise<Partial<CreateTask>[]> {
        try {
            const response = await this.callWithFallback([
                {
                    role: "user",
                    content: `You are a strategic productivity architect. 
              Break down the following high-level task into a set of 3-5 "Sub-Task Cards".
              
              PARENT TASK: ${title}
              DESCRIPTION: ${description || "None"}
              
              CRITICAL GUIDELINES:
              1. The set of sub-tasks must be DETERMINISTIC: they must be NECESSARY AND SUFFICIENT to achieve the parent task.
              2. Each sub-task is a "Card" (Action Layer), not a nano-step. It should be a concrete deliverable or milestone.
              3. Provide a brief, encouraging description for each sub-card.
              4. Assign an effortLevel: "Tiny", "Small", "Medium", or "Big".
              5. Return JSON array of objects with fields: title, description, effortLevel.`,
                },
            ], { type: "json_object" });

            const content = response.choices[0].message.content || "[]";
            const cleanContent = content.replace(/```(json|)/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanContent);
            const subtasks = Array.isArray(parsed) ? parsed : parsed.subtasks || parsed.steps || [];
            return subtasks;
        } catch (error) {
            console.error("AI Planning error:", error);
            return [
                { title: "Analyze the core requirements", description: "Review the goal and break it down logically.", effortLevel: "Small" as const },
                { title: "Draft an initial strategy", description: "Write down the necessary steps.", effortLevel: "Medium" as const },
                { title: "Execute the foundational step", description: "Start with the smallest viable piece of work.", effortLevel: "Big" as const }
            ];
        }
    }
}

export const aiService = new AiService();
