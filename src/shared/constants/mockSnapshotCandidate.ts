import type {
  ForecastRecord,
  ObservationRecord,
} from "@/shared/api/types";

export const mockSnapshotCandidate = {
  snapshot: {
    snapshot_id: "draft-2026-04-09",
    status: "draft",
    observed_until: "2026-04-09",
    published_at: null,
    forecast_generated_at: "2026-04-09",
    source_note: "mock analytics candidate generated from normalized records",
  },
  observations: [
    {
      observation_id: "obs-31023-flu-a-7-2026-04-09",
      region_id: "31023",
      disease_id: "flu-a",
      age: 7,
      risk_level: "high",
      trend_summary: "최근 관측 기준 위험 증가 가능성이 높음",
    },
    {
      observation_id: "obs-11160-rsv-5-2026-04-09",
      region_id: "11160",
      disease_id: "rsv",
      age: 5,
      risk_level: "medium",
      trend_summary: "최근 관측 기준 완만한 확산 신호",
    },
  ] satisfies ObservationRecord[],
  forecasts: [
    {
      forecast_id: "fc-31023-flu-a-7-2026-04-09",
      region_id: "31023",
      disease_id: "flu-a",
      age: 7,
      week_direction: "increase",
      month_direction: "steady",
      confidence: "medium",
    },
    {
      forecast_id: "fc-11160-rsv-5-2026-04-09",
      region_id: "11160",
      disease_id: "rsv",
      age: 5,
      week_direction: "steady",
      month_direction: "decrease",
      confidence: "medium",
    },
  ] satisfies ForecastRecord[],
};
