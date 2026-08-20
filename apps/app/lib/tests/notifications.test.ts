import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNotificationManager } from "@parity/product-sdk/host";
import { notificationTests } from "./notifications";
import type { TestContext } from "../types";

vi.mock("@parity/product-sdk/host", () => ({
  getNotificationManager: vi.fn(),
}));

vi.mock("./shared", () => ({
  error: (message: string, details?: unknown) => ({
    success: false,
    message,
    details,
  }),
  success: (message: string, details?: unknown) => ({
    success: true,
    message,
    details,
  }),
}));

const cancelNotification = notificationTests.find(
  (test) => test.id === "cancel-notification",
);

if (!cancelNotification) {
  throw new Error("cancel-notification flow is missing");
}

function context(id: string): TestContext {
  return {
    args: { id },
    chain: {} as TestContext["chain"],
    log: vi.fn(),
    navigate: vi.fn(),
  };
}

describe("cancel-notification", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates and cancels a scheduled notification when no id is provided", async () => {
    const push = vi.fn().mockResolvedValue(42);
    const cancel = vi.fn().mockResolvedValue(undefined);
    vi.mocked(getNotificationManager).mockResolvedValue({ push, cancel });

    const started = Date.now();
    const result = await cancelNotification.run(context(""));

    expect(result.success).toBe(true);
    expect(push).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith({
      text: "Cancel notification test",
      scheduledAt: expect.any(BigInt),
    });
    expect(Number(push.mock.calls[0][0].scheduledAt)).toBeGreaterThan(started);
    expect(cancel).toHaveBeenCalledOnce();
    expect(cancel).toHaveBeenCalledWith(42);
  });

  it("cancels an explicitly provided notification without pushing", async () => {
    const push = vi.fn();
    const cancel = vi.fn().mockResolvedValue(undefined);
    vi.mocked(getNotificationManager).mockResolvedValue({ push, cancel });

    const result = await cancelNotification.run(context("17"));

    expect(result.success).toBe(true);
    expect(push).not.toHaveBeenCalled();
    expect(cancel).toHaveBeenCalledWith(17);
  });
});
