import { diseases, forecasts, observations, regions } from "@/shared/constants/mockData";
import {
  normalizeForecast,
  normalizeObservation,
} from "@/shared/api/adapters";
import { useForecasts } from "@/shared/api/useForecasts";
import { useObservations } from "@/shared/api/useObservations";
import { useSelectionStore } from "@/features/selection-context/store";
import { Card } from "@/shared/ui/Card";
import { SectionHeading } from "@/shared/ui/SectionHeading";

const directionLabel = {
  increase: "증가",
  steady: "정체",
  decrease: "감소",
};

export function DetailPanel() {
  const { regionId, diseaseId, age, panelState, closePanel } = useSelectionStore();
  const { data: observationResponse } = useObservations();
  const { data: forecastResponse } = useForecasts();
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

  return (
    <Card className="h-full min-h-[420px] space-y-5 lg:max-w-[380px]">
      <div className="flex items-start justify-between gap-3">
        <SectionHeading
          eyebrow="Detail"
          title={`${region?.name} · ${disease?.name}`}
          body={`${age}세 기준 상세 분석 placeholder`}
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
            {observation?.trendSummary ?? "상세 데이터 준비 중"}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">분석 섹션</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            <li>기간별 추세 placeholder</li>
            <li>확산 속도 변화 placeholder</li>
            <li>연령/성별 분포 placeholder</li>
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-800">예측 섹션</p>
          <div className="mt-2 grid gap-2 text-sm text-slate-600">
            <div>1주 예측: {forecast ? directionLabel[forecast.weekDirection] : "준비 중"}</div>
            <div>1달 예측: {forecast ? directionLabel[forecast.monthDirection] : "준비 중"}</div>
            <div>신뢰도: {forecast?.confidence ?? "준비 중"}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
