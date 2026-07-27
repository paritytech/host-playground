"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/card";
import type { LucideIcon } from "lucide-react";
import type { TestDefinition } from "@/src/lib/types";
import { TestButton } from "./test-button";

interface TestCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tests: TestDefinition[];
  runningTest: string | null;
  onRunTest: (test: TestDefinition, args?: Record<string, string>) => void;
}

export function TestCategoryCard({
  title,
  description,
  icon: Icon,
  tests,
  runningTest,
  onRunTest,
}: TestCategoryProps) {
  return (
    <Card>
      <CardHeader className="pb-5">
        <CardTitle className="text-lg font-semibold flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
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
              onRun={(args) => onRunTest(test, args)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
