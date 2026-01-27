"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { testsByCategory } from "@/src/app/tests";
import {
  CHAINS,
  type ChainConfig,
  type ChainId,
  type TestDefinition,
} from "@/src/app/types";

type TestStatus = "idle" | "running" | "success" | "error";

interface TestState {
  status: TestStatus;
  message: string;
  logs: string[];
}

export default function SimplePage() {
  const searchParams = useSearchParams();
  const testId = searchParams.get("test");
  const chainId = (searchParams.get("chain") as ChainId) || "PASSET_HUB";

  const [state, setState] = useState<TestState>({
    status: "idle",
    message: "",
    logs: [],
  });

  // Find the test definition
  const allTests = Object.values(testsByCategory).flat();
  const test = allTests.find((t) => t.id === testId);
  const chain: ChainConfig = CHAINS[chainId] || CHAINS.PASSET_HUB;

  const runTest = useCallback(async () => {
    if (!test) return;

    setState({ status: "running", message: "Running...", logs: [] });

    const logger = (message: string) => {
      setState((prev) => ({
        ...prev,
        message,
        logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
      }));
    };

    try {
      const result = await test.run(chain, logger);
      setState((prev) => ({
        ...prev,
        status: result.success ? "success" : "error",
        message: result.message,
        logs: [
          ...prev.logs,
          `[${new Date().toLocaleTimeString()}] ${result.success ? "✅" : "❌"} ${result.message}`,
        ],
      }));
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setState((prev) => ({
        ...prev,
        status: "error",
        message,
        logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ❌ ${message}`],
      }));
    }
  }, [test, chain]);

  // Auto-run if test param is provided
  useEffect(() => {
    if (test && state.status === "idle") {
      runTest();
    }
  }, [test, state.status, runTest]);

  if (!testId) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <h1 className="text-2xl mb-4">Simple Test Runner</h1>
        <p className="text-gray-400 mb-4">
          Usage: <code className="bg-gray-800 px-2 py-1 rounded">?test=TEST_ID&chain=CHAIN_ID</code>
        </p>
        <div className="mt-8">
          <h2 className="text-lg mb-2">Available Tests:</h2>
          <ul className="space-y-1">
            {allTests.map((t) => (
              <li key={t.id}>
                <a
                  href={`?test=${t.id}&chain=${chainId}`}
                  className="text-blue-400 hover:underline"
                >
                  {t.id}
                </a>
                <span className="text-gray-500 ml-2">- {t.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="text-lg mb-2">Available Chains:</h2>
          <ul className="space-y-1">
            {Object.keys(CHAINS).map((id) => (
              <li key={id} className="text-gray-400">
                {id}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-black text-white p-8 font-mono">
        <h1 className="text-2xl text-red-500">Test not found: {testId}</h1>
        <a href="/simple" className="text-blue-400 hover:underline mt-4 block">
          ← Back to test list
        </a>
      </div>
    );
  }

  const statusColor = {
    idle: "text-gray-400",
    running: "text-yellow-400",
    success: "text-green-400",
    error: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="mb-4">
        <a href="/simple" className="text-blue-400 hover:underline text-sm">
          ← Back
        </a>
      </div>

      <h1 className="text-2xl mb-2">{test.name}</h1>
      <p className="text-gray-400 mb-4">{test.description}</p>
      <p className="text-gray-500 text-sm mb-8">
        Chain: {chain.name} ({chain.network})
      </p>

      <div className="mb-4">
        <span className={`font-bold ${statusColor[state.status]}`}>
          {state.status.toUpperCase()}
        </span>
        {state.status === "running" && (
          <span className="ml-2 animate-pulse">●</span>
        )}
      </div>

      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="text-sm whitespace-pre-wrap break-all">
          {state.message || "Waiting..."}
        </div>
      </div>

      {state.logs.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4">
          <h2 className="text-sm text-gray-500 mb-2">Logs:</h2>
          <div className="text-xs space-y-1">
            {state.logs.map((log, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {state.status !== "running" && (
        <button
          onClick={runTest}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
        >
          Run Again
        </button>
      )}
    </div>
  );
}
