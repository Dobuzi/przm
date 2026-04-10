import { describe, expect, it } from "vitest";
import {
  fetchDashboardData,
  fetchDiseases,
  fetchForecasts,
  fetchObservationBreakdown,
  fetchObservations,
  fetchRegions,
} from "@/shared/api/mockApi";

describe("fetchDashboardData", () => {
  it("filters dashboard data by region, disease, and age", async () => {
    const data = await fetchDashboardData({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(data.observations).toHaveLength(1);
    expect(data.forecasts).toHaveLength(1);
    expect(data.observations[0].regionId).toBe("31023");
    expect(data.observations[0].diseaseId).toBe("flu-a");
    expect(data.observations[0].age).toBe(7);
  });

  it("returns empty arrays instead of throwing when filters have no matching data", async () => {
    const data = await fetchDashboardData({
      regionId: "11160",
      diseaseId: "flu-a",
      age: 13,
    });

    expect(data.observations).toEqual([]);
    expect(data.forecasts).toEqual([]);
  });

  it("fetches filtered observations as API records", async () => {
    const response = await fetchObservations({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].observation_id).toBe("obs-1");
  });

  it("fetches filtered forecasts as API records", async () => {
    const response = await fetchForecasts({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].forecast_id).toBe("fc-1");
  });

  it("returns region and disease metadata", async () => {
    const [regionResponse, diseaseResponse] = await Promise.all([
      fetchRegions(),
      fetchDiseases(),
    ]);

    expect(regionResponse.items.length).toBeGreaterThan(10);
    expect(regionResponse.items.some((item) => item.region_id === "11160")).toBe(true);
    expect(diseaseResponse.items.some((item) => item.disease_id === "flu-a")).toBe(true);
  });

  it("returns filtered observation breakdown data for the detail panel", async () => {
    const response = await fetchObservationBreakdown({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(response.summary).toBe("최근 7일 확산세 증가");
    expect(response.recent_trend).toHaveLength(4);
    expect(response.recent_trend[0]).toEqual({
      week_label: "4주 전",
      risk_level: "medium",
      cases: 18,
    });
    expect(response.age_distribution[0]).toEqual({
      age: 7,
      cases: 22,
    });
    expect(response.gender_distribution).toEqual([
      { gender: "male", cases: 12 },
      { gender: "female", cases: 10 },
    ]);
  });
});
