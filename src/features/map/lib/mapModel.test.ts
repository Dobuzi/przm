import { describe, expect, it } from "vitest";
import {
  buildRegionMapData,
  getRegionViewport,
} from "@/features/map/lib/mapModel";
import { diseases, observations } from "@/shared/constants/mockData";
import { regionFixtures } from "@/features/map/data/regionFixtures";

describe("buildRegionMapData", () => {
  it("marks selected region and carries risk/focus metadata for the active disease", () => {
    const mapData = buildRegionMapData({
      features: regionFixtures,
      observations,
      diseaseId: diseases[0].id,
      age: 7,
      selectedRegionId: "31023",
    });

    const selected = mapData.features.find(
      (feature) => feature.properties.regionId === "31023",
    );
    const comparisonRegion = mapData.features.find(
      (feature) => feature.properties.regionId === "11160",
    );

    expect(selected?.properties.isSelected).toBe(true);
    expect(selected?.properties.riskLevel).toBe("high");
    expect(selected?.properties.diseaseFocus).toBe(true);
    expect(comparisonRegion?.properties.isSelected).toBe(false);
    expect(comparisonRegion?.properties.riskLevel).toBe("medium");
    expect(comparisonRegion?.properties.diseaseFocus).toBe(true);
  });

  it("returns a focused viewport for the selected region", () => {
    const viewport = getRegionViewport(regionFixtures, "31014");

    expect(viewport).not.toBeNull();
    expect(viewport?.center[0]).toBeGreaterThan(127);
    expect(viewport?.center[1]).toBeGreaterThan(37.2);
    expect(viewport?.zoom).toBeGreaterThanOrEqual(9.6);
  });
});
