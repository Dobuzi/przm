import type {
  Disease,
  Forecast,
  ObservationBreakdown,
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
    diseaseId: "flu-a",
    age: 7,
    riskLevel: "medium",
    trendSummary: "최근 7일 완만한 증가",
  },
  {
    id: "obs-3",
    regionId: "31023",
    diseaseId: "rsv",
    age: 7,
    riskLevel: "medium",
    trendSummary: "이번 주 위험도 유지",
  },
  {
    id: "obs-4",
    regionId: "11160",
    diseaseId: "rsv",
    age: 5,
    riskLevel: "medium",
    trendSummary: "이번 주 위험도 유지",
  },
  {
    id: "obs-5",
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
  {
    id: "fc-2",
    regionId: "11160",
    diseaseId: "flu-a",
    age: 7,
    weekDirection: "steady",
    monthDirection: "decrease",
    confidence: "medium",
  },
  {
    id: "fc-3",
    regionId: "31023",
    diseaseId: "rsv",
    age: 7,
    weekDirection: "steady",
    monthDirection: "steady",
    confidence: "low",
  },
];

export const observationBreakdowns: Array<
  ObservationBreakdown & {
    regionId: string;
    diseaseId: string;
    age: number;
  }
> = [
  {
    regionId: "31023",
    diseaseId: "flu-a",
    age: 7,
    summary: "최근 7일 확산세 증가",
    recentTrend: [
      { weekLabel: "4주 전", riskLevel: "medium", cases: 18 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 19 },
      { weekLabel: "2주 전", riskLevel: "high", cases: 21 },
      { weekLabel: "이번 주", riskLevel: "high", cases: 22 },
    ],
    ageDistribution: [
      { age: 5, cases: 10 },
      { age: 6, cases: 16 },
      { age: 7, cases: 22 },
      { age: 8, cases: 17 },
    ],
    genderDistribution: [
      { gender: "male", cases: 12 },
      { gender: "female", cases: 10 },
    ],
  },
  {
    regionId: "11160",
    diseaseId: "flu-a",
    age: 7,
    summary: "최근 7일 완만한 증가",
    recentTrend: [
      { weekLabel: "4주 전", riskLevel: "low", cases: 9 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 11 },
      { weekLabel: "2주 전", riskLevel: "medium", cases: 12 },
      { weekLabel: "이번 주", riskLevel: "medium", cases: 13 },
    ],
    ageDistribution: [
      { age: 5, cases: 7 },
      { age: 6, cases: 10 },
      { age: 7, cases: 13 },
      { age: 8, cases: 9 },
    ],
    genderDistribution: [
      { gender: "male", cases: 7 },
      { gender: "female", cases: 6 },
    ],
  },
  {
    regionId: "31023",
    diseaseId: "rsv",
    age: 7,
    summary: "이번 주 위험도 유지",
    recentTrend: [
      { weekLabel: "4주 전", riskLevel: "medium", cases: 10 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 10 },
      { weekLabel: "2주 전", riskLevel: "medium", cases: 11 },
      { weekLabel: "이번 주", riskLevel: "medium", cases: 11 },
    ],
    ageDistribution: [
      { age: 5, cases: 8 },
      { age: 6, cases: 10 },
      { age: 7, cases: 11 },
      { age: 8, cases: 8 },
    ],
    genderDistribution: [
      { gender: "male", cases: 6 },
      { gender: "female", cases: 5 },
    ],
  },
  {
    regionId: "11160",
    diseaseId: "rsv",
    age: 5,
    summary: "이번 주 위험도 유지",
    recentTrend: [
      { weekLabel: "4주 전", riskLevel: "low", cases: 8 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 11 },
      { weekLabel: "2주 전", riskLevel: "medium", cases: 12 },
      { weekLabel: "이번 주", riskLevel: "medium", cases: 12 },
    ],
    ageDistribution: [
      { age: 3, cases: 7 },
      { age: 4, cases: 10 },
      { age: 5, cases: 12 },
      { age: 6, cases: 9 },
    ],
    genderDistribution: [
      { gender: "male", cases: 7 },
      { gender: "female", cases: 5 },
    ],
  },
  {
    regionId: "31014",
    diseaseId: "adeno",
    age: 9,
    summary: "증가세 둔화",
    recentTrend: [
      { weekLabel: "4주 전", riskLevel: "medium", cases: 14 },
      { weekLabel: "3주 전", riskLevel: "medium", cases: 13 },
      { weekLabel: "2주 전", riskLevel: "low", cases: 10 },
      { weekLabel: "이번 주", riskLevel: "low", cases: 8 },
    ],
    ageDistribution: [
      { age: 7, cases: 9 },
      { age: 8, cases: 10 },
      { age: 9, cases: 8 },
      { age: 10, cases: 6 },
    ],
    genderDistribution: [
      { gender: "male", cases: 4 },
      { gender: "female", cases: 4 },
    ],
  },
];
