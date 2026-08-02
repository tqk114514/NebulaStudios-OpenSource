import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

/** 标准页面外壳 —— 内容 + 页脚（Navbar 已提升至 App 顶层，不随路由切换重新挂载） */
export function PageShell({
  children,
  showFooter = true,
  className,
}: PageShellProps) {
  return (
    <div className="relative min-h-screen">
      <main className={cn("relative pt-16", className)}>{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
