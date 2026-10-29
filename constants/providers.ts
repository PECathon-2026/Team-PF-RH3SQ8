import { ProviderOption } from "@/types/guild";

export const PROVIDERS: ProviderOption[] = [
  {
    id: "gemini",
    name: "Google Gemini (gemini-2.5-flash)",
    defaultModel: "gemini-2.5-flash",
    keyPrefix: "AIzaSy",
    placeholder: "AIzaSy... (from Google AI Studio)",
    docsUrl: "https://aistudio.google.com/app/apikey",
  },
  {
    id: "openai",
    name: "OpenAI (gpt-4o-mini)",
    defaultModel: "gpt-4o-mini",
    keyPrefix: "sk-",
    placeholder: "sk-... (from platform.openai.com)",
    docsUrl: "https://platform.openai.com/api-keys",
  },
  {
    id: "groq",
    name: "Groq (llama-3.3-70b-versatile)",
    defaultModel: "llama-3.3-70b-versatile",
    keyPrefix: "gsk_",
    placeholder: "gsk_... (from console.groq.com)",
    docsUrl: "https://console.groq.com/keys",
  },
  {
    id: "claude",
    name: "Anthropic Claude (claude-3-5-sonnet)",
    defaultModel: "claude-3-5-sonnet-20241022",
    keyPrefix: "sk-ant",
    placeholder: "sk-ant-... (from console.anthropic.com)",
    docsUrl: "https://console.anthropic.com/settings/keys",
  },
];

