function toObservationId(record) {
  return `obs-${record.regionId}-${record.diseaseId}-${record.age}-${record.date}`;
}

function toForecastId(record) {
  return `fc-${record.regionId}-${record.diseaseId}-${record.age}-${record.date}`;
}

function getRiskLevel(caseCount) {
  if (caseCount >= 20) {
    return "high";
  }

  if (caseCount >= 10) {
    return "medium";
  }

  return "low";
}

function getTrendSummary(caseCount) {
  if (caseCount >= 20) {
    return "최근 관측 기준 위험 증가 가능성이 높음";
  }

  if (caseCount >= 10) {
    return "최근 관측 기준 완만한 확산 신호";
  }

  return "현재는 비교적 안정적인 흐름";
}

function getForecastDirections(riskLevel) {
  if (riskLevel === "high") {
    return {
      weekDirection: "increase",
      monthDirection: "steady",
      confidence: "medium",
    };
  }

  if (riskLevel === "medium") {
    return {
      weekDirection: "steady",
      monthDirection: "decrease",
      confidence: "medium",
    };
  }

  return {
    weekDirection: "decrease",
    monthDirection: "decrease",
    confidence: "low",
  };
}

export function buildSnapshotCandidate(normalizedRecords) {
  const observations = normalizedRecords.map((record) => {
    const riskLevel = getRiskLevel(record.caseCount);

    return {
      observation_id: toObservationId(record),
      region_id: record.regionId,
      disease_id: record.diseaseId,
      age: record.age,
      risk_level: riskLevel,
      trend_summary: getTrendSummary(record.caseCount),
      observed_on: record.date,
      case_count: record.caseCount,
    };
  });

  const forecasts = normalizedRecords.map((record) => {
    const riskLevel = getRiskLevel(record.caseCount);
    const directions = getForecastDirections(riskLevel);

    return {
      forecast_id: toForecastId(record),
      region_id: record.regionId,
      disease_id: record.diseaseId,
      age: record.age,
      week_direction: directions.weekDirection,
      month_direction: directions.monthDirection,
      confidence: directions.confidence,
      generated_from_date: record.date,
    };
  });

  const observedUntil = normalizedRecords.reduce((latest, record) => {
    return record.date > latest ? record.date : latest;
  }, "");

  return {
    snapshot: {
      snapshot_id: `draft-${observedUntil || "unknown"}`,
      status: "draft",
      observed_until: observedUntil,
      published_at: null,
      forecast_generated_at: observedUntil,
      source_note: "mock analytics candidate generated from normalized records",
    },
    observations,
    forecasts,
    summary: {
      observationCount: observations.length,
      forecastCount: forecasts.length,
      observedUntil,
    },
  };
}
