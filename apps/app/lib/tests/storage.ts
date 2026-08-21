import { createHostLocalStorage } from "@parity/product-sdk/host";
import { toHex } from "polkadot-api/utils";
import { getApp } from "@/lib/app";
import type { TestDefinition } from "@/lib/types";
import { error, hostStorage, success } from "./shared";

export const storageTests: TestDefinition[] = [
  {
    id: "storage-string-write-read",
    name: "String Write & Read",
    description:
      "Writes and reads a string via app.localStorage (Tier-1 createApp storage)",
    api: "app.localStorage.set(key, value) / app.localStorage.get(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run({ args }) {
      const value = `test_value_${Date.now()}`;

      const app = await getApp();
      await app.localStorage.set(args.key, value);
      const readValue = await app.localStorage.get(args.key);

      return readValue === value
        ? success(`Write: "${value}"\nRead: "${readValue}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
  {
    id: "storage-bytes-write-read",
    name: "Bytes Write & Read",
    description: "Writes and reads raw bytes via hostLocalStorage",
    api: "hostStorage().writeBytes(key, value) / readBytes(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_bytes" },
    ],
    category: "storage",
    // Stays on getHostLocalStorage: app.localStorage has no bytes surface.
    async run({ args }) {
      const value = new TextEncoder().encode(`bytes_${Date.now()}`);

      const storage = await hostStorage();
      await storage.writeBytes(args.key, value);
      const readValue = await storage.readBytes(args.key);

      if (!readValue) {
        return error("Read returned undefined after write");
      }

      return toHex(value) === toHex(readValue)
        ? success(`Bytes round-trip OK (${value.length} bytes)`, {
            written: toHex(value),
            read: toHex(readValue),
          })
        : error("Bytes mismatch", {
            written: toHex(value),
            read: toHex(readValue),
          });
    },
  },
  {
    id: "storage-json-write-read",
    name: "JSON Write & Read",
    description:
      "Writes and reads JSON via app.localStorage (Tier-1 createApp storage)",
    api: "app.localStorage.setJSON(key, value) / app.localStorage.getJSON(key)",
    args: [{ name: "key", label: "Key", defaultValue: "host_playground_json" }],
    category: "storage",
    async run({ args }) {
      const value = {
        timestamp: Date.now(),
        nested: { foo: "bar", nums: [1, 2, 3] },
      };

      const app = await getApp();
      await app.localStorage.setJSON(args.key, value);
      const readValue = await app.localStorage.getJSON(args.key);

      return JSON.stringify(value) === JSON.stringify(readValue)
        ? success("JSON round-trip OK", readValue)
        : error("JSON mismatch", { written: value, read: readValue });
    },
  },
  {
    id: "storage-clear",
    name: "Storage Clear",
    description:
      "Removes a single storage key via app.localStorage.remove (Tier-1). Note: app.localStorage.clear() wipes ALL keys, so remove(key) is the per-key equivalent.",
    api: "app.localStorage.remove(key)",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_string" },
    ],
    category: "storage",
    async run({ args }) {
      // Write then remove just this key — clear() would wipe ALL keys.
      const app = await getApp();
      await app.localStorage.set(args.key, "to_be_cleared");
      await app.localStorage.remove(args.key);

      const readValue = await app.localStorage.get(args.key);
      return !readValue
        ? success("Storage key cleared successfully")
        : error(`Key still has value after clear: "${readValue}"`);
    },
  },
  {
    id: "storage-factory",
    name: "Storage Factory",
    description:
      "Creates a custom HostLocalStorage instance via createHostLocalStorage (Tier-2; app.localStorage has no factory equivalent)",
    api: "createHostLocalStorage()",
    args: [
      { name: "key", label: "Key", defaultValue: "host_playground_factory" },
    ],
    category: "storage",
    async run({ args }) {
      const storage = await createHostLocalStorage();
      if (!storage)
        return error(
          "createHostLocalStorage returned null - not inside a host container",
        );
      const value = `factory_${Date.now()}`;

      await storage.writeString(args.key, value);
      const readValue = await storage.readString(args.key);
      await storage.clear(args.key);

      return readValue === value
        ? success(`Factory storage round-trip OK: "${value}"`)
        : error(`Mismatch: wrote "${value}", read "${readValue}"`);
    },
  },
];
