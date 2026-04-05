import type { Feature, FeatureCollection, Polygon } from "geojson";
import type { Observation, RiskLevel } from "@/shared/types/domain";
import type { RegionFeatureProperties } from "@/features/map/data/mockRegions";

export interface RegionMapProperties extends RegionFeatureProperties {
  riskLevel: RiskLevel;
  isSelected: boolean;
  diseaseFocus: boolean;
  trendSummary: string;
}

interface BuildRegionMapDataParams {
  features: Feature<Polygon, RegionFeatureProperties>[];
  observations: Observation[];
  diseaseId: string;
  age: number;
  selectedRegionId: string;
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
}: BuildRegionMapDataParams): FeatureCollection<Polygon, RegionMapProperties> {
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
  features: Feature<Polygon, RegionFeatureProperties>[],
  selectedRegionId: string,
): RegionViewport | null {
  const region = features.find(
    (feature) => feature.properties.regionId === selectedRegionId,
  );

  if (!region) {
    return null;
  }

  return {
    center: region.properties.center,
    zoom: region.properties.zoom,
  };
}
