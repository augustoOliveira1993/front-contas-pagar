import { toast } from "sonner";
import { api } from "@/lib/axios-instance";
import {
  QueryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface UseFetchProps<T> {
  queryKey: string[];
  route: string;
  rest?: Omit<QueryOptions<T>, "queryKey" | "queryFn">;
}

interface UseCustomMutationsProps<T> {
  route: string;
  mutationKey: string[];
  queryInvalidationKeys?: string[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const useFetch = <T>({ route, queryKey, ...rest }: UseFetchProps<T>) => {
  return useQuery<T>({
    ...rest,
    queryKey,
    queryFn: async () => {
      const { data: response } = await api.get(route).then((res) => {
        return res.data;
      });
      return response;
    },
  });
};

export function useCreate<T>({
  route,
  queryInvalidationKeys,
  onSuccess,
  onError,
  mutationKey,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ formData }: { formData: T }) => {
      const response = await api.post<T>(route, formData);
      return response.data;
    },
    onSuccess: (data: T) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        toast.success("Criado com sucesso!");
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      } else {
        toast.error("Ocorreu um erro ao criar!");
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}

export function useUpdate<T>({
  route,
  queryInvalidationKeys,
  mutationKey,
  onSuccess,
  onError,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ formData, id }: { formData: T; id: string }) => {
      const response = await api.put<T>(`${route}/${id}`, formData);
      return response.data;
    },
    onSuccess: (data: T) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        toast.success("Atualizado com sucesso!");
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      } else {
        toast.error("Ocorreu um erro ao atualizar!");
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}

export function useDelete<T>({
  route,
  queryInvalidationKeys,
  mutationKey,
  onSuccess,
  onError,
}: UseCustomMutationsProps<T>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey,
    mutationFn: async ({ id }: { id: string }) => {
      await api.delete(`${route}/${id}`);
    },
    onSuccess: (data: any) => {
      if (onSuccess) {
        onSuccess(data);
      } else {
        toast.success("Excluído com sucesso!");
      }
    },
    onError: (error: Error) => {
      if (onError) {
        onError(error);
      } else {
        toast.error("Ocorreu um erro ao excluir!");
      }
    },
    onSettled: () => {
      queryInvalidationKeys?.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
      });
    },
  });
}
