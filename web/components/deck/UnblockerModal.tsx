"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NanoStep } from "@spurtalk/shared";
import { Check, Loader2 } from "lucide-react";

interface UnblockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  steps: NanoStep[];
  onAccept: () => void;
}

export function UnblockerModal({
  isOpen,
  onClose,
  isLoading,
  steps,
  onAccept,
}: UnblockerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Stuck? Let&apos;s break it down.</DialogTitle>
          <DialogDescription>
            We&apos;ve generated some nano-steps to get you started. The first
            one takes less than 2 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : Array.isArray(steps) && steps.length > 0 ? (
            steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start p-3 bg-muted rounded-lg border border-border"
              >
                <div className="mr-3 mt-0.5 bg-primary/10 p-1 rounded-full">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{step.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ~{Math.ceil(step.estimatedSeconds / 60)} min •{" "}
                    {step.emotionalEffort} effort
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>We couldn&apos;t break this one down right now.</p>
              <p className="text-xs mt-2">Try again in a moment.</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Maybe later
          </Button>
          <Button
            type="button"
            onClick={onAccept}
            disabled={isLoading || steps.length === 0}
          >
            Let&apos;s do this! 🚀
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
