export const env = {
  mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN ?? "",
  apiMode: (import.meta.env.VITE_API_MODE ?? "mock") as "mock" | "real",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "/api/v1",
};
