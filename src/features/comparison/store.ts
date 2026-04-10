import { create } from "zustand";

type ComparisonMode = "none" | "region" | "disease";

interface ComparisonState {
  mode: ComparisonMode;
  regionId: string;
  diseaseId: string;
  setMode: (mode: ComparisonMode) => void;
  setRegionId: (regionId: string) => void;
  setDiseaseId: (diseaseId: string) => void;
  reset: () => void;
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  mode: "none",
  regionId: "",
  diseaseId: "",
  setMode: (mode) =>
    set((state) => ({
      mode,
      regionId: mode === "region" ? state.regionId : "",
      diseaseId: mode === "disease" ? state.diseaseId : "",
    })),
  setRegionId: (regionId) => set({ regionId }),
  setDiseaseId: (diseaseId) => set({ diseaseId }),
  reset: () => set({ mode: "none", regionId: "", diseaseId: "" }),
}));
