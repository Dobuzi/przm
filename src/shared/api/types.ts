import type {
  ForecastDirection,
  RiskLevel,
} from "@/shared/types/domain";

export interface ObservationRecord {
  observation_id: string;
  region_id: string;
  disease_id: string;
  age: number;
  risk_level: RiskLevel;
  trend_summary: string;
}

export interface ForecastRecord {
  forecast_id: string;
  region_id: string;
  disease_id: string;
  age: number;
  week_direction: ForecastDirection;
  month_direction: ForecastDirection;
  confidence: "low" | "medium" | "high";
}

export interface DashboardResponse {
  observations: ObservationRecord[];
  forecasts: ForecastRecord[];
}

