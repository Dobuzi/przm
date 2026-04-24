import { readFile } from "node:fs/promises";

export async function loadSourceRecords(adapter) {
  return adapter.loadRecords();
}

export function createLocalJsonSourceAdapter({
  sourceName,
  fixturePath,
}) {
  return {
    sourceName,
    fixturePath,
    async loadRecords() {
      const rawFixture = await readFile(fixturePath, "utf-8");
      return JSON.parse(rawFixture);
    },
  };
}

export function createHttpJsonSourceAdapter({
  sourceName,
  url,
  headers = {},
  fetchImpl = globalThis.fetch,
  selectRecords = (payload) => payload,
}) {
  return {
    sourceName,
    url,
    async loadRecords() {
      if (typeof fetchImpl !== "function") {
        throw new Error(`No fetch implementation available for ${sourceName}`);
      }

      const response = await fetchImpl(url, {
        headers,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load ${sourceName} from ${url}: HTTP ${response.status}`,
        );
      }

      const payload = await response.json();
      const records = selectRecords(payload);

      if (!Array.isArray(records)) {
        throw new Error(`Source ${sourceName} did not return a record array`);
      }

      return records;
    },
  };
}
