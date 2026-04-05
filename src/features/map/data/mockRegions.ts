import type { Feature, FeatureCollection, Polygon } from "geojson";

export interface RegionFeatureProperties {
  regionId: string;
  name: string;
  province: string;
}

export type RegionFeature = Feature<Polygon, RegionFeatureProperties>;
export type RegionFeatureCollection = FeatureCollection<
  Polygon,
  RegionFeatureProperties
>;

export const regionFeatures: RegionFeature[] = [
  {
    type: "Feature",
    properties: {
      regionId: "seoul-gangseo",
      name: "서울 강서구",
      province: "서울특별시",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [126.79, 37.56],
          [126.89, 37.56],
          [126.89, 37.61],
          [126.79, 37.61],
          [126.79, 37.56],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      regionId: "gyeonggi-bundang",
      name: "성남시 분당구",
      province: "경기도",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [127.05, 37.34],
          [127.16, 37.34],
          [127.16, 37.41],
          [127.05, 37.41],
          [127.05, 37.34],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      regionId: "gyeonggi-suwon",
      name: "수원시 영통구",
      province: "경기도",
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [127.02, 37.23],
          [127.11, 37.23],
          [127.11, 37.29],
          [127.02, 37.29],
          [127.02, 37.23],
        ],
      ],
    },
  },
];

export const mockRegionsGeoJson: RegionFeatureCollection = {
  type: "FeatureCollection",
  features: regionFeatures,
};

