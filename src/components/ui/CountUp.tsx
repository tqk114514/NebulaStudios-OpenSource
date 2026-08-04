import { useEffect, useRef, useState } from "react";
import { useInView, animate, useReducedMotion } from "motion/react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
}

/** 数字滚动计数动画 —— 滚动至视口时触发 */
export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  format = (n) => Math.round(n).toLocaleString(),
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(from);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, to, from, duration, reduceMotion]);

  // prefers-reduced-motion：派生值直接显示最终结果，不经过计数动画
  const shown = reduceMotion ? to : display;

  return (
    <span ref={ref} className={className}>
      {format(shown)}
    </span>
  );
}
