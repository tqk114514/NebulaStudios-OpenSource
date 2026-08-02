import { Link } from "react-router-dom";
import { Github, BookOpen, MessageCircle } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";

const footerLinks = [
  {
    title: "产品",
    links: [
      { label: "特性", to: "/" },
      { label: "探索", to: "/explore" },
      { label: "仪表盘", to: "/dashboard" },
      { label: "自托管指南", to: "/" },
    ],
  },
  {
    title: "资源",
    links: [
      { label: "文档", to: "/" },
      { label: "API 参考", to: "/" },
      { label: "更新日志", to: "/" },
      { label: "状态", to: "/" },
    ],
  },
  {
    title: "社区",
    links: [
      { label: "GitHub", to: "/" },
      { label: "讨论区", to: "/" },
      { label: "贡献指南", to: "/" },
      { label: "行为准则", to: "/" },
    ],
  },
];

/**
 * 印刷感页脚 —— 顶部发丝线 + 版心 + colophon 版权页
 * 含排版信息（字体/工具），呼应印刷品版权页传统
 */
export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-4">
          <BrandMark showWordmark size={32} />
          <p className="max-w-xs font-display-italic text-[1.05rem] leading-relaxed text-ink-soft">
            自托管的轻量级代码平台。私有可控、极致简约、可读性第一。
          </p>
          <div className="flex items-center gap-2 pt-2">
            <a
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-subtle text-ink-soft transition-colors hover:border-vermillion hover:text-vermillion"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-subtle text-ink-soft transition-colors hover:border-vermillion hover:text-vermillion"
              aria-label="文档"
            >
              <BookOpen className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line-subtle text-ink-soft transition-colors hover:border-vermillion hover:text-vermillion"
              aria-label="讨论"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        {footerLinks.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h4 className="meta-caps text-ink-mute">
              {group.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-soft transition-colors hover:text-vermillion-deep"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Colophon —— 印刷品版权页传统 */}
      <div className="border-t border-line-subtle">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-mute md:flex-row md:px-8">
          <p className="font-mono">© 2026 Nebula OpenSource · MIT License</p>
          <p className="inline-flex items-center gap-2">
            <span className="inline-block h-2 w-2 bg-vermillion" aria-hidden />
            <span className="font-display-italic">
              Set in Fraunces &amp; IBM Plex Sans · 用 Zig 与 React 构建
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
