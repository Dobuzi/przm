import { observations, regions } from "@/shared/constants/mockData";
import { Card } from "@/shared/ui/Card";
import { useSelectionStore } from "@/features/selection-context/store";
import { cn } from "@/shared/lib/cn";

const riskClasses = {
  low: "bg-riskLow",
  medium: "bg-riskMedium",
  high: "bg-riskHigh text-white",
};

export function MapViewport() {
  const regionId = useSelectionStore((state) => state.regionId);
  const setRegionId = useSelectionStore((state) => state.setRegionId);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(140deg,#dbeafe_0%,#b9dff7_35%,#e7f2fb_100%)] shadow-panel">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_0_28%),radial-gradient(circle_at_80%_35%,rgba(15,76,129,0.12),transparent_0_22%),radial-gradient(circle_at_45%_75%,rgba(238,108,77,0.16),transparent_0_18%)]" />
      <div className="relative flex h-full min-h-[420px] flex-col justify-between p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean/70">
              Main Map
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">
              서울/경기 어린이 질병 확산 지도
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-700">
              실제 Mapbox 연동 전 단계의 placeholder입니다. 위험도, 선택 지역,
              확산 범위가 어디에 배치되는지 확인하기 위한 scaffold 상태입니다.
            </p>
          </div>
          <Card className="hidden max-w-xs bg-white/80 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
              위험도 범례
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-riskLow" />
                낮음
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-riskMedium" />
                보통
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-riskHigh" />
                높음
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {regions.map((region) => {
            const observation = observations.find((item) => item.regionId === region.id);
            const isSelected = region.id === regionId;

            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setRegionId(region.id)}
                className={cn(
                  "rounded-3xl border border-white/60 p-4 text-left transition",
                  riskClasses[observation?.riskLevel ?? "low"],
                  isSelected
                    ? "ring-4 ring-ocean/20"
                    : "opacity-90 hover:-translate-y-0.5 hover:opacity-100",
                )}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                  {region.province}
                </p>
                <p className="mt-2 text-lg font-semibold">{region.name}</p>
                <p className="mt-2 text-sm">
                  {observation?.trendSummary ?? "관측 데이터 준비 중"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

