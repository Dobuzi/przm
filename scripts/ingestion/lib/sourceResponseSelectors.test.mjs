import { describe, expect, it } from "vitest";
import { selectJsonRecords } from "./sourceResponseSelectors.mjs";

describe("selectJsonRecords", () => {
  it("returns array payloads directly", () => {
    expect(selectJsonRecords([{ id: "row-1" }])).toEqual([{ id: "row-1" }]);
  });

  it("returns records from common wrapper fields", () => {
    expect(selectJsonRecords({ items: [{ id: "item-1" }] })).toEqual([
      { id: "item-1" },
    ]);
    expect(selectJsonRecords({ data: [{ id: "data-1" }] })).toEqual([
      { id: "data-1" },
    ]);
  });

  it("returns records from data.go.kr response body items", () => {
    expect(
      selectJsonRecords({
        response: {
          body: {
            items: {
              item: [{ id: "openapi-1" }],
            },
          },
        },
      }),
    ).toEqual([{ id: "openapi-1" }]);
  });

  it("wraps a single data.go.kr item object as one record", () => {
    expect(
      selectJsonRecords({
        response: {
          body: {
            items: {
              item: { id: "openapi-1" },
            },
          },
        },
      }),
    ).toEqual([{ id: "openapi-1" }]);
  });
});
