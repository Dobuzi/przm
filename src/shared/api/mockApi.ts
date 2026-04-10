import { normalizeDashboardPayload } from "@/shared/api/adapters";
import type {
  DashboardResponse,
  DiseasesResponse,
  ForecastRecord,
  ForecastsResponse,
  ObservationBreakdownResponse,
  ObservationRecord,
  ObservationsResponse,
  RegionsResponse,
} from "@/shared/api/types";
import {
  diseases,
  forecasts,
  observationBreakdowns,
  observations,
  regions,
} from "@/shared/constants/mockData";
import { mockSnapshotCandidate } from "@/shared/constants/mockSnapshotCandidate";

interface DashboardFilters {
  regionId?: string;
  diseaseId?: string;
  age?: number;
}

const syntheticCurrentCasesByRisk = {
  high: 22,
  medium: 12,
  low: 8,
} as const;

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

function toSelectionKey(item: {
  regionId: string;
  diseaseId: string;
  age: number;
}) {
  return `${item.regionId}:${item.diseaseId}:${item.age}`;
}

function buildObservationItems(): ObservationRecord[] {
  const derivedItems = mockSnapshotCandidate.observations;
  const derivedKeys = new Set(
    derivedItems.map((item) =>
      toSelectionKey({
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      }),
    ),
  );

  const fallbackItems = observations
    .filter(
      (item) =>
        !derivedKeys.has(
          toSelectionKey({
            regionId: item.regionId,
            diseaseId: item.diseaseId,
            age: item.age,
          }),
        ),
    )
    .map((item) => ({
      observation_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      risk_level: item.riskLevel,
      trend_summary: item.trendSummary,
    }));

  return [...derivedItems, ...fallbackItems];
}

function buildForecastItems(): ForecastRecord[] {
  const derivedItems = mockSnapshotCandidate.forecasts;
  const derivedKeys = new Set(
    derivedItems.map((item) =>
      toSelectionKey({
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      }),
    ),
  );

  const fallbackItems = forecasts
    .filter(
      (item) =>
        !derivedKeys.has(
          toSelectionKey({
            regionId: item.regionId,
            diseaseId: item.diseaseId,
            age: item.age,
          }),
        ),
    )
    .map((item) => ({
      forecast_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      week_direction: item.weekDirection,
      month_direction: item.monthDirection,
      confidence: item.confidence,
    }));

  return [...derivedItems, ...fallbackItems];
}

function buildBreakdownItem(filters: DashboardFilters) {
  const derivedItem = mockSnapshotCandidate.breakdowns.find((item) =>
    matchesFilters(
      {
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      },
      filters,
    ),
  );

  if (derivedItem) {
    return {
      summary: derivedItem.summary,
      recent_trend: derivedItem.recent_trend.map((point) => ({
        week_label: point.week_label,
        risk_level: point.risk_level,
        cases: point.cases,
      })),
      age_distribution: [...derivedItem.age_distribution]
        .sort((left, right) => {
          if (typeof filters.age !== "number") {
            return left.age - right.age;
          }

          if (left.age === filters.age) {
            return -1;
          }

          if (right.age === filters.age) {
            return 1;
          }

          return left.age - right.age;
        })
        .map((point) => ({
          age: point.age,
          cases: point.cases,
        })),
      gender_distribution: derivedItem.gender_distribution.map((point) => ({
        gender: point.gender,
        cases: point.cases,
      })),
    };
  }

  return null;
}

function sortAgeDistribution(
  ageDistribution: ObservationBreakdownResponse["age_distribution"],
  selectedAge?: number,
) {
  return [...ageDistribution].sort((left, right) => {
    if (typeof selectedAge !== "number") {
      return left.age - right.age;
    }

    if (left.age === selectedAge) {
      return -1;
    }

    if (right.age === selectedAge) {
      return 1;
    }

    return left.age - right.age;
  });
}

function buildSyntheticRecentTrend(item: ObservationRecord) {
  const currentCases = syntheticCurrentCasesByRisk[item.risk_level];

  if (item.risk_level === "high") {
    return [
      { week_label: "4주 전", risk_level: "low", cases: currentCases - 6 },
      { week_label: "3주 전", risk_level: "medium", cases: currentCases - 5 },
      { week_label: "2주 전", risk_level: "medium", cases: currentCases - 4 },
      { week_label: "이번 주", risk_level: "high", cases: currentCases },
    ] satisfies ObservationBreakdownResponse["recent_trend"];
  }

  if (item.risk_level === "medium") {
    return [
      { week_label: "4주 전", risk_level: "low", cases: currentCases - 4 },
      { week_label: "3주 전", risk_level: "medium", cases: currentCases - 2 },
      { week_label: "2주 전", risk_level: "medium", cases: currentCases - 1 },
      { week_label: "이번 주", risk_level: "medium", cases: currentCases },
    ] satisfies ObservationBreakdownResponse["recent_trend"];
  }

  return [
    { week_label: "4주 전", risk_level: "medium", cases: currentCases + 6 },
    { week_label: "3주 전", risk_level: "medium", cases: currentCases + 5 },
    { week_label: "2주 전", risk_level: "low", cases: currentCases + 2 },
    { week_label: "이번 주", risk_level: "low", cases: currentCases },
  ] satisfies ObservationBreakdownResponse["recent_trend"];
}

function buildSyntheticAgeDistribution(item: ObservationRecord) {
  const currentCases = syntheticCurrentCasesByRisk[item.risk_level];

  return [
    { age: item.age - 1, cases: Math.max(1, currentCases - 2) },
    { age: item.age, cases: currentCases },
    { age: item.age + 1, cases: Math.max(1, currentCases - 3) },
  ] satisfies ObservationBreakdownResponse["age_distribution"];
}

function buildSyntheticGenderDistribution(item: ObservationRecord) {
  const currentCases = syntheticCurrentCasesByRisk[item.risk_level];
  const maleCases = Math.ceil(currentCases / 2);

  return [
    { gender: "male", cases: maleCases },
    { gender: "female", cases: currentCases - maleCases },
  ] satisfies ObservationBreakdownResponse["gender_distribution"];
}

function buildSyntheticBreakdownItem(
  item: ObservationRecord,
  filters: DashboardFilters,
): ObservationBreakdownResponse {
  return {
    summary: item.trend_summary,
    recent_trend: buildSyntheticRecentTrend(item),
    age_distribution: sortAgeDistribution(
      buildSyntheticAgeDistribution(item),
      filters.age,
    ),
    gender_distribution: buildSyntheticGenderDistribution(item),
  };
}

export async function fetchObservations(
  filters: DashboardFilters = {},
): Promise<ObservationsResponse> {
  await sleep(180);

  const items = buildObservationItems().filter((item) =>
    matchesFilters(
      {
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      },
      filters,
    ),
  );

  return { items };
}

export async function fetchForecasts(
  filters: DashboardFilters = {},
): Promise<ForecastsResponse> {
  await sleep(180);

  const items = buildForecastItems().filter((item) =>
    matchesFilters(
      {
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      },
      filters,
    ),
  );

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

export async function fetchObservationBreakdown(
  filters: DashboardFilters = {},
): Promise<ObservationBreakdownResponse> {
  await sleep(180);

  const derivedItem = buildBreakdownItem(filters);
  if (derivedItem) {
    return derivedItem;
  }

  const syntheticSource = buildObservationItems().find((item) =>
    matchesFilters(
      {
        regionId: item.region_id,
        diseaseId: item.disease_id,
        age: item.age,
      },
      filters,
    ),
  );

  if (syntheticSource) {
    return buildSyntheticBreakdownItem(syntheticSource, filters);
  }

  const item = observationBreakdowns.find((entry) => matchesFilters(entry, filters));

  if (!item) {
    return {
      summary: "",
      recent_trend: [],
      age_distribution: [],
      gender_distribution: [],
    };
  }

  return {
    summary: item.summary,
    recent_trend: item.recentTrend.map((point) => ({
      week_label: point.weekLabel,
      risk_level: point.riskLevel,
      cases: point.cases,
    })),
    age_distribution: sortAgeDistribution(
      [...item.ageDistribution].map((point) => ({
        age: point.age,
        cases: point.cases,
      })),
      filters.age,
    )
      .map((point) => ({
        age: point.age,
        cases: point.cases,
      })),
    gender_distribution: item.genderDistribution.map((point) => ({
      gender: point.gender,
      cases: point.cases,
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
