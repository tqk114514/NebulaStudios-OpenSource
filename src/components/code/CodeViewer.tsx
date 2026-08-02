import { useState } from "react";
import { motion } from "motion/react";
import { Check, Copy } from "lucide-react";
import { HighlightedLine } from "./SyntaxHighlight";
import type { Language } from "@/types";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language?: Language;
  filename?: string;
  className?: string;
  maxHeight?: number;
}

export function CodeViewer({
  code,
  language,
  filename,
  className,
  maxHeight = 520,
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <div className={cn("overflow-hidden rounded-md border border-line-subtle bg-paper-pure shadow-card", className)}>
      {filename && (
        <div className="flex items-center justify-between border-b border-line-subtle bg-paper-warm px-4 py-2">
          <span className="font-mono text-xs text-ink-soft">{filename}</span>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[0.7rem] text-ink-mute transition-colors hover:bg-paper-deep hover:text-ink"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-vermillion" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      )}
      <div className="code-scroll overflow-auto" style={{ maxHeight }}>
        <table className="w-full border-collapse font-mono text-[0.82rem] leading-[1.65]">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="group">
                <td className="sticky left-0 w-12 select-none border-r border-line-subtle bg-[var(--code-line)] px-3 text-right text-[var(--code-line-fg)] group-hover:bg-[var(--code-hover)]">
                  {i + 1}
                </td>
                <td className="whitespace-pre px-4 text-ink group-hover:bg-[var(--code-hover)]">
                  {line.length === 0 ? " " : <HighlightedLine line={line} language={language} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filename && (
        <motion.button
          onClick={copy}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-line-subtle bg-paper-pure/90 px-2 py-1 font-mono text-[0.7rem] text-ink-mute transition-colors hover:text-ink"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-vermillion" /> : <Copy className="h-3.5 w-3.5" />}
        </motion.button>
      )}
    </div>
  );
}
