import React from "react";

export type AgentId = "MIKADO" | "SHOGUN" | "SAMURAI" | "SENTINEL" | "COUNCIL";

export interface ProviderOption {
  id: "gemini" | "openai" | "groq" | "claude";
  name: string;
  defaultModel: string;
  keyPrefix: string;
  placeholder: string;
  docsUrl: string;
}

export interface Scenario {
  id: string;
  name: string;
  filename: string;
  badge: string;
  decree: string;
  brokenCode: string;
  initialPatch: string;
  healedPatch: string;
  edgeCaseTrace: string;
}

export interface AgentSpec {
  id: AgentId;
  order: string;
  name: string;
  title: string;
  role: string;
  description: string;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
  badgeBg: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface LogEntry {
  id: number;
  agent: AgentId;
  title: string;
  detail: string;
  status: "info" | "error" | "success" | "warning";
  timestamp: string;
}

export type CodeTab = "diff" | "healed" | "broken";

