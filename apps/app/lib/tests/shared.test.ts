import { describe, expect, it } from "vitest";
import { NETWORKS } from "../types";
import {
  ASSETHUB_GENESIS_TO_PEOPLE_GENESIS,
  PEOPLE_CHAIN_BY_HUB,
  PRODUCT_ALIAS_RING_LOCATION,
} from "./shared";

describe("Paseo People chain configuration", () => {
  it("uses one live genesis across descriptors and ring locations", () => {
    const paseo = NETWORKS.PASEO_ASSETHUBNEXTV2;

    expect(PEOPLE_CHAIN_BY_HUB[paseo.genesis]?.genesis).toBe(
      paseo.peopleGenesis,
    );
    expect(PRODUCT_ALIAS_RING_LOCATION.chainId).toBe(paseo.peopleGenesis);
    expect(ASSETHUB_GENESIS_TO_PEOPLE_GENESIS[paseo.genesis]).toBe(
      paseo.peopleGenesis,
    );
  });
});
