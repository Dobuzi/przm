import { normalizeDashboardPayload } from "@/shared/api/adapters";
import type { DashboardResponse } from "@/shared/api/types";
import { forecasts, observations } from "@/shared/constants/mockData";

export async function fetchDashboardData() {
  const payload: DashboardResponse = {
    observations: observations.map((item) => ({
      observation_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      risk_level: item.riskLevel,
      trend_summary: item.trendSummary,
    })),
    forecasts: forecasts.map((item) => ({
      forecast_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      week_direction: item.weekDirection,
      month_direction: item.monthDirection,
      confidence: item.confidence,
    })),
  };

  return normalizeDashboardPayload(payload);
}

