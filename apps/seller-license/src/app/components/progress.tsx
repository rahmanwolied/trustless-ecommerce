"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@/lib/atoms/progress-atom";

import { Loader, X, Check } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StepStatus =
  | "current"
  | "upcoming"
  | "complete"
  | "failed"
  | ""
  | undefined;

type Step = {
  name: string;
  description: string;
  status: StepStatus;
};

const stepsDetails: Step[] = [
  {
    name: "Connect your wallet",
    description: "Connect your wallet to the platform",
    status: "current",
  },
  {
    name: "Verify your identity",
    description: "Verify your identity to the platform",
    status: "upcoming",
  },
  {
    name: "Fill in the details",
    description: "Fill in the details for your business",
    status: "upcoming",
  },
  {
    name: "Sending your Credential",
    description: "Sending your Credential to your wallet",
    status: "upcoming",
  },
];

export const Progress = () => {
  const [progress] = useProgress();
  const [steps, setSteps] = useState<Step[]>(stepsDetails);

  useEffect(() => {
    if (!progress) return;

    const updatedSteps = stepsDetails.map((step, idx) => ({
      ...step,
      status: progress[idx],
    }));
    setSteps(updatedSteps as Step[]);
  }, [progress]);

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          Please be patient while it&apos;s being processed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label="Progress">
          <ol role="list" className="overflow-hidden">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={cn(
                  stepIdx !== steps.length - 1 ? "pb-10" : "",
                  "relative"
                )}
              >
                {step.status === "complete" ? (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-green-500/30"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="group relative flex items-start">
                      <span className="flex h-9 items-center">
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 transition-colors">
                          <Check
                            className="size-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-green-700">
                          {step.name}
                        </span>
                        <span className="text-sm text-green-800">
                          {step.description}
                        </span>
                      </span>
                    </div>
                  </>
                ) : step.status === "current" ? (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-red-500/30"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div
                      className="group relative flex items-start"
                      aria-current="step"
                    >
                      <span
                        className="flex h-9 items-center"
                        aria-hidden="true"
                      >
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-600 bg-red-500 backdrop-blur-lg">
                          <Loader className="size-4 animate-spin text-white" />
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-red-600">
                          {step.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </div>
                  </>
                ) : step.status === "failed" ? (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-red-500/30"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="group relative flex items-start">
                      <span className="flex h-9 items-center">
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 transition-colors group-hover:bg-red-600">
                          <X className="size-4 text-white" aria-hidden="true" />
                        </span>
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-medium text-red-700">
                          {step.name} (Failed)
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {stepIdx !== steps.length - 1 ? (
                      <div
                        className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-red-500/30"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="group relative flex items-start">
                      <span
                        className="flex h-9 items-center"
                        aria-hidden="true"
                      >
                        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-600 bg-red-500 backdrop-blur-lg transition-colors group-hover:border-white/15" />
                      </span>
                      <span className="ml-4 flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-gray-700">
                          {step.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {step.description}
                        </span>
                      </span>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </CardContent>
    </Card>
  );
};
