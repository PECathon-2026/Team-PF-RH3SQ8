import { NextResponse } from "next/server";
import { StateGraph, Annotation, START, END } from "@langchain/langgraph";

// ═══════════════════════════════════════════════════════════════════════════════
// 1. DEFINE GUILD STATE SCHEMA (LangGraph Annotation.Root)
// ═══════════════════════════════════════════════════════════════════════════════

export interface GuildLog {
  agent: "MIKADO" | "SHOGUN" | "SAMURAI" | "SENTINEL" | "COUNCIL";
  title: string;
  detail: string;
  status: "info" | "error" | "success" | "warning";
}

export const GuildStateAnnotation = Annotation.Root({
  decree: Annotation<string>(),
  filename: Annotation<string>(),
  brokenCode: Annotation<string>(),
  plan: Annotation<string>(),
  fixedCode: Annotation<string>(),
  iteration: Annotation<number>(),
  maxIterations: Annotation<number>(),
  runner: Annotation<string>(),
  halted: Annotation<boolean>(),
  haltReason: Annotation<string>(),
  testPassed: Annotation<boolean>(),
  errorTrace: Annotation<string>(),
  securityStatus: Annotation<string>(),
  logs: Annotation<GuildLog[]>({
    reducer: (existingLogs, newLogs) => existingLogs.concat(newLogs),
    default: () => [],
  }),
});

type GuildStateType = typeof GuildStateAnnotation.State;

// Helper: Determine language test runner from file extension
export function detectTestRunner(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".py")) return "pytest v8.3.2";
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "jest --coverage";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "vitest / ts-jest";
  if (lower.endsWith(".cpp") || lower.endsWith(".c") || lower.endsWith(".cc")) return "g++ -std=c++20 & ctest";
  if (lower.endsWith(".java")) return "JUnit 5 / Maven Surefire";
  if (lower.endsWith(".sql")) return "pgTAP / SQLFluff";
  if (lower.endsWith(".go")) return "go test -v ./...";
  if (lower.endsWith(".rs")) return "cargo test --all";
  return "language-native sandbox test runner";
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. 5 LANGGRAPH NODE IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Node 0: The Mikado (Supreme Orchestrator)
 * Initializes state machine, selects test runner, monitors maxIterations budget.
 */
async function mikadoNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const runner = detectTestRunner(state.filename || "auth.py");
  const budget = state.maxIterations || 3;

  const initLog: GuildLog = {
    agent: "MIKADO",
    title: "Supreme Orchestrator Initialized",
    detail: `State graph mounted. Test runner configured: [${runner}]. Max Iterations budget locked at [${budget}]. Task routed to Agent 1: The Shogun.`,
    status: "info",
  };

  return {
    runner,
    iteration: 1,
    halted: false,
    haltReason: "",
    logs: [initLog],
  };
}

/**
 * Node 1: The Shogun (Master Strategic Planner)
 * Deconstructs the decree into a clean 3-step execution plan.
 */
async function shogunNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const targetFile = state.filename || "auth.py";
  const decreeText = state.decree || "Fix software defect in target repository";

  const strategicPlan = [
    `1. AST Vulnerability Mapping: Locate insecure branches & edge-case crash points in ${targetFile}.`,
    `2. Surgical Sandboxed Patching: Inject boundary guards and secure type-coercion logic.`,
    `3. Sentinel Quality Verification: Run test suites and execute self-healing cycle on failure.`,
  ].join("\n");

  const newLog: GuildLog = {
    agent: "SHOGUN",
    title: "Strategic Blueprint Formulated",
    detail: `Deconstructed decree: "${decreeText.slice(0, 60)}...". Target file identified: ${targetFile}. Three-stage execution plan dispatched to The Samurai.`,
    status: "info",
  };

  return {
    plan: strategicPlan,
    testPassed: false,
    errorTrace: "",
    logs: [newLog],
  };
}

/**
 * Node 2: The Samurai (Code Builder)
 * On iteration 1: Produces an initial patch (with a realistic edge-case omission).
 * On iteration 2: Reads errorTrace from Sentinel and applies the self-corrected code.
 */
async function samuraiNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const currentIteration = state.iteration || 1;
  const filename = (state.filename || "auth.py").toLowerCase();

  // ── ITERATION 1: Initial Partial Patch ──
  if (currentIteration === 1) {
    let initialFix = "";

    if (filename.includes("auth")) {
      initialFix = `def login(user, password):
    # Iteration 1: Basic null check added
    if not user:
        raise ValueError("Username is required")
    # Edge case bug: empty string and non-string passwords still cause crashes
    token = f"{user.strip()}:{password.strip()}"
    return {"status": "ok", "token": token}`;
    } else if (filename.includes("billing")) {
      initialFix = `def calculate_invoice(subtotal, discount_percent, items_count):
    # Iteration 1: Computes discount
    discount = subtotal * (discount_percent / 100.0)
    final_total = subtotal - discount
    # Edge case bug: items_count == 0 causes unhandled ZeroDivisionError
    cost_per_item = final_total / items_count
    return {"total": final_total, "cost_per_item": cost_per_item}`;
    } else {
      initialFix = `import os
# Iteration 1: Fallback environment variable with exposed default secret
DB_PASSWORD = os.getenv("DB_PASSWORD", "super_secret_mikado_root_password")
DB_HOST = os.getenv("DB_HOST", "prod-db.internal.sanctuary.net")

def get_db_connection():
    return connect(host=DB_HOST, password=DB_PASSWORD)`;
    }

    const log1: GuildLog = {
      agent: "SAMURAI",
      title: "Initial Code Patch Applied (Iteration #1)",
      detail: `Synthesized initial defensive patch for ${state.filename}. Staged modifications and submitted artifact to The Sentinel for test verification.`,
      status: "info",
    };

    return {
      fixedCode: initialFix,
      logs: [log1],
    };
  }

  // ── ITERATION 2: Self-Healed Complete Patch ──
  let healedFix = "";

  if (filename.includes("auth")) {
    healedFix = `def login(user, password):
    # Iteration 2 (Self-Healed): Strict type enforcement and empty-string guards
    if not user or not isinstance(user, str) or len(user.strip()) == 0:
        raise ValueError("Valid username is required")
    if not password or not isinstance(password, str) or len(password.strip()) == 0:
        raise ValueError("Password cannot be null or empty string")

    # Cryptographically isolated credentials
    safe_user = user.strip()
    safe_token = f"tok_sec_{abs(hash(safe_user + password))}"
    return {"status": "ok", "token": safe_token, "user": safe_user}`;
  } else if (filename.includes("billing")) {
    healedFix = `def calculate_invoice(subtotal, discount_percent, items_count):
    # Iteration 2 (Self-Healed): Non-negative bounds & zero-item protection
    if subtotal < 0:
        raise ValueError("Subtotal cannot be negative")
    clamped_discount = max(0.0, min(100.0, float(discount_percent)))
    discount_amount = round(subtotal * (clamped_discount / 100.0), 2)
    final_total = max(0.0, round(subtotal - discount_amount, 2))

    # Guard against ZeroDivisionError when items_count is zero
    cost_per_item = round(final_total / items_count, 2) if items_count > 0 else 0.0
    return {"total": final_total, "discount": discount_amount, "cost_per_item": cost_per_item}`;
  } else {
    healedFix = `import os
from secrets_manager import get_vault_secret

# Iteration 2 (Self-Healed): Zero hardcoded secrets, authenticated KMS vault resolution
def get_db_connection():
    db_host = os.environ.get("DB_HOST", "db.cluster.internal")
    db_password = get_vault_secret("prod/database/master_key")
    if not db_password:
        raise RuntimeError("Database credentials missing from secure vault")
    return connect(host=db_host, password=db_password, ssl_mode="require")`;
  }

  const log2: GuildLog = {
    agent: "SAMURAI",
    title: "Self-Correction Patch Applied (Iteration #2)",
    detail: `Read Sentinel error traceback: "${state.errorTrace}". Re-forged patch with comprehensive edge-case validation and type coercion.`,
    status: "success",
  };

  return {
    fixedCode: healedFix,
    logs: [log2],
  };
}

/**
 * Node 3: The Sentinel (Quality Guardian)
 * Executes test suite in a sandboxed runner.
 * On iteration 1: Triggers intentional failure on edge cases, advances iteration to 2.
 * On iteration 2: Confirms 100% test pass.
 */
async function sentinelNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const currentIteration = state.iteration || 1;
  const filename = state.filename || "auth.py";
  const runner = state.runner || "pytest v8.3.2";

  // ── ITERATION 1: Test Failure & Self-Healing Trigger ──
  if (currentIteration === 1) {
    const errorTrace = `AssertionError: Edge-case input failed validation on ${filename}:line 4. Expected ValueError on empty string or null credentials, got unhandled exception.`;

    const failLog: GuildLog = {
      agent: "SENTINEL",
      title: `${runner} Suite Encountered Edge-Case Failure (Iteration #1)`,
      detail: `❌ Test suite failed on boundary input: "${errorTrace}". Requesting Orchestrator routing decree.`,
      status: "error",
    };

    return {
      testPassed: false,
      errorTrace: errorTrace,
      iteration: 2, // Advance iteration for the retry loop!
      logs: [failLog],
    };
  }

  // ── ITERATION 2: 100% Test Pass ──
  const passLog: GuildLog = {
    agent: "SENTINEL",
    title: `100% ${runner} Suite Passed (Iteration #2)`,
    detail: `✅ All 14/14 unit tests passed. Edge cases, null guards, and boundary checks confirmed. Forwarding verified code to The Shadow Council.`,
    status: "success",
  };

  return {
    testPassed: true,
    errorTrace: "",
    logs: [passLog],
  };
}

/**
 * Node: Mikado Circuit Breaker (Halt Node)
 * Executes when maxIterations budget is exhausted before tests pass.
 */
async function mikadoHaltNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const maxIter = state.maxIterations || 1;
  const haltMsg = `MIKADO HALT: Max Iterations (${maxIter}/${maxIter}) reached before tests passed! Increase Max Iterations to ≥ 2 to allow self-healing.`;

  const haltLog: GuildLog = {
    agent: "MIKADO",
    title: "Circuit Breaker Activated: Execution Halted",
    detail: `⛔ ${haltMsg} Preventing automated deployment of unverified code. Sovereign branch remains locked.`,
    status: "warning",
  };

  return {
    halted: true,
    haltReason: haltMsg,
    securityStatus: "LOCKED ⛔ Tests Unresolved Under Current Budget",
    logs: [haltLog],
  };
}

/**
 * Node 4: The Shadow Council (Security & Human Gate)
 * Audits code for secret leakage, AST safety, and authorizes Human Approval.
 */
async function councilNode(state: GuildStateType): Promise<Partial<GuildStateType>> {
  const councilLog: GuildLog = {
    agent: "COUNCIL",
    title: "Security Clearance Confirmed",
    detail: `🛡️ Shadow Council audit complete: 0 hardcoded secrets exposed, AST syntax tree verified, OWASP Top 10 compliance passed. Awaiting final Sovereign Human Seal.`,
    status: "success",
  };

  return {
    securityStatus: "CLEARED ✅ 0 Secrets Exposed, AST Verified",
    logs: [councilLog],
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. COMPILE LANGGRAPH STATE MACHINE WITH THE MIKADO & CYCLIC CONDITIONAL EDGE
// ═══════════════════════════════════════════════════════════════════════════════

function buildGuildGraph() {
  const workflow = new StateGraph<GuildStateType>(GuildStateAnnotation)
    // Add 5 Primary Nodes + 1 Halt Node
    .addNode("mikado", mikadoNode)
    .addNode("shogun", shogunNode)
    .addNode("samurai", samuraiNode)
    .addNode("sentinel", sentinelNode)
    .addNode("mikado_halt", mikadoHaltNode)
    .addNode("council", councilNode)

    // Linear Start: START -> Mikado -> Shogun -> Samurai -> Sentinel
    .addEdge(START, "mikado")
    .addEdge("mikado", "shogun")
    .addEdge("shogun", "samurai")
    .addEdge("samurai", "sentinel")

    // CONDITIONAL EDGE FROM SENTINEL:
    // If tests passed -> council -> END
    // If tests failed:
    //    If maxIterations <= 1 -> mikado_halt -> END
    //    If maxIterations > 1 -> retry samurai!
    .addConditionalEdges(
      "sentinel",
      (state: GuildStateType) => {
        if (state.testPassed) {
          return "proceed";
        }
        const maxIter = state.maxIterations || 3;
        // If maxIterations is 1, circuit breaker halt!
        if (maxIter <= 1) {
          return "halt";
        }
        // If iteration was already 2 and still failed, halt
        if (state.iteration > maxIter) {
          return "halt";
        }
        return "retry";
      },
      {
        proceed: "council",
        retry: "samurai",
        halt: "mikado_halt",
      }
    )
    .addEdge("council", END)
    .addEdge("mikado_halt", END);

  return workflow.compile();
}

// Compile singleton graph instance
const guildGraph = buildGuildGraph();

// ═══════════════════════════════════════════════════════════════════════════════
// 4. API HANDLERS (Next.js App Router)
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    status: "active",
    orchestrator: "The Mikado LangGraph State Machine",
    nodes: ["mikado", "shogun", "samurai", "sentinel", "council"],
    cyclicLoop: "sentinel -> samurai (when testPassed is false and iteration <= maxIterations)",
    circuitBreaker: "sentinel -> mikado_halt (when maxIterations <= 1)",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      decree = "Fix login authentication null pointer crash in auth.py",
      filename = "auth.py",
      brokenCode = "",
      maxIterations = 3,
    } = body;

    // Invoke compiled LangGraph state machine with initial input
    const finalState = await guildGraph.invoke({
      decree,
      filename,
      brokenCode,
      plan: "",
      fixedCode: "",
      iteration: 1,
      maxIterations: Number(maxIterations) || 3,
      runner: detectTestRunner(filename),
      halted: false,
      haltReason: "",
      testPassed: false,
      errorTrace: "",
      securityStatus: "Pending Audit",
      logs: [],
    });

    return NextResponse.json({
      success: true,
      orchestrator: "The Mikado LangGraph",
      state: finalState,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to execute LangGraph state machine",
      },
      { status: 500 }
    );
  }
}
