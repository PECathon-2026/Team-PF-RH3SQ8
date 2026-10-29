/**
 * Detects the appropriate sandboxed test runner based on file extension.
 */
export function getTestRunnerForFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".py")) return "pytest v8.3.2";
  if (lower.endsWith(".js") || lower.endsWith(".jsx")) return "jest --coverage";
  if (lower.endsWith(".ts") || lower.endsWith(".tsx")) return "vitest / ts-jest";
  if (lower.endsWith(".cpp") || lower.endsWith(".c") || lower.endsWith(".cc")) return "g++ -std=c++20 & ctest";
  if (lower.endsWith(".java")) return "JUnit 5 / Surefire";
  if (lower.endsWith(".sql")) return "pgTAP / SQLFluff";
  if (lower.endsWith(".go")) return "go test -v ./...";
  if (lower.endsWith(".rs")) return "cargo test --all";
  return "language-native sandbox runner";
}

/**
 * Downloads a code string as a local file via browser Blob and temporary anchor click.
 */
export function downloadCodeFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "patched_artifact.py";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies text safely to clipboard with fallback.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

