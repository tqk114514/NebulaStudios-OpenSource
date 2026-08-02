import { Fragment, type ReactNode } from "react";
import type { Language } from "@/types";

type TokenType = "keyword" | "string" | "comment" | "number" | "type" | "function" | "punct" | "plain" | "heading" | "bold";

interface Token {
  type: TokenType;
  value: string;
}

const keywordSets: Record<string, string[]> = {
  zig: ["const", "var", "pub", "fn", "try", "return", "if", "else", "while", "for", "break", "continue", "struct", "enum", "union", "error", "test", "comptime", "inline", "extern", "export", "switch", "orelse", "catch", "defer", "errdefer", "async", "await", "suspend", "resume", "nosuspend", "anytype", "anyerror", "void", "true", "false", "null", "undefined", "unreachable"],
  typescript: ["import", "export", "from", "const", "let", "var", "function", "return", "if", "else", "for", "while", "switch", "case", "break", "continue", "new", "class", "extends", "implements", "interface", "type", "enum", "public", "private", "protected", "static", "async", "await", "yield", "try", "catch", "finally", "throw", "typeof", "instanceof", "in", "of", "as", "void", "this", "super", "default", "true", "false", "null", "undefined"],
  go: ["package", "import", "func", "return", "if", "else", "for", "range", "switch", "case", "default", "break", "continue", "var", "const", "type", "struct", "interface", "map", "chan", "go", "defer", "select", "fallthrough", "goto", "true", "false", "nil", "iota"],
  rust: ["fn", "let", "mut", "pub", "use", "mod", "struct", "enum", "impl", "trait", "return", "if", "else", "for", "while", "loop", "match", "break", "continue", "const", "static", "ref", "move", "as", "in", "where", "unsafe", "async", "await", "dyn", "self", "Self", "true", "false"],
  c: ["int", "char", "void", "long", "short", "float", "double", "unsigned", "signed", "const", "static", "struct", "union", "enum", "typedef", "return", "if", "else", "for", "while", "do", "switch", "case", "break", "continue", "default", "sizeof", "extern", "volatile", "register", "auto", "goto", "inline", "restrict"],
  shell: ["function", "if", "then", "else", "elif", "fi", "for", "in", "do", "done", "while", "case", "esac", "return", "exit", "local", "export", "echo", "set", "unset"],
};

const langToKey: Record<string, keyof typeof keywordSets> = {
  Zig: "zig",
  TypeScript: "typescript",
  Go: "go",
  Rust: "rust",
  C: "c",
  Shell: "shell",
  Markdown: "shell",
};

function tokenizeLine(line: string, lang: string): Token[] {
  const kwKey = langToKey[lang] || "shell";
  const keywords = keywordSets[kwKey] || [];
  const tokens: Token[] = [];
  let i = 0;

  // 注释优先（// 或 #）
  const commentMatch = line.match(/(\/\/.*$|#.*$)/);
  let workingLine = line;
  let comment = "";
  if (commentMatch && commentMatch.index !== undefined) {
    comment = commentMatch[0];
    workingLine = line.slice(0, commentMatch.index);
  }

  // 主分词：字符串、数字、标识符、标点、空白
  const regex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+)|([^\sA-Za-z0-9_"']+)/g;
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = regex.exec(workingLine)) !== null) {
    if (m.index > last) {
      tokens.push({ type: "plain", value: workingLine.slice(last, m.index) });
    }
    if (m[1]) tokens.push({ type: "string", value: m[1] });
    else if (m[2]) tokens.push({ type: "number", value: m[2] });
    else if (m[3]) {
      const word = m[3];
      if (keywords.includes(word)) tokens.push({ type: "keyword", value: word });
      else if (/^[A-Z][A-Za-z0-9_]*$/.test(word)) tokens.push({ type: "type", value: word });
      else {
        // 函数名：后接 (
        const after = workingLine.slice(regex.lastIndex);
        if (/^\s*\(/.test(after)) tokens.push({ type: "function", value: word });
        else tokens.push({ type: "plain", value: word });
      }
    } else if (m[4]) tokens.push({ type: "plain", value: m[4] });
    else if (m[5]) tokens.push({ type: "punct", value: m[5] });
    last = regex.lastIndex;
  }
  if (last < workingLine.length) {
    tokens.push({ type: "plain", value: workingLine.slice(last) });
  }
  if (comment) tokens.push({ type: "comment", value: comment });

  return tokens;
}

const tokenColor: Record<TokenType, string> = {
  keyword: "text-[var(--code-keyword)]",
  string: "text-[var(--code-string)]",
  comment: "text-[var(--code-comment)] italic",
  number: "text-[var(--code-number)]",
  type: "text-[var(--code-type)]",
  function: "text-[var(--code-fn)]",
  punct: "text-[var(--code-punct)]",
  plain: "text-[var(--code-fg)]",
  heading: "text-vermillion-deep font-semibold",
  bold: "text-ink font-semibold",
};

export function HighlightedLine({ line, language }: { line: string; language?: Language }) {
  if (!language || language === "Markdown") {
    // Markdown 简易高亮
    if (/^#{1,6}\s/.test(line)) {
      return <span className={tokenColor.heading}>{line}</span>;
    }
    return <span className={tokenColor.plain}>{line}</span>;
  }
  const tokens = tokenizeLine(line, language);
  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={tokenColor[t.type]}>
          {t.value}
        </span>
      ))}
    </>
  );
}

/** 渲染多行高亮代码，返回每行的 ReactNode */
export function renderCode(code: string, language?: Language): ReactNode[] {
  return code.split("\n").map((line, i) => (
    <Fragment key={i}>
      <HighlightedLine line={line} language={language} />
      {i < code.split("\n").length - 1 && "\n"}
    </Fragment>
  ));
}
