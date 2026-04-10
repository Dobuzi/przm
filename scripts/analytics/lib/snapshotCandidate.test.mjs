import { describe, expect, it } from "vitest";
import { buildSnapshotCandidate } from "./snapshotCandidate.mjs";

describe("buildSnapshotCandidate", () => {
  it("builds observations and forecasts from normalized records", () => {
    const candidate = buildSnapshotCandidate([
      {
        sourceName: "sample",
        sourceRecordId: "1",
        date: "2026-04-09",
        regionId: "31023",
        diseaseId: "flu-a",
        age: 7,
        gender: "male",
        caseCount: 22,
        isQuarantined: false,
        quarantineReason: null,
      },
      {
        sourceName: "sample",
        sourceRecordId: "2",
        date: "2026-04-09",
        regionId: "11160",
        diseaseId: "rsv",
        age: 5,
        gender: "female",
        caseCount: 12,
        isQuarantined: false,
        quarantineReason: null,
      },
    ]);

    expect(candidate.snapshot).toEqual({
      snapshot_id: "draft-2026-04-09",
      status: "draft",
      observed_until: "2026-04-09",
      published_at: null,
      forecast_generated_at: "2026-04-09",
      source_note: "mock analytics candidate generated from normalized records",
    });
    expect(candidate.observations).toHaveLength(2);
    expect(candidate.forecasts).toHaveLength(2);
    expect(candidate.observations[0]).toMatchObject({
      region_id: "31023",
      disease_id: "flu-a",
      age: 7,
      risk_level: "high",
    });
    expect(candidate.forecasts[1]).toMatchObject({
      region_id: "11160",
      disease_id: "rsv",
      age: 5,
      week_direction: "steady",
      month_direction: "decrease",
      confidence: "medium",
    });
  });
});
