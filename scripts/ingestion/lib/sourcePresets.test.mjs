import { describe, expect, it } from "vitest";
import { resolveSourceConfig } from "./sourcePresets.mjs";

describe("resolveSourceConfig", () => {
  it("applies the KDCA heat illness preset", () => {
    const config = resolveSourceConfig({
      preset: "kdca-heat-illness",
      sourceUrl: "https://example.test/kdca-heat",
    });

    expect(config).toEqual({
      sourceName: "kdca-heat-illness",
      sourceFormat: "korean-public-health",
      sourceUrl: "https://example.test/kdca-heat",
      defaultDiseaseLabel: "heat illness",
    });
  });

  it("lets explicit values override preset defaults", () => {
    const config = resolveSourceConfig({
      preset: "kdca-heat-illness",
      sourceName: "custom-source",
      sourceFormat: "przm",
      sourceUrl: "https://example.test/custom",
      defaultDiseaseLabel: "custom disease",
    });

    expect(config).toMatchObject({
      sourceName: "custom-source",
      sourceFormat: "przm",
      defaultDiseaseLabel: "custom disease",
    });
  });
});
