import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/shared/api/mockApi";
import { useSelectionStore } from "@/features/selection-context/store";

export function useDashboardData() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);

  return useQuery({
    queryKey: ["dashboard-data", regionId, diseaseId, age],
    queryFn: () => fetchDashboardData({ regionId, diseaseId, age }),
    staleTime: 30_000,
  });
}
