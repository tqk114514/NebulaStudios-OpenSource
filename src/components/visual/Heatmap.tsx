import { useMemo, useState } from "react";
import { motion } from "motion/react";

interface HeatmapProps {
  username: string;
  className?: string;
}

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const days = ["一", "三", "五"];

// 伪随机但稳定的提交数据
function generateData(seed: string) {
  const weeks: { count: number; date: string }[][] = [];
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };

  const today = new Date("2026-07-17");
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  for (let w = 0; w < 53; w++) {
    const week: { count: number; date: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) {
        week.push({ count: -1, date: "" });
        continue;
      }
      const r = rand();
      let count = 0;
      if (r > 0.55) count = Math.floor(rand() * 4) + 1;
      if (r > 0.92) count = Math.floor(rand() * 8) + 5;
      if (d >= 5 && r < 0.7) count = 0;
      // 本地日期（避免 toISOString 的 UTC 跨天错位）
      const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      week.push({ count, date: ds });
    }
    weeks.push(week);
  }
  return weeks;
}

/** 朱砂单色阶 —— 呼应印刷油墨 */
function levelColor(count: number): string {
  if (count < 0) return "transparent";
  if (count === 0) return "#EFEAE0";
  if (count <= 2) return "#FAE6DF";
  if (count <= 4) return "#F2C3B5";
  if (count <= 7) return "#E2451C";
  return "#B8350F";
}

/**
 * 贡献热力图 —— 朱砂单色阶
 * 方角格子呼应印刷感，0 贡献用纸色（非暗色透明）
 */
export function Heatmap({ username, className }: HeatmapProps) {
  const data = useMemo(() => generateData(username), [username]);
  const [hover, setHover] = useState<{ count: number; date: string } | null>(null);

  const total = useMemo(
    () => data.flat().reduce((acc, d) => acc + Math.max(0, d.count), 0),
    [data],
  );

  return (
    <div className={className}>
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <span className="font-display text-2xl text-ink">{total.toLocaleString()}</span>
          <span className="ml-2 text-sm text-ink-soft">次贡献在过去一年</span>
        </div>
        {hover && hover.count >= 0 && (
          <motion.span
            key={hover.date}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-ink-soft"
          >
            {hover.count} 次提交 · {hover.date}
          </motion.span>
        )}
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="inline-flex flex-col gap-2">
          {/* 月份标签 */}
          <div className="flex gap-[3px] pl-7 font-mono text-[0.65rem] text-ink-mute">
            {months.map((m, i) => (
              <span key={i} className="w-[42px]">{m}</span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {/* 星期标签 */}
            <div className="flex flex-col justify-between py-[1px] pr-1 font-mono text-[0.6rem] text-ink-mute">
              {days.map((d, i) => (
                <span key={i} className="h-[12px] leading-[12px]">{d}</span>
              ))}
            </div>

            {/* 格子网格 —— 方角，发丝线边框 */}
            {data.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((cell, di) => (
                  <motion.div
                    key={di}
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: wi * 0.012 + di * 0.004,
                    }}
                    onMouseEnter={() => setHover(cell)}
                    onMouseLeave={() => setHover(null)}
                    title={cell.count < 0 ? undefined : `${cell.date}：${cell.count} 次提交`}
                    className="h-[12px] w-[12px] rounded-xs border border-line-subtle transition-transform hover:scale-125"
                    style={{ backgroundColor: levelColor(cell.count) }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[0.65rem] text-ink-mute">
            <span>少</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span
                key={l}
                className="h-[11px] w-[11px] rounded-xs border border-line-subtle"
                style={{ backgroundColor: levelColor(l === 0 ? 0 : l * 3) }}
              />
            ))}
            <span>多</span>
          </div>
        </div>
      </div>
    </div>
  );
}
