import { Link } from "react-router-dom";
import { MapViewport } from "@/features/map/MapViewport";
import { useSelectionStore } from "@/features/selection-context/store";
import { DetailPanel } from "@/widgets/detail-panel/DetailPanel";
import { SummaryCard } from "@/widgets/summary-card/SummaryCard";
import { TopControlBar } from "@/widgets/top-control-bar/TopControlBar";

export function HomePage() {
  const panelState = useSelectionStore((state) => state.panelState);

  return (
    <main className="min-h-screen px-4 py-5 text-ink lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <TopControlBar />

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <div className="relative">
              <MapViewport />
              {panelState === "closed" ? (
                <div className="pointer-events-none absolute left-4 top-4 hidden max-w-md lg:block">
                  <div className="pointer-events-auto">
                    <SummaryCard />
                  </div>
                </div>
              ) : null}
            </div>

            <div className="lg:hidden">
              <SummaryCard />
            </div>
          </div>

          <div className="hidden lg:block">
            <DetailPanel />
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-panel">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
                Scaffold Status
              </p>
              <h2 className="mt-2 text-xl font-semibold">초기 앱 골격 완료</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                현재 상태는 문서 기반 scaffold입니다. 실제 Mapbox, 분석 차트,
                예측 API는 아직 연결되지 않았고, feature 경계와 선택 컨텍스트를
                검증할 수 있는 placeholder UI만 포함합니다.
              </p>
            </div>
            <Link className="text-sm font-medium text-ocean underline" to="/about">
              구조 설명 보기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

