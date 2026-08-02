import type { Variants } from "motion/react";

// 弹簧预设 —— 所有动画统一物理感
export const spring = {
  smooth: { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.8 },
  gentle: { type: "spring" as const, stiffness: 180, damping: 26, mass: 1 },
  snappy: { type: "spring" as const, stiffness: 420, damping: 32, mass: 0.6 },
  bouncy: { type: "spring" as const, stiffness: 320, damping: 18, mass: 0.7 },
};

// 淡入上浮 —— 通用入场
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.smooth,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: spring.gentle },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: spring.smooth },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: spring.smooth },
};

// 容器：错位编排入场
export const staggerContainer = (stagger = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

// 页面切换
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: spring.smooth },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } },
};

// 滚动揭示通用
export const reveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: spring.gentle,
  },
};

// 视口配置
export const viewportOnce = { once: true, margin: "-80px" };
