import type {
  Forecast,
  ForecastDirection,
  RiskLevel,
} from "@/shared/types/domain";

type ForecastTone = "alert" | "stable" | "positive" | "muted";

interface ForecastPeriodPresentation {
  label: string;
  description: string;
}

interface ForecastPresentation {
  week: ForecastPeriodPresentation;
  month: ForecastPeriodPresentation;
  confidenceLabel: string;
  headline: string;
  summary: string;
  tone: ForecastTone;
}

const directionLabel: Record<ForecastDirection, string> = {
  increase: "증가",
  steady: "정체",
  decrease: "감소",
};

const directionDescription: Record<ForecastDirection, string> = {
  increase: "위험이 더 커질 가능성이 있습니다.",
  steady: "현재 수준을 유지할 가능성이 있습니다.",
  decrease: "위험이 완만하게 낮아질 가능성이 있습니다.",
};

const confidenceLabel = {
  low: "낮음",
  medium: "보통",
  high: "높음",
} as const;

const riskLabel: Record<RiskLevel, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

function toneFromDirection(direction: ForecastDirection): ForecastTone {
  if (direction === "increase") {
    return "alert";
  }

  if (direction === "decrease") {
    return "positive";
  }

  return "stable";
}

export function buildForecastPresentation(
  forecast?: Forecast,
): ForecastPresentation {
  if (!forecast) {
    return {
      week: {
        label: "준비 중",
        description: "가까운 미래 예측을 준비하고 있습니다.",
      },
      month: {
        label: "준비 중",
        description: "중기 예측을 준비하고 있습니다.",
      },
      confidenceLabel: "데이터 부족",
      headline: "예측 준비 중",
      summary: "현재 선택한 조건의 예측 데이터가 아직 충분하지 않습니다.",
      tone: "muted",
    };
  }

  return {
    week: {
      label: directionLabel[forecast.weekDirection],
      description: directionDescription[forecast.weekDirection],
    },
    month: {
      label: directionLabel[forecast.monthDirection],
      description: directionDescription[forecast.monthDirection],
    },
    confidenceLabel: confidenceLabel[forecast.confidence],
    headline: `앞으로 1주 위험 ${directionLabel[forecast.weekDirection]} 신호`,
    summary: `한달 기준으로는 ${directionDescription[forecast.monthDirection]}`,
    tone: toneFromDirection(forecast.weekDirection),
  };
}

export function buildForecastSummary(
  currentRiskLevel: RiskLevel,
  forecast?: Forecast,
) {
  const currentRiskLabel = riskLabel[currentRiskLevel];

  if (!forecast) {
    return `현재 위험은 ${currentRiskLabel}이며, 가까운 미래 예측은 아직 준비 중입니다.`;
  }

  return `현재 위험은 ${currentRiskLabel}이며, 앞으로 1주 기준으로는 ${directionLabel[forecast.weekDirection]} 가능성이 있습니다.`;
}
