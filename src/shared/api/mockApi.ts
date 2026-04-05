import { normalizeDashboardPayload } from "@/shared/api/adapters";
import type { DashboardResponse } from "@/shared/api/types";
import { forecasts, observations } from "@/shared/constants/mockData";

interface DashboardFilters {
  regionId?: string;
  diseaseId?: string;
  age?: number;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchDashboardData(filters: DashboardFilters = {}) {
  await sleep(180);

  const filteredObservations = observations.filter((item) => {
    if (filters.regionId && item.regionId !== filters.regionId) {
      return false;
    }

    if (filters.diseaseId && item.diseaseId !== filters.diseaseId) {
      return false;
    }

    if (typeof filters.age === "number" && item.age !== filters.age) {
      return false;
    }

    return true;
  });

  const filteredForecasts = forecasts.filter((item) => {
    if (filters.regionId && item.regionId !== filters.regionId) {
      return false;
    }

    if (filters.diseaseId && item.diseaseId !== filters.diseaseId) {
      return false;
    }

    if (typeof filters.age === "number" && item.age !== filters.age) {
      return false;
    }

    return true;
  });

  const payload: DashboardResponse = {
    observations: filteredObservations.map((item) => ({
      observation_id: item.id,
      region_id: item.regionId,
      disease_id: item.diseaseId,
      age: item.age,
      risk_level: item.riskLevel,
      trend_summary: item.trendSummary,
    })),
    forecasts: filteredForecasts.map((item) => ({
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
