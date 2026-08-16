import {
  isChainSupported,
  requestDevicePermission,
} from "@host-playground/product-sdk-host";
import type { TestDefinition } from "@/lib/types";
import {
  error,
  reportPermission,
  requestDevice,
  requestRemote,
  sdkErrorMessage,
  success,
} from "./shared";

type DevicePermission = Parameters<typeof requestDevicePermission>[0];

/** One card per device permission the host can prompt for. */
const DEVICE_PERMISSIONS: {
  permission: DevicePermission;
  id: string;
  description: string;
}[] = [
  {
    permission: "Camera",
    id: "camera",
    description: "Requests camera access from the host",
  },
  {
    permission: "Microphone",
    id: "microphone",
    description: "Requests microphone access from the host",
  },
  {
    permission: "Location",
    id: "location",
    description: "Requests location access from the host",
  },
  {
    permission: "Bluetooth",
    id: "bluetooth",
    description: "Requests bluetooth access from the host",
  },
  {
    permission: "Notifications",
    id: "notifications",
    description: "Requests notifications access from the host",
  },
  {
    permission: "NFC",
    id: "nfc",
    description: "Requests NFC access from the host",
  },
  {
    permission: "Clipboard",
    id: "clipboard",
    description: "Requests clipboard access from the host",
  },
  {
    permission: "OpenUrl",
    id: "open-url",
    description: "Requests permission to open external URLs",
  },
  {
    permission: "Biometrics",
    id: "biometrics",
    description: "Requests biometrics access from the host",
  },
];

const devicePermissionTests: TestDefinition[] = DEVICE_PERMISSIONS.map(
  ({ permission, id, description }) => ({
    id: `device-permission-${id}`,
    name: `Device Permission: ${permission}`,
    description,
    api: `requestDevicePermission('${permission}')`,
    category: "permissions",
    async run() {
      return reportPermission(
        `${permission} permission`,
        requestDevice(permission),
      );
    },
  }),
);

export const permissionTests: TestDefinition[] = [
  {
    id: "feature-check",
    name: "Feature Check",
    description: "Checks if the selected chain is supported",
    api: "isChainSupported(genesisHash)",
    category: "permissions",
    async run({ chain }) {
      try {
        const result = await isChainSupported(chain.genesis);
        return result.ok
          ? success(`${chain.name} supported: ${result.value}`)
          : error(sdkErrorMessage(result.error), result.error);
      } catch (err) {
        return error(sdkErrorMessage(err), err);
      }
    },
  },
  ...devicePermissionTests,
  {
    id: "remote-permission-remote",
    name: "Remote Permission: Remote (HTTP/WS)",
    description: "Requests permission to connect to remote domains",
    api: "requestPermission({ tag: 'Remote', value: { domains: [url] } })",
    args: [
      {
        name: "url",
        label: "URL pattern",
        defaultValue: "https://example.com",
      },
    ],
    category: "permissions",
    async run({ args }) {
      return reportPermission(
        "Remote permission",
        requestRemote({ tag: "Remote", value: { domains: [args.url] } }),
      );
    },
  },
  {
    id: "remote-permission-webrtc",
    name: "Remote Permission: WebRTC",
    description: "Requests permission to use WebRTC",
    api: "requestPermission({ tag: 'WebRtc', value: undefined })",
    category: "permissions",
    async run() {
      return reportPermission(
        "WebRTC permission",
        requestRemote({ tag: "WebRtc", value: undefined }),
      );
    },
  },
  {
    id: "remote-permission-chain-submit",
    name: "Remote Permission: Chain Submit",
    description: "Requests permission to submit transactions on a chain",
    api: "requestPermission({ tag: 'ChainSubmit', value: undefined })",
    category: "permissions",
    async run({ chain }) {
      return reportPermission(
        `Chain submit permission for ${chain.name}`,
        requestRemote({ tag: "ChainSubmit", value: undefined }),
      );
    },
  },
  {
    id: "remote-permission-preimage-submit",
    name: "Remote Permission: Preimage Submit",
    description: "Requests permission to submit preimages via the host",
    api: "requestPermission({ tag: 'PreimageSubmit', value: undefined })",
    category: "permissions",
    async run({ chain }) {
      return reportPermission(
        `Preimage submit permission for ${chain.name}`,
        requestRemote({ tag: "PreimageSubmit", value: undefined }),
      );
    },
  },
  {
    id: "remote-permission-statement-submit",
    name: "Remote Permission: Statement Submit",
    description: "Requests permission to submit statement-store statements",
    api: "requestPermission({ tag: 'StatementSubmit', value: undefined })",
    category: "permissions",
    async run({ chain }) {
      return reportPermission(
        `Statement submit permission for ${chain.name}`,
        requestRemote({ tag: "StatementSubmit", value: undefined }),
      );
    },
  },
];
