import { normalizeDashboardPayload } from "@/shared/api/adapters";
import {
  fetchDashboardData as fetchMockDashboardData,
  fetchDiseases as fetchMockDiseases,
  fetchForecasts as fetchMockForecasts,
  fetchObservationBreakdown as fetchMockObservationBreakdown,
  fetchObservations as fetchMockObservations,
  fetchRegions as fetchMockRegions,
} from "@/shared/api/mockApi";
import type {
  DashboardResponse,
  DiseasesResponse,
  ForecastsResponse,
  ObservationBreakdownResponse,
  ObservationsResponse,
  RegionsResponse,
} from "@/shared/api/types";
import { env } from "@/shared/config/env";

export interface DashboardFilters {
  regionId?: string;
  diseaseId?: string;
  age?: number;
}

type ApiMode = "mock" | "real";

interface MockClient {
  fetchRegions: () => Promise<RegionsResponse>;
  fetchDiseases: () => Promise<DiseasesResponse>;
  fetchObservations: (filters?: DashboardFilters) => Promise<ObservationsResponse>;
  fetchForecasts: (filters?: DashboardFilters) => Promise<ForecastsResponse>;
  fetchObservationBreakdown: (
    filters?: DashboardFilters,
  ) => Promise<ObservationBreakdownResponse>;
  fetchDashboardData?: (filters?: DashboardFilters) => ReturnType<typeof fetchMockDashboardData>;
}

interface CreateApiClientOptions {
  mode: ApiMode;
  baseUrl: string;
  mockClient: MockClient;
  fetchImpl?: typeof fetch;
}

function buildQueryString(filters: DashboardFilters = {}) {
  const params = new URLSearchParams();

  if (filters.regionId) {
    params.set("region_id", filters.regionId);
  }

  if (filters.diseaseId) {
    params.set("disease_id", filters.diseaseId);
  }

  if (typeof filters.age === "number") {
    params.set("age", String(filters.age));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

async function fetchJson<T>(
  fetchImpl: typeof fetch,
  url: string,
): Promise<T> {
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function createApiClient({
  mode,
  baseUrl,
  mockClient,
  fetchImpl = fetch,
}: CreateApiClientOptions) {
  if (mode === "mock") {
    return {
      fetchRegions: mockClient.fetchRegions,
      fetchDiseases: mockClient.fetchDiseases,
      fetchObservations: mockClient.fetchObservations,
      fetchForecasts: mockClient.fetchForecasts,
      fetchObservationBreakdown: mockClient.fetchObservationBreakdown,
      fetchDashboardData:
        mockClient.fetchDashboardData ?? ((filters?: DashboardFilters) => fetchMockDashboardData(filters)),
    };
  }

  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    fetchRegions: () =>
      fetchJson<RegionsResponse>(fetchImpl, `${normalizedBaseUrl}/regions`),
    fetchDiseases: () =>
      fetchJson<DiseasesResponse>(fetchImpl, `${normalizedBaseUrl}/diseases`),
    fetchObservations: (filters: DashboardFilters = {}) =>
      fetchJson<ObservationsResponse>(
        fetchImpl,
        `${normalizedBaseUrl}/observations${buildQueryString(filters)}`,
      ),
    fetchForecasts: (filters: DashboardFilters = {}) =>
      fetchJson<ForecastsResponse>(
        fetchImpl,
        `${normalizedBaseUrl}/forecasts${buildQueryString(filters)}`,
      ),
    fetchObservationBreakdown: (filters: DashboardFilters = {}) =>
      fetchJson<ObservationBreakdownResponse>(
        fetchImpl,
        `${normalizedBaseUrl}/observations/breakdown${buildQueryString(filters)}`,
      ),
    fetchDashboardData: async (filters: DashboardFilters = {}) => {
      const payload = await fetchJson<DashboardResponse>(
        fetchImpl,
        `${normalizedBaseUrl}/dashboard${buildQueryString(filters)}`,
      );
      return normalizeDashboardPayload(payload);
    },
  };
}

export const apiClient = createApiClient({
  mode: env.apiMode,
  baseUrl: env.apiBaseUrl,
  mockClient: {
    fetchRegions: fetchMockRegions,
    fetchDiseases: fetchMockDiseases,
    fetchObservations: fetchMockObservations,
    fetchForecasts: fetchMockForecasts,
    fetchObservationBreakdown: fetchMockObservationBreakdown,
    fetchDashboardData: fetchMockDashboardData,
  },
});
