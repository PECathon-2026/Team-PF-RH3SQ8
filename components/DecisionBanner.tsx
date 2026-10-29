"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface DecisionBannerProps {
  isHalted: boolean;
  haltReason: string;
  isSelfHealed: boolean;
  onIncreaseBudget: (budget: number) => void;
}

export const DecisionBanner: React.FC<DecisionBannerProps> = ({
  isHalted,
  haltReason,
  isSelfHealed,
  onIncreaseBudget,
}) => {
  return (
    <AnimatePresence>
      {isHalted && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-red-950/40 border-2 border-red-500/80 rounded-2xl p-5 shadow-2xl shadow-red-950/60"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-red-300 flex items-center gap-2">
                👑 The Mikado Supreme Circuit Breaker Halted Execution
              </h3>
              <p className="text-xs text-red-200/90 leading-relaxed">{haltReason}</p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => onIncreaseBudget(3)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors shadow-md shadow-red-950"
                >
                  Increase Max Iterations to 3
                </motion.button>
                <span className="text-[11px] text-zinc-400">
                  Sovereign human gate & git merge remain strictly LOCKED to protect production repository.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {isSelfHealed && !isHalted && (
        <motion.div
          initial={{ opacity: 0, y: -15, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-emerald-950/30 border border-emerald-500/50 rounded-2xl p-4 shadow-xl shadow-emerald-950/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-emerald-300 uppercase tracking-wider">
                👑 Mikado Autonomous Routing Succeeded (Iteration #2):
              </span>{" "}
              <span className="text-zinc-300">
                Sentinel test failure caught, re-dispatched to Samurai, and 100% of unit tests verified green!
                Shadow Council has approved human sign-off.
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

