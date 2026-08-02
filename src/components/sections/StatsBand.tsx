import { motion } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  format?: (n: number) => string;
}

const stats: Stat[] = [
  { value: 8421, label: "GitHub Stars", format: (n) => Math.round(n).toLocaleString() },
  { value: 612, label: "Forks" },
  { value: 3, suffix: "×", label: "快于 Gitea" },
  { value: 7.8, suffix: "MB", label: "二进制体积", format: (n) => n.toFixed(1) },
];

/**
 * 数据统计 —— 纸白卡片 + Fraunces 数字 + 朱砂单位
 * 无光晕，无毛玻璃
 */
export function StatsBand() {
  return (
    <section className="relative py-20">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="relative overflow-hidden rounded-md border border-line-subtle bg-paper-pure px-8 py-14 shadow-card md:px-14"
        >
          {/* 极淡纸格背景 */}
          <div className="pointer-events-none absolute inset-0 bg-paper-grid opacity-40" />

          <div className="relative grid gap-10 md:grid-cols-4">
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="flex flex-col gap-1">
                <div className="font-display text-5xl text-ink md:text-6xl">
                  <CountUp
                    to={s.value}
                    format={s.format}
                    duration={1.8}
                  />
                  <span className="text-vermillion">{s.suffix}</span>
                </div>
                <div className="meta-caps text-ink-mute">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
