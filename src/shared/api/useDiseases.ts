import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

export function useDiseases() {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: () => apiClient.fetchDiseases(),
    staleTime: Infinity,
  });
}
