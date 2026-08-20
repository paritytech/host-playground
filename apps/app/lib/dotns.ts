/**
 * Derive the DotNS identifier the host bound this product under. The desktop's
 * handleCreateTransaction gate rejects with PermissionDenied when the signer's
 * dotNsIdentifier doesn't match the binding identifier — and that identifier
 * comes from the URL. We mirror the dotli shell's BASE_DOMAIN rule
 * (packages/config/src/config.ts) inverted: the shell takes the last two
 * segments of the hostname as the registrable root (dot.li, paseo.li,
 * paseoli.dev, ephemeral previews, ...) so the *label* is everything before
 * it. Appending ".dot" gives the canonical DotNS identifier that's stable
 * across shell deployments.
 *
 * Cases:
 *   - <name>.dot                       → use as-is
 *   - app.<name>.dot                   → <name>.dot (bulletin-deploy publishes
 *     <sub>.<name>.dot                   each executable under its `kind`
 *                                        subdomain; the binding identifier is
 *                                        the registrable root)
 *   - <cid>.app.localhost / <cid>.app.dot → host-playground.dot
 *   - <name>.<root>.<tld>              → <name>.dot (handles .dot.li,
 *     <name>.<sub>.<root>.<tld>          .paseo.li, .paseoli.dev, etc.)
 *   - <sub>.app.<root>.<tld>           → <sub>.dot (strip the `app` infra
 *                                        subdomain preview hosts insert)
 *   - localhost / 127.0.0.1 / *.localhost → host (with :port if any)
 *     (desktop dev mode and Playwright both report the local host:port
 *      and the desktop binds local URLs under "localhost[:port]")
 *   - anything else                    → fall back to the prod identifier
 */
export const HOST_PLAYGROUND_FALLBACK = "host-playground.dot";

export function deriveSelfDotNs(input: {
  hostname: string;
  host: string;
}): string {
  const hostname = input.hostname.toLowerCase();
  if (hostname.endsWith(".app.localhost") || hostname.endsWith(".app.dot")) {
    return HOST_PLAYGROUND_FALLBACK;
  }
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1"
  ) {
    return input.host.toLowerCase();
  }
  if (hostname.endsWith(".dot")) {
    const segments = hostname.split(".");
    return segments.length > 2 ? segments.slice(-2).join(".") : hostname;
  }
  const segments = hostname.split(".");
  if (segments.length >= 3) {
    let label = segments.slice(0, -2);
    // drop the `app` infra subdomain preview hosts insert (<name>.app.<root> → <name>)
    if (label[label.length - 1] === "app") label = label.slice(0, -1);
    if (label.length > 0) return `${label.join(".")}.dot`;
  }
  return HOST_PLAYGROUND_FALLBACK;
}

export function getSelfDotNs(): string {
  // Dev override: act as a specific product (e.g. `dim2.paseo`) while served
  // from localhost. Only meaningful against a host that serves the same id —
  // `TRUAPI_HOST_PRODUCT_ID=<id> yarn dev:host` sets both sides at once. The
  // host scopes signing to its --product-id, so setting only one side means
  // every signature is refused.
  const override = process.env.NEXT_PUBLIC_SELF_DOTNS;
  if (override) return override;
  if (typeof window === "undefined") return HOST_PLAYGROUND_FALLBACK;
  return deriveSelfDotNs({
    hostname: window.location.hostname,
    host: window.location.host,
  });
}
