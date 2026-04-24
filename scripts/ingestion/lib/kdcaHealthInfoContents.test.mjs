import { describe, expect, it } from "vitest";
import {
  buildKdcaHealthInfoUrl,
  representativeInfectiousHealthInfoContents,
} from "./kdcaHealthInfoContents.mjs";

describe("KDCA health info contents", () => {
  it("keeps representative infectious disease content ids available", () => {
    expect(representativeInfectiousHealthInfoContents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          contentId: "5423",
          title: "감기",
          diseaseId: "common-cold",
        }),
        expect.objectContaining({
          contentId: "6561",
          title: "결핵",
          diseaseId: "tuberculosis",
        }),
        expect.objectContaining({
          contentId: "5245",
          title: "말라리아",
          diseaseId: "malaria",
        }),
      ]),
    );
  });

  it("builds a token-redacted content URL from the configured base URL", () => {
    expect(
      buildKdcaHealthInfoUrl({
        baseUrl: "http://api.kdca.go.kr/api/provide/healthInfoNew?TOKEN=<TOKEN>",
        contentId: "5423",
      }),
    ).toBe(
      "http://api.kdca.go.kr/api/provide/healthInfoNew?TOKEN=<TOKEN>&cntntsSn=5423",
    );
  });
});
