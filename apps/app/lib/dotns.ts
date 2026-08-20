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
 *   - <name>.<suffix>                  → use as-is
 *   - app.<name>.<suffix>              → <name>.<suffix> (bulletin-deploy publishes
 *     <sub>.<name>.dot                   each executable under its `kind`
 *                                        subdomain; the binding identifier is
 *                                        the registrable root)
 *   - <cid>.app.localhost / <cid>.app.<suffix> → host-playground.<suffix>
 *   - <name>.<root>.<tld>              → <name>.<suffix> (handles .dot.li,
 *     <name>.<sub>.<root>.<tld>          .paseo.li, .paseoli.dev, etc.)
 *   - <sub>.app.<root>.<tld>           → <sub>.<suffix> (strip the `app` infra
 *                                        subdomain preview hosts insert)
 *   - localhost / 127.0.0.1 / *.localhost → host (with :port if any)
 *     (desktop dev mode and Playwright both report the local host:port
 *      and the desktop binds local URLs under "localhost[:port]")
 *   - anything else                    → fall back to the prod identifier
 */
import { ACTIVE_CHAIN } from "./types";

export function hostPlaygroundFallback(suffix: string): string {
  return `host-playground.${suffix}`;
}

export function deriveSelfDotNs(input: {
  hostname: string;
  host: string;
  suffix?: string;
}): string {
  const hostname = input.hostname.toLowerCase();
  const suffix = input.suffix ?? ACTIVE_CHAIN.dotNsSuffix;
  if (
    hostname.endsWith(".app.localhost") ||
    hostname.endsWith(`.app.${suffix}`)
  ) {
    return hostPlaygroundFallback(suffix);
  }
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1"
  ) {
    return input.host.toLowerCase();
  }
  if (hostname.endsWith(`.${suffix}`)) {
    const segments = hostname.split(".");
    return segments.length > 2 ? segments.slice(-2).join(".") : hostname;
  }
  const segments = hostname.split(".");
  if (segments.length >= 3) {
    let label = segments.slice(0, -2);
    // drop the `app` infra subdomain preview hosts insert (<name>.app.<root> → <name>)
    if (label[label.length - 1] === "app") label = label.slice(0, -1);
    if (label.length > 0) return `${label.join(".")}.${suffix}`;
  }
  return hostPlaygroundFallback(suffix);
}

export function getSelfDotNs(): string {
  const suffix = ACTIVE_CHAIN.dotNsSuffix;
  if (typeof window === "undefined") return hostPlaygroundFallback(suffix);
  return deriveSelfDotNs({
    hostname: window.location.hostname,
    host: window.location.host,
  });
}
