import { describe, expect, it } from "vitest";
import {
  createKoreanPublicHealthRecordMapper,
  mapSourceRecords,
} from "./sourceRecordMappers.mjs";

describe("source record mappers", () => {
  it("maps Korean public health fields into PRZM ingestion fields", () => {
    const mapper = createKoreanPublicHealthRecordMapper({
      sourceName: "kdca-heat-illness",
      defaultDiseaseLabel: "heat illness",
    });

    const records = mapSourceRecords(
      [
        {
          id: "row-1",
          "발생일자": "2026-04-09",
          "발생시도": "서울특별시",
          "발생시군구": "강서구",
          "성별": "남",
          "나이": "7",
          "신고건수": "3",
        },
      ],
      mapper,
    );

    expect(records).toEqual([
      {
        source_name: "kdca-heat-illness",
        source_record_id: "row-1",
        reported_date: "2026-04-09",
        region_label: "서울특별시 강서구",
        disease_label: "heat illness",
        age_raw: "7",
        gender_raw: "남",
        case_count_raw: "3",
      },
    ]);
  });

  it("uses configurable Korean field names for disease and case count", () => {
    const mapper = createKoreanPublicHealthRecordMapper({
      sourceName: "local-infection-report",
      dateField: "기준일",
      sidoField: "시도",
      sigunguField: "시군구",
      diseaseField: "질병명",
      ageField: "연령",
      genderField: "성",
      caseCountField: "환자수",
    });

    const [record] = mapSourceRecords(
      [
        {
          "기준일": "2026-04-10",
          "시도": "경기도",
          "시군구": "성남시 분당구",
          "질병명": "Flu A",
          "연령": "8세",
          "성": "F",
          "환자수": "12",
        },
      ],
      mapper,
    );

    expect(record).toMatchObject({
      source_name: "local-infection-report",
      source_record_id: "local-infection-report-2026-04-10-경기도-성남시 분당구-Flu A-8세-F",
      reported_date: "2026-04-10",
      region_label: "경기도 성남시 분당구",
      disease_label: "Flu A",
      age_raw: "8세",
      gender_raw: "F",
      case_count_raw: "12",
    });
  });
});
