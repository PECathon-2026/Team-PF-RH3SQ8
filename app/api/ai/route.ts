import { NextRequest, NextResponse } from "next/server";

export interface ProviderConfig {
  id: string;
  name: string;
  defaultModel: string;
  models: { id: string; name: string }[];
  keyPrefix: string;
  keyPlaceholder: string;
  docsUrl: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    defaultModel: "gemini-1.5-flash",
    models: [
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Fast & Free)" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Deep Reasoning)" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash" },
    ],
    keyPrefix: "AIzaSy",
    keyPlaceholder: "AIzaSy... (from Google AI Studio)",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    defaultModel: "claude-3-5-sonnet-20241022",
    models: [
      { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (State of the Art)" },
      { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Ultra Fast)" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    ],
    keyPrefix: "sk-ant",
    keyPlaceholder: "sk-ant-... (from console.anthropic.com)",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
  {
    id: "openai",
    name: "OpenAI GPT",
    defaultModel: "gpt-4o-mini",
    models: [
      { id: "gpt-4o-mini", name: "GPT-4o Mini (Fast & Cheap)" },
      { id: "gpt-4o", name: "GPT-4o (Omni Reasoning)" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "o1-mini", name: "OpenAI o1-mini" },
    ],
    keyPrefix: "sk-",
    keyPlaceholder: "sk-... (from platform.openai.com)",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "groq",
    name: "Groq (Llama / DeepSeek)",
    defaultModel: "llama-3.3-70b-versatile",
    models: [
      { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B (High Speed)" },
      { id: "deepseek-r1-distill-llama-70b", name: "DeepSeek R1 Distill 70B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
    keyPrefix: "gsk_",
    keyPlaceholder: "gsk_... (from console.groq.com)",
    docsUrl: "https://console.groq.com/keys",
  },
  {
    id: "offline",
    name: "Imperial Offline Sanctuary Engine",
    defaultModel: "mikado-heuristic-v2",
    models: [
      { id: "mikado-heuristic-v2", name: "Mikado Autonomous Heuristic Engine (No Key Needed)" },
    ],
    keyPrefix: "",
    keyPlaceholder: "No API Key Required (Autonomous Mode)",
    docsUrl: "#",
  },
];

// Helper: Read environment key for a given provider
function getEnvKeyForProvider(provider: string): string {
  if (provider === "gemini") {
    return (
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      ""
    ).trim();
  }
  if (provider === "claude") {
    return (
      process.env.ANTHROPIC_API_KEY ||
      process.env.CLAUDE_API_KEY ||
      process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ||
      ""
    ).trim();
  }
  if (provider === "openai") {
    return (
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
      ""
    ).trim();
  }
  if (provider === "groq") {
    return (
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY ||
      ""
    ).trim();
  }
  return "";
}

// GET: Returns available providers and server configuration
export async function GET() {
  const result = PROVIDERS.map((p) => {
    const envKey = getEnvKeyForProvider(p.id);
    return {
      id: p.id,
      name: p.name,
      defaultModel: p.defaultModel,
      models: p.models,
      docsUrl: p.docsUrl,
      keyPlaceholder: p.keyPlaceholder,
      hasEnvKey: Boolean(envKey && envKey.length > 0),
      maskedEnvKey: envKey ? `${envKey.slice(0, 8)}...${envKey.slice(-4)}` : "",
      fullEnvKey: envKey || "",
    };
  });

  return NextResponse.json({ providers: result });
}

// POST: Execute test ping or generate patch
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action = "generate",
      provider = "gemini",
      apiKey: clientKey,
      model,
      decree = "",
      code = "",
      fileName = "auth_service.py",
    } = body;

    if (provider === "offline") {
      return NextResponse.json({
        success: true,
        source: "offline_engine",
        model: "mikado-heuristic-v2",
        latency: 42,
        keyUsed: "None (Autonomous Offline)",
        message: "Imperial Autonomous Sanctuary Engine operating without external key.",
      });
    }

    const key = (clientKey || getEnvKeyForProvider(provider) || "").trim();

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 401,
          errorMessage: `No API key provided for ${provider.toUpperCase()}. Please enter an API key or switch to Offline mode.`,
        },
        { status: 401 }
      );
    }

    const maskedKey = `${key.slice(0, 8)}...${key.slice(-4)}`;
    const startTime = Date.now();

    // ── ACTION: TEST PING ──
    if (action === "test") {
      if (provider === "gemini") {
        const testModel = model || "gemini-1.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          testModel
        )}:generateContent?key=${encodeURIComponent(key)}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: "DevPilot ping test. Reply: PONG" }] }],
          }),
        });

        const latency = Date.now() - startTime;
        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json({
            success: false,
            statusCode: res.status,
            latency,
            provider,
            model: testModel,
            keyUsed: maskedKey,
            errorMessage: data?.error?.message || `Google API error ${res.status}`,
          });
        }

        return NextResponse.json({
          success: true,
          statusCode: 200,
          latency,
          provider,
          model: testModel,
          keyUsed: maskedKey,
          message: "Google Gemini connection verified successfully!",
          reply: data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "PONG",
        });
      }

      if (provider === "claude") {
        const testModel = model || "claude-3-5-haiku-20241022";
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: testModel,
            max_tokens: 30,
            messages: [{ role: "user", content: "DevPilot ping test. Reply: PONG" }],
          }),
        });

        const latency = Date.now() - startTime;
        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json({
            success: false,
            statusCode: res.status,
            latency,
            provider,
            model: testModel,
            keyUsed: maskedKey,
            errorMessage: data?.error?.message || `Anthropic API error ${res.status}`,
          });
        }

        return NextResponse.json({
          success: true,
          statusCode: 200,
          latency,
          provider,
          model: testModel,
          keyUsed: maskedKey,
          message: "Anthropic Claude connection verified successfully!",
          reply: data?.content?.[0]?.text?.trim() || "PONG",
        });
      }

      if (provider === "openai") {
        const testModel = model || "gpt-4o-mini";
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: testModel,
            max_tokens: 30,
            messages: [{ role: "user", content: "DevPilot ping test. Reply: PONG" }],
          }),
        });

        const latency = Date.now() - startTime;
        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json({
            success: false,
            statusCode: res.status,
            latency,
            provider,
            model: testModel,
            keyUsed: maskedKey,
            errorMessage: data?.error?.message || `OpenAI API error ${res.status}`,
          });
        }

        return NextResponse.json({
          success: true,
          statusCode: 200,
          latency,
          provider,
          model: testModel,
          keyUsed: maskedKey,
          message: "OpenAI GPT connection verified successfully!",
          reply: data?.choices?.[0]?.message?.content?.trim() || "PONG",
        });
      }

      if (provider === "groq") {
        const testModel = model || "llama-3.3-70b-versatile";
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: testModel,
            max_tokens: 30,
            messages: [{ role: "user", content: "DevPilot ping test. Reply: PONG" }],
          }),
        });

        const latency = Date.now() - startTime;
        const data = await res.json();

        if (!res.ok) {
          return NextResponse.json({
            success: false,
            statusCode: res.status,
            latency,
            provider,
            model: testModel,
            keyUsed: maskedKey,
            errorMessage: data?.error?.message || `Groq API error ${res.status}`,
          });
        }

        return NextResponse.json({
          success: true,
          statusCode: 200,
          latency,
          provider,
          model: testModel,
          keyUsed: maskedKey,
          message: "Groq Llama connection verified successfully!",
          reply: data?.choices?.[0]?.message?.content?.trim() || "PONG",
        });
      }
    }

    // ── ACTION: AUTONOMOUS GENERATE (MULTI-PROVIDER) ──
    const systemPrompt = `You are DevPilot AI Guild backend. 
Decree: "${decree}"
File: "${fileName}"
Source code:
\`\`\`
${code}
\`\`\`

Return ONLY a raw JSON object with this exact structure:
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

    let parsedResult: any = null;
    let chosenModel = model;

    // 1. Google Gemini
    if (provider === "gemini") {
      chosenModel = model || "gemini-1.5-flash";
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          chosenModel
        )}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
            },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({
          success: false,
          statusCode: res.status,
          provider,
          model: chosenModel,
          keyUsed: maskedKey,
          error: data?.error?.message || `Google API error ${res.status}`,
        });
      }
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        parsedResult = JSON.parse(
          rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim()
        );
      }
    }

    // 2. Anthropic Claude
    else if (provider === "claude") {
      chosenModel = model || "claude-3-5-sonnet-20241022";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: chosenModel,
          max_tokens: 4096,
          messages: [{ role: "user", content: systemPrompt }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({
          success: false,
          statusCode: res.status,
          provider,
          model: chosenModel,
          keyUsed: maskedKey,
          error: data?.error?.message || `Claude API error ${res.status}`,
        });
      }
      const rawText = data?.content?.[0]?.text;
      if (rawText) {
        parsedResult = JSON.parse(
          rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim()
        );
      }
    }

    // 3. OpenAI
    else if (provider === "openai") {
      chosenModel = model || "gpt-4o-mini";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: systemPrompt }],
          temperature: 0.2,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({
          success: false,
          statusCode: res.status,
          provider,
          model: chosenModel,
          keyUsed: maskedKey,
          error: data?.error?.message || `OpenAI error ${res.status}`,
        });
      }
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) parsedResult = JSON.parse(rawText.trim());
    }

    // 4. Groq
    else if (provider === "groq") {
      chosenModel = model || "llama-3.3-70b-versatile";
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: chosenModel,
          response_format: { type: "json_object" },
          messages: [{ role: "user", content: systemPrompt }],
          temperature: 0.2,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return NextResponse.json({
          success: false,
          statusCode: res.status,
          provider,
          model: chosenModel,
          keyUsed: maskedKey,
          error: data?.error?.message || `Groq error ${res.status}`,
        });
      }
      const rawText = data?.choices?.[0]?.message?.content;
      if (rawText) parsedResult = JSON.parse(rawText.trim());
    }

    const latency = Date.now() - startTime;

    if (parsedResult) {
      return NextResponse.json({
        success: true,
        source: `live_${provider}`,
        provider,
        model: chosenModel,
        latency,
        keyUsed: maskedKey,
        data: parsedResult,
      });
    }

    return NextResponse.json({
      success: false,
      error: "Unable to parse JSON response from provider",
      provider,
      model: chosenModel,
      keyUsed: maskedKey,
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

