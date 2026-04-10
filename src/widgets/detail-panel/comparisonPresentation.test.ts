import { describe, expect, it } from "vitest";
import {
  buildComparisonCardTitle,
  buildComparisonSummary,
} from "@/widgets/detail-panel/comparisonPresentation";

describe("buildComparisonCardTitle", () => {
  it("builds a region comparison title", () => {
    expect(
      buildComparisonCardTitle({
        mode: "region",
        regionName: "강서구",
        diseaseName: "독감 A형",
      }),
    ).toBe("강서구 · 독감 A형");
  });

  it("builds a disease comparison title", () => {
    expect(
      buildComparisonCardTitle({
        mode: "disease",
        regionName: "성남시 분당구",
        diseaseName: "RSV",
      }),
    ).toBe("성남시 분당구 · RSV");
  });
});

describe("buildComparisonSummary", () => {
  it("describes a region comparison", () => {
    expect(
      buildComparisonSummary({
        mode: "region",
        baseLabel: "성남시 분당구",
        comparisonLabel: "강서구",
      }),
    ).toBe("성남시 분당구 기준과 강서구의 현재 위험과 예측을 비교합니다.");
  });

  it("describes a disease comparison", () => {
    expect(
      buildComparisonSummary({
        mode: "disease",
        baseLabel: "독감 A형",
        comparisonLabel: "RSV",
      }),
    ).toBe("독감 A형 기준과 RSV의 현재 위험과 예측을 비교합니다.");
  });
});
