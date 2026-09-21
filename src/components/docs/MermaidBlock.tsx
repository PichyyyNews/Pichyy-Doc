"use client";

import React, { useState, useEffect, useId, useRef } from "react";
import { Copy, Check, Code, Eye, WarningCircle } from "@phosphor-icons/react";
import { highlightCode } from "@/lib/highlighter";

interface MermaidBlockProps {
  code: string;
}

export function MermaidBlock({ code }: MermaidBlockProps) {
  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const renderIndexRef = useRef(0);

  // Detect and observe dark mode changes
  useEffect(() => {
    const checkDark = () => {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-mode") === "dark" ||
        document.body.classList.contains("dark");
      setIsDark(isDarkMode);
    };

    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-mode"],
    });

    return () => observer.disconnect();
  }, []);

  // Render mermaid diagram whenever code or theme changes
  useEffect(() => {
    let isCancelled = false;
    const currentRender = ++renderIndexRef.current;
    setIsLoading(true);
    setError(null);

    async function renderDiagram() {
      if (!code.trim()) {
        setIsLoading(false);
        setSvgHtml("");
        return;
      }

      try {
        const mermaid = (await import("mermaid")).default;
        
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "loose",
          theme: isDark ? "dark" : "neutral",
          fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          themeVariables: isDark
            ? {
                darkMode: true,
                background: "#18181b",
                mainBkg: "#27272a",
                primaryColor: "#27272a",
                primaryTextColor: "#f4f4f5",
                primaryBorderColor: "#3f3f46",
                lineColor: "#a1a1aa",
                secondaryColor: "#1f1f23",
                tertiaryColor: "#27272a",
                edgeLabelBackground: "#18181b",
                nodeTextColor: "#f4f4f5",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                mainBkg: "#f4f4f5",
                primaryColor: "#f4f4f5",
                primaryTextColor: "#18181b",
                primaryBorderColor: "#e4e4e7",
                lineColor: "#71717a",
                secondaryColor: "#fafafa",
                tertiaryColor: "#f4f4f5",
                edgeLabelBackground: "#ffffff",
                nodeTextColor: "#18181b",
              },
        });

        const elementId = `mermaid-${uniqueId}-${currentRender}`;
        const { svg } = await mermaid.render(elementId, code.trim());

        if (!isCancelled && currentRender === renderIndexRef.current) {
          setSvgHtml(svg);
          setError(null);
          setIsLoading(false);
        }
      } catch (err: any) {
        if (!isCancelled && currentRender === renderIndexRef.current) {
          console.warn("Mermaid render error:", err);
          setError(err?.message || "Failed to parse Mermaid diagram syntax.");
          setIsLoading(false);
        }
      }
    }

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [code, isDark, uniqueId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const { html: highlightedCode } = highlightCode(code, "mermaid");
  const codeLines = code.trim().split("\n");

  return (
    <div className="my-6 rounded-lg border border-kumo-line bg-kumo-base overflow-hidden shadow-xs transition-colors">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-kumo-hairline bg-kumo-recessed text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-kumo-base border border-kumo-line text-kumo-strong">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Mermaid Diagram
          </span>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-kumo-base border border-kumo-line rounded p-0.5 ml-2">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                activeTab === "preview"
                  ? "bg-kumo-recessed text-kumo-strong shadow-xs font-semibold"
                  : "text-kumo-subtle hover:text-kumo-default"
              }`}
            >
              <Eye weight={activeTab === "preview" ? "fill" : "regular"} className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded transition-colors ${
                activeTab === "code"
                  ? "bg-kumo-recessed text-kumo-strong shadow-xs font-semibold"
                  : "text-kumo-subtle hover:text-kumo-default"
              }`}
            >
              <Code weight={activeTab === "code" ? "bold" : "regular"} className="w-3.5 h-3.5" />
              Code
            </button>
          </div>
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-kumo-subtle hover:text-kumo-strong hover:bg-kumo-base transition-colors"
          title="Copy diagram code"
        >
          {copied ? (
            <>
              <Check weight="bold" className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === "preview" ? (
        <div className="p-4 sm:p-6 overflow-x-auto min-h-[140px] flex items-center justify-center bg-kumo-base">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 py-6 text-kumo-subtle text-xs">
              <span className="w-5 h-5 border-2 border-kumo-line border-t-kumo-strong rounded-full animate-spin" />
              <span>Rendering diagram...</span>
            </div>
          ) : error ? (
            <div className="w-full">
              <div className="flex items-start gap-2.5 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs mb-3">
                <WarningCircle weight="bold" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold mb-0.5">Mermaid Diagram Syntax Error</div>
                  <div className="text-[11px] opacity-90 line-clamp-2 font-mono">{error}</div>
                </div>
              </div>
              <div className="text-[11px] text-kumo-subtle mb-1.5 font-medium">Source Syntax:</div>
              <pre className="p-3 rounded bg-kumo-recessed border border-kumo-line text-xs font-mono text-kumo-strong overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          ) : (
            <div
              className="mermaid-rendered-svg w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto select-none"
              dangerouslySetInnerHTML={{ __html: svgHtml }}
            />
          )}
        </div>
      ) : (
        /* Source Code view */
        <div className="flex font-mono text-xs leading-relaxed overflow-x-auto bg-kumo-recessed">
          <div className="py-3 pl-3 pr-2 text-right select-none text-kumo-subtle/50 text-[11px] border-r border-kumo-hairline bg-kumo-recessed/50 min-w-[2.5rem]">
            {codeLines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="p-3 text-kumo-strong flex-1 overflow-x-auto">
            <code
              className="hljs block font-mono"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      )}
    </div>
  );
}
