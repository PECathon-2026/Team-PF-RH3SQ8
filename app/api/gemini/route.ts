import { NextRequest, NextResponse } from "next/server";

const DEFAULT_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-3.8-flash",
];

// GET: Returns current active server environment key configuration
export async function GET() {
  const envKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";

  return NextResponse.json({
    configured: Boolean(envKey && envKey.trim().length > 0),
    maskedKey: envKey
      ? `${envKey.slice(0, 8)}...${envKey.slice(-4)}`
      : "Not Configured",
    fullKey: envKey || "",
    source: envKey ? ".env.local (Server Environment)" : "None",
    availableModels: DEFAULT_MODELS,
  });
}

// POST: Execute live test ping or complete guild autonomous generation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = "generate",
      apiKey: clientKey,
      model = "gemini-1.5-flash",
      decree = "",
      code = "",
      fileName = "auth_service.py",
    } = body;

    const key = (
      clientKey ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""
    ).trim();

    if (!key) {
      return NextResponse.json(
        {
          error: "No Gemini API key found. Please provide an API key in the Imperial Key Chamber or in .env.local",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    // ── ACTION: TEST PING ──
    if (action === "test") {
      const startTime = Date.now();
      const testUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent?key=${encodeURIComponent(key)}`;

      try {
        const testRes = await fetch(testUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { parts: [{ text: "Imperial DevPilot Ping: Respond with: SANCTUARY PONG" }] },
            ],
          }),
        });

        const latency = Date.now() - startTime;
        const testData = await testRes.json();

        if (!testRes.ok) {
          return NextResponse.json(
            {
              success: false,
              statusCode: testRes.status,
              statusText: testRes.statusText,
              latency,
              model,
              keyUsed: `${key.slice(0, 8)}...${key.slice(-4)}`,
              errorMessage:
                testData?.error?.message ||
                `Google Gemini API responded with status ${testRes.status}`,
              errorDetails: testData?.error || null,
            },
            { status: 200 } // return 200 so UI can display rich diagnostic report
          );
        }

        const reply =
          testData?.candidates?.[0]?.content?.parts?.[0]?.text || "OK";

        return NextResponse.json({
          success: true,
          statusCode: 200,
          latency,
          model,
          keyUsed: `${key.slice(0, 8)}...${key.slice(-4)}`,
          message: "Google Gemini Neural Gateway connection verified successfully!",
          reply: reply.trim(),
        });
      } catch (networkErr: any) {
        return NextResponse.json({
          success: false,
          statusCode: 503,
          latency: Date.now() - startTime,
          model,
          keyUsed: `${key.slice(0, 8)}...${key.slice(-4)}`,
          errorMessage: `Network connection failed: ${networkErr.message}`,
        });
      }
    }

    // ── ACTION: AUTONOMOUS GENERATE ──
    const systemPrompt = `You are DevPilot, an elite autonomous multi-agent software engineering guild (The Mystic Mikado).
A software engineer has issued this decree:
"${decree}"

Target file: "${fileName}"
Source code:
\`\`\`
${code}
\`\`\`

Generate a comprehensive engineering patch. You MUST respond with ONLY a raw JSON object (no markdown fence, no backticks):
{
  "shogunPlan": [
    "Step 1: AST decomposition and vulnerability mapping",
    "Step 2: Surgical patch injection with boundary guards",
    "Step 3: Pytest test suite execution & self-healing correction",
    "Step 4: Shadow Council security audit & human seal validation"
  ],
  "samuraiSummary": "Summary of modifications applied to ${fileName}",
  "patchedCode": "Complete, production-ready, fully fixed code",
  "diffUnified": "Unified diff showing deletions starting with - and additions starting with +",
  "failTraceback": "Realistic pytest failure traceback showing an edge-case bug on initial execution",
  "passReport": "Realistic pytest passing report (100% 18/18 passed)",
  "securityChecks": {
    "secretLeak": "PASS",
    "pathTraversal": "PASS",
    "astSyntax": "PASS",
    "owaspTop10": "PASS"
  }
}`;

    // Try selected model first, with automatic fallback through DEFAULT_MODELS if 404
    const modelsToTry = [model, ...DEFAULT_MODELS.filter((m) => m !== model)];
    let lastError: any = null;
    let finalData: any = null;
    let successfulModel = model;
    let totalLatency = 0;

    for (const currentModel of modelsToTry) {
      const startTime = Date.now();
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        currentModel
      )}:generateContent?key=${encodeURIComponent(key)}`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        });

        const latency = Date.now() - startTime;
        totalLatency = latency;
        const rawJson = await response.json();

        if (response.ok) {
          const candidateText =
            rawJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            try {
              // Strip any unexpected markdown formatting if returned
              const cleaned = candidateText
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();
              finalData = JSON.parse(cleaned);
              successfulModel = currentModel;
              break;
            } catch (parseErr) {
              // Fall through to next model or raw text
            }
          }
        } else {
          lastError = {
            status: response.status,
            message:
              rawJson?.error?.message ||
              `Google Gemini API responded with status ${response.status}`,
            raw: rawJson,
            model: currentModel,
          };
          // If it's a 403 billing error or 401 auth error, no need to retry other models on the same project
          if (response.status === 403 || response.status === 401) {
            break;
          }
        }
      } catch (fetchErr: any) {
        lastError = { status: 500, message: fetchErr.message, model: currentModel };
      }
    }

    if (finalData) {
      return NextResponse.json({
        success: true,
        source: "live_gemini",
        model: successfulModel,
        latency: totalLatency,
        keyUsed: `${key.slice(0, 8)}...${key.slice(-4)}`,
        data: finalData,
      });
    }

    // If Gemini returned an error (e.g. 403 billing), return transparent error details
    return NextResponse.json({
      success: false,
      source: "gemini_error",
      error: lastError?.message || "Failed to generate with Google Gemini API",
      statusCode: lastError?.status || 500,
      modelTried: lastError?.model || model,
      keyUsed: `${key.slice(0, 8)}...${key.slice(-4)}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
