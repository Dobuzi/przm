export type RiskLevel = "low" | "medium" | "high";
export type ForecastDirection = "increase" | "steady" | "decrease";

export interface Region {
  id: string;
  name: string;
  province: string;
}

export interface Disease {
  id: string;
  name: string;
}

export interface Observation {
  id: string;
  regionId: string;
  diseaseId: string;
  age: number;
  riskLevel: RiskLevel;
  trendSummary: string;
}

export interface Forecast {
  id: string;
  regionId: string;
  diseaseId: string;
  age: number;
  weekDirection: ForecastDirection;
  monthDirection: ForecastDirection;
  confidence: "low" | "medium" | "high";
}

export interface ObservationTrendPoint {
  weekLabel: string;
  riskLevel: RiskLevel;
  cases: number;
}

export interface ObservationAgePoint {
  age: number;
  cases: number;
}

export interface ObservationGenderPoint {
  gender: "male" | "female";
  cases: number;
}

export interface ObservationBreakdown {
  summary: string;
  recentTrend: ObservationTrendPoint[];
  ageDistribution: ObservationAgePoint[];
  genderDistribution: ObservationGenderPoint[];
}
