import { useQuery } from "@tanstack/react-query";
import { fetchRegions } from "@/shared/api/mockApi";

export function useRegions() {
  return useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
    staleTime: Infinity,
  });
}

