import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { IssueLabel, PRStatus, IssueStatus } from "@/types";
import { labelMeta } from "@/data/issues";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  color?: string;
  bg?: string;
  variant?: "solid" | "soft" | "outline";
}

/**
 * 印刷感徽章 —— 方角、发丝线、油墨色
 * soft: tint 底 + deep 文字
 * solid: deep 底 + paper 文字
 * outline: 透明底 + line-strong 边框 + ink 文字
 */
export function Badge({
  children,
  color,
  bg,
  variant = "soft",
  className,
  style,
  ...props
}: BadgeProps) {
  const variantClass =
    variant === "outline"
      ? "border border-line-strong bg-transparent"
      : "border border-transparent";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-[0.7rem] font-medium leading-5",
        variantClass,
        className,
      )}
      style={{
        color: variant === "solid" ? "#FFFFFF" : variant === "outline" ? undefined : color,
        backgroundColor: variant === "outline" ? undefined : variant === "solid" ? color : bg,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
}

/** Issue 标签徽章 */
export function LabelBadge({ label }: { label: IssueLabel }) {
  const meta = labelMeta[label];
  return (
    <Badge color={meta.color} bg={meta.bg}>
      {meta.name}
    </Badge>
  );
}

const prStatusMeta: Record<PRStatus, { label: string; color: string; bg: string; dot: string }> = {
  open: { label: "Open", color: "#2E6B2E", bg: "#E6EFE3", dot: "#2E6B2E" },
  merged: { label: "Merged", color: "#6B3FA0", bg: "#EDE6F5", dot: "#6B3FA0" },
  closed: { label: "Closed", color: "#B8350F", bg: "#FAE6DF", dot: "#E2451C" },
  draft: { label: "Draft", color: "#5C5A52", bg: "#EFEAE0", dot: "#9A988F" },
};

export function PRStatusBadge({ status }: { status: PRStatus }) {
  const meta = prStatusMeta[status];
  return (
    <Badge color={meta.color} bg={meta.bg}>
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </Badge>
  );
}

const issueStatusMeta: Record<IssueStatus, { label: string; color: string; bg: string; dot: string }> = {
  open: { label: "Open", color: "#2E6B2E", bg: "#E6EFE3", dot: "#2E6B2E" },
  closed: { label: "Closed", color: "#B8350F", bg: "#FAE6DF", dot: "#E2451C" },
};

export function IssueStatusBadge({ status }: { status: IssueStatus }) {
  const meta = issueStatusMeta[status];
  return (
    <Badge color={meta.color} bg={meta.bg}>
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </Badge>
  );
}
