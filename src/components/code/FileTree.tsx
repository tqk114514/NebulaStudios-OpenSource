import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, File, FileCode, Folder, FolderOpen, FileType2 } from "lucide-react";
import type { FileNode, Language } from "@/types";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  nodes: FileNode[];
  selectedPath: string;
  onSelect: (node: FileNode, path: string) => void;
  defaultExpanded?: string[];
}

export function FileTree({
  nodes,
  selectedPath,
  onSelect,
  defaultExpanded = [],
}: FileTreeProps) {
  return (
    <div className="bg-paper font-mono text-sm">
      {nodes.map((node) => (
        <TreeItem
          key={node.name}
          node={node}
          depth={0}
          path={node.name}
          selectedPath={selectedPath}
          onSelect={onSelect}
          expandedSet={new Set(defaultExpanded)}
        />
      ))}
    </div>
  );
}

interface TreeItemProps {
  node: FileNode;
  depth: number;
  path: string;
  selectedPath: string;
  onSelect: (node: FileNode, path: string) => void;
  expandedSet: Set<string>;
}

function TreeItem({ node, depth, path, selectedPath, onSelect, expandedSet }: TreeItemProps) {
  const isDir = node.type === "dir";
  const [open, setOpen] = useState(isDir && expandedSet.has(path));

  const isSelected = selectedPath === path;

  function handleClick() {
    if (isDir) {
      setOpen((v) => !v);
    } else {
      onSelect(node, path);
    }
  }

  const icon = isDir ? (
    open ? <FolderOpen className="h-4 w-4 text-ink-soft" /> : <Folder className="h-4 w-4 text-ink-soft" />
  ) : (
    <FileIcon language={node.language} />
  );

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left transition-colors",
          isSelected ? "bg-vermillion-tint text-vermillion-deep" : "text-ink-soft hover:bg-paper-warm hover:text-ink",
        )}
        style={{ paddingLeft: depth * 14 + 8 }}
      >
        {isDir ? (
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="h-3.5 w-3.5 text-ink-mute" />
          </motion.span>
        ) : (
          <span className="inline-block w-3.5" />
        )}
        {icon}
        <span className="truncate">{node.name}</span>
      </button>

      <AnimatePresence initial={false}>
        {isDir && open && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <TreeItem
                key={child.name}
                node={child}
                depth={depth + 1}
                path={`${path}/${child.name}`}
                selectedPath={selectedPath}
                onSelect={onSelect}
                expandedSet={expandedSet}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileIcon({ language }: { language?: Language }) {
  if (!language || language === "Markdown") return <File className="h-4 w-4 text-ink-soft" />;
  if (language === "Shell") return <FileType2 className="h-4 w-4 text-ink-soft" />;
  return <FileCode className="h-4 w-4 text-ink-soft" />;
}
