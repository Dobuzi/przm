import { useQuery } from "@tanstack/react-query";
import { normalizeObservationBreakdown } from "@/shared/api/adapters";
import { apiClient } from "@/shared/api/client";
import { useSelectionStore } from "@/features/selection-context/store";

export function useObservationBreakdown() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);

  return useQuery({
    queryKey: ["observation-breakdown", regionId, diseaseId, age],
    queryFn: async () => {
      const response = await apiClient.fetchObservationBreakdown({
        regionId,
        diseaseId,
        age,
      });
      return normalizeObservationBreakdown(response);
    },
    staleTime: 30_000,
  });
}
