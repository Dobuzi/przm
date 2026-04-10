import { useQuery } from "@tanstack/react-query";
import { useSelectionStore } from "@/features/selection-context/store";
import { apiClient } from "@/shared/api/client";

export function useObservations() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);

  return useQuery({
    queryKey: ["observations", regionId, diseaseId, age],
    queryFn: () => apiClient.fetchObservations({ regionId, diseaseId, age }),
    staleTime: 30_000,
  });
}
