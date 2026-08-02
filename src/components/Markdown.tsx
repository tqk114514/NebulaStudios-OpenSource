import { type ReactNode, Fragment } from "react";

interface MarkdownProps {
  content: string;
  className?: string;
}

/** 轻量 Markdown 渲染 —— 标题/列表/代码块/链接/表格/引用/强调 */
export function Markdown({ content, className }: MarkdownProps) {
  const blocks = parseBlocks(content);
  return (
    <div className={`prose-editorial ${className ?? ""}`}>
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  );
}

type Block =
  | { type: "heading"; level: number; inline: Inline[] }
  | { type: "paragraph"; inline: Inline[] }
  | { type: "code"; lang: string; code: string }
  | { type: "list"; ordered: boolean; items: Inline[][] }
  | { type: "quote"; inline: Inline[] }
  | { type: "hr" }
  | { type: "table"; header: Inline[][]; rows: Inline[][][] }
  | { type: "blank" };

type Inline =
  | { kind: "text"; value: string }
  | { kind: "bold"; value: Inline[] }
  | { kind: "italic"; value: Inline[] }
  | { kind: "code"; value: string }
  | { kind: "link"; href: string; value: Inline[] }
  | { kind: "inlineCode"; value: string };

function parseBlocks(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // 代码块
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }

    // 标题
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      blocks.push({ type: "heading", level: h[1].length, inline: parseInline(h[2]) });
      i++;
      continue;
    }

    // 水平线
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // 引用
    if (line.startsWith(">")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].slice(1).trim());
        i++;
      }
      blocks.push({ type: "quote", inline: parseInline(quoteLines.join(" ")) });
      continue;
    }

    // 表格
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: Inline[][][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]).map(parseInline));
        i++;
      }
      blocks.push({ type: "table", header: header.map(parseInline), rows });
      continue;
    }

    // 列表
    if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\.\s+/.test(line);
      const items: Inline[][] = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^\s*([-*+]|\d+\.)\s+/, "");
        items.push(parseInline(itemText));
        i++;
      }
      blocks.push({ type: "list", ordered, items });
      continue;
    }

    // 段落
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !/^#{1,6}\s/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !/^\s*([-*+]|\d+\.)\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", inline: parseInline(para.join(" ")) });
  }
  return blocks;
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

function parseInline(text: string): Inline[] {
  const tokens: Inline[] = [];
  const rest = text;
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(rest)) !== null) {
    if (m.index > last) tokens.push({ kind: "text", value: rest.slice(last, m.index) });
    if (m[2]) tokens.push({ kind: "bold", value: parseInline(m[2]) });
    else if (m[3]) tokens.push({ kind: "italic", value: parseInline(m[3]) });
    else if (m[4]) tokens.push({ kind: "inlineCode", value: m[4] });
    else if (m[5] && m[6]) tokens.push({ kind: "link", href: m[6], value: parseInline(m[5]) });
    last = regex.lastIndex;
  }
  if (last < rest.length) tokens.push({ kind: "text", value: rest.slice(last) });
  return tokens;
}

function renderInline(inlines: Inline[]): ReactNode {
  return inlines.map((t, i) => {
    switch (t.kind) {
      case "bold":
        return <strong key={i} className="font-semibold">{renderInline(t.value)}</strong>;
      case "italic":
        return <em key={i}>{renderInline(t.value)}</em>;
      case "inlineCode":
        return <code key={i}>{t.value}</code>;
      case "link":
        return (
          <a key={i} href={t.href}>
            {renderInline(t.value)}
          </a>
        );
      default:
        return <Fragment key={i}>{t.value}</Fragment>;
    }
  });
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const level = Math.min(Math.max(block.level, 1), 6);
      const id = block.inline
        .map((t) => ("value" in t ? t.value : ""))
        .join("")
        .toLowerCase()
        .replace(/\s+/g, "-");
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      if (level === 2 || level === 3) {
        return <Tag id={id}>{renderInline(block.inline)}</Tag>;
      }
      const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"];
      return (
        <Tag id={id} className={`font-display ${sizes[level - 1]} mt-7 mb-3`}>
          {renderInline(block.inline)}
        </Tag>
      );
    }
    case "paragraph":
      return <p>{renderInline(block.inline)}</p>;
    case "code":
      return (
        <pre className="overflow-x-auto code-scroll">
          <code className="font-mono">{block.code}</code>
        </pre>
      );
    case "list":
      return block.ordered ? (
        <ol className="list-inside list-decimal space-y-1.5 marker:text-vermillion">
          {block.items.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ol>
      ) : (
        <ul className="list-none space-y-1.5">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-vermillion" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return <blockquote>{renderInline(block.inline)}</blockquote>;
    case "hr":
      return <div className="hairline my-6" />;
    case "table":
      return (
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                {block.header.map((h, i) => (
                  <th key={i}>{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
