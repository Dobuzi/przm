import { useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "@/features/selection-context/store";
import { apiClient, type DashboardFilters } from "@/shared/api/client";

export function useForecasts(filtersOverride?: DashboardFilters) {
  const selectedRegionId = useSelectionStore((state) => state.regionId);
  const selectedDiseaseId = useSelectionStore((state) => state.diseaseId);
  const selectedAge = useSelectionStore((state) => state.age);
  const regionId = filtersOverride?.regionId ?? selectedRegionId;
  const diseaseId = filtersOverride?.diseaseId ?? selectedDiseaseId;
  const age = filtersOverride?.age ?? selectedAge;

  return useQuery({
    queryKey: ["forecasts", regionId, diseaseId, age],
    queryFn: () => apiClient.fetchForecasts({ regionId, diseaseId, age }),
    staleTime: 30_000,
  });
}
