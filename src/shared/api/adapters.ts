import type { DashboardResponse } from "@/shared/api/types";
import type { Forecast, Observation } from "@/shared/types/domain";

interface NormalizedDashboardData {
  observations: Observation[];
  forecasts: Forecast[];
}

export function normalizeDashboardPayload(
  payload: DashboardResponse,
): NormalizedDashboardData {
  return {
    observations: payload.observations.map((item) => ({
      id: item.observation_id,
      regionId: item.region_id,
      diseaseId: item.disease_id,
      age: item.age,
      riskLevel: item.risk_level,
      trendSummary: item.trend_summary,
    })),
    forecasts: payload.forecasts.map((item) => ({
      id: item.forecast_id,
      regionId: item.region_id,
      diseaseId: item.disease_id,
      age: item.age,
      weekDirection: item.week_direction,
      monthDirection: item.month_direction,
      confidence: item.confidence,
    })),
  };
}

