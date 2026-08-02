import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, FileCode, Plus, Minus } from "lucide-react";
import type { DiffFile } from "@/types";
import { cn } from "@/lib/utils";

interface DiffViewerProps {
  files: DiffFile[];
  className?: string;
}

export function DiffViewer({ files, className }: DiffViewerProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {files.map((file, i) => (
        <DiffFileView key={i} file={file} />
      ))}
    </div>
  );
}

function DiffFileView({ file }: { file: DiffFile }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure shadow-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 border-b border-line-subtle bg-paper-warm px-4 py-2.5 text-left transition-colors hover:bg-paper-deep"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight className="h-4 w-4 text-ink-mute" />
        </motion.span>
        <FileCode className="h-4 w-4 text-ink-soft" />
        <span className="font-mono text-xs text-ink">{file.path}</span>
        <span className="ml-auto flex items-center gap-2 font-mono text-[0.7rem]">
          <span className="inline-flex items-center gap-1 text-forest">
            <Plus className="h-3 w-3" />
            {file.additions}
          </span>
          <span className="inline-flex items-center gap-1 text-vermillion-deep">
            <Minus className="h-3 w-3" />
            {file.deletions}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="code-scroll overflow-x-auto">
              <table className="w-full border-collapse font-mono text-[0.8rem] leading-[1.6]">
                <tbody>
                  {file.hunks.flatMap((hunk, hi) => [
                    <tr key={`h-${hi}`} className="border-y border-line-subtle bg-[var(--code-diff-hunk)]">
                      <td colSpan={3} className="px-4 py-1.5 font-mono text-[0.7rem] text-prussian-deep">
                        {hunk.header}
                      </td>
                    </tr>,
                    ...hunk.lines.map((line, li) => (
                      <tr
                        key={`${hi}-${li}`}
                        className={cn(
                          line.type === "add" && "bg-[var(--code-diff-add-bg)]",
                          line.type === "del" && "bg-[var(--code-diff-del-bg)]",
                        )}
                      >
                        <td className="w-10 select-none bg-[var(--code-line)] px-2 text-right text-[var(--code-line-fg)]">
                          {line.oldNo ?? ""}
                        </td>
                        <td className="w-10 select-none bg-[var(--code-line)] px-2 text-right text-[var(--code-line-fg)]">
                          {line.newNo ?? ""}
                        </td>
                        <td className="whitespace-pre px-3">
                          <span
                            className={cn(
                              "mr-2 select-none",
                              line.type === "add" && "text-[var(--code-diff-add-mark)]",
                              line.type === "del" && "text-[var(--code-diff-del-mark)]",
                              line.type === "context" && "text-ink-mute",
                            )}
                          >
                            {line.type === "add" ? "+" : line.type === "del" ? "-" : " "}
                          </span>
                          <span
                            className={cn(
                              line.type === "add" && "text-ink",
                              line.type === "del" && "text-ink-soft",
                              line.type === "context" && "text-ink-soft",
                            )}
                          >
                            {line.content}
                          </span>
                        </td>
                      </tr>
                    )),
                  ])}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
