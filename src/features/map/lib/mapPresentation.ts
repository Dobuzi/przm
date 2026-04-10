export type RegionCardTone = "selected" | "hovered" | "focused" | "default";

interface RegionCardPresentationInput {
  isSelected: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

interface RegionCardPresentation {
  badge: string;
  tone: RegionCardTone;
  description: string;
}

interface LegendItem {
  key: "low" | "medium" | "high" | "selected" | "focused";
  label: string;
  description: string;
}

export function buildRegionCardPresentation(
  input: RegionCardPresentationInput,
): RegionCardPresentation {
  if (input.isSelected) {
    return {
      badge: "선택 지역",
      tone: "selected",
      description: "현재 지도와 상세 정보의 기준 지역입니다.",
    };
  }

  if (input.isHovered) {
    return {
      badge: "미리 보기",
      tone: "hovered",
      description: "지금 가리키는 지역입니다. 클릭하면 기준 지역이 바뀝니다.",
    };
  }

  if (input.isFocused) {
    return {
      badge: "질병 포커스",
      tone: "focused",
      description: "선택한 질병 기준으로 주목할 지역입니다.",
    };
  }

  return {
    badge: "일반 지역",
    tone: "default",
    description: "지도를 눌러 이 지역을 기준으로 분석할 수 있습니다.",
  };
}

export function buildLegendItems(): LegendItem[] {
  return [
    { key: "low", label: "낮음", description: "현재 위험 신호가 비교적 낮은 지역" },
    { key: "medium", label: "보통", description: "지켜볼 필요가 있는 지역" },
    { key: "high", label: "높음", description: "현재 주의가 필요한 지역" },
    { key: "selected", label: "선택 지역", description: "지금 분석 기준으로 보는 지역" },
    { key: "focused", label: "질병 포커스", description: "선택한 질병 기준으로 주목할 지역" },
  ];
}
