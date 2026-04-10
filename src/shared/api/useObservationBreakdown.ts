import { useQuery } from "@tanstack/react-query";
import { normalizeObservationBreakdown } from "@/shared/api/adapters";
import { apiClient, type DashboardFilters } from "@/shared/api/client";
import { useSelectionStore } from "@/features/selection-context/store";

export function useObservationBreakdown(filtersOverride?: DashboardFilters) {
  const selectedRegionId = useSelectionStore((state) => state.regionId);
  const selectedDiseaseId = useSelectionStore((state) => state.diseaseId);
  const selectedAge = useSelectionStore((state) => state.age);
  const regionId = filtersOverride?.regionId ?? selectedRegionId;
  const diseaseId = filtersOverride?.diseaseId ?? selectedDiseaseId;
  const age = filtersOverride?.age ?? selectedAge;

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
