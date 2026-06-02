import { describe, expect, test } from "vitest";
import { deriveSelfDotNs, HOST_PLAYGROUND_FALLBACK } from "./dotns";

const derive = (hostname: string, host = hostname) =>
  deriveSelfDotNs({ hostname, host });

describe("deriveSelfDotNs", () => {
  describe(".dot hostnames", () => {
    test("registrable root returns as-is", () => {
      expect(derive("host-playground.dot")).toBe("host-playground.dot");
      expect(derive("some-other-app.dot")).toBe("some-other-app.dot");
    });

    test("app.<name>.dot collapses to <name>.dot (bulletin-deploy executable subdomain)", () => {
      expect(derive("app.host-playground.dot")).toBe("host-playground.dot");
      expect(derive("app.some-other-app.dot")).toBe("some-other-app.dot");
    });

    test("any subdomain on a .dot root collapses to the registrable root", () => {
      expect(derive("widget.host-playground.dot")).toBe("host-playground.dot");
      expect(derive("a.b.host-playground.dot")).toBe("host-playground.dot");
    });

    test("hostname is normalized to lowercase", () => {
      expect(derive("APP.Host-Playground.DOT")).toBe("host-playground.dot");
    });
  });

  describe("preview deployments (<cid>.app.dot / <cid>.app.localhost)", () => {
    test("<cid>.app.dot falls back to host-playground.dot", () => {
      expect(derive("bafyabc123.app.dot")).toBe(HOST_PLAYGROUND_FALLBACK);
    });

    test("<cid>.app.localhost falls back to host-playground.dot", () => {
      expect(derive("bafyabc123.app.localhost")).toBe(
        HOST_PLAYGROUND_FALLBACK,
      );
    });

    test("preview check wins over the .dot rule", () => {
      // Without the preview short-circuit, this would collapse to "app.dot".
      expect(derive("bafy.app.dot")).not.toBe("app.dot");
      expect(derive("bafy.app.dot")).toBe(HOST_PLAYGROUND_FALLBACK);
    });
  });

  describe("local development", () => {
    test("bare localhost returns host (with port)", () => {
      expect(derive("localhost", "localhost:3000")).toBe("localhost:3000");
      expect(derive("localhost", "localhost")).toBe("localhost");
    });

    test("127.0.0.1 returns host", () => {
      expect(derive("127.0.0.1", "127.0.0.1:3000")).toBe("127.0.0.1:3000");
    });

    test("<name>.localhost returns host", () => {
      expect(derive("host-playground.localhost", "host-playground.localhost:3000")).toBe(
        "host-playground.localhost:3000",
      );
    });

    test("host is lowercased", () => {
      expect(derive("Localhost", "Localhost:3000")).toBe("localhost:3000");
    });
  });

  describe("shell deployments (.dot.li, .paseo.li, .paseoli.dev, etc.)", () => {
    test("<name>.<root>.<tld> takes the label and appends .dot", () => {
      expect(derive("host-playground.dot.li")).toBe("host-playground.dot");
      expect(derive("host-playground.paseo.li")).toBe("host-playground.dot");
      expect(derive("host-playground.paseoli.dev")).toBe(
        "host-playground.dot",
      );
    });

    test("multi-segment labels are preserved", () => {
      expect(derive("a.b.host-playground.paseo.li")).toBe(
        "a.b.host-playground.dot",
      );
    });

    test("<sub>.app.<root>.<tld> strips the `app` infra subdomain", () => {
      // <sub>.app.<root> shape preview hosts insert — collapse to <sub>.dot
      expect(derive("host-playground.app.paseo.li")).toBe(
        "host-playground.dot",
      );
      expect(derive("foo.app.dot.li")).toBe("foo.dot");
    });
  });

  describe("fallback", () => {
    test("2-segment non-.dot hostnames fall back", () => {
      expect(derive("example.com")).toBe(HOST_PLAYGROUND_FALLBACK);
    });

    test("single-segment non-.dot hostnames fall back", () => {
      expect(derive("intranet")).toBe(HOST_PLAYGROUND_FALLBACK);
    });

    test("hostname that strips to nothing (just app.<tld>) falls back", () => {
      // If the only label is `app`, stripping leaves nothing → fallback.
      // (Not a real shape but ensures the safety check works.)
      expect(derive("app.something.com")).toBe(HOST_PLAYGROUND_FALLBACK);
    });
  });
});
