import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

/**
 * Nebula OpenSource 品牌标识 —— 纸白底 + 墨黑折线 N + 朱砂方块
 */
export function BrandMark({ className, size = 28, showWordmark = false }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        className="shrink-0"
        aria-hidden
      >
        {/* 折线 N —— 墨黑，方角 */}
        <path
          d="M14 50 V14 L50 50 V14"
          fill="none"
          stroke="#1A1A18"
          strokeWidth="4"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* 朱砂方块 —— 品牌强调色，落于右上 */}
        <rect x="46" y="10" width="8" height="8" fill="#E2451C" />
      </svg>
      {showWordmark && (
        <span className="font-display text-[1.35rem] leading-none tracking-tightest text-ink">
          Nebula<span className="text-vermillion"> OpenSource</span>
        </span>
      )}
    </span>
  );
}
