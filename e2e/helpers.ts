import type { TestHost } from '@parity/host-api-test-sdk/playwright';
import { expect, type FrameLocator } from '@playwright/test';

export async function waitForAppReady(testHost: TestHost, options?: { timeout?: number }): Promise<FrameLocator> {
  const timeout = options?.timeout ?? 90_000;
  const frame = testHost.productFrame();
  await testHost.waitForConnection(timeout);
  await frame.locator('h1:has-text("Host Playground")').first().waitFor({ state: 'visible', timeout });
  return frame;
}

/**
 * Click a test button by its test ID and wait for the log entry to resolve.
 */
export async function runTest(
  frame: FrameLocator,
  testId: string,
  timeout = 90_000,
): Promise<'success' | 'error'> {
  const btn = frame.locator(`[data-testid="run-${testId}"]`);
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await btn.click();

  // Wait for the latest log entry to resolve (not pending)
  const lastEntry = frame.locator('[data-testid="log-entry"]').last();
  await expect(lastEntry).not.toHaveAttribute('data-status', 'pending', { timeout });

  const status = await lastEntry.getAttribute('data-status');
  return status === 'success' ? 'success' : 'error';
}

/**
 * Fill a test's argument inputs, then run it. Mirrors `runTest` but sets
 * the named arg fields first (each rendered with a `arg-<testId>-<name>`
 * test ID by TestButton).
 */
export async function runTestWithArgs(
  frame: FrameLocator,
  testId: string,
  args: Record<string, string>,
  timeout = 90_000,
): Promise<'success' | 'error'> {
  for (const [name, value] of Object.entries(args)) {
    const input = frame.locator(`[data-testid="arg-${testId}-${name}"]`);
    await expect(input).toBeVisible({ timeout: 10_000 });
    await input.fill(value);
  }
  return runTest(frame, testId, timeout);
}
