import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => apiClient.fetchRegions(),
    staleTime: Infinity,
  });
}
