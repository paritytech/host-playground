"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import type { TestCategory, TestDefinition } from "@/src/lib/types";
import { TestButton } from "./test-button";

interface TestCategoryProps {
  title: string;
  description: string;
  category: TestCategory;
  tests: TestDefinition[];
  runningTest: string | null;
  onRunTest: (test: TestDefinition) => void;
}

const categoryIcons: Record<TestCategory, string> = {
  extension: "🔌",
  accounts: "👤",
  signing: "✍️",
  storage: "💾",
  permissions: "🔐",
  chat: "💬",
};

export function TestCategoryCard({
  title,
  description,
  category,
  tests,
  runningTest,
  onRunTest,
}: TestCategoryProps) {
  return (
    <Card>
      <CardHeader className="pb-5">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <span className="text-xl">{categoryIcons[category]}</span>
          {title}
        </CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {tests.map((test) => (
            <TestButton
              key={test.id}
              test={test}
              isRunning={runningTest === test.id}
              disabled={runningTest !== null && runningTest !== test.id}
              onRun={() => onRunTest(test)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
