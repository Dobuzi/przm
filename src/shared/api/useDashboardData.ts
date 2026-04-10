import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/client";
import { useSelectionStore } from "@/features/selection-context/store";

export function useDashboardData() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);

  return useQuery({
    queryKey: ["dashboard-data", regionId, diseaseId, age],
    queryFn: () => apiClient.fetchDashboardData({ regionId, diseaseId, age }),
    staleTime: 30_000,
  });
}
