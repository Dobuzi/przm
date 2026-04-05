import { useQuery } from "@tanstack/react-query";
import { fetchDiseases } from "@/shared/api/mockApi";

export function useDiseases() {
  return useQuery({
    queryKey: ["diseases"],
    queryFn: fetchDiseases,
    staleTime: Infinity,
  });
}

