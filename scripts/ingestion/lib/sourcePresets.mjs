const sourcePresets = {
  "kdca-heat-illness": {
    sourceName: "kdca-heat-illness",
    sourceFormat: "korean-public-health",
    defaultDiseaseLabel: "heat illness",
  },
};

export function resolveSourceConfig({
  preset,
  sourceUrl,
  sourceName,
  sourceFormat,
  defaultDiseaseLabel,
}) {
  const presetConfig = preset ? sourcePresets[preset] : null;

  if (preset && !presetConfig) {
    throw new Error(`Unknown source preset: ${preset}`);
  }

  return {
    sourceName: sourceName ?? presetConfig?.sourceName ?? "http-public-health",
    sourceFormat: sourceFormat ?? presetConfig?.sourceFormat ?? "przm",
    sourceUrl,
    defaultDiseaseLabel:
      defaultDiseaseLabel ?? presetConfig?.defaultDiseaseLabel ?? "",
  };
}
