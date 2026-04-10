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
