"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NanoStep, Task, CreateTask } from "@spurtalk/shared";
import { Check, Loader2, ListTree, Wand2, X, ChevronRight, AlertCircle, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface UnblockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  steps: NanoStep[];
  proposedCards?: Partial<CreateTask>[];
  task: Task | null;
  onAcceptSteps: () => void;
  onAcceptPlan: (cards: Partial<CreateTask>[], strategy: "replace" | "supplement") => void;
  onElevateRequest: () => void;
}

type ViewMode = "unblock" | "conflict" | "plan";

export function UnblockerModal({
  isOpen,
  onClose,
  isLoading,
  steps,
  proposedCards = [],
  task,
  onAcceptSteps,
  onAcceptPlan,
  onElevateRequest,
}: UnblockerModalProps) {
  const [mode, setMode] = useState<ViewMode>("unblock");
  const [editedCards, setEditedCards] = useState<Partial<CreateTask>[]>([]);
  const [conflictStrategy, setConflictStrategy] = useState<"replace" | "supplement">("supplement");

  useEffect(() => {
    if (isOpen) {
      if (proposedCards && proposedCards.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setEditedCards(proposedCards);
        setMode(task?.subtasks && task.subtasks.length > 0 ? "conflict" : "plan");
      } else {
        setMode("unblock");
      }
    }
  }, [isOpen, proposedCards, task]);

  const handleCardChange = (index: number, field: keyof CreateTask, value: string) => {
    const newCards = [...editedCards];
    newCards[index] = { ...newCards[index], [field]: value };
    setEditedCards(newCards);
  };

  const removeCard = (index: number) => {
    setEditedCards(editedCards.filter((_, i) => i !== index));
  };

  const renderUnblockView = () => (
    <div className="space-y-4 py-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          Stuck? Let&apos;s break it down.
        </DialogTitle>
        <DialogDescription>
          Nano-steps help you bypass the &quot;starting friction&quot;. The first one takes under 2 minutes.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : Array.isArray(steps) && steps.length > 0 ? (
          steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start p-3 bg-muted/50 rounded-lg border border-border/50 transition-all hover:bg-muted"
            >
              <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{step.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5 italic">
                  ~{Math.ceil(step.estimatedSeconds / 60)} min • {step.emotionalEffort} effort
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>We couldn&apos;t break this one down right now.</p>
          </div>
        )}
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button onClick={onAcceptSteps} disabled={isLoading || steps.length === 0} className="w-full">
          Let&apos;s do these! 🚀
        </Button>
        <Button
          variant="outline"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={onElevateRequest}
          data-testid="plan-subtasks-btn"
        >
          <ListTree className="h-4 w-4 mr-2" />
          Wait, this is a bigger project. Plan sub-tasks instead?
        </Button>
      </div>
    </div>
  );

  const renderConflictView = () => (
    <div className="space-y-6 py-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-attention">
          <AlertCircle className="h-5 w-5" />
          Found existing sub-tasks
        </DialogTitle>
        <DialogDescription>
          You already have {task?.subtasks?.length} cards under this project. How should we handle the new AI proposal?
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-3">
        <Button
          variant="outline"
          className={cn("h-auto py-4 px-4 flex flex-col items-start gap-1 transition-all", conflictStrategy === "supplement" && "border-primary bg-primary/5")}
          onClick={() => setConflictStrategy("supplement")}
        >
          <div className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4" /> Supplement (Audit & Add)
          </div>
          <div className="text-xs text-muted-foreground text-left">
            Keep your current cards and only add missing pieces. Best if you&apos;ve already started.
          </div>
        </Button>

        <Button
          variant="outline"
          className={cn("h-auto py-4 px-4 flex flex-col items-start gap-1 transition-all", conflictStrategy === "replace" && "border-destructive bg-destructive/5")}
          onClick={() => setConflictStrategy("replace")}
        >
          <div className="font-semibold flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" /> Fresh Start (Replace)
          </div>
          <div className="text-xs text-muted-foreground text-left">
            Wipe existing sub-tasks and replace them with this new deterministic roadmap.
          </div>
        </Button>
      </div>

      <DialogFooter className="pt-4">
        <Button variant="ghost" onClick={() => setMode("unblock")}>Go Back</Button>
        <Button data-testid="review-proposal-btn" onClick={() => setMode("plan")}>Review Proposal <ChevronRight className="h-4 w-4 ml-2" /></Button>
      </DialogFooter>
    </div>
  );

  const renderPlanningView = () => (
    <div className="space-y-4 py-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-primary" />
          Review Project Roadmap
        </DialogTitle>
        <DialogDescription>
          Amend the AI&apos;s proposal to fit your mental model. These will become real cards in your deck.
        </DialogDescription>
      </DialogHeader>

      <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
        {editedCards.map((card, index) => (
          <div key={index} className="group relative p-4 bg-muted/30 rounded-xl border border-border/50 space-y-3">
            <button
              onClick={() => removeCard(index)}
              className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 rounded-md text-destructive"
            >
              <X className="h-4 w-4" />
            </button>

            <Input
              value={card.title}
              onChange={(e) => handleCardChange(index, "title", e.target.value)}
              className="font-semibold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Card title..."
            />
            <Textarea
              value={card.description || ""}
              onChange={(e) => handleCardChange(index, "description", e.target.value)}
              className="text-xs text-muted-foreground bg-transparent border-none p-0 resize-none min-h-[40px] focus-visible:ring-0"
              placeholder="Brief description..."
            />
          </div>
        ))}
        {editedCards.length === 0 && (
          <div className="text-center py-8 text-muted-foreground italic">
            No cards left. Add one or go back.
          </div>
        )}
      </div>

      <DialogFooter className="pt-4">
        <Button variant="ghost" onClick={() => setMode("unblock")}>Cancel</Button>
        <Button
          data-testid="create-cards-btn"
          disabled={editedCards.length === 0 || isLoading}
          onClick={() => onAcceptPlan(editedCards, conflictStrategy)}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Create Cards 🚀
        </Button>
      </DialogFooter>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        {mode === "unblock" && renderUnblockView()}
        {mode === "conflict" && renderConflictView()}
        {mode === "plan" && renderPlanningView()}
      </DialogContent>
    </Dialog>
  );
}
