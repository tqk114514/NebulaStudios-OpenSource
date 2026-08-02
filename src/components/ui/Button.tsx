import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
}

/**
 * 印刷感按钮 —— 仅 primary 用锻造朱，其余克制
 * 形态偏方正（rounded-md），呼应工程印刷气质
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-vermillion text-paper-pure font-semibold shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_8px_20px_-10px_rgba(226,69,28,0.5)] hover:bg-vermillion-deep hover:shadow-[0_1px_0_0_rgba(255,255,255,0.25)_inset,0_12px_28px_-10px_rgba(226,69,28,0.6)]",
  secondary:
    "bg-paper-pure text-ink border border-line hover:border-line-strong hover:bg-paper-warm",
  ghost: "text-ink-soft hover:text-ink hover:bg-paper-warm",
  outline:
    "border border-vermillion text-vermillion-deep hover:bg-vermillion-tint",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3.5 text-xs gap-1.5 rounded-md",
  md: "h-10 px-5 text-sm gap-2 rounded-md",
  lg: "h-12 px-7 text-[0.95rem] gap-2.5 rounded-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leftIcon, rightIcon, fullWidth, className, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap font-body transition-colors duration-200 select-none disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </motion.button>
  );
});

interface IconButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", size = "md", className, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "inline-flex items-center justify-center transition-colors duration-200",
        variantClasses[variant],
        size === "sm" && "h-8 w-8 rounded-md",
        size === "md" && "h-10 w-10 rounded-md",
        size === "lg" && "h-12 w-12 rounded-md",
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export type { ButtonHTMLAttributes };
