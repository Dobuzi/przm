import type {
  Feature,
  FeatureCollection,
  Geometry,
  MultiPolygon,
  Polygon,
} from "geojson";
import { regionOptions } from "@/features/map/data/regionOptions";

export interface RegionFeatureProperties {
  regionId: string;
  name: string;
  province: string;
}

export type RegionGeometry = Polygon | MultiPolygon;
export type RegionFeature = Feature<RegionGeometry, RegionFeatureProperties>;
export type RegionFeatureCollection = FeatureCollection<
  Geometry,
  RegionFeatureProperties
>;

export async function loadRegionFeatureCollection() {
  const response = await fetch("/data/seoul-gyeonggi-municipalities.json");

  if (!response.ok) {
    throw new Error("Failed to load Seoul/Gyeonggi municipality GeoJSON");
  }

  return (await response.json()) as RegionFeatureCollection;
}

export { regionOptions };

