import { AiService } from "../../services/ai";

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
    let mockOpenAI: { chat: { completions: { create: jest.Mock } } };

    beforeEach(() => {
        aiService = new AiService();
        mockOpenAI = (aiService as unknown as { client: typeof mockOpenAI }).client;
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
        expect(steps).toEqual([
            { "text": "Take a breath", "estimatedSeconds": 10, "emotionalEffort": "zero" },
            { "text": "Open the task", "estimatedSeconds": 30, "emotionalEffort": "zero" },
            { "text": "Do the first tiny part", "estimatedSeconds": 120, "emotionalEffort": "minimal" }
        ]);
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
