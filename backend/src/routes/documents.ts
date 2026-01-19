import { Router } from "express";
import { authenticateToken, AuthRequest } from "../middleware/auth";
import multer from "multer";
import { documentService } from "../services/document";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(authenticateToken);

// Upload document endpoint
router.post(
  "/upload",
  upload.single("document"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const result = await documentService.processDocument(
        req.userId!,
        req.file.path,
        req.file.originalname
      );

      res.json(result);
    } catch (error: any) {
      console.error("Document processing error:", error);
      res.status(500).json({ error: "Failed to process document" });
    }
  }
);

// Get processed documents
router.get("/", async (req: AuthRequest, res) => {
  try {
    const documents = await documentService.getUserDocuments(req.userId!);
    res.json(documents);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

export default router;
