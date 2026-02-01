import { AiService } from "../../services/ai";
import OpenAI from "openai";

// Mock OpenAI
jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => ({
        chat: {
            completions: {
                create: jest.fn(),
            },
        },
    }));
});

describe("AiService Unit Tests", () => {
    let aiService: AiService;
    let mockOpenAI: any;

    beforeEach(() => {
        aiService = new AiService();
        mockOpenAI = (aiService as any).client;
        jest.clearAllMocks();
    });

    it("should decompose a task into nano-steps", async () => {
        const mockResponse = {
            choices: [{
                message: {
                    content: JSON.stringify([
                        { text: "Step 1", estimatedSeconds: 30, emotionalEffort: "zero" },
                        { text: "Step 2", estimatedSeconds: 60, emotionalEffort: "zero" }
                    ])
                }
            }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const steps = await aiService.decomposeTask("Test Task", "Description");
        expect(steps.length).toBe(2);
        expect(steps[0].text).toBe("Step 1");
    });

    it("should generate a compelling event string", async () => {
        const mockResponse = {
            choices: [{
                message: {
                    content: "Imagine the feeling of success."
                }
            }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const event = await aiService.generateCompellingEvent("Test Task", "Achievement");
        expect(event).toBe("Imagine the feeling of success.");
    });

    it("should handle invalid JSON in decomposition", async () => {
        const mockResponse = {
            choices: [{
                message: {
                    content: "invalid json"
                }
            }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const steps = await aiService.decomposeTask("Test Task");
        expect(steps).toEqual([]);
    });

    it("should analyze a document", async () => {
        const mockResponse = {
            choices: [{
                message: {
                    content: JSON.stringify({
                        extractedText: "Analyzed text",
                        parsedTasks: [{ title: "New Task" }],
                        confidence: 0.95
                    })
                }
            }]
        };

        mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

        const analysis = await aiService.analyzeDocument("raw text", "pdf", "file.pdf");
        expect(analysis.extractedText).toBe("Analyzed text");
        expect(analysis.parsedTasks.length).toBe(1);
        expect(analysis.confidence).toBe(0.95);
    });
});
