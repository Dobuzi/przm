import { normalizeDashboardPayload } from "@/shared/api/adapters";
import type {
  DashboardResponse,
  DiseasesResponse,
  ForecastsResponse,
  ObservationsResponse,
  RegionsResponse,
} from "@/shared/api/types";
import {
  diseases,
  forecasts,
  observations,
  regions,
} from "@/shared/constants/mockData";

interface DashboardFilters {
  regionId?: string;
  diseaseId?: string;
  age?: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function matchesFilters(
  item: { regionId: string; diseaseId: string; age: number },
  filters: DashboardFilters,
) {
    if (filters.regionId && item.regionId !== filters.regionId) {
      return false;
    }

    if (filters.diseaseId && item.diseaseId !== filters.diseaseId) {
      return false;
    }

    if (typeof filters.age === "number" && item.age !== filters.age) {
      return false;
    }

    return true;
}

export async function fetchObservations(
  filters: DashboardFilters = {},
): Promise<ObservationsResponse> {
  await sleep(180);

  const items = observations
    .filter((item) => matchesFilters(item, filters))
    .map((item) => ({
      observation_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      risk_level: item.riskLevel,
      trend_summary: item.trendSummary,
    }));

  return { items };
}

export async function fetchForecasts(
  filters: DashboardFilters = {},
): Promise<ForecastsResponse> {
  await sleep(180);

  const items = forecasts
    .filter((item) => matchesFilters(item, filters))
    .map((item) => ({
      forecast_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      week_direction: item.weekDirection,
      month_direction: item.monthDirection,
      confidence: item.confidence,
    }));

  return { items };
}

export async function fetchRegions(): Promise<RegionsResponse> {
  await sleep(120);

  return {
    items: regions.map((item) => ({
      region_id: item.id,
      name: item.name,
      province: item.province,
    })),
  };
}

export async function fetchDiseases(): Promise<DiseasesResponse> {
  await sleep(120);

  return {
    items: diseases.map((item) => ({
      disease_id: item.id,
      display_name: item.name,
      is_active: true,
    })),
  };
}

export async function fetchDashboardData(filters: DashboardFilters = {}) {
  const [observationsResponse, forecastsResponse] = await Promise.all([
    fetchObservations(filters),
    fetchForecasts(filters),
  ]);

  const payload: DashboardResponse = {
    observations: observationsResponse.items,
    forecasts: forecastsResponse.items,
  };

  return normalizeDashboardPayload(payload);
}
