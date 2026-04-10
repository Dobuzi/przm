import { describe, expect, it } from "vitest";
import {
  normalizeDashboardPayload,
  normalizeObservationBreakdown,
} from "@/shared/api/adapters";
import type {
  DashboardResponse,
  ObservationBreakdownResponse,
} from "@/shared/api/types";

describe("normalizeDashboardPayload", () => {
  it("maps API response fields into domain models", () => {
    const payload: DashboardResponse = {
      observations: [
        {
          observation_id: "obs-1",
          region_id: "31023",
          disease_id: "flu-a",
          age: 7,
          risk_level: "high",
          trend_summary: "최근 7일 확산세 증가",
        },
      ],
      forecasts: [
        {
          forecast_id: "fc-1",
          region_id: "31023",
          disease_id: "flu-a",
          age: 7,
          week_direction: "increase",
          month_direction: "steady",
          confidence: "medium",
        },
      ],
    };

    const normalized = normalizeDashboardPayload(payload);

    expect(normalized.observations[0]).toEqual({
      id: "obs-1",
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
      riskLevel: "high",
      trendSummary: "최근 7일 확산세 증가",
    });
    expect(normalized.forecasts[0]).toEqual({
      id: "fc-1",
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
      weekDirection: "increase",
      monthDirection: "steady",
      confidence: "medium",
    });
  });
});

describe("normalizeObservationBreakdown", () => {
  it("maps breakdown API response into UI-friendly fields", () => {
    const payload: ObservationBreakdownResponse = {
      summary: "최근 7일 확산세 증가",
      recent_trend: [
        {
          week_label: "4주 전",
          risk_level: "medium",
          cases: 18,
        },
      ],
      age_distribution: [
        {
          age: 7,
          cases: 22,
        },
      ],
      gender_distribution: [
        {
          gender: "male",
          cases: 12,
        },
      ],
    };

    const normalized = normalizeObservationBreakdown(payload);

    expect(normalized).toEqual({
      summary: "최근 7일 확산세 증가",
      recentTrend: [
        {
          weekLabel: "4주 전",
          riskLevel: "medium",
          cases: 18,
        },
      ],
      ageDistribution: [
        {
          age: 7,
          cases: 22,
        },
      ],
      genderDistribution: [
        {
          gender: "male",
          cases: 12,
        },
      ],
    });
  });
});
