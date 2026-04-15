import { create } from "zustand";
import { diseases } from "@/shared/constants/mockData";

type PanelState = "closed" | "open";

interface SelectionState {
  regionId: string;
  diseaseId: string;
  age: number;
  panelState: PanelState;
  setRegionId: (regionId: string) => void;
  setDiseaseId: (diseaseId: string) => void;
  setAge: (age: number) => void;
  openPanel: () => void;
  closePanel: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  regionId: "31023",
  diseaseId: diseases[0].id,
  age: 7,
  panelState: "closed",
  setRegionId: (regionId) => set({ regionId }),
  setDiseaseId: (diseaseId) => set({ diseaseId }),
  setAge: (age) => set({ age }),
  openPanel: () => set({ panelState: "open" }),
  closePanel: () => set({ panelState: "closed" }),
}));
