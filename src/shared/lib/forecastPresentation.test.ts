import { describe, expect, it } from "vitest";
import type { Forecast } from "@/shared/types/domain";
import {
  buildForecastPresentation,
  buildForecastSummary,
} from "@/shared/lib/forecastPresentation";

const forecast: Forecast = {
  id: "fc-1",
  regionId: "31023",
  diseaseId: "flu-a",
  age: 7,
  weekDirection: "increase",
  monthDirection: "steady",
  confidence: "medium",
};

describe("buildForecastPresentation", () => {
  it("maps forecast directions into user-facing labels and interpretation", () => {
    const presentation = buildForecastPresentation(forecast);

    expect(presentation.week.label).toBe("증가");
    expect(presentation.month.label).toBe("정체");
    expect(presentation.confidenceLabel).toBe("보통");
    expect(presentation.headline).toBe("앞으로 1주 위험 증가 신호");
    expect(presentation.summary).toBe("한달 기준으로는 현재 수준을 유지할 가능성이 있습니다.");
    expect(presentation.tone).toBe("alert");
  });

  it("returns a neutral empty state when forecast is missing", () => {
    const presentation = buildForecastPresentation();

    expect(presentation.week.label).toBe("준비 중");
    expect(presentation.month.label).toBe("준비 중");
    expect(presentation.confidenceLabel).toBe("데이터 부족");
    expect(presentation.headline).toBe("예측 준비 중");
    expect(presentation.summary).toBe("현재 선택한 조건의 예측 데이터가 아직 충분하지 않습니다.");
    expect(presentation.tone).toBe("muted");
  });
});

describe("buildForecastSummary", () => {
  it("connects current risk and near-term forecast into one sentence", () => {
    expect(buildForecastSummary("high", forecast)).toBe(
      "현재 위험은 높음이며, 앞으로 1주 기준으로는 증가 가능성이 있습니다.",
    );
  });

  it("returns a fallback sentence when forecast is missing", () => {
    expect(buildForecastSummary("medium")).toBe(
      "현재 위험은 보통이며, 가까운 미래 예측은 아직 준비 중입니다.",
    );
  });
});
