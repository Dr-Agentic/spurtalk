"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DocumentsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      setSuccessMessage(
        `✅ Successfully processed ${file.name}! Extracted ${response.data.tasks.length} tasks.`
      );

      // Refresh document list
      await fetchDocuments();
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.error || "Failed to upload document");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const response = await api.get("/documents");
      setDocuments(response.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError("Failed to fetch documents");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <FileText className="h-8 w-8" />
        Document Processing
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <label className="w-full max-w-md cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag & drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports: PDF, DOCX, PPTX, TXT, MD, CSV, XLSX
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.markdown,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </label>

            {isUploading && (
              <div className="w-full max-w-md mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading: {uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 text-green-600 mt-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="text-red-600 mt-2 p-2 bg-red-50 rounded">
                {error}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processed Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No documents processed yet. Upload your first document!
            </p>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-primary">
                        {doc.filename}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {doc.fileType.toUpperCase()} •{" "}
                        {Math.round(doc.fileSize / 1024)} KB •
                        {new Date(doc.uploadedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {doc.confidence
                        ? `${Math.round(doc.confidence * 100)}% confidence`
                        : "Processed"}
                    </span>
                  </div>
                  {doc.parsedTasks && doc.parsedTasks.length > 0 && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">
                        Extracted {doc.parsedTasks.length} tasks:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {doc.parsedTasks
                          .slice(0, 3)
                          .map((task: any, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-primary">•</span>
                              <span>
                                {task.title || task.text || "Untitled task"}
                              </span>
                            </li>
                          ))}
                        {doc.parsedTasks.length > 3 && (
                          <li className="text-xs text-gray-500 mt-1">
                            + {doc.parsedTasks.length - 3} more tasks
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
