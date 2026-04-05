import type {
  DashboardResponse,
  DiseaseRecord,
  DiseasesResponse,
  ForecastRecord,
  ObservationRecord,
  RegionsResponse,
} from "@/shared/api/types";
import type { Disease, Forecast, Observation, Region } from "@/shared/types/domain";

interface NormalizedDashboardData {
  observations: Observation[];
  forecasts: Forecast[];
}

export function normalizeObservation(item: ObservationRecord): Observation {
  return {
    id: item.observation_id,
    regionId: item.region_id,
    diseaseId: item.disease_id,
    age: item.age,
    riskLevel: item.risk_level,
    trendSummary: item.trend_summary,
  };
}

export function normalizeForecast(item: ForecastRecord): Forecast {
  return {
    id: item.forecast_id,
    regionId: item.region_id,
    diseaseId: item.disease_id,
    age: item.age,
    weekDirection: item.week_direction,
    monthDirection: item.month_direction,
    confidence: item.confidence,
  };
}

export function normalizeRegions(payload: RegionsResponse): Region[] {
  return payload.items.map((item) => ({
    id: item.region_id,
    name: item.name,
    province: item.province,
  }));
}

export function normalizeDisease(item: DiseaseRecord): Disease {
  return {
    id: item.disease_id,
    name: item.display_name,
  };
}

export function normalizeDiseases(payload: DiseasesResponse): Disease[] {
  return payload.items.map(normalizeDisease);
}

export function normalizeDashboardPayload(
  payload: DashboardResponse,
): NormalizedDashboardData {
  return {
    observations: payload.observations.map(normalizeObservation),
    forecasts: payload.forecasts.map(normalizeForecast),
  };
}
