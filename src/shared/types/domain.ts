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

