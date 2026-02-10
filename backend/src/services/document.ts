import { prisma } from "../lib/prisma";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { aiService } from "./ai";

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
          extractedText = `[${documentType.toUpperCase()} file: ${originalName}]`;
          break;
        default:
          extractedText = `[Unsupported file type: ${fileExtension}]`;
      }

      // Send to AI for analysis
      const analysisResult = await aiService.analyzeDocument(
        extractedText,
        documentType,
        originalName
      );

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
      // Dynamic import to handle optional pdf-parse dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
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
}

export const documentService = new DocumentService();
