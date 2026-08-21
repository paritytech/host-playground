import { getNotificationManager } from "@parity/product-sdk/host";
import type { TestDefinition } from "@/lib/types";
import { error, success } from "./shared";

/** Notification pushes surface host rejections as a named error. */
function notificationError(err: unknown) {
  const e = err as { name?: string };
  return error(e.name ?? String(err), err);
}

export const notificationTests: TestDefinition[] = [
  {
    id: "push-notification",
    name: "Push Notification",
    description:
      "Send a push notification to the host. Leave 'Schedule in' empty to fire immediately, or set seconds in the future to schedule it.",
    api: "getNotificationManager().push({ text, deeplink, scheduledAt })",
    args: [
      { name: "text", label: "Text", defaultValue: "Hello from demo product!" },
      { name: "deeplink", label: "Deeplink (optional)", defaultValue: "" },
      {
        name: "scheduleInSeconds",
        label: "Schedule in (seconds, optional)",
        defaultValue: "",
      },
    ],
    category: "notifications",
    async run({ args }) {
      const deeplink = args.deeplink.trim() || undefined;

      // Relative seconds → absolute epoch-ms; empty means immediate.
      const rawSeconds = args.scheduleInSeconds.trim();
      let scheduledAt: bigint | undefined;
      if (rawSeconds !== "") {
        const seconds = Number(rawSeconds);
        if (!Number.isFinite(seconds) || seconds <= 0) {
          return error(
            "Invalid schedule",
            `"Schedule in" must be a positive number of seconds, got "${rawSeconds}"`,
          );
        }
        scheduledAt = BigInt(Date.now() + Math.round(seconds * 1000));
      }

      // The host's push() prompts for the Notifications permission itself, so
      // no explicit pre-check here. Requesting it first caused a second prompt
      // when the user picked "Allow once" (see issue #33).
      const nm = await getNotificationManager();
      if (!nm)
        return error(
          "getNotificationManager returned null - not inside a host container",
        );

      const when =
        scheduledAt === undefined
          ? "now"
          : `at ${new Date(Number(scheduledAt)).toLocaleTimeString()}`;

      try {
        const id = await nm.push({ text: args.text, deeplink, scheduledAt });
        return success(
          `Notification (#${String(id)}) scheduled ${when}: "${args.text}"${deeplink ? ` → ${deeplink}` : ""}`,
        );
      } catch (err) {
        return notificationError(err);
      }
    },
  },
  {
    id: "cancel-notification",
    name: "Cancel Notification",
    description:
      "Cancel a scheduled notification by its id. Leave the id empty to schedule and immediately cancel a test notification.",
    api: "getNotificationManager().cancel(id)",
    args: [
      { name: "id", label: "Notification id (optional)", defaultValue: "" },
    ],
    category: "notifications",
    async run({ args }) {
      const rawId = args.id.trim();
      const requestedId = Number(rawId);
      if (
        rawId !== "" &&
        (!Number.isInteger(requestedId) || requestedId <= 0)
      ) {
        return error(
          "Invalid id",
          `"Notification id" must be a positive integer, got "${rawId}"`,
        );
      }

      const nm = await getNotificationManager();
      if (!nm)
        return error(
          "getNotificationManager returned null - not inside a host container",
        );

      try {
        const id =
          rawId === ""
            ? await nm.push({
                text: "Cancel notification test",
                scheduledAt: BigInt(Date.now() + 60 * 60 * 1000),
              })
            : requestedId;
        await nm.cancel(id);
        return success(`Cancelled notification #${String(id)}`);
      } catch (err) {
        return notificationError(err);
      }
    },
  },
];
