type ComparisonMode = "region" | "disease";

export function buildComparisonCardTitle({
  mode,
  regionName,
  diseaseName,
}: {
  mode: ComparisonMode;
  regionName: string;
  diseaseName: string;
}) {
  if (mode === "region") {
    return `${regionName} · ${diseaseName}`;
  }

  return `${regionName} · ${diseaseName}`;
}

export function buildComparisonSummary({
  mode,
  baseLabel,
  comparisonLabel,
}: {
  mode: ComparisonMode;
  baseLabel: string;
  comparisonLabel: string;
}) {
  if (mode === "region") {
    return `${baseLabel} 기준과 ${comparisonLabel}의 현재 위험과 예측을 비교합니다.`;
  }

  return `${baseLabel} 기준과 ${comparisonLabel}의 현재 위험과 예측을 비교합니다.`;
}
