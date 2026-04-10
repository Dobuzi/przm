import { diseases, forecasts, observations, regions } from "@/shared/constants/mockData";
import {
  normalizeForecast,
  normalizeObservation,
} from "@/shared/api/adapters";
import { useForecasts } from "@/shared/api/useForecasts";
import { useObservationBreakdown } from "@/shared/api/useObservationBreakdown";
import { useObservations } from "@/shared/api/useObservations";
import { useSelectionStore } from "@/features/selection-context/store";
import {
  buildForecastPresentation,
  buildForecastSummary,
} from "@/shared/lib/forecastPresentation";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";
import { SectionHeading } from "@/shared/ui/SectionHeading";
import {
  buildAgeDistributionPresentation,
  buildGenderDistributionPresentation,
  buildTrendPresentation,
} from "@/widgets/detail-panel/detailPanelPresentation";

const confidenceLabel = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

const genderLabel = {
  male: "남아",
  female: "여아",
};

function DistributionRow({
  label,
  value,
  width,
  isSelected = false,
  suffix,
}: {
  label: string;
  value: number;
  width: string;
  isSelected?: boolean;
  suffix?: string;
}) {
  return (
    <div className={cn("space-y-1", isSelected && "rounded-2xl bg-white/70 p-2")}>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span className={cn(isSelected && "font-semibold text-ink")}>{label}</span>
        <span className="font-medium text-slate-800">
          {value}
          {suffix ? ` · ${suffix}` : ""}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-ocean" style={{ width }} />
      </div>
    </div>
  );
}

export function DetailPanel() {
  const { regionId, diseaseId, age, panelState, closePanel } = useSelectionStore();
  const { data: observationResponse } = useObservations();
  const { data: forecastResponse } = useForecasts();
  const { data: breakdown } = useObservationBreakdown();
  const currentObservations =
    observationResponse?.items.map(normalizeObservation) ?? observations;
  const currentForecasts =
    forecastResponse?.items.map(normalizeForecast) ?? forecasts;

  if (panelState === "closed") {
    return null;
  }

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
  const trendPoints = breakdown?.recentTrend ?? [];
  const agePoints = breakdown?.ageDistribution ?? [];
  const genderPoints = breakdown?.genderDistribution ?? [];
  const trendPresentation = buildTrendPresentation(trendPoints);
  const agePresentation = buildAgeDistributionPresentation(agePoints, age);
  const genderPresentation = buildGenderDistributionPresentation(genderPoints);

  return (
    <Card className="h-full min-h-[420px] space-y-5 lg:max-w-[380px]">
      <div className="flex items-start justify-between gap-3">
        <SectionHeading
          eyebrow="Detail"
          title={`${region?.name} · ${disease?.name}`}
          body={`${age}세 기준 상세 분석`}
        />
        <button
          type="button"
          onClick={closePanel}
          className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
        >
          닫기
        </button>
      </div>

      <div className="space-y-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">현재 상태</p>
          <p className="mt-2 text-sm text-slate-600">
            {breakdown?.summary || observation?.trendSummary || "상세 데이터 준비 중"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">최근 4주 추세</p>
          {trendPresentation.length > 0 ? (
            <div className="mt-4">
              <div className="flex h-28 items-end gap-3">
                {trendPresentation.map((point) => (
                  <div key={point.weekLabel} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-20 w-full items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-2xl",
                          point.riskLevel === "high" && "bg-riskHigh",
                          point.riskLevel === "medium" && "bg-riskMedium",
                          point.riskLevel === "low" && "bg-riskLow",
                        )}
                        style={{ height: point.barHeight }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-medium text-slate-700">{point.weekLabel}</p>
                      <p className="text-[11px] text-slate-500">{point.cases}건</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                최근 4주 흐름을 막대 높이로 비교합니다.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">최근 추세 데이터 준비 중</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">연령 분포</p>
          {agePresentation.length > 0 ? (
            <div className="mt-3 space-y-3">
              {agePresentation.map((point) => (
                <DistributionRow
                  key={point.age}
                  label={`${point.age}세`}
                  value={point.cases}
                  width={point.width}
                  isSelected={point.isSelected}
                  suffix={point.isSelected ? "선택 연령" : undefined}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">연령 분포 데이터 준비 중</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">성별 분포</p>
          {genderPresentation.length > 0 ? (
            <div className="mt-3 space-y-3">
              {genderPresentation.map((point) => (
                <DistributionRow
                  key={point.gender}
                  label={genderLabel[point.gender]}
                  value={point.cases}
                  width={point.ratioLabel}
                  suffix={point.ratioLabel}
                />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-600">성별 분포 데이터 준비 중</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">예측 개요</p>
          <p className="mt-2 text-sm text-slate-600">{forecastSummary}</p>
          <div className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700">
            신뢰도 {forecast ? confidenceLabel[forecast.confidence] : forecastPresentation.confidenceLabel}
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-800">1주 예측</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-ocean">
                  {forecastPresentation.week.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {forecastPresentation.week.description}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-800">1달 예측</p>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-ocean">
                  {forecastPresentation.month.label}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {forecastPresentation.month.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
