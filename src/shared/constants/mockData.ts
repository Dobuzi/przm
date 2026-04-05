import type {
  Disease,
  Forecast,
  Observation,
  Region,
} from "@/shared/types/domain";

export const regions: Region[] = [
  { id: "seoul-gangseo", name: "서울 강서구", province: "서울특별시" },
  { id: "gyeonggi-bundang", name: "성남시 분당구", province: "경기도" },
  { id: "gyeonggi-suwon", name: "수원시 영통구", province: "경기도" },
];

export const diseases: Disease[] = [
  { id: "flu-a", name: "독감 A형" },
  { id: "rsv", name: "RSV" },
  { id: "adeno", name: "아데노바이러스" },
];

export const observations: Observation[] = [
  {
    id: "obs-1",
    regionId: "gyeonggi-bundang",
    diseaseId: "flu-a",
    age: 7,
    riskLevel: "high",
    trendSummary: "최근 7일 확산세 증가",
  },
  {
    id: "obs-2",
    regionId: "seoul-gangseo",
    diseaseId: "rsv",
    age: 5,
    riskLevel: "medium",
    trendSummary: "이번 주 위험도 유지",
  },
  {
    id: "obs-3",
    regionId: "gyeonggi-suwon",
    diseaseId: "adeno",
    age: 9,
    riskLevel: "low",
    trendSummary: "증가세 둔화",
  },
];

export const forecasts: Forecast[] = [
  {
    id: "fc-1",
    regionId: "gyeonggi-bundang",
    diseaseId: "flu-a",
    age: 7,
    weekDirection: "increase",
    monthDirection: "steady",
    confidence: "medium",
  },
];

