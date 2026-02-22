"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CreateTaskSchema } from "@spurtalk/shared";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCreateTaskMutation, useTasksQuery, useTaskQuery } from "@/lib/hooks/useTasks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialParentTaskId?: string;
}

interface FormState {
  title: string;
  effortLevel: string;
  description: string;
  emotionalTag: string;
  fuzzyDeadline: string;
  hardDeadline: string;
  tags: string;
  parentTaskId: string;
}

interface FormErrors {
  title?: string;
  effortLevel?: string;
  description?: string;
  emotionalTag?: string;
  fuzzyDeadline?: string;
  hardDeadline?: string;
  tags?: string;
}

const initialFormState: FormState = {
  title: "",
  effortLevel: "",
  description: "",
  emotionalTag: "",
  fuzzyDeadline: "",
  hardDeadline: "",
  tags: "",
  parentTaskId: "",
};

export function CardCreationModal({
  isOpen,
  onClose,
  onSuccess,
  initialParentTaskId,
}: CardCreationModalProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);

  const { mutateAsync, isPending, isError, error, reset } =
    useCreateTaskMutation();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        ...initialFormState,
        parentTaskId: initialParentTaskId || "",
      });
      setErrors({});
      setTouched({});
      setApiError(null);
      reset();
    }
  }, [isOpen, reset, initialParentTaskId]);

  // Validate a single field
  const validateField = useCallback(
    (field: keyof FormState, value: string) => {
      const newErrors: FormErrors = { ...errors };

      switch (field) {
        case "title":
          if (!value || value.trim().length === 0) {
            newErrors.title =
              "This one needs a title to get started";
          } else if (value.length > 500) {
            newErrors.title =
              "Keep the title under 500 characters - you can add more details in the description";
          } else {
            delete newErrors.title;
          }
          break;
        case "effortLevel":
          if (!value) {
            newErrors.effortLevel =
              "How big does this feel?";
          } else {
            delete newErrors.effortLevel;
          }
          break;
        case "description":
          if (value && value.length > 2000) {
            newErrors.description =
              "Description is a bit long - try keeping it under 2000 characters";
          } else {
            delete newErrors.description;
          }
          break;
        case "hardDeadline":
          if (value && new Date(value) <= new Date()) {
            newErrors.hardDeadline =
              "Let's pick a date that's still ahead of us";
          } else {
            delete newErrors.hardDeadline;
          }
          break;
        default:
          break;
      }

      // Check mutual exclusivity of fuzzy and hard deadlines
      if (field === "fuzzyDeadline" || field === "hardDeadline") {
        const fuzzy = field === "fuzzyDeadline" ? value : form.fuzzyDeadline;
        const hard = field === "hardDeadline" ? value : form.hardDeadline;
        if (fuzzy && hard) {
          newErrors.fuzzyDeadline =
            "Choose either a flexible timeframe or a specific date - not both";
        } else {
          delete newErrors.fuzzyDeadline;
        }
      }

      setErrors(newErrors);
      return newErrors;
    },
    [errors, form.fuzzyDeadline, form.hardDeadline]
  );

  // Handle field blur for validation
  const handleBlur = useCallback(
    (field: keyof FormState) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, form[field]);
    },
    [form, validateField]
  );

  // Update form field
  const updateField = useCallback(
    (field: keyof FormState, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Clear API error when user edits form
      if (apiError) setApiError(null);
      // Re-validate if field was already touched
      if (touched[field]) {
        validateField(field, value);
      }
    },
    [touched, validateField, apiError]
  );

  // Handle fuzzy deadline change - clear hard deadline if set
  const handleFuzzyDeadlineChange = useCallback((value: string) => {
    if (value) {
      setForm((prev) => ({ ...prev, fuzzyDeadline: value, hardDeadline: "" }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.fuzzyDeadline;
        delete next.hardDeadline;
        return next;
      });
    } else {
      setForm((prev) => ({ ...prev, fuzzyDeadline: "" }));
    }
  }, []);

  // Handle hard deadline change - clear fuzzy deadline if set
  const handleHardDeadlineChange = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, hardDeadline: value, fuzzyDeadline: "" }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.fuzzyDeadline;
      return next;
    });
    if (value && new Date(value) <= new Date()) {
      setErrors((prev) => ({
        ...prev,
        hardDeadline:
          "The deadline should be in the future so you have time to work on it",
      }));
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.hardDeadline;
        return next;
      });
    }
  }, []);

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!form.title || form.title.trim().length === 0) {
      newErrors.title =
        "This one needs a title to get started";
    } else if (form.title.length > 500) {
      newErrors.title =
        "Keep the title under 500 characters - you can add more details in the description";
    }

    if (!form.effortLevel) {
      newErrors.effortLevel =
        "How big does this feel?";
    }

    if (form.description && form.description.length > 2000) {
      newErrors.description =
        "Description is a bit long - try keeping it under 2000 characters";
    }

    if (form.fuzzyDeadline && form.hardDeadline) {
      newErrors.fuzzyDeadline =
        "Choose either a flexible timeframe or a specific date - not both";
    }

    if (form.hardDeadline && new Date(form.hardDeadline) <= new Date()) {
      newErrors.hardDeadline =
        "Let's pick a date that's still ahead of us";
    }

    setErrors(newErrors);
    // Mark all fields as touched
    setTouched({
      title: true,
      effortLevel: true,
      description: true,
      emotionalTag: true,
      fuzzyDeadline: true,
      hardDeadline: true,
      tags: true,
    });

    return Object.keys(newErrors).length === 0;
  }, [form]);

  // Fetch potential parents
  const { data: potentialParents } = useTasksQuery({ state: "Deck" });
  const { data: selectedParent } = useTaskQuery(form.parentTaskId);

  // Check if form is valid for button state
  const isFormValid =
    form.title.trim().length > 0 &&
    form.title.length <= 500 &&
    form.effortLevel !== "" &&
    (!form.description || form.description.length <= 2000) &&
    !(form.fuzzyDeadline && form.hardDeadline) &&
    (!form.hardDeadline || new Date(form.hardDeadline) > new Date());

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;
      if (isPending) return;
      if (submissionInProgress) return; // Prevent duplicate submissions

      setSubmissionInProgress(true);
      // Build payload
      const payload: Record<string, unknown> = {
        title: form.title.trim(),
        effortLevel: form.effortLevel,
      };

      if (form.description.trim()) {
        payload.description = form.description.trim();
      }

      if (form.emotionalTag) {
        payload.emotionalTag = form.emotionalTag;
      }

      if (form.fuzzyDeadline) {
        payload.fuzzyDeadline = form.fuzzyDeadline;
      }

      if (form.hardDeadline) {
        payload.hardDeadline = form.hardDeadline;
      }

      // Parse tags
      if (form.tags.trim()) {
        payload.tags = form.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      } else {
        payload.tags = [];
      }

      if (form.parentTaskId) {
        payload.parentTaskId = form.parentTaskId;
      }

      // Validate with Zod schema as a safety check
      try {
        CreateTaskSchema.parse(payload);
      } catch (zodError) {
        if (zodError instanceof z.ZodError) {
          const newErrors: FormErrors = {};
          zodError.issues.forEach((err) => {
            const field = err.path[0] as keyof FormErrors;
            if (field) {
              newErrors[field] = err.message;
            }
          });
          setErrors(newErrors);
          return;
        }
      }

      setApiError(null);
      reset(); // Clear any previous mutation error state before retrying

      try {
        console.log("[Modal] Submitting task:", payload);
        await mutateAsync(payload as Parameters<typeof mutateAsync>[0]);
        console.log("[Modal] Submission success");
        toast.success("Your card is ready in the Deck");
        onClose();
        onSuccess?.();
      } catch (err: unknown) {
        // Determine if this is a network error or a server error
        const isNetworkError =
          (err &&
            typeof err === "object" &&
            "code" in err &&
            (err as { code: string }).code === "ERR_NETWORK") ||
          (err instanceof Error &&
            (err.message.includes("Network") ||
              err.message.includes("network"))) ||
          (err instanceof TypeError && err.message === "Failed to fetch");

        if (isNetworkError) {
          setApiError(
            "We're having trouble connecting. Your card is safe here - try again in a moment."
          );
        } else {
          // Extract server error message from Axios response if available
          let serverMessage =
            "Something went wrong. Your card is safe here - try again.";
          if (err && typeof err === "object" && "response" in err) {
            const axiosErr = err as {
              response?: { data?: { message?: string }; status?: number };
            };
            if (axiosErr.response?.data?.message) {
              serverMessage = axiosErr.response.data.message;
            }
          } else if (err instanceof Error && err.message) {
            serverMessage = err.message;
          }
          setApiError(serverMessage);
        }
      } finally {
        setSubmissionInProgress(false);
      }
    },
    [
      form,
      validateForm,
      isPending,
      mutateAsync,
      onClose,
      onSuccess,
      reset,
      submissionInProgress,
    ]
  );

  // Handle Enter key on form
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        if (isFormValid && !isPending) {
          handleSubmit(e as unknown as React.FormEvent);
        }
      }
    },
    [isFormValid, isPending, handleSubmit]
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader>
          <DialogTitle>Add a new card</DialogTitle>
          <DialogDescription>
            Capture what&apos;s on your mind. We&apos;ll help you take it from
            there.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* API Error */}
          {(apiError || (isError && error)) && (
            <div
              className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {apiError ||
                error?.message ||
                "Something went wrong. Your card is safe here - try again."}
            </div>
          )}
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="card-title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="card-title"
              placeholder="What's on your mind?"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              maxLength={500}
              aria-invalid={touched.title && !!errors.title}
              aria-describedby={
                touched.title && errors.title ? "title-error" : "title-counter"
              }
            />
            <div className="flex items-center justify-between">
              {touched.title && errors.title ? (
                <p
                  id="title-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.title}
                </p>
              ) : (
                <span />
              )}
              <span
                id="title-counter"
                className="text-xs text-muted-foreground"
              >
                {form.title.length}/500
              </span>
            </div>
          </div>

          {/* Parent Task Selection */}
          <div className="space-y-2">
            <Label htmlFor="parent-task">Parent Task (Optional)</Label>
            <div className="relative">
              <select
                id="parent-task"
                className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                value={form.parentTaskId}
                onChange={(e) => updateField("parentTaskId", e.target.value)}
              >
                <option value="">None (Individual Task)</option>
                {potentialParents?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
                {/* Ensure the initial parent is visible even if not in "Deck" */}
                {initialParentTaskId && selectedParent && !potentialParents?.some(p => p.id === initialParentTaskId) && (
                  <option value={initialParentTaskId}>
                    {selectedParent.title}
                  </option>
                )}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {form.parentTaskId && (
              <p className="text-xs text-muted-foreground italic">
                This will implicitly promote the parent to tracking mode.
              </p>
            )}
          </div>

          {/* Effort Level */}
          <div className="space-y-2">
            <Label>
              Effort Level <span className="text-destructive">*</span>
            </Label>
            <ToggleGroup
              type="single"
              value={form.effortLevel}
              onValueChange={(value) => {
                if (value) updateField("effortLevel", value);
              }}
              variant="outline"
              className="flex w-full gap-2"
              aria-label="Effort level"
            >
              {[
                { label: "Tiny", color: "data-[state=on]:bg-success/20 data-[state=on]:text-success data-[state=on]:border-success/30" },
                { label: "Small", color: "data-[state=on]:bg-primary/20 data-[state=on]:text-primary data-[state=on]:border-primary/30" },
                { label: "Medium", color: "data-[state=on]:bg-secondary/20 data-[state=on]:text-secondary data-[state=on]:border-secondary/30" },
                { label: "Big", color: "data-[state=on]:bg-attention/20 data-[state=on]:text-attention data-[state=on]:border-attention/30" }
              ].map((level) => (
                <ToggleGroupItem
                  key={level.label}
                  value={level.label}
                  className={cn("flex-1 px-2 py-1 h-auto text-xs font-medium transition-all", level.color)}
                  aria-label={level.label}
                >
                  {level.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {touched.effortLevel && errors.effortLevel && (
              <p className="text-xs text-destructive" role="alert">
                {errors.effortLevel}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              placeholder="Any details that help..."
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              maxLength={2000}
              rows={3}
              aria-invalid={touched.description && !!errors.description}
              aria-describedby={
                touched.description && errors.description
                  ? "description-error"
                  : "description-counter"
              }
            />
            <div className="flex items-center justify-between">
              {touched.description && errors.description ? (
                <p
                  id="description-error"
                  className="text-xs text-destructive"
                  role="alert"
                >
                  {errors.description}
                </p>
              ) : (
                <span />
              )}
              <span
                id="description-counter"
                className="text-xs text-muted-foreground"
              >
                {form.description.length}/2000
              </span>
            </div>
          </div>

          {/* Emotional Tag */}
          <div className="space-y-2">
            <Label>Emotional Tag</Label>
            <ToggleGroup
              type="single"
              value={form.emotionalTag}
              onValueChange={(value) =>
                updateField("emotionalTag", value ?? "")
              }
              variant="outline"
              className="flex w-full"
              aria-label="Emotional tag"
            >
              {["Boring", "Scary", "Fun"].map((tag) => (
                <ToggleGroupItem
                  key={tag}
                  value={tag}
                  className="flex-1"
                  aria-label={tag}
                >
                  {tag}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Fuzzy Deadline */}
          <div className="space-y-2">
            <Label>Flexible Timeframe</Label>
            <ToggleGroup
              type="single"
              value={form.fuzzyDeadline}
              onValueChange={(value) => handleFuzzyDeadlineChange(value ?? "")}
              variant="outline"
              className="flex w-full"
              aria-label="Flexible timeframe"
            >
              {["Soon", "This Week", "Eventually"].map((deadline) => (
                <ToggleGroupItem
                  key={deadline}
                  value={deadline}
                  className="flex-1"
                  aria-label={deadline}
                >
                  {deadline}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {touched.fuzzyDeadline && errors.fuzzyDeadline && (
              <p className="text-xs text-destructive" role="alert">
                {errors.fuzzyDeadline}
              </p>
            )}
          </div>

          {/* Hard Deadline */}
          <div className="space-y-2">
            <Label htmlFor="card-hard-deadline">Specific Date</Label>
            <Input
              id="card-hard-deadline"
              type="date"
              value={form.hardDeadline}
              onChange={(e) => handleHardDeadlineChange(e.target.value)}
              onBlur={() => handleBlur("hardDeadline")}
              min={new Date().toISOString().split("T")[0]}
              aria-invalid={touched.hardDeadline && !!errors.hardDeadline}
              aria-describedby={
                touched.hardDeadline && errors.hardDeadline
                  ? "hard-deadline-error"
                  : undefined
              }
            />
            {touched.hardDeadline && errors.hardDeadline && (
              <p
                id="hard-deadline-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.hardDeadline}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="card-tags">Tags</Label>
            <Input
              id="card-tags"
              placeholder="Comma-separated (e.g. work, urgent, personal)"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              onBlur={() => handleBlur("tags")}
              aria-describedby="tags-hint"
            />
            <p id="tags-hint" className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isPending || submissionInProgress}
              aria-disabled={!isFormValid || isPending || submissionInProgress}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Card"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent >
    </Dialog >
  );
}
