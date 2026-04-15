import type { GeoJSONSource, Map } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { diseases, observations, regions } from "@/shared/constants/mockData";
import { normalizeObservation } from "@/shared/api/adapters";
import { useComparisonStore } from "@/features/comparison/store";
import { env } from "@/shared/config/env";
import { useSelectionStore } from "@/features/selection-context/store";
import {
  loadRegionFeatureCollection,
  type RegionFeature,
} from "@/features/map/data/regionData";
import {
  buildRegionMapData,
  getRegionViewport,
} from "@/features/map/lib/mapModel";
import {
  buildLegendItems,
  buildRegionCardPresentation,
} from "@/features/map/lib/mapPresentation";
import { riskFillColors } from "@/features/map/lib/riskColors";
import { useObservations } from "@/shared/api/useObservations";
import { Card } from "@/shared/ui/Card";
import { cn } from "@/shared/lib/cn";

const sourceId = "regions";
const fillLayerId = "regions-fill";
const lineLayerId = "regions-line";
const selectionLayerId = "regions-selected";
const comparisonLayerId = "regions-comparison";
const focusLayerId = "regions-focus";
const hoverLayerId = "regions-hover";

const riskClasses = {
  low: "bg-riskLow",
  medium: "bg-riskMedium",
  high: "bg-riskHigh text-white",
};

const cardToneClasses = {
  selected: "ring-4 ring-ocean/20 border-ink/10 shadow-lg",
  comparison: "ring-2 ring-coral/25 border-coral/35 shadow-md",
  hovered: "ring-2 ring-ocean/20 border-ocean/20 shadow-md",
  focused: "border-ocean/25 shadow-sm",
  default: "opacity-90 hover:-translate-y-0.5 hover:opacity-100",
};

export function MapViewport() {
  const regionId = useSelectionStore((state) => state.regionId);
  const diseaseId = useSelectionStore((state) => state.diseaseId);
  const age = useSelectionStore((state) => state.age);
  const setRegionId = useSelectionStore((state) => state.setRegionId);
  const comparisonMode = useComparisonStore((state) => state.mode);
  const comparisonRegionId = useComparisonStore((state) => state.regionId);
  const comparisonDiseaseId = useComparisonStore((state) => state.diseaseId);
  const { data: observationResponse } = useObservations();
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [regionFeatures, setRegionFeatures] = useState<RegionFeature[]>([]);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const hasComparisonRegion =
    comparisonMode === "region" && comparisonRegionId.length > 0;
  const legendItems = buildLegendItems(hasComparisonRegion);

  useEffect(() => {
    let cancelled = false;

    const loadRegions = async () => {
      try {
        const collection = await loadRegionFeatureCollection();
        if (!cancelled) {
          setRegionFeatures(collection.features as RegionFeature[]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadRegions();

    return () => {
      cancelled = true;
    };
  }, []);

  const mapData = useMemo(
    () =>
      buildRegionMapData({
        features: regionFeatures,
        observations: observationResponse?.items.map(normalizeObservation) ?? observations,
        diseaseId,
        age,
        selectedRegionId: regionId,
        comparisonRegionId: hasComparisonRegion ? comparisonRegionId : undefined,
      }),
    [
      age,
      comparisonRegionId,
      diseaseId,
      hasComparisonRegion,
      observationResponse?.items,
      regionFeatures,
      regionId,
    ],
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

        map.addLayer({
          id: comparisonLayerId,
          type: "line",
          source: sourceId,
          filter: ["==", ["get", "isComparison"], true],
          paint: {
            "line-color": "#ee6c4d",
            "line-width": 3,
            "line-opacity": 0.85,
            "line-dasharray": [2, 1.5],
          },
        });

        map.addLayer({
          id: hoverLayerId,
          type: "line",
          source: sourceId,
          filter: ["==", ["get", "regionId"], ""],
          paint: {
            "line-color": "#0f4c81",
            "line-width": 3,
            "line-opacity": 0.85,
          },
        });

        map.on("click", fillLayerId, (event) => {
          const clickedFeature = event.features?.[0];
          const clickedRegionId = clickedFeature?.properties?.regionId;
          if (typeof clickedRegionId === "string") {
            setRegionId(clickedRegionId);
          }
        });

        map.on("mousemove", fillLayerId, (event) => {
          const hoveredFeature = event.features?.[0];
          const nextHoveredRegionId = hoveredFeature?.properties?.regionId;
          setHoveredRegionId(typeof nextHoveredRegionId === "string" ? nextHoveredRegionId : null);
        });

        map.on("mouseenter", fillLayerId, () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", fillLayerId, () => {
          map.getCanvas().style.cursor = "";
          setHoveredRegionId(null);
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
    if (!mapRef.current) {
      return;
    }

    const hoveredId = hoveredRegionId ?? "";
    mapRef.current.setFilter(hoverLayerId, ["==", ["get", "regionId"], hoveredId]);
  }, [hoveredRegionId]);

  useEffect(() => {
    const viewport = getRegionViewport(regionFeatures, regionId);
    if (!mapRef.current || !viewport) {
      return;
    }

    mapRef.current.flyTo({
      center: viewport.center,
      zoom: viewport.zoom,
      duration: 900,
      essential: true,
    });
  }, [regionFeatures, regionId]);

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
                ? "실제 서울/경기 시군구 경계 위에 위험도 색상과 선택 상태를 표시하는 첫 MVP 지도입니다."
                : "Mapbox 토큰이 없어 fallback 상태로 보입니다. 프로젝트 루트의 .env.local 에 VITE_MAPBOX_TOKEN 을 설정하면 실제 지도가 렌더링됩니다."}
            </p>
            {comparisonMode === "region" && comparisonRegionId ? (
              <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-coral shadow-sm">
                비교 지역: {regions.find((item) => item.id === comparisonRegionId)?.name ?? "선택됨"}
              </div>
            ) : null}
            {comparisonMode === "disease" && comparisonDiseaseId ? (
              <div className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-ocean shadow-sm">
                질병 비교: {diseases.find((item) => item.id === comparisonDiseaseId)?.name ?? "선택됨"}
              </div>
            ) : null}
          </div>
          <Card className="hidden max-w-xs bg-white/80 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ocean/70">
              위험도 범례
            </p>
            <div className="mt-3 space-y-3 text-sm text-slate-700">
              {legendItems.map((item) => (
                <div key={item.key} className="flex items-start gap-2">
                  <span
                    className={cn(
                      "mt-1 h-3 w-3 rounded-full",
                      item.key === "low" && "bg-riskLow",
                      item.key === "medium" && "bg-riskMedium",
                      item.key === "high" && "bg-riskHigh",
                      item.key === "selected" && "border-2 border-ink bg-white",
                      item.key === "comparison" && "border-2 border-coral bg-white",
                      item.key === "focused" && "border-2 border-ocean bg-white",
                    )}
                  />
                  <div>
                    <p className="font-medium text-slate-800">{item.label}</p>
                    <p className="text-xs leading-5 text-slate-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {(observationResponse?.items.map(normalizeObservation) ?? observations).map(
            (sampleObservation) => {
            const region = regions.find((item) => item.id === sampleObservation.regionId);
            if (!region) {
              return null;
            }

            const isSelected = region.id === regionId;
            const isComparison =
              comparisonMode === "region" && region.id === comparisonRegionId;
            const isHovered = region.id === hoveredRegionId;
            const isFocused =
              sampleObservation.diseaseId === diseaseId && sampleObservation.age === age;
            const cardPresentation = buildRegionCardPresentation({
              isSelected,
              isComparison,
              isHovered,
              isFocused,
              comparisonMode,
            });

            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setRegionId(region.id)}
                onMouseEnter={() => setHoveredRegionId(region.id)}
                onMouseLeave={() => setHoveredRegionId((current) => (current === region.id ? null : current))}
                className={cn(
                  "rounded-3xl border border-white/60 p-4 text-left transition",
                  riskClasses[sampleObservation.riskLevel ?? "low"],
                  cardToneClasses[cardPresentation.tone],
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {region.province}
                  </p>
                  <span className="rounded-full bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-700">
                    {cardPresentation.badge}
                  </span>
                </div>
                <p className="mt-2 text-lg font-semibold">{region.name}</p>
                <p className="mt-2 text-sm">{sampleObservation.trendSummary}</p>
                <p className="mt-3 text-xs leading-5 opacity-80">
                  {cardPresentation.description}
                </p>
              </button>
            );
            },
          )}
        </div>
      </div>
    </div>
  );
}
