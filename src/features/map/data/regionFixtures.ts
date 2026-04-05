import type { RegionFeature } from "@/features/map/data/regionData";

export const regionFixtures: RegionFeature[] = [
  {
    type: "Feature",
    properties: {
      regionId: "11160",
      name: "강서구",
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
      regionId: "31023",
      name: "성남시분당구",
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
      regionId: "31014",
      name: "수원시영통구",
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

