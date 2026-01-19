import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { default as pdfParse } from "pdf-parse";
import mammoth from "mammoth";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

// Initialize OpenRouter client only when needed
let openrouter: OpenAI | null = null;

function getOpenRouterClient(): OpenAI {
  if (!openrouter) {
    openrouter = new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });
  }
  return openrouter;
}

export class DocumentService {
  async processDocument(
    userId: string,
    filePath: string,
    originalName: string
  ) {
    try {
      const fileExtension = path.extname(originalName).toLowerCase();
      const documentType = this.getDocumentType(fileExtension);
      let extractedText = "";

      // Extract text based on document type
      switch (documentType) {
        case "pdf":
          extractedText = await this.extractTextFromPDF(filePath);
          break;
        case "word":
          extractedText = await this.extractTextFromWord(filePath);
          break;
        case "text":
        case "markdown":
          extractedText = fs.readFileSync(filePath, "utf8");
          break;
        case "powerpoint":
        case "spreadsheet":
          // For now, treat as binary files
          extractedText = `[${documentType.toUpperCase()} file: ${originalName}]`;
          break;
        default:
          extractedText = `[Unsupported file type: ${fileExtension}]`;
      }

      // Send to Gemini Flash for analysis
      const analysisResult = await this.analyzeDocumentWithGemini(
        extractedText,
        documentType,
        originalName
      );

      // Save document metadata to database
      const document = await prisma.document.create({
        data: {
          userId,
          filename: originalName,
          fileType: documentType,
          fileSize: fs.statSync(filePath).size,
          processingStatus: "completed",
          extractedText: analysisResult.extractedText || extractedText,
          parsedTasks: analysisResult.parsedTasks || [],
          confidence: analysisResult.confidence || 0.8,
        },
      });

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      return {
        success: true,
        documentId: document.id,
        tasks: analysisResult.parsedTasks || [],
        confidence: analysisResult.confidence || 0.8,
      };
    } catch (error) {
      console.error("Document processing error:", error);
      throw new Error("Failed to process document");
    }
  }

  async getUserDocuments(userId: string) {
    return prisma.document.findMany({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });
  }

  private getDocumentType(extension: string): string {
    const ext = extension.toLowerCase();
    if ([".pdf"].includes(ext)) return "pdf";
    if ([".doc", ".docx"].includes(ext)) return "word";
    if ([".ppt", ".pptx"].includes(ext)) return "powerpoint";
    if ([".txt", ".md", ".markdown"].includes(ext)) return "text";
    if ([".csv", ".xls", ".xlsx"].includes(ext)) return "spreadsheet";
    if ([".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext))
      return "image";
    return "other";
  }

  private async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      // Use require for CommonJS module
      const pdfParse = require("pdf-parse");
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error("PDF extraction error:", error);
      return `[PDF extraction failed: ${filePath}]`;
    }
  }

  private async extractTextFromWord(filePath: string): Promise<string> {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error("Word extraction error:", error);
      return `[Word extraction failed: ${filePath}]`;
    }
  }

  private async analyzeDocumentWithGemini(
    extractedText: string,
    documentType: string,
    fileName: string
  ) {
    // Get OpenRouter client
    const client = getOpenRouterClient();

    // Send to Gemini Flash model
    const response = await client.chat.completions.create({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: `Analyze this ${documentType} document (${fileName}) and extract:
          
          Document content:
          ${extractedText.substring(0, 8000)}...${extractedText.length > 8000 ? " (truncated)" : ""}
          
          Extraction instructions:
          1. Extract all actionable tasks with deadlines
          2. Identify important dates and events
          3. Find key information that should be tracked
          4. Provide confidence scores (0.0-1.0) for each extraction
          5. Return structured JSON with fields: extractedText, parsedTasks, confidence
          
          Example task format:
          {
            "title": "Complete project proposal",
            "description": "Write and submit the Q3 project proposal",
            "deadline": "2024-12-15",
            "priority": "high",
            "confidence": 0.95
          }`,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse the response
    const result = JSON.parse(response.choices[0].message.content || "{}");

    return {
      extractedText: result.extractedText || extractedText,
      parsedTasks: result.parsedTasks || [],
      confidence: result.confidence || 0.8,
    };
  }
}

export const documentService = new DocumentService();
