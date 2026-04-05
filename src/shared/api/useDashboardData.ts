import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "@/shared/api/mockApi";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    staleTime: Infinity,
  });
}

