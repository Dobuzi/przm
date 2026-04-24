import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createHttpJsonSourceAdapter,
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

    expect(records).toHaveLength(7);
    expect(records[0]).toMatchObject({
      source_name: "sample-public-health",
      source_record_id: "sample-001",
    });
  });

  it("loads records from an HTTP JSON source", async () => {
    const adapter = createHttpJsonSourceAdapter({
      sourceName: "sample-http-health",
      url: "https://example.test/observations",
      fetchImpl: async (url, options) => ({
        ok: true,
        status: 200,
        url,
        options,
        async json() {
          return {
            items: [
              {
                source_name: "sample-http-health",
                source_record_id: "http-001",
              },
            ],
          };
        },
      }),
      selectRecords: (payload) => payload.items,
    });

    const records = await loadSourceRecords(adapter);

    expect(records).toEqual([
      {
        source_name: "sample-http-health",
        source_record_id: "http-001",
      },
    ]);
  });

  it("fails clearly when an HTTP source returns a non-2xx response", async () => {
    const adapter = createHttpJsonSourceAdapter({
      sourceName: "sample-http-health",
      url: "https://example.test/observations",
      fetchImpl: async () => ({
        ok: false,
        status: 503,
        async json() {
          return {};
        },
      }),
    });

    await expect(loadSourceRecords(adapter)).rejects.toThrow(
      "Failed to load sample-http-health from https://example.test/observations: HTTP 503",
    );
  });
});
