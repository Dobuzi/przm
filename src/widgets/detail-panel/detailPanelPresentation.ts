import type {
  ObservationAgePoint,
  ObservationGenderPoint,
  ObservationTrendPoint,
} from "@/shared/types/domain";

export function buildTrendPresentation(points: ObservationTrendPoint[]) {
  const maxCases = Math.max(...points.map((point) => point.cases), 0);

  return points.map((point) => ({
    ...point,
    barHeight:
      maxCases > 0
        ? `${Math.max(Math.round((point.cases / maxCases) * 100), 18)}%`
        : "0%",
  }));
}

export function buildAgeDistributionPresentation(
  points: ObservationAgePoint[],
  selectedAge: number,
) {
  const maxCases = Math.max(...points.map((point) => point.cases), 0);

  return points.map((point) => ({
    ...point,
    isSelected: point.age === selectedAge,
    width:
      maxCases > 0
        ? `${Math.max(Math.round((point.cases / maxCases) * 100), 12)}%`
        : "0%",
  }));
}

export function buildGenderDistributionPresentation(
  points: ObservationGenderPoint[],
) {
  const totalCases = points.reduce((sum, point) => sum + point.cases, 0);

  return points.map((point) => ({
    ...point,
    ratioLabel:
      totalCases > 0
        ? `${Math.round((point.cases / totalCases) * 100)}%`
        : "0%",
  }));
}
