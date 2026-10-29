"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Crown, Scroll } from "lucide-react";
import { LogEntry } from "@/types/guild";
import { AGENT_SPECS } from "@/constants/agents";

interface ExecutionTerminalProps {
  logs: LogEntry[];
  isRunning: boolean;
  clockTime: string;
  logsContainerRef: React.RefObject<HTMLDivElement | null>;
}

export const ExecutionTerminal: React.FC<ExecutionTerminalProps> = ({
  logs,
  isRunning,
  clockTime,
  logsContainerRef,
}) => {
  return (
    <div className="lg:col-span-5 bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[565px]">
      {/* Terminal Header */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-zinc-200">
            Swarm Execution Timeline
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">{clockTime}</span>
      </div>

      {/* Logs Timeline Body with Spring Animation */}
      <div
        ref={logsContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs"
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <motion.div
              key="empty-logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center text-zinc-500 space-y-2 py-12"
            >
              <Crown className="w-8 h-8 text-zinc-700 animate-pulse" />
              <p className="text-xs">The Mikado LangGraph is in standby.</p>
              <p className="text-[11px] text-zinc-600">
                Click &quot;⚔️ Invoke Guild&quot; above to initiate autonomous execution.
              </p>
            </motion.div>
          ) : (
            logs.map((log) => {
              const spec = AGENT_SPECS.find((a) => a.id === log.agent);
              const Icon = spec ? spec.icon : Scroll;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className={`p-3 rounded-xl border transition-all ${
                    log.status === "error"
                      ? "bg-red-950/30 border-red-500/50 text-red-200"
                      : log.status === "warning"
                      ? "bg-amber-950/30 border-amber-500/50 text-amber-200"
                      : log.status === "success"
                      ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                      : "bg-zinc-900/60 border-zinc-800/80 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          spec?.accentColor || "text-zinc-400"
                        }`}
                      />
                      <span
                        className={`font-bold text-[11px] tracking-wide ${
                          spec?.accentColor || "text-zinc-200"
                        }`}
                      >
                        [{log.agent}]
                      </span>
                      <span className="font-semibold text-zinc-200 text-xs">
                        {log.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-300 font-sans">
                    {log.detail}
                  </p>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Terminal Footer Indicator */}
      <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isRunning ? "bg-amber-400 animate-ping" : "bg-emerald-400"
            }`}
          />
          <span>{isRunning ? "Graph Active" : "Graph Ready"}</span>
        </span>
        <span>{logs.length} Telemetry Events</span>
      </div>
    </div>
  );
};

