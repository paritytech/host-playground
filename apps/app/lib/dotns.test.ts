import { describe, expect, it } from "vitest";
import { deriveSelfDotNs } from "./dotns";

describe("deriveSelfDotNs", () => {
  it("preserves the environment-qualified native dot binding", () => {
    expect(
      deriveSelfDotNs({
        protocol: "dot:",
        hostname: "fix-epoca-fixtures-host-playground00.paseo",
        host: "fix-epoca-fixtures-host-playground00.paseo",
      }),
    ).toBe("fix-epoca-fixtures-host-playground00.paseo");
  });

  it("maps web shell identifiers to the active network suffix", () => {
    expect(
      deriveSelfDotNs({
        protocol: "https:",
        hostname: "host-playground.paseo.li",
        host: "host-playground.paseo.li",
        suffix: "paseo",
      }),
    ).toBe("host-playground.paseo");
  });
});
