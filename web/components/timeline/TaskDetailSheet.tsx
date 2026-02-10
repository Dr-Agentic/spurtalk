"use client";

import { useState, useEffect } from "react";
import { TimelineTask, NanoStep } from "@spurtalk/shared";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Play, Trash2, Calendar, Target, Smile, Info } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskDetailSheetProps {
    task: TimelineTask | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function TaskDetailSheet({ task, isOpen, onClose, onUpdate }: TaskDetailSheetProps) {
    const router = useRouter();
    const [localNanoSteps, setLocalNanoSteps] = useState<NanoStep[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (task) {
            setLocalNanoSteps(task.nanoSteps);
        }
    }, [task]);

    if (!task) return null;

    const completedSteps = localNanoSteps.filter((s) => s.isCompleted).length;
    const totalSteps = localNanoSteps.length;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    const handleToggleStep = async (stepId: string, checked: boolean) => {
        const updatedSteps = localNanoSteps.map((s) =>
            s.id === stepId ? { ...s, isCompleted: checked } : s
        );
        setLocalNanoSteps(updatedSteps);

        try {
            await api.put(`/tasks/${task.taskId}`, { nanoSteps: updatedSteps });
            onUpdate();
        } catch (error) {
            console.error("Failed to update step", error);
            toast.error("Couldn't save your progress. Let's try again!");
            // Revert local state on error
            setLocalNanoSteps(task.nanoSteps);
        }
    };

    const handleCompost = async () => {
        try {
            setIsUpdating(true);
            await api.put(`/tasks/${task.taskId}`, {
                state: "Completed",
                motivationCategory: "Relief",
                tags: ["composted"]
            });
            toast.success("Letting it go... The garden appreciates the nutrients! 🌿");
            onUpdate();
            onClose();
        } catch (error) {
            toast.error("Something went wrong with composting.");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-md flex flex-col h-full bg-background border-l shadow-2xl">
                <SheetHeader className="text-left space-y-4 pr-6">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="animate-bloom">
                            {task.effortLevel} Effort
                        </Badge>
                        {task.emotionalTag && (
                            <Badge variant="secondary" className="bg-primary/10 text-primary">
                                {task.emotionalTag}
                            </Badge>
                        )}
                    </div>
                    <SheetTitle className="text-2xl font-bold text-foreground leading-tight">
                        {task.title}
                    </SheetTitle>
                    <SheetDescription className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Due: {format(new Date(task.scheduledDate), "MMMM d, yyyy")}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-hidden mt-6">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-8 pb-8">
                            {/* Progress Section */}
                            {totalSteps > 0 && (
                                <div className="space-y-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                                    <div className="flex justify-between items-end">
                                        <h4 className="text-sm font-semibold flex items-center gap-2">
                                            <Target className="h-4 w-4 text-primary" />
                                            Nano-Step Progress
                                        </h4>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {completedSteps}/{totalSteps} done
                                        </span>
                                    </div>
                                    <Progress value={progressPercent} className="h-2" />

                                    <div className="space-y-2 mt-4">
                                        {localNanoSteps.map((step) => (
                                            <div key={step.id} className="flex items-start gap-3 py-2 group">
                                                <Checkbox
                                                    id={step.id}
                                                    checked={step.isCompleted}
                                                    onCheckedChange={(checked) => handleToggleStep(step.id, !!checked)}
                                                    className="mt-1 transition-transform group-active:scale-90"
                                                />
                                                <label
                                                    htmlFor={step.id}
                                                    className={cn(
                                                        "text-sm leading-tight transition-colors cursor-pointer",
                                                        step.isCompleted ? "text-muted-foreground line-through" : "text-foreground font-medium"
                                                    )}
                                                >
                                                    {step.text}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Motivation Section (Note) */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <Smile className="h-4 w-4 text-primary" />
                                    Anti-Guilt Reflection
                                </h4>
                                <div className="p-4 rounded-xl bg-primary/5 text-sm text-muted-foreground border border-primary/10 italic">
                                    Remember: progress isn&apos;t linear. Every small step counts towards your growth. 🌿
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>

                <SheetFooter className="pt-6 border-t bg-background/95 backdrop-blur-sm mt-auto gap-3">
                    <div className="flex flex-col w-full gap-3">
                        <Button
                            className="w-full h-12 text-base font-semibold gap-2 shadow-gentle hover:scale-[1.01] active:scale-[0.99] transition-all"
                            onClick={() => router.push(`/focus/${task.taskId}`)}
                        >
                            <Play className="h-5 w-5 fill-current" />
                            Focus on this now
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="gap-2 text-muted-foreground hover:text-foreground">
                                <Info className="h-4 w-4" />
                                Edit Details
                            </Button>
                            <Button
                                variant="ghost"
                                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                onClick={handleCompost}
                                disabled={isUpdating}
                            >
                                <Trash2 className="h-4 w-4" />
                                Let it go
                            </Button>
                        </div>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
