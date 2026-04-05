import type {
  Disease,
  Forecast,
  Observation,
  Region,
} from "@/shared/types/domain";
import { regionOptions } from "@/features/map/data/regionOptions";

export const regions: Region[] = regionOptions;

export const diseases: Disease[] = [
  { id: "flu-a", name: "독감 A형" },
  { id: "rsv", name: "RSV" },
  { id: "adeno", name: "아데노바이러스" },
];

export const observations: Observation[] = [
  {
    id: "obs-1",
    regionId: "31023",
    diseaseId: "flu-a",
    age: 7,
    riskLevel: "high",
    trendSummary: "최근 7일 확산세 증가",
  },
  {
    id: "obs-2",
    regionId: "11160",
    diseaseId: "rsv",
    age: 5,
    riskLevel: "medium",
    trendSummary: "이번 주 위험도 유지",
  },
  {
    id: "obs-3",
    regionId: "31014",
    diseaseId: "adeno",
    age: 9,
    riskLevel: "low",
    trendSummary: "증가세 둔화",
  },
];

export const forecasts: Forecast[] = [
  {
    id: "fc-1",
    regionId: "31023",
    diseaseId: "flu-a",
    age: 7,
    weekDirection: "increase",
    monthDirection: "steady",
    confidence: "medium",
  },
];
