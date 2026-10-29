"use client";

import React from "react";
import { motion } from "framer-motion";
import { Flame, Lock, Unlock, GitCommitHorizontal, Crown } from "lucide-react";

interface SovereignGateProps {
  isHalted: boolean;
  isMerged: boolean;
  isSelfHealed: boolean;
  isRunning: boolean;
  commitHash: string;
  onAuthorizeAndMerge: () => void;
  onOpenSealModal: () => void;
}

export const SovereignGate: React.FC<SovereignGateProps> = ({
  isHalted,
  isMerged,
  isSelfHealed,
  isRunning,
  commitHash,
  onAuthorizeAndMerge,
  onOpenSealModal,
}) => {
  return (
    <section className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs uppercase font-bold tracking-wider text-purple-300">
              Shadow Council Sovereign Approval Gate
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Human-in-the-Loop governance protocol. Unlocks once the 5-agent pipeline has passed all unit tests and security scans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {isHalted ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs font-semibold">
              <Lock className="w-4 h-4 text-red-400" />
              <span>Branch Locked: Sentinel tests failed under 1-iteration budget</span>
            </div>
          ) : isMerged ? (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onOpenSealModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/60 border border-amber-400/50"
              >
                <Crown className="w-4 h-4 text-amber-200" />
                <span>📜 View Imperial Proclamation</span>
              </motion.button>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs font-mono font-semibold">
                <GitCommitHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Merged ({commitHash})</span>
              </div>
            </div>
          ) : (
            <motion.button
              whileHover={isSelfHealed && !isRunning ? { scale: 1.03 } : {}}
              whileTap={isSelfHealed && !isRunning ? { scale: 0.97 } : {}}
              type="button"
              disabled={!isSelfHealed || isRunning}
              onClick={onAuthorizeAndMerge}
              className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2.5 shadow-xl ${
                isSelfHealed && !isRunning
                  ? "bg-gradient-to-r from-purple-600 via-amber-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white border border-amber-500/50 shadow-red-950/80 cursor-pointer animate-pulse"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
              }`}
            >
              {isSelfHealed ? (
                <Unlock className="w-4 h-4 text-amber-200" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>⚡ Authorize & Merge Sovereign Branch</span>
            </motion.button>
          )}
        </div>
      </div>
    </section>
  );
};

