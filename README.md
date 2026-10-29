# DevPilot: The Mystic Mikado's Autonomous AI Engineering Guild ⛩️👑

> **An Autonomous, Multi-Agent Self-Healing Engineering Swarm powered by LangGraph, Next.js 16 (App Router), Tailwind CSS, and Framer Motion.**

---

## 🌟 Executive Overview

**DevPilot: The Mystic Mikado** is a production-grade autonomous developer command sanctuary designed to take broken source code, formulate strategic repair plans, synthesize sandboxed AST code patches, run sandboxed unit tests, and autonomously self-heal failing edge-cases before seeking cryptographic Human-in-the-Loop release approval.

The system combines feudal-Japanese sanctuary aesthetics with high-performance modern developer tooling, real-time telemetry, and multi-provider LLM orchestration.

---

## 🏛️ The 5-Agent Autonomous Architecture

The guild operates as a cyclic LangGraph state machine with 5 specialized autonomous agents:

```
                  ┌──────────────────────────────────────────────┐
                  │          👑 Agent 0: The Mikado              │
                  │   (Supreme Orchestrator & State Machine)     │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │          ⛩️ Agent 1: The Shogun              │
                  │        (Master Strategic Planner)            │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │          ⚔️ Agent 2: The Samurai             │
                  │         (Autonomous Code Builder)            │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │         🛡️ Agent 3: The Sentinel            │
                  │        (Quality & Sandbox Guardian)          │
                  └──────────────────────┬───────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
      [Tests Failed & Budget Available]             [Tests 100% Passed]
                    │                                         │
                    ▼                                         ▼
        (Cyclic Retry to Samurai)          ┌─────────────────────────────────────┐
                                           │     📜 Agent 4: Shadow Council      │
                                           │    (Security Audit & Human Seal)    │
                                           └──────────────────┬──────────────────┘
                                                              │
                                                              ▼
                                                   [Sovereign Git Merge]
```

### 1. 👑 Agent 0: The Mikado (Supreme Orchestrator)
- **Role**: LangGraph State Machine Controller & Sandbox Environment Architect.
- **Capabilities**:
  - Dynamically detects the target file extension and configures the native language test runner (`pytest` for Python, `jest`/`vitest` for JavaScript/TypeScript, `g++ & ctest` for C++, `JUnit 5` for Java, `pgTAP` for SQL, etc.).
  - Enforces the `maxIterations` budget circuit breaker.
  - Dynamically routes tracebacks and signals between nodes.

### 2. ⛩️ Agent 1: The Shogun (Master Strategic Planner)
- **Role**: Architectural Task Decomposition.
- **Capabilities**: Deconstructs user imperial decrees into a 3-step surgical execution blueprint allocating boundary constraints.

### 3. ⚔️ Agent 2: The Samurai (Autonomous Code Builder)
- **Role**: AST Surgical Patching & Re-Forging.
- **Capabilities**: Applies initial code patches; ingests Sentinel error tracebacks on Iteration #2 to autonomously re-forge edge-case-safe code with boundary type-enforcement and null guards.

### 4. 🛡️ Agent 3: The Sentinel (Quality Guardian)
- **Role**: Sandboxed Test Runner & Assertion Sentry.
- **Capabilities**: Runs test suites in isolated sandboxes, identifies boundary edge cases on Iteration #1, and verifies 100% green test passes on Iteration #2.

### 5. 📜 Agent 4: Shadow Council (Security & Human Gate)
- **Role**: Zero-Leak Audit & Merge Seal.
- **Capabilities**: Scans diffs for leaked secrets (API keys, hardcoded passwords), validates OWASP Top 10 compliance, and unlocks the Sovereign Human Seal and Patched File Download.

---

## ⚡ Core Features

- **Working Circuit Breaker (`maxIterations`)**:
  - Set to `1`: The Mikado halts upon Sentinel's Iteration #1 edge-case catch with a red warning banner, locking production merge.
  - Set to `≥ 2`: The Mikado autonomously routes the error traceback back to The Samurai for Iteration #2 self-healing, passing 100% of unit tests.
- **Multi-Provider API Integration**:
  - Direct selection of **Google Gemini (`gemini-2.5-flash`)**, **OpenAI (`gpt-4o-mini`)**, **Groq (`llama-3.3-70b-versatile`)**, and **Anthropic Claude (`claude-3-5-sonnet`)**.
  - Seamless fallback to the built-in Sanctuary Heuristic Engine if keys are absent or endpoints timeout.
- **Real File Upload & Patched Artifact Download**:
  - Upload real local files (`.py`, `.js`, `.ts`, `.cpp`, `.java`, etc.) with automatic language sandbox detection.
  - Download verified, signed patches directly to your machine.
- **Cinematic Hanko Imperial Seal**:
  - High-impact spring physics stamping animation of the traditional vermilion Hanko seal with expanding shockwave ripples and native Web Audio API temple gong resonance.

---

## 📁 Modular Project Architecture

```
dev-pilot/
├── app/
│   ├── api/
│   │   ├── ai/
│   │   │   └── route.ts         # Multi-provider LLM API dispatcher
│   │   ├── gemini/
│   │   │   └── route.ts         # Direct Gemini interactions
│   │   └── guild/
│   │       └── route.ts         # LangGraph State Machine & cyclic edge logic
│   ├── globals.css              # Custom styling, dark obsidian theme & animations
│   ├── layout.tsx               # Root Next.js layout
│   └── page.tsx                 # Main orchestrator component
├── components/
│   ├── BackgroundAura.tsx       # Animated floating ambient glow & cyber-grid
│   ├── Header.tsx               # Imperial logo & multi-provider API key bar
│   ├── CommandBar.tsx           # Presets, max-iterations budget, file upload & decree prompt
│   ├── DecisionBanner.tsx       # Mikado circuit-breaker halt & pass notifications
│   ├── AgentPipeline.tsx        # 5-Agent status cards & connecting energy bar
│   ├── CodeWorkspace.tsx        # Unified git diff, patched code & broken source tabs
│   ├── ExecutionTerminal.tsx    # Real-time spring-animated LangGraph execution logs
│   ├── SovereignGate.tsx        # Bottom human-in-the-loop governance & merge gate
│   └── SealModal.tsx            # Imperial Hanko seal, shockwaves & proclamation scroll
├── constants/
│   ├── providers.ts             # Provider configurations (Gemini, OpenAI, Groq, Claude)
│   ├── presets.ts               # Pre-configured edge-case scenarios
│   └── agents.ts                # Specifications for the 5 autonomous agents
├── types/
│   └── guild.ts                 # Clean TypeScript type definitions
└── lib/
    ├── sound.ts                 # Web Audio API ceremonial temple gong synthesizer
    └── utils.ts                 # Sandbox runner detection, blob file download & clipboard helpers
```

---

## 🚀 Quickstart & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/dev-pilot.git
cd dev-pilot
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here
```
*(Note: You can also paste your API key directly into the top header of the web interface at runtime, or leave it blank to use the autonomous Sanctuary Heuristic Engine!)*

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **State Machine Orchestration**: `@langchain/langgraph` & `@langchain/core`
- **Animations**: `framer-motion` (Spring physics, AnimatePresence, layout animations)
- **Styling**: Tailwind CSS
- **Icons**: `lucide-react`
- **Audio**: Native Browser Web Audio API (`AudioContext`)
- **Language**: TypeScript (Strict type checking)

---

## 📜 License

MIT License. Crafted for elite autonomous software engineering.
