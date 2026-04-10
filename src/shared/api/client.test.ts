import { describe, expect, it, vi } from "vitest";
import type {
  DiseasesResponse,
  ForecastsResponse,
  ObservationBreakdownResponse,
  ObservationsResponse,
  RegionsResponse,
} from "@/shared/api/types";
import { createApiClient } from "@/shared/api/client";

describe("createApiClient", () => {
  it("delegates to the mock client in mock mode", async () => {
    const mockClient = {
      fetchRegions: vi.fn<() => Promise<RegionsResponse>>().mockResolvedValue({ items: [] }),
      fetchDiseases: vi.fn<() => Promise<DiseasesResponse>>().mockResolvedValue({ items: [] }),
      fetchObservations: vi
        .fn<() => Promise<ObservationsResponse>>()
        .mockResolvedValue({ items: [] }),
      fetchForecasts: vi.fn<() => Promise<ForecastsResponse>>().mockResolvedValue({ items: [] }),
      fetchObservationBreakdown: vi
        .fn<() => Promise<ObservationBreakdownResponse>>()
        .mockResolvedValue({
          summary: "",
          recent_trend: [],
          age_distribution: [],
          gender_distribution: [],
        }),
    };

    const client = createApiClient({
      mode: "mock",
      baseUrl: "http://localhost:4000/api/v1",
      mockClient,
      fetchImpl: vi.fn(),
    });

    await client.fetchRegions();

    expect(mockClient.fetchRegions).toHaveBeenCalledTimes(1);
  });

  it("uses fetch with query params in real mode", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    const client = createApiClient({
      mode: "real",
      baseUrl: "http://localhost:4000/api/v1",
      mockClient: {
        fetchRegions: vi.fn(),
        fetchDiseases: vi.fn(),
        fetchObservations: vi.fn(),
        fetchForecasts: vi.fn(),
        fetchObservationBreakdown: vi.fn(),
      },
      fetchImpl,
    });

    await client.fetchObservations({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:4000/api/v1/observations?region_id=31023&disease_id=flu-a&age=7",
      expect.objectContaining({
        headers: {
          Accept: "application/json",
        },
      }),
    );
  });
});
