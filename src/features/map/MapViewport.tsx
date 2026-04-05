import type { GeoJSONSource, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef } from "react";
import { observations, regions } from "@/shared/constants/mockData";
import { env } from "@/shared/config/env";
import { useSelectionStore } from "@/features/selection-context/store";
import { mockRegionsGeoJson } from "@/features/map/data/mockRegions";
import {
  buildRegionMapData,
  getRegionViewport,
} from "@/features/map/lib/mapModel";
import { riskFillColors } from "@/features/map/lib/riskColors";
import { Card } from "@/shared/ui/Card";
import { cn } from "@/shared/lib/cn";

const sourceId = "regions";
const fillLayerId = "regions-fill";
const lineLayerId = "regions-line";
const selectionLayerId = "regions-selected";
const focusLayerId = "regions-focus";

const riskClasses = {
  low: "bg-riskLow",
  medium: "bg-riskMedium",
  high: "bg-riskHigh text-white",
};

export function MapViewport() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);
  const setRegionId = useSelectionStore((state) => state.setRegionId);
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapData = useMemo(
    () =>
      buildRegionMapData({
        features: mockRegionsGeoJson.features,
        observations,
        diseaseId,
        age,
        selectedRegionId: regionId,
      }),
    [age, diseaseId, regionId],
  );

  useEffect(() => {
    if (!env.mapboxToken || !mapContainerRef.current || mapRef.current) {
      return;
    }

    let cancelled = false;

    const setupMap = async () => {
      const mapboxgl = await import("mapbox-gl");
      if (cancelled || !mapContainerRef.current) {
        return;
      }

      mapboxgl.default.accessToken = env.mapboxToken;

      const map = new mapboxgl.default.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [127.02, 37.43],
        zoom: 8.7,
        attributionControl: false,
      });

      mapRef.current = map;
      map.addControl(
        new mapboxgl.default.NavigationControl({ showCompass: false }),
        "top-right",
      );

      map.on("load", () => {
        map.addSource(sourceId, {
          type: "geojson",
          data: mapData,
        });

        map.addLayer({
          id: fillLayerId,
          type: "fill",
          source: sourceId,
          paint: {
            "fill-color": [
              "match",
              ["get", "riskLevel"],
              "high",
              riskFillColors.high,
              "medium",
              riskFillColors.medium,
              riskFillColors.low,
            ],
            "fill-opacity": 0.72,
          },
        });

        map.addLayer({
          id: focusLayerId,
          type: "line",
          source: sourceId,
          filter: ["==", ["get", "diseaseFocus"], true],
          paint: {
            "line-color": "#0f4c81",
            "line-width": 3,
            "line-opacity": 0.55,
          },
        });

        map.addLayer({
          id: lineLayerId,
          type: "line",
          source: sourceId,
          paint: {
            "line-color": "rgba(15, 23, 42, 0.18)",
            "line-width": 1.2,
          },
        });

        map.addLayer({
          id: selectionLayerId,
          type: "line",
          source: sourceId,
          filter: ["==", ["get", "isSelected"], true],
          paint: {
            "line-color": "#0f172a",
            "line-width": 4,
          },
        });

        map.on("click", fillLayerId, (event) => {
          const clickedFeature = event.features?.[0];
          const clickedRegionId = clickedFeature?.properties?.regionId;
          if (typeof clickedRegionId === "string") {
            setRegionId(clickedRegionId);
          }
        });

        map.on("mouseenter", fillLayerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", fillLayerId, () => {
          map.getCanvas().style.cursor = "";
        });
      });
    };

    void setupMap();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mapData, setRegionId]);

  useEffect(() => {
    const source = mapRef.current?.getSource(sourceId) as GeoJSONSource | undefined;
    source?.setData(mapData);
  }, [mapData]);

  useEffect(() => {
    const viewport = getRegionViewport(mockRegionsGeoJson.features, regionId);
    if (!mapRef.current || !viewport) {
      return;
    }

    mapRef.current.flyTo({
      center: viewport.center,
      zoom: viewport.zoom,
      duration: 900,
      essential: true,
    });
  }, [regionId]);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(140deg,#dbeafe_0%,#b9dff7_35%,#e7f2fb_100%)] shadow-panel">
      {env.mapboxToken ? (
        <div ref={mapContainerRef} className="absolute inset-0" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.7),transparent_0_28%),radial-gradient(circle_at_80%_35%,rgba(15,76,129,0.12),transparent_0_22%),radial-gradient(circle_at_45%_75%,rgba(238,108,77,0.16),transparent_0_18%)]" />
      )}
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
              {env.mapboxToken
                ? "시군구 단위 mock polygon 위에 위험도 색상과 선택 상태를 표시하는 첫 MVP 지도입니다."
                : "Mapbox 토큰이 없어 fallback 상태로 보입니다. VITE_MAPBOX_TOKEN을 설정하면 실제 지도가 렌더링됩니다."}
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
