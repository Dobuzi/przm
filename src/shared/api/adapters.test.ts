import { describe, expect, it } from "vitest";
import { normalizeDashboardPayload } from "@/shared/api/adapters";
import type { DashboardResponse } from "@/shared/api/types";

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
