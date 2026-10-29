"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, Key, Eye, EyeOff, ChevronDown } from "lucide-react";
import { PROVIDERS } from "@/constants/providers";

interface HeaderProps {
  selectedProvider: "gemini" | "openai" | "groq" | "claude";
  onSelectProvider: (provider: "gemini" | "openai" | "groq" | "claude") => void;
  apiKeyInput: string;
  onChangeApiKey: (key: string) => void;
  showApiKey: boolean;
  onToggleShowApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedProvider,
  onSelectProvider,
  apiKeyInput,
  onChangeApiKey,
  showApiKey,
  onToggleShowApiKey,
}) => {
  const currentProvider = PROVIDERS.find((p) => p.id === selectedProvider);

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 relative z-10">
        {/* Logo & Imperial Title */}
        <div className="flex items-center gap-3.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 via-amber-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-950/50 border border-amber-500/40">
              <Crown className="w-5 h-5 text-amber-200" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060609] animate-pulse" />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wider uppercase text-white flex items-center gap-2">
                DevPilot <span className="text-amber-400 font-normal">|</span> The Mystic Mikado
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-red-950/80 border border-red-500/30 text-red-300">
                5-Agent Swarm
              </span>
            </div>
            <p className="text-xs text-zinc-400">Autonomous AI Engineering Guild & Self-Healing Swarm</p>
          </div>
        </div>

        {/* Multi-Provider API Bar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 rounded-lg p-1.5 shadow-md">
          {/* Provider Dropdown */}
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => onSelectProvider(e.target.value as any)}
              className="bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded px-2.5 py-1.5 pr-7 appearance-none focus:outline-none focus:border-amber-500/60 transition-colors cursor-pointer"
            >
              {PROVIDERS.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* API Key Input Box */}
          <div className="relative flex items-center">
            <div className="absolute left-2.5 pointer-events-none text-zinc-500">
              <Key className="w-3.5 h-3.5" />
            </div>
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKeyInput}
              onChange={(e) => onChangeApiKey(e.target.value)}
              placeholder={currentProvider?.placeholder || "Paste API Key..."}
              className="bg-zinc-950 text-xs text-zinc-200 border border-zinc-800 rounded pl-8 pr-8 py-1.5 w-44 sm:w-60 focus:outline-none focus:border-amber-500/60 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={onToggleShowApiKey}
              className="absolute right-2 text-zinc-500 hover:text-zinc-300 transition-colors"
              title={showApiKey ? "Hide API Key" : "Show API Key"}
            >
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </motion.button>
          </div>

          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border bg-zinc-950/60">
            {apiKeyInput.trim() ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-semibold">Live AI Ready</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-zinc-400">Sanctuary Mode (Reliable)</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

