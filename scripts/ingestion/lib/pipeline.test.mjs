import { describe, expect, it } from "vitest";
import { ingestRecords } from "./pipeline.mjs";

describe("ingestRecords", () => {
  it("normalizes supported records and quarantines unsupported ones", () => {
    const result = ingestRecords([
      {
        source_name: "sample",
        source_record_id: "1",
        reported_date: "2026-04-09",
        region_label: "성남시 분당구",
        disease_label: "Flu A",
        age_raw: "7세",
        gender_raw: "M",
        case_count_raw: "22",
      },
      {
        source_name: "sample",
        source_record_id: "2",
        reported_date: "2026-04-09",
        region_label: "부산 해운대구",
        disease_label: "RSV",
        age_raw: "5",
        gender_raw: "F",
        case_count_raw: "10",
      },
      {
        source_name: "sample",
        source_record_id: "3",
        reported_date: "2026-04-09",
        region_label: "수원시 영통구",
        disease_label: "Unknown Virus",
        age_raw: "9",
        gender_raw: "M",
        case_count_raw: "8",
      },
      {
        source_name: "sample",
        source_record_id: "4",
        reported_date: "2026-04-09",
        region_label: "서울특별시 강서구",
        disease_label: "heat illness",
        age_raw: "7",
        gender_raw: "남",
        case_count_raw: "3",
      },
      {
        source_name: "sample",
        source_record_id: "5",
        reported_date: "2026-04-09",
        region_label: "서울특별시 강서구",
        disease_label: "말라리아",
        age_raw: "7",
        gender_raw: "남",
        case_count_raw: "2",
      },
    ]);

    expect(result.normalizedRecords).toEqual([
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
        sourceRecordId: "4",
        date: "2026-04-09",
        regionId: "11160",
        diseaseId: "heat-illness",
        age: 7,
        gender: "male",
        caseCount: 3,
        isQuarantined: false,
        quarantineReason: null,
      },
      {
        sourceName: "sample",
        sourceRecordId: "5",
        date: "2026-04-09",
        regionId: "11160",
        diseaseId: "malaria",
        age: 7,
        gender: "male",
        caseCount: 2,
        isQuarantined: false,
        quarantineReason: null,
      },
    ]);
    expect(result.quarantinedRecords).toHaveLength(2);
    expect(result.summary.quarantineByReason).toEqual({
      unsupported_region: 1,
      unknown_disease: 1,
    });
  });
});
