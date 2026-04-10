import type { Feature, FeatureCollection } from "geojson";
import type { Observation, RiskLevel } from "@/shared/types/domain";
import type {
  RegionFeatureProperties,
  RegionGeometry,
} from "@/features/map/data/regionData";

export interface RegionMapProperties extends RegionFeatureProperties {
  riskLevel: RiskLevel;
  isSelected: boolean;
  isComparison: boolean;
  diseaseFocus: boolean;
  trendSummary: string;
}

interface BuildRegionMapDataParams {
  features: Feature<RegionGeometry, RegionFeatureProperties>[];
  observations: Observation[];
  diseaseId: string;
  age: number;
  selectedRegionId: string;
  comparisonRegionId?: string;
}

interface RegionViewport {
  center: [number, number];
  zoom: number;
}

export function buildRegionMapData({
  features,
  observations,
  diseaseId,
  age,
  selectedRegionId,
  comparisonRegionId,
}: BuildRegionMapDataParams): FeatureCollection<RegionGeometry, RegionMapProperties> {
  return {
    type: "FeatureCollection",
    features: features.map((feature) => {
      const regionObservations = observations.filter(
        (item) => item.regionId === feature.properties.regionId,
      );
      const activeObservation =
        regionObservations.find(
          (item) => item.diseaseId === diseaseId && item.age === age,
        ) ?? regionObservations[0];

      return {
        ...feature,
        properties: {
          ...feature.properties,
          riskLevel: activeObservation?.riskLevel ?? "low",
          isSelected: feature.properties.regionId === selectedRegionId,
          isComparison: feature.properties.regionId === comparisonRegionId,
          diseaseFocus:
            activeObservation?.diseaseId === diseaseId &&
            activeObservation?.age === age,
          trendSummary: activeObservation?.trendSummary ?? "관측 데이터 준비 중",
        },
      };
    }),
  };
}

export function getRegionViewport(
  features: Feature<RegionGeometry, RegionFeatureProperties>[],
  selectedRegionId: string,
): RegionViewport | null {
  const region = features.find(
    (feature) => feature.properties.regionId === selectedRegionId,
  );

  if (!region) {
    return null;
  }

  return {
    center: getGeometryCenter(region.geometry.coordinates),
    zoom: getViewportZoom(region.geometry.coordinates),
  };
}

function getGeometryCenter(
  coordinates: RegionGeometry["coordinates"],
): [number, number] {
  const [minLng, minLat, maxLng, maxLat] = getBounds(coordinates);
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

function getViewportZoom(coordinates: RegionGeometry["coordinates"]): number {
  const [minLng, minLat, maxLng, maxLat] = getBounds(coordinates);
  const lngSpan = Math.abs(maxLng - minLng);
  const latSpan = Math.abs(maxLat - minLat);
  const maxSpan = Math.max(lngSpan, latSpan);

  if (maxSpan < 0.08) {
    return 10.8;
  }

  if (maxSpan < 0.14) {
    return 10.2;
  }

  return 9.6;
}

function getBounds(coordinates: unknown): [number, number, number, number] {
  const points = flattenCoordinates(coordinates);
  const lngs = points.map((point) => point[0]);
  const lats = points.map((point) => point[1]);

  return [
    Math.min(...lngs),
    Math.min(...lats),
    Math.max(...lngs),
    Math.max(...lats),
  ];
}

function flattenCoordinates(value: unknown): Array<[number, number]> {
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  ) {
    return [[value[0], value[1]]];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenCoordinates(item));
  }

  return [];
}
