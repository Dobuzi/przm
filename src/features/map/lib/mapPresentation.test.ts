import { describe, expect, it } from "vitest";
import {
  buildLegendItems,
  buildRegionCardPresentation,
} from "@/features/map/lib/mapPresentation";

describe("buildRegionCardPresentation", () => {
  it("prioritizes selected state over hover and focus", () => {
    const presentation = buildRegionCardPresentation({
      isSelected: true,
      isHovered: true,
      isFocused: true,
    });

    expect(presentation.badge).toBe("선택 지역");
    expect(presentation.tone).toBe("selected");
    expect(presentation.description).toBe("현재 지도와 상세 정보의 기준 지역입니다.");
  });

  it("uses hover state when region is only previewed", () => {
    const presentation = buildRegionCardPresentation({
      isSelected: false,
      isHovered: true,
      isFocused: false,
    });

    expect(presentation.badge).toBe("미리 보기");
    expect(presentation.tone).toBe("hovered");
    expect(presentation.description).toBe("지금 가리키는 지역입니다. 클릭하면 기준 지역이 바뀝니다.");
  });

  it("uses focus state when disease spread is highlighted", () => {
    const presentation = buildRegionCardPresentation({
      isSelected: false,
      isHovered: false,
      isFocused: true,
    });

    expect(presentation.badge).toBe("질병 포커스");
    expect(presentation.tone).toBe("focused");
  });
});

describe("buildLegendItems", () => {
  it("returns legend groups for risk, selection, and focus", () => {
    const items = buildLegendItems();

    expect(items).toEqual([
      { key: "low", label: "낮음", description: "현재 위험 신호가 비교적 낮은 지역" },
      { key: "medium", label: "보통", description: "지켜볼 필요가 있는 지역" },
      { key: "high", label: "높음", description: "현재 주의가 필요한 지역" },
      { key: "selected", label: "선택 지역", description: "지금 분석 기준으로 보는 지역" },
      { key: "focused", label: "질병 포커스", description: "선택한 질병 기준으로 주목할 지역" },
    ]);
  });
});
