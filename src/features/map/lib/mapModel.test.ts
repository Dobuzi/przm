import { describe, expect, it } from "vitest";
import { buildRegionMapData } from "@/features/map/lib/mapModel";
import { diseases, observations } from "@/shared/constants/mockData";
import { regionFeatures } from "@/features/map/data/mockRegions";

describe("buildRegionMapData", () => {
  it("marks selected region and carries risk/focus metadata for the active disease", () => {
    const mapData = buildRegionMapData({
      features: regionFeatures,
      observations,
      diseaseId: diseases[0].id,
      age: 7,
      selectedRegionId: "gyeonggi-bundang",
    });

    const selected = mapData.features.find(
      (feature) => feature.properties.regionId === "gyeonggi-bundang",
    );
    const neutral = mapData.features.find(
      (feature) => feature.properties.regionId === "seoul-gangseo",
    );

    expect(selected?.properties.isSelected).toBe(true);
    expect(selected?.properties.riskLevel).toBe("high");
    expect(selected?.properties.diseaseFocus).toBe(true);
    expect(neutral?.properties.isSelected).toBe(false);
    expect(neutral?.properties.diseaseFocus).toBe(false);
  });
});
