import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import type { CreateTask, Task } from "@spurtalk/shared";

interface UseCreateTaskMutationReturn {
  mutate: (data: CreateTask) => void;
  mutateAsync: (data: CreateTask) => Promise<Task>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  reset: () => void;
}

export function useCreateTaskMutation(): UseCreateTaskMutationReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateTask) => {
      const response = await api.post("/tasks", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync as (data: CreateTask) => Promise<Task>,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useTasksQuery(filters?: { state?: string }) {
  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: async () => {
      const response = await api.get("/tasks", { params: filters });
      return response.data as Task[];
    },
  });
}

export function useTaskQuery(taskId: string | null) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const response = await api.get(`/tasks/${taskId}`);
      return response.data as Task;
    },
    enabled: !!taskId,
  });
}

export function usePlanSubtasksQuery(taskId: string | null) {
  return useQuery({
    queryKey: ["tasks", taskId, "plan"],
    queryFn: async () => {
      if (!taskId) return null;
      const response = await api.get(`/tasks/${taskId}/plan`);
      return response.data as Partial<CreateTask>[];
    },
    enabled: false, // Manual trigger
  });
}

export function useCreateSubtasksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      parentTaskId,
      subtasks,
    }: {
      parentTaskId: string;
      subtasks: Partial<CreateTask>[];
    }) => {
      const response = await api.post(`/tasks/${parentTaskId}/subtasks`, {
        subtasks,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
