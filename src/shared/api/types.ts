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

export interface ObservationsResponse {
  items: ObservationRecord[];
}

export interface ForecastsResponse {
  items: ForecastRecord[];
}

export interface RegionsResponse {
  items: RegionRecord[];
}

export interface DiseasesResponse {
  items: DiseaseRecord[];
}

export interface RegionRecord {
  region_id: string;
  name: string;
  province: string;
}

export interface DiseaseRecord {
  disease_id: string;
  display_name: string;
  is_active: boolean;
}

export interface ObservationBreakdownResponse {
  summary: string;
  recent_trend: Array<{
    week_label: string;
    risk_level: RiskLevel;
    cases: number;
  }>;
  age_distribution: Array<{
    age: number;
    cases: number;
  }>;
  gender_distribution: Array<{
    gender: "male" | "female";
    cases: number;
  }>;
}
