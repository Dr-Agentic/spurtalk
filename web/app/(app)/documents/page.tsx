"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Sparkles,
  File,
  Image,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  tasksExtracted: number;
  uploadedAt: string;
}

export default function DocumentsPage() {
  const user = useAuthStore((state) => state.user);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data } = await api.get<DocumentItem[]>("/documents");
        setDocuments(data || []);
      } catch (error) {
        console.error("Couldn't load documents", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDocuments();
  }, [user]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload
    const files = e.dataTransfer.files;
    console.log("Dropped files:", files);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-destructive" />;
      case "image":
        return (
          <Image
            className="h-5 w-5 text-secondary"
            aria-label="Image document"
          />
        );
      case "spreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-success" />;
      default:
        return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FileText className="h-8 w-8 text-primary animate-gentle-pulse" />
          <p className="text-body-small text-muted-foreground">
            Loading documents...
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto max-w-4xl px-4 py-8"
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-h2 text-foreground flex items-center gap-2">
          <FileText className="h-7 w-7 text-primary" />
          Documents
        </h1>
        <p className="mt-2 text-body-small text-muted-foreground">
          Upload documents and let AI extract tasks for you
        </p>
      </header>

      {/* Upload Zone */}
      <Card
        className={`mb-8 border-2 border-dashed transition-colors ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4"
          >
            <Upload className="h-8 w-8 text-primary" />
          </motion.div>
          <h3 className="text-subheader text-foreground mb-2">
            Drop files here
          </h3>
          <p className="text-body-small text-muted-foreground mb-4">
            or click to browse
          </p>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Choose Files
          </Button>
          <p className="mt-4 text-caption text-muted-foreground">
            Supports PDF, DOC, DOCX, XLS, XLSX, and images
          </p>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-subheader text-foreground">Recent Documents</h2>

        {documents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-body-small text-muted-foreground">
                No documents yet. Upload one to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center gap-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{doc.name}</CardTitle>
                      <CardDescription className="text-caption">
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString()
                          : "Recently uploaded"}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      {doc.tasksExtracted} tasks extracted
                    </Badge>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
