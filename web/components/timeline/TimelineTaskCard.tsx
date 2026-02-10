"use client";

import { TimelineTask, NanoStep } from "@spurtalk/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TimelineTaskCardProps {
    task: TimelineTask;
    onClick: (task: TimelineTask) => void;
    isLeft: boolean;
}

export function TimelineTaskCard({ task, onClick }: TimelineTaskCardProps) {
    const effortColors = {
        Tiny: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Small: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Big: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };

    const emotionColors = {
        Boring: "bg-gray-100 text-gray-800",
        Scary: "bg-red-100 text-red-800",
        Fun: "bg-purple-100 text-purple-800",
        Hard: "bg-amber-100 text-amber-800",
    };

    const completedSteps = task.nanoSteps.filter((s: NanoStep) => s.isCompleted).length;
    const totalSteps = task.nanoSteps.length;
    const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    return (
        <Card
            onClick={() => onClick(task)}
            className={cn(
                "w-5/12 cursor-pointer transition-all duration-500 hover:shadow-card hover:scale-[1.02]",
                task.renderStyle === "blurred" && "blur-[1.5px] hover:blur-none opacity-80",
                task.renderStyle === "misty" && "blur-[3px] hover:blur-[0.5px] opacity-60"
            )}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground truncate max-w-[140px]" title={task.title}>
                        {task.title || "Untitled Task"}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {format(new Date(task.scheduledDate), "MMM d")}
                    </Badge>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border-none", effortColors[task.effortLevel])}>
                        {task.effortLevel}
                    </Badge>
                    {task.emotionalTag && (
                        <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 border-none", emotionColors[task.emotionalTag])}>
                            {task.emotionalTag}
                        </Badge>
                    )}
                </div>

                {totalSteps > 0 && (
                    <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-muted-foreground">
                            <span>{completedSteps}/{totalSteps} steps</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-1" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
