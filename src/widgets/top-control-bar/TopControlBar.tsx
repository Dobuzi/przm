import { diseases, regions } from "@/shared/constants/mockData";
import { useSelectionStore } from "@/features/selection-context/store";

export function TopControlBar() {
  const {
    regionId,
    diseaseId,
    age,
    setRegionId,
    setDiseaseId,
    setAge,
  } = useSelectionStore();

  return (
    <div className="flex flex-col gap-3 rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-panel backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ocean/70">
          PRZM
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          우리 동네 어린이 질병 퍼짐을 빠르게 읽는 지도
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-sm">
          <span className="block font-medium text-slate-700">지역</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2"
            value={regionId}
            onChange={(event) => setRegionId(event.target.value)}
          >
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="block font-medium text-slate-700">질병</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2"
            value={diseaseId}
            onChange={(event) => setDiseaseId(event.target.value)}
          >
            {diseases.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="block font-medium text-slate-700">연령</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2"
            value={age}
            onChange={(event) => setAge(Number(event.target.value))}
          >
            {Array.from({ length: 14 }, (_, index) => (
              <option key={index} value={index}>
                {index}세
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

