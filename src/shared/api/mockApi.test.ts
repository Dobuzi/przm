import { describe, expect, it } from "vitest";
import { fetchDashboardData } from "@/shared/api/mockApi";

describe("fetchDashboardData", () => {
  it("filters dashboard data by region, disease, and age", async () => {
    const data = await fetchDashboardData({
      regionId: "31023",
      diseaseId: "flu-a",
      age: 7,
    });

    expect(data.observations).toHaveLength(1);
    expect(data.forecasts).toHaveLength(1);
    expect(data.observations[0].regionId).toBe("31023");
    expect(data.observations[0].diseaseId).toBe("flu-a");
    expect(data.observations[0].age).toBe(7);
  });

  it("returns empty arrays instead of throwing when filters have no matching data", async () => {
    const data = await fetchDashboardData({
      regionId: "11160",
      diseaseId: "flu-a",
      age: 13,
    });

    expect(data.observations).toEqual([]);
    expect(data.forecasts).toEqual([]);
  });
});
