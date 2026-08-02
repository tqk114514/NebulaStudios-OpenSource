import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  username: string;
  name?: string;
  hue?: number;
  size?: number;
  className?: string;
  ring?: boolean;
}

/**
 * 程序化生成头像 —— 印刷油墨感
 * 基于 hue 生成 tint 底 + deep 文字，呼应印刷品质感
 * 色相限制在印刷油墨范围（朱砂/琥珀/森林/普鲁士/紫罗兰），低饱和高对比
 */
export function Avatar({
  username,
  name,
  hue = 14,
  size = 40,
  className,
  ring,
}: AvatarProps) {
  const initials = useMemo(() => {
    const src = name || username;
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.slice(0, 2).toUpperCase();
  }, [username, name]);

  // 将任意 hue 量化到印刷油墨色相档位，避免霓虹色
  const inkHue = useMemo(() => {
    const palette = [14, 35, 120, 215, 270]; // 朱砂 / 琥珀 / 森林 / 普鲁士 / 紫罗兰
    const nearest = palette.reduce((acc, p) =>
      Math.abs(((hue - p + 540) % 360) - 180) < Math.abs(((hue - acc + 540) % 360) - 180) ? p : acc,
    );
    return nearest;
  }, [hue]);

  // tint 底（浅油墨）+ deep 文字（深油墨）
  const bg = `hsl(${inkHue} 42% 90%)`;
  const fg = `hsl(${inkHue} 55% 28%)`;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-mono font-semibold select-none border border-line-subtle",
        ring && "ring-2 ring-vermillion/40 ring-offset-2 ring-offset-paper",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
      }}
      aria-label={name || username}
    >
      {initials}
    </span>
  );
}
