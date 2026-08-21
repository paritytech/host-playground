import { describe, expect, it } from "vitest";
import { ACTIVE_CHAIN_ID, NETWORKS } from "../types";
import {
  ASSETHUB_GENESIS_TO_PEOPLE_GENESIS,
  PEOPLE_CHAIN_BY_HUB,
  PRODUCT_ALIAS_RING_LOCATION,
  PRODUCT_ALIAS_RING_OWNER,
} from "./shared";

describe("People chain configuration", () => {
  it("uses the configured People genesis for descriptors and ring locations", () => {
    const paseo = NETWORKS.PASEO_ASSETHUBNEXTV2;
    const preview = NETWORKS.PREVIEWNET_ASSETHUB;

    expect(PEOPLE_CHAIN_BY_HUB[paseo.genesis]?.genesis).toBe(
      paseo.peopleGenesis,
    );
    expect(ASSETHUB_GENESIS_TO_PEOPLE_GENESIS[paseo.genesis]).toBe(
      paseo.peopleGenesis,
    );
    expect(ASSETHUB_GENESIS_TO_PEOPLE_GENESIS[preview.genesis]).toBe(
      preview.peopleGenesis,
    );
    expect(paseo.personhoodRingOwner).toBe("peopl.paseo");
    expect(preview.personhoodRingOwner).toBe("peopl.dot");
    expect(PRODUCT_ALIAS_RING_LOCATION.chainId).toBe(
      NETWORKS[ACTIVE_CHAIN_ID].peopleGenesis,
    );
    expect(PRODUCT_ALIAS_RING_OWNER).toBe(
      NETWORKS[ACTIVE_CHAIN_ID].personhoodRingOwner,
    );
  });
});
