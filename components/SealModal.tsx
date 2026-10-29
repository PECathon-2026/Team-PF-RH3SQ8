"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Download, Copy, Check, X } from "lucide-react";

interface SealModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetFilename: string;
  commitHash: string;
  copiedHash: boolean;
  copiedPullCmd: boolean;
  onCopyHash: () => void;
  onCopyPullCmd: () => void;
  onDownloadArtifact: () => void;
}

export const SealModal: React.FC<SealModalProps> = ({
  isOpen,
  onClose,
  targetFilename,
  commitHash,
  copiedHash,
  copiedPullCmd,
  onCopyHash,
  onCopyPullCmd,
  onDownloadArtifact,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop Blur & Darkness */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Floating Golden Sparks / Cyber Sakura Particles */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(24)].map((_, i) => (
              <motion.div
                key={`spark-${i}`}
                initial={{
                  x: `${(i * 4.2) % 100}vw`,
                  y: -40,
                  opacity: 0,
                  scale: 0.5 + ((i % 5) * 0.15),
                  rotate: 0,
                }}
                animate={{
                  y: "105vh",
                  opacity: [0, 0.9, 0.7, 0],
                  rotate: 360 * (i % 2 === 0 ? 1 : -1),
                  x: `calc(${(i * 4.2) % 100}vw + ${i % 3 === 0 ? 40 : -40}px)`,
                }}
                transition={{
                  duration: 4.5 + ((i % 4) * 0.8),
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "linear",
                }}
                className={`absolute w-3 h-3 rounded-full ${
                  i % 3 === 0
                    ? "bg-amber-400 shadow-[0_0_10px_#f59e0b]"
                    : i % 3 === 1
                    ? "bg-red-500 shadow-[0_0_10px_#ef4444]"
                    : "bg-emerald-400 shadow-[0_0_10px_#10b981]"
                }`}
                style={{
                  clipPath:
                    i % 2 === 0
                      ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                      : "circle(50% at 50% 50%)",
                }}
              />
            ))}
          </div>

          {/* Modal Card / Sovereign Proclamation Scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative z-20 w-full max-w-2xl bg-gradient-to-b from-[#111118] via-[#09090f] to-[#040406] border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(220,38,38,0.45)] text-center overflow-hidden my-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-700/60"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gold / Crimson Watermark Borders */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

            {/* Center Stamp Animation: Hanko Sovereign Seal */}
            <div className="flex flex-col items-center justify-center my-4 relative">
              {/* Concentric Expanding Shockwaves */}
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: [0.2, 2.2], opacity: [0.9, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-36 h-36 rounded-full border-2 border-amber-500/60 pointer-events-none"
              />
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: [0.2, 2.8], opacity: [0.7, 0] }}
                transition={{ duration: 2.0, delay: 0.3, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-36 h-36 rounded-full border-2 border-red-500/50 pointer-events-none"
              />

              {/* THE SOVEREIGN HANKO STAMP (Imperial Seal) */}
              <motion.div
                initial={{ scale: 2.8, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 16, delay: 0.15 }}
                className="relative cursor-pointer group"
              >
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-950 p-2 border-4 border-amber-400 shadow-[0_0_40px_rgba(239,68,68,0.7)] flex flex-col items-center justify-center text-center transform transition-transform group-hover:scale-105">
                  <div className="w-full h-full border border-amber-400/80 rounded-xl flex flex-col items-center justify-center p-1 bg-red-950/40">
                    <span className="text-amber-200 text-[10px] font-bold tracking-widest uppercase">
                      御 璽
                    </span>
                    <Crown className="w-6 h-6 text-amber-300 my-0.5" />
                    <span className="text-amber-200 text-[9px] font-bold tracking-widest uppercase">
                      勅 許
                    </span>
                  </div>
                </div>
                <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 text-[9px] font-extrabold uppercase tracking-wider shadow">
                  SEALED
                </span>
              </motion.div>
            </div>

            {/* Grand Proclamation Title */}
            <div className="space-y-1.5 mt-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono tracking-widest uppercase inline-block">
                勅命奉行 • 大願成就
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-400">
                The Sovereign Seal Has Been Applied
              </h2>
              <p className="text-xs text-zinc-300 max-w-lg mx-auto leading-relaxed">
                The Imperial Engineering Guild has officially verified, fortified, and merged the healed branch into{" "}
                <span className="text-amber-400 font-mono font-semibold">
                  origin/sovereign-main
                </span>
                .
              </p>
            </div>

            {/* Telemetry Summary Parchment Card */}
            <div className="bg-zinc-950/90 border border-amber-500/30 rounded-2xl p-4 my-5 text-left grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  Target Repository File
                </span>
                <span className="text-amber-300 font-bold text-xs">{targetFilename}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  Sovereign Commit SHA
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold text-xs">{commitHash}</span>
                  <button
                    type="button"
                    onClick={onCopyHash}
                    className="text-zinc-400 hover:text-amber-300 transition-colors p-1"
                    title="Copy Commit Hash"
                  >
                    {copiedHash ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  Sentinel Pytest Score
                </span>
                <span className="text-emerald-400 font-bold text-xs">
                  14 / 14 Unit Tests Passed (100%)
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 block uppercase">
                  Shadow Council Audit
                </span>
                <span className="text-purple-300 font-bold text-xs">
                  CLEARED (0 Secrets Exposed)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onDownloadArtifact}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-700 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/80 flex items-center gap-2 border border-amber-400/40"
              >
                <Download className="w-4 h-4 text-amber-200" />
                <span>💾 Download Signed Artifact</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onCopyPullCmd}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2"
              >
                {copiedPullCmd ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-amber-400" />
                )}
                <span>{copiedPullCmd ? "Pull Command Copied!" : "Copy Git Pull Command"}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-medium"
              >
                Return to Sanctuary
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

