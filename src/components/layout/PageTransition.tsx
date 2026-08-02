import type { ReactNode } from "react";
import { motion } from "motion/react";
import { pageTransition } from "@/lib/motion";

/** 页面切换动画包装 —— 配合 AnimatePresence mode=wait */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
