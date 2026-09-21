import hljs from "highlight.js/lib/common";
import dockerfile from "highlight.js/lib/languages/dockerfile";

hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerAliases(["docker", "containerfile"], { languageName: "dockerfile" });

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightCode(
  codeText: string,
  explicitLang?: string
): { html: string; language: string } {
  const cleanLang = explicitLang?.toLowerCase().trim();

  if (cleanLang && hljs.getLanguage(cleanLang)) {
    try {
      const res = hljs.highlight(codeText, {
        language: cleanLang,
        ignoreIllegals: true,
      });
      return { html: res.value, language: cleanLang };
    } catch {
      return { html: escapeHtml(codeText), language: cleanLang };
    }
  }

  if (!cleanLang && codeText.trim()) {
    try {
      const autoRes = hljs.highlightAuto(codeText);
      return {
        html: autoRes.value,
        language: autoRes.language || "text",
      };
    } catch {
      return { html: escapeHtml(codeText), language: "text" };
    }
  }

  return { html: escapeHtml(codeText), language: cleanLang || "text" };
}

export { hljs, escapeHtml };
