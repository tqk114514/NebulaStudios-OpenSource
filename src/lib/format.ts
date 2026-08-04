import type { Language } from "@/types";
import { languageColors } from "@/data/repos";

/** 相对时间 —— "3 天前"（基于真实当前时间） */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = (now.getTime() - date.getTime()) / 1000;
  if (diff < 60) return "刚刚";
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} 天前`;
  if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))} 周前`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} 个月前`;
  return `${Math.floor(diff / (86400 * 365))} 年前`;
}

/** 中文长日期 —— "2021年3月8日" */
export function formatDate(dateStr: string): string {
  // date-only 字符串按本地时区解析，避免 new Date("YYYY-MM-DD") 按 UTC 解析导致负时区跨天
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(y, m - 1, d));
}

/** 简短日期 —— "2026-07-15" */
export function shortDate(dateStr: string): string {
  return dateStr.split("T")[0];
}

/** 数字简写 —— 8.4k / 1.2M */
export function compactNumber(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `${(n / 1_000_000).toFixed(1)}M`;
}

export function languageColor(lang: Language | string): string {
  return languageColors[lang] || "#a1a1aa";
}
