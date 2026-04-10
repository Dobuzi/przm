import { diseases, forecasts, observations, regions } from "@/shared/constants/mockData";
import {
  normalizeForecast,
  normalizeObservation,
} from "@/shared/api/adapters";
import { useForecasts } from "@/shared/api/useForecasts";
import { useObservations } from "@/shared/api/useObservations";
import { useSelectionStore } from "@/features/selection-context/store";
import {
  buildForecastPresentation,
  buildForecastSummary,
} from "@/shared/lib/forecastPresentation";
import { Card } from "@/shared/ui/Card";

export function SummaryCard() {
  const { regionId, diseaseId, age, openPanel } = useSelectionStore();
  const { data: observationResponse } = useObservations();
  const { data: forecastResponse } = useForecasts();
  const currentObservations =
    observationResponse?.items.map(normalizeObservation) ?? observations;
  const currentForecasts =
    forecastResponse?.items.map(normalizeForecast) ?? forecasts;
  const region = regions.find((item) => item.id === regionId);
  const disease = diseases.find((item) => item.id === diseaseId);
  const observation = currentObservations.find(
    (item) =>
      item.regionId === regionId && item.diseaseId === diseaseId && item.age === age,
  );
  const forecast = currentForecasts.find(
    (item) =>
      item.regionId === regionId && item.diseaseId === diseaseId && item.age === age,
  );
  const forecastPresentation = buildForecastPresentation(forecast);
  const forecastSummary = buildForecastSummary(
    observation?.riskLevel ?? "low",
    forecast,
  );

  return (
    <Card className="w-full max-w-md">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
        Current Summary
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-ink">
        {region?.name} {age}세 위험도 {observation?.riskLevel === "high" ? "높음" : observation?.riskLevel === "medium" ? "보통" : "낮음"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-700">
        {disease?.name} 기준으로 {observation?.trendSummary ?? "관측 데이터 준비 중"}.
      </p>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean/70">
          Forecast
        </p>
        <p className="mt-2 text-base font-semibold text-ink">
          {forecastPresentation.headline}
        </p>
        <p className="mt-1 text-sm text-slate-600">{forecastSummary}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">1주 예측</p>
          <p className="mt-1 text-lg font-semibold text-ocean">
            {forecastPresentation.week.label}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {forecastPresentation.week.description}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="font-medium text-slate-800">1달 예측</p>
          <p className="mt-1 text-lg font-semibold text-ocean">
            {forecastPresentation.month.label}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {forecastPresentation.month.description}
          </p>
        </div>
      </div>
    <button
        type="button"
        onClick={openPanel}
        className="mt-5 rounded-full bg-ocean px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c3f6a]"
      >
        상세 분석 열기
      </button>
    </Card>
  );
}
