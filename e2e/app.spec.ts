import { test, expect } from './fixtures';
import { waitForAppReady } from './helpers';

test.describe('App loads', () => {
  test('shows playground heading', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    await expect(frame.locator('h1:has-text("Host Playground")')).toBeVisible();
  });

  test('shows sidebar categories', async ({ testHost }) => {
    const frame = await waitForAppReady(testHost);
    // Sidebar nav items
    await expect(frame.getByRole('heading', { name: /Accounts/ })).toBeVisible();
    await expect(frame.getByRole('heading', { name: /Signing/ })).toBeVisible();
    await expect(frame.getByRole('heading', { name: /Chain Interaction/ })).toBeVisible();
  });
});
