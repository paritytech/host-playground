import type { TestHost } from '@parity/host-api-test-sdk/playwright';
import { expect, type FrameLocator } from '@playwright/test';

export async function waitForAppReady(testHost: TestHost, options?: { timeout?: number }): Promise<FrameLocator> {
  const timeout = options?.timeout ?? 90_000;
  const frame = testHost.productFrame();
  await testHost.waitForConnection(timeout);
  await frame.locator('h1:has-text("Host Playground")').waitFor({ state: 'visible', timeout });
  return frame;
}

/**
 * Click a test button by its visible name text and wait for the log
 * to show a success or error badge (not pending).
 */
export async function runTest(
  frame: FrameLocator,
  testName: string,
  timeout = 90_000,
): Promise<'success' | 'error'> {
  const btn = frame.locator(`button:has(span.font-medium:text-is("${testName}"))`);
  await expect(btn).toBeVisible({ timeout: 10_000 });
  await btn.click();

  // The log viewer's last entry should resolve from "pending" to "success" or "error".
  // Badge text is the status string inside a rounded-full div.
  const lastEntry = frame.locator('.space-y-3 > div').last();
  // Wait for it NOT to say "pending"
  await expect(lastEntry).not.toContainText('pending', { timeout });

  const text = await lastEntry.textContent() ?? '';
  return text.includes('success') ? 'success' : 'error';
}
