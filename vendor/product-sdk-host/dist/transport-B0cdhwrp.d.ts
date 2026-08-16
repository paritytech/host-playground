import { TrUApiClient } from '@parity/truapi';

/**
 * Access to the in-house TruAPI client (`@parity/truapi`) for the host package.
 *
 * Environment detection and the lazily-built, cached client come from
 * `@parity/truapi/sandbox`; this module layers the product-sdk-specific glue on
 * top — an async {@link getClient} accessor and {@link subscribeWithInterrupt},
 * which adapts a truapi stream into the host's {@link HostSubscription} shape.
 *
 * @module
 */

/**
 * Test-only seam: force {@link getClient} / {@link getClientSync} to return
 * `client`, and {@link isCorrectEnvironment} to report `true`. Pass `null` to
 * restore normal detection. Exposed through `@parity/product-sdk-host/testing`,
 * not the package's main entry.
 *
 * Calling this in a production build silently reroutes every host accessor to
 * the injected client, so we warn — it almost always means a `/testing` import
 * leaked into a production path.
 */
declare function setTruApiClient(client: TrUApiClient | null): void;
/**
 * Host-container detection. `true` when a test client is injected, otherwise the
 * sandbox heuristic (iframe / webview marker / injected message port).
 */
declare function isCorrectEnvironment(): boolean;

export { isCorrectEnvironment as i, setTruApiClient as s };
