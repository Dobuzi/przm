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

function buildRecentTrend(record, riskLevel) {
  const base = Math.max(record.caseCount - 4, 1);

  return [
    { week_label: "4주 전", risk_level: "low", cases: Math.max(base - 2, 1) },
    { week_label: "3주 전", risk_level: "medium", cases: Math.max(base - 1, 1) },
    { week_label: "2주 전", risk_level: riskLevel === "high" ? "medium" : riskLevel, cases: base },
    { week_label: "이번 주", risk_level: riskLevel, cases: record.caseCount },
  ];
}

function buildAgeDistribution(record) {
  const selected = record.caseCount;
  const younger = Math.max(selected - 6, 1);
  const older = Math.max(selected - 4, 1);

  return [
    { age: Math.max(record.age - 1, 0), cases: younger },
    { age: record.age, cases: selected },
    { age: Math.min(record.age + 1, 13), cases: older },
  ];
}

function buildGenderDistribution(record) {
  const primary = Math.ceil(record.caseCount * 0.55);
  const secondary = record.caseCount - primary;

  if (record.gender === "male") {
    return [
      { gender: "male", cases: primary },
      { gender: "female", cases: secondary },
    ];
  }

  return [
    { gender: "male", cases: secondary },
    { gender: "female", cases: primary },
  ];
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

  const breakdowns = normalizedRecords.map((record) => {
    const riskLevel = getRiskLevel(record.caseCount);

    return {
      region_id: record.regionId,
      disease_id: record.diseaseId,
      age: record.age,
      summary: getTrendSummary(record.caseCount),
      recent_trend: buildRecentTrend(record, riskLevel),
      age_distribution: buildAgeDistribution(record),
      gender_distribution: buildGenderDistribution(record),
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
    breakdowns,
    summary: {
      observationCount: observations.length,
      forecastCount: forecasts.length,
      breakdownCount: breakdowns.length,
      observedUntil,
    },
  };
}
