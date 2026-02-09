import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import type { CreateTask } from "@spurtalk/shared";

interface UseCreateTaskMutationReturn {
  mutate: (data: CreateTask) => void;
  mutateAsync: (data: CreateTask) => Promise<unknown>;
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
      queryClient.invalidateQueries({ queryKey: ["tasks", "deck"] });
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
