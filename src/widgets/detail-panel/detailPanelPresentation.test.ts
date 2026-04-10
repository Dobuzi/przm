import { describe, expect, it } from "vitest";
import {
  buildAgeDistributionPresentation,
  buildGenderDistributionPresentation,
  buildTrendPresentation,
} from "@/widgets/detail-panel/detailPanelPresentation";

describe("buildTrendPresentation", () => {
  it("computes relative bar heights from trend values", () => {
    const presentation = buildTrendPresentation([
      { weekLabel: "4주 전", riskLevel: "medium", cases: 10 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 20 },
      { weekLabel: "이번 주", riskLevel: "high", cases: 30 },
    ]);

    expect(presentation[0]).toMatchObject({
      weekLabel: "4주 전",
      barHeight: "33%",
    });
    expect(presentation[2]).toMatchObject({
      weekLabel: "이번 주",
      barHeight: "100%",
    });
  });
});

describe("buildAgeDistributionPresentation", () => {
  it("highlights the currently selected age and computes widths", () => {
    const presentation = buildAgeDistributionPresentation(
      [
        { age: 6, cases: 10 },
        { age: 7, cases: 22 },
        { age: 8, cases: 12 },
      ],
      7,
    );

    expect(presentation[1]).toMatchObject({
      age: 7,
      isSelected: true,
      width: "100%",
    });
    expect(presentation[0]).toMatchObject({
      age: 6,
      isSelected: false,
      width: "45%",
    });
  });
});

describe("buildGenderDistributionPresentation", () => {
  it("computes ratios for gender distribution", () => {
    const presentation = buildGenderDistributionPresentation([
      { gender: "male", cases: 12 },
      { gender: "female", cases: 8 },
    ]);

    expect(presentation).toEqual([
      { gender: "male", cases: 12, ratioLabel: "60%" },
      { gender: "female", cases: 8, ratioLabel: "40%" },
    ]);
  });
});
