"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sliders,
  Upload,
  FileCode2,
  FileText,
  Play,
  RefreshCw,
} from "lucide-react";
import { Scenario } from "@/types/guild";
import { PRESET_SCENARIOS } from "@/constants/presets";

interface CommandBarProps {
  maxIterations: number;
  onSetMaxIterations: (count: number) => void;
  selectedScenario: Scenario;
  targetFilename: string;
  onSelectScenario: (scenario: Scenario) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeFilename: (filename: string) => void;
  activeTestRunner: string;
  decreeInput: string;
  onChangeDecree: (decree: string) => void;
  brokenCodeInput: string;
  onChangeBrokenCode: (code: string) => void;
  isBrokenCodeOpen: boolean;
  onToggleBrokenCode: () => void;
  isRunning: boolean;
  activeAgentName: string;
  onInvokeGuild: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  maxIterations,
  onSetMaxIterations,
  selectedScenario,
  targetFilename,
  onSelectScenario,
  onFileUpload,
  onChangeFilename,
  activeTestRunner,
  decreeInput,
  onChangeDecree,
  brokenCodeInput,
  onChangeBrokenCode,
  isBrokenCodeOpen,
  onToggleBrokenCode,
  isRunning,
  activeAgentName,
  onInvokeGuild,
  fileInputRef,
}) => {
  return (
    <section className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        {/* Max Iterations Budget Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-300">
              Max Iterations Budget:
            </span>
          </div>
          <div className="inline-flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            {[1, 2, 3, 5].map((count) => (
              <motion.button
                key={count}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => onSetMaxIterations(count)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  maxIterations === count
                    ? "bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-md shadow-red-950"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                {count} {count === 1 ? "(Halt Test)" : count === 3 ? "(Default)" : ""}
              </motion.button>
            ))}
          </div>
          <span className="text-[11px] text-zinc-500 italic hidden lg:inline">
            {maxIterations === 1
              ? "⚠️ Set to 1: The Mikado halts upon Iteration #1 Sentinel failure."
              : "⚡ Set to ≥ 2: The Mikado triggers autonomous self-healing on Iteration #2."}
          </span>
        </div>

        {/* Local File Upload Button */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={onFileUpload}
            className="hidden"
            accept=".py,.js,.jsx,.ts,.tsx,.cpp,.c,.cc,.java,.sql,.go,.rs,.json,.txt"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span>📂 Upload Local File</span>
          </motion.button>
        </div>
      </div>

      {/* Preset Decrees Selection */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
          Select Preset Imperial Scenario or Customize Prompt:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESET_SCENARIOS.map((scenario) => {
            const isSelected = selectedScenario.id === scenario.id && targetFilename === scenario.filename;
            return (
              <motion.button
                key={scenario.id}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSelectScenario(scenario)}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/40 ring-1 ring-red-500/40"
                    : "bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-zinc-200">{scenario.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                    {scenario.filename}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400 line-clamp-1">{scenario.badge}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Target File & Detected Test Runner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
            <span>Target Repository File:</span>
            <span className="text-[11px] text-amber-400 font-mono">
              Active Sandbox Runner: {activeTestRunner}
            </span>
          </label>
          <div className="relative">
            <FileCode2 className="w-4 h-4 text-zinc-500 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={targetFilename}
              onChange={(e) => onChangeFilename(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-amber-500/60"
              placeholder="e.g. auth_service.py, order_processor.ts, main.cpp"
            />
          </div>
        </div>

        {/* Invoke Guild CTA Button */}
        <div className="flex flex-col justify-end">
          <motion.button
            whileHover={isRunning ? {} : { scale: 1.02 }}
            whileTap={isRunning ? {} : { scale: 0.98 }}
            type="button"
            disabled={isRunning}
            onClick={onInvokeGuild}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${
              isRunning
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-gradient-to-r from-red-600 via-amber-600 to-red-700 hover:from-red-500 hover:to-amber-500 text-white border border-amber-500/40 shadow-red-950/80 cursor-pointer"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Executing Swarm ({activeAgentName})...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>⚔️ Invoke Guild (Execute Swarm)</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Imperial Decree Prompt */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
          <span>Imperial Decree (Instruction Prompt):</span>
          <span className="text-[11px] text-zinc-500">Judges can customize any engineering prompt</span>
        </label>
        <textarea
          rows={2}
          value={decreeInput}
          onChange={(e) => onChangeDecree(e.target.value)}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/60 leading-relaxed font-sans"
          placeholder="State the engineering decree or bug to patch..."
        />
      </div>

      {/* Collapsible Broken Source Code Editor */}
      <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950">
        <button
          type="button"
          onClick={onToggleBrokenCode}
          className="w-full px-4 py-2.5 bg-zinc-900/60 hover:bg-zinc-900 flex items-center justify-between text-xs font-semibold text-zinc-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-red-400" />
            <span>Broken Source Code Editor (Input for {targetFilename})</span>
          </div>
          <span className="text-[11px] text-zinc-500">
            {isBrokenCodeOpen ? "▲ Hide Editor" : "▼ Expand Editor & Paste Custom Code"}
          </span>
        </button>
        <AnimatePresence>
          {isBrokenCodeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-3 border-t border-zinc-800/80"
            >
              <textarea
                rows={5}
                value={brokenCodeInput}
                onChange={(e) => onChangeBrokenCode(e.target.value)}
                className="w-full bg-zinc-950 font-mono text-xs text-zinc-300 p-2.5 rounded border border-zinc-800/80 focus:outline-none focus:border-amber-500/60 leading-relaxed resize-y"
                placeholder="Paste buggy code snippet here..."
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

