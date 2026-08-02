import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glow?: boolean;
  children?: ReactNode;
}

/**
 * 纸白卡片 —— 纯白底 + 发丝线边框 + 极轻阴影
 * 无毛玻璃，无渐变，呼应印刷品质感
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, hover, glow, children, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative rounded-md border border-line-subtle bg-paper-pure",
        hover &&
          "transition-colors duration-300 hover:border-line-strong",
        glow && "shadow-float",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

interface SectionTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  mark?: string;
}

/**
 * 章节标题 —— 印刷感排版
 * eyebrow 用大写小字 + 字距，title 用 Fraunces 衬线收紧字距
 * 可选 mark 显示章节编号 §
 */
export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  mark,
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <span className="meta-caps text-vermillion">
          {mark && <span className="section-mark mr-1.5 not-italic">{mark}</span>}
          {eyebrow}
        </span>
      )}
      <h2 className="display-tight text-4xl text-ink md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className={cn("text-ink-soft text-base md:text-lg", align === "center" && "max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
