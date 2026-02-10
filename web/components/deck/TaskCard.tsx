import { Task } from "@spurtalk/shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  // Map effort to color/label
  const effortColors = {
    Tiny: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Small: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    Medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Big: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };

  const deadlineColor =
    task.fuzzyDeadline === "Soon"
      ? "text-orange-500 font-bold"
      : "text-gray-500";

  return (
    <Card
      className={cn(
        "w-full h-full flex flex-col justify-between shadow-xl",
        className
      )}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className={cn("mb-2", effortColors[task.effortLevel])}
          >
            {task.effortLevel} Effort
          </Badge>
          {task.emotionalTag && (
            <Badge variant="secondary" className="mb-2">
              {task.emotionalTag}
            </Badge>
          )}
        </div>
        <CardTitle className="text-3xl">{task.title}</CardTitle>
        <CardDescription className={cn("mt-2 text-lg", deadlineColor)}>
          Due: {task.fuzzyDeadline}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        {task.description && (
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {task.description}
          </p>
        )}
        {task.motivationCategory && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <span className="font-semibold block mb-1">Motivation:</span>
            {task.motivationCategory}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground/60 px-6 pb-6">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
          Swipe Right to Do
        </div>
        <div className="flex items-center gap-1.5">
          Swipe Left for Later
          <span className="w-1.5 h-1.5 rounded-full bg-border" />
        </div>
      </CardFooter>
    </Card>
  );
}
