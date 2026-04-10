import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createLocalJsonSourceAdapter,
  loadSourceRecords,
} from "./sourceAdapters.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("source adapters", () => {
  it("loads records from a local json fixture", async () => {
    const adapter = createLocalJsonSourceAdapter({
      sourceName: "sample-public-health",
      fixturePath: path.join(__dirname, "..", "fixtures", "sample-source-records.json"),
    });

    const records = await loadSourceRecords(adapter);

    expect(records).toHaveLength(5);
    expect(records[0]).toMatchObject({
      source_name: "sample-public-health",
      source_record_id: "sample-001",
    });
  });
});
