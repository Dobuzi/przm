import type {
  ForecastRecord,
  ObservationBreakdownResponse,
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
  breakdowns: [
    {
      region_id: "31023",
      disease_id: "flu-a",
      age: 7,
      summary: "최근 관측 기준 위험 증가 가능성이 높음",
      recent_trend: [
        { week_label: "4주 전", risk_level: "low", cases: 16 },
        { week_label: "3주 전", risk_level: "medium", cases: 17 },
        { week_label: "2주 전", risk_level: "medium", cases: 18 },
        { week_label: "이번 주", risk_level: "high", cases: 22 },
      ],
      age_distribution: [
        { age: 6, cases: 16 },
        { age: 7, cases: 22 },
        { age: 8, cases: 18 },
      ],
      gender_distribution: [
        { gender: "male", cases: 13 },
        { gender: "female", cases: 9 },
      ],
    },
    {
      region_id: "11160",
      disease_id: "rsv",
      age: 5,
      summary: "최근 관측 기준 완만한 확산 신호",
      recent_trend: [
        { week_label: "4주 전", risk_level: "low", cases: 6 },
        { week_label: "3주 전", risk_level: "medium", cases: 7 },
        { week_label: "2주 전", risk_level: "medium", cases: 8 },
        { week_label: "이번 주", risk_level: "medium", cases: 12 },
      ],
      age_distribution: [
        { age: 4, cases: 6 },
        { age: 5, cases: 12 },
        { age: 6, cases: 8 },
      ],
      gender_distribution: [
        { gender: "male", cases: 5 },
        { gender: "female", cases: 7 },
      ],
    },
  ] satisfies Array<
    ObservationBreakdownResponse & {
      region_id: string;
      disease_id: string;
      age: number;
    }
  >,
};
