"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import { CodeTab } from "@/types/guild";

interface CodeWorkspaceProps {
  activeCodeTab: CodeTab;
  onChangeTab: (tab: CodeTab) => void;
  brokenCodeInput: string;
  currentFixedCode: string;
  healedPatch: string;
  initialPatch: string;
  targetFilename: string;
  isSelfHealed: boolean;
  isHalted: boolean;
  isRunning: boolean;
  currentIteration: number;
  copiedCode: boolean;
  onCopyCode: () => void;
  onDownloadPatchedFile: () => void;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  activeCodeTab,
  onChangeTab,
  brokenCodeInput,
  currentFixedCode,
  healedPatch,
  initialPatch,
  targetFilename,
  isSelfHealed,
  isHalted,
  isRunning,
  currentIteration,
  copiedCode,
  onCopyCode,
  onDownloadPatchedFile,
}) => {
  const codeToShow = currentFixedCode || (isSelfHealed ? healedPatch : initialPatch);

  const renderCodeViewer = () => {
    if (activeCodeTab === "broken") {
      return (
        <motion.pre
          key="broken-view"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xs sm:text-sm leading-relaxed text-zinc-300 p-4 overflow-x-auto whitespace-pre"
        >
          {brokenCodeInput}
        </motion.pre>
      );
    }

    if (activeCodeTab === "healed") {
      return (
        <motion.pre
          key="healed-view"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="font-mono text-xs sm:text-sm leading-relaxed text-emerald-300 p-4 overflow-x-auto whitespace-pre"
        >
          {codeToShow}
        </motion.pre>
      );
    }

    // Default: Unified Diff View with Staggered Cascading Animation
    const brokenLines = brokenCodeInput.split("\n");
    const fixedLines = codeToShow.split("\n");

    return (
      <motion.div
        key={`diff-view-${isSelfHealed ? "healed" : isHalted ? "halted" : "init"}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="font-mono text-xs sm:text-sm divide-y divide-zinc-900 overflow-x-auto"
      >
        <div className="bg-zinc-950/80 px-4 py-2 text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center justify-between border-b border-zinc-800">
          <span>@@ Unified Swarm Diff: {targetFilename} @@</span>
          <span className="text-zinc-400">
            {isSelfHealed
              ? "Iteration #2 (Self-Healed Pass)"
              : isHalted
              ? "Iteration #1 (Halted on Failure)"
              : isRunning
              ? `Iteration #${currentIteration} in progress`
              : "Ready"}
          </span>
        </div>

        {/* Red Buggy / Replaced Section (Staggered Animation) */}
        {brokenLines.map((line, idx) => (
          <motion.div
            key={`broken-${idx}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(idx * 0.025, 0.35), duration: 0.2 }}
            className="flex items-start bg-red-950/20 hover:bg-red-950/30 text-red-300 px-4 py-1 transition-colors"
          >
            <span className="w-8 text-red-500/70 select-none text-right pr-4 text-xs font-mono">
              {idx + 1}
            </span>
            <span className="w-5 text-red-500 font-bold select-none">-</span>
            <span className="flex-1 whitespace-pre">{line}</span>
          </motion.div>
        ))}

        {/* Green Guarded / Healed Section (Staggered Animation) */}
        {fixedLines.map((line, idx) => (
          <motion.div
            key={`fixed-${idx}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(0.1 + idx * 0.025, 0.45), duration: 0.2 }}
            className="flex items-start bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-300 px-4 py-1 transition-colors"
          >
            <span className="w-8 text-emerald-500/70 select-none text-right pr-4 text-xs font-mono">
              {idx + 1}
            </span>
            <span className="w-5 text-emerald-400 font-bold select-none">+</span>
            <span className="flex-1 whitespace-pre">{line}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800/90 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
      {/* Header with Tabs & Actions */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        {/* Tab Selector */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => onChangeTab("diff")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCodeTab === "diff"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Sovereign Diff
          </button>
          <button
            type="button"
            onClick={() => onChangeTab("healed")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCodeTab === "healed"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Patched Code
          </button>
          <button
            type="button"
            onClick={() => onChangeTab("broken")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              activeCodeTab === "broken"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Broken Source
          </button>
        </div>

        {/* Action Buttons: Copy & Download Patched File */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCopyCode}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
            title="Copy Code"
          >
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedCode ? "Copied" : "Copy"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={onDownloadPatchedFile}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-semibold shadow-md shadow-red-950 transition-colors"
            title="Download Patched File to Computer"
          >
            <Download className="w-3.5 h-3.5 text-amber-200" />
            <span>💾 Download Patched File</span>
          </motion.button>
        </div>
      </div>

      {/* Code Content with AnimatePresence */}
      <div className="max-h-[500px] overflow-y-auto bg-[#0a0a0f]">
        <AnimatePresence mode="wait">{renderCodeViewer()}</AnimatePresence>
      </div>

      {/* Diff Legend Footer */}
      <div className="px-4 py-2 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500/40 border border-red-500 rounded" />
            <span>Buggy Code Removed</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500/40 border border-emerald-500 rounded" />
            <span>Guarded Defensive Patch</span>
          </span>
        </div>
        <span className="font-mono text-zinc-500">{targetFilename}</span>
      </div>
    </div>
  );
};

