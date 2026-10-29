"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Check } from "lucide-react";
import { AGENT_SPECS } from "@/constants/agents";

interface AgentPipelineProps {
  isRunning: boolean;
  activeAgentIndex: number;
  isHalted: boolean;
  isSelfHealed: boolean;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({
  isRunning,
  activeAgentIndex,
  isHalted,
  isSelfHealed,
}) => {
  const pipelinePercent = isSelfHealed
    ? 100
    : isHalted
    ? 60
    : activeAgentIndex >= 0
    ? ((activeAgentIndex + 1) / 5) * 100
    : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>The 5-Agent Autonomous Engineering Guild</span>
        </h2>
        <span className="text-[11px] text-zinc-500 font-mono">
          State:{" "}
          {isRunning
            ? `Agent ${activeAgentIndex} Executing`
            : isHalted
            ? "Halted (Circuit Breaker)"
            : isSelfHealed
            ? "Verified (Self-Healed)"
            : "Awaiting Command"}
        </span>
      </div>

      {/* Animated Connecting Energy Bar */}
      <div className="relative w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pipelinePercent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]"
        />
      </div>

      {/* 5 Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {AGENT_SPECS.map((agent, idx) => {
          const isActive = activeAgentIndex === idx && isRunning;
          const isPast = activeAgentIndex > idx || isSelfHealed;
          const isCurrentHalted = isHalted && activeAgentIndex === idx;

          const Icon = agent.icon;

          return (
            <motion.div
              key={agent.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`rounded-2xl border p-4.5 transition-all relative flex flex-col justify-between ${
                isActive
                  ? `${agent.bgGlow} ${agent.borderColor} ring-2 ring-amber-500/60 shadow-xl shadow-amber-950/40`
                  : isCurrentHalted
                  ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/40"
                  : isPast
                  ? "bg-zinc-950/80 border-zinc-800"
                  : "bg-zinc-950/40 border-zinc-900 opacity-70"
              }`}
            >
              {/* Pulsing Active Ring */}
              {isActive && (
                <motion.div
                  layoutId="active-agent-glow"
                  className="absolute inset-0 rounded-2xl border-2 border-amber-400/60 pointer-events-none animate-pulse"
                />
              )}

              <div className="space-y-2.5">
                {/* Header badge & icon */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${agent.badgeBg}`}>
                    {agent.order}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isActive ? "bg-amber-400/20 text-amber-300 animate-pulse" : agent.accentColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Agent Name & Title */}
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">{agent.name}</h3>
                  <p className={`text-[11px] font-medium ${agent.accentColor}`}>{agent.title}</p>
                </div>

                {/* Agent Description */}
                <p className="text-[11px] text-zinc-400 leading-snug line-clamp-3">
                  {agent.description}
                </p>
              </div>

              {/* Dynamic Status Indicator */}
              <div className="pt-3 border-t border-zinc-800/60 mt-3 flex items-center justify-between text-[10px]">
                <span className="text-zinc-500">Status:</span>
                {isActive ? (
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    ACTIVE
                  </span>
                ) : isCurrentHalted ? (
                  <span className="font-bold text-red-400">HALTED</span>
                ) : isPast ? (
                  <span className="font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> DONE
                  </span>
                ) : (
                  <span className="text-zinc-600">STANDBY</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

