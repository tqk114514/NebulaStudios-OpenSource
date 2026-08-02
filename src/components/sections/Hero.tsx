import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Terminal } from "lucide-react";
import { TypingTerminal } from "@/components/visual/TypingTerminal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * 印刷感 Hero —— 无粒子，纸格背景 + 朱砂光晕
 * 标题用 Fraunces 衬线，关键词用朱砂强调
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">
      {/* 纸格背景 + 渐隐 */}
      <div className="absolute inset-0 bg-paper-grid bg-paper-grid-fade opacity-70" />
      {/* 顶部朱砂光晕 —— 极淡，仅暗示 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px]"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(226,69,28,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* 左：文案 */}
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-7"
          >
            {/* —— 艺术字品牌名：层叠套色，印刷套色之美 —— */}
            <motion.div variants={fadeUp} className="relative select-none" aria-hidden>
              <div className="relative inline-block">
                {/* 朱砂套色幻影 —— 偏移叠于墨黑主体之下，如星云的色差残影 */}
                <span
                  aria-hidden
                  className="absolute left-0 top-0 block font-display italic leading-[0.82] text-vermillion text-[7rem] md:text-[12rem]"
                  style={{
                    fontVariationSettings: "'opsz' 144, 'wght' 500",
                    letterSpacing: "-0.045em",
                    transform: "translate(10px, 8px)",
                    opacity: "0.22",
                  }}
                >
                  Nebula
                </span>
                {/* 墨黑主体 —— Fraunces opsz 144，极端粗细对比的雕塑感衬线 */}
                <span
                  className="relative block font-display italic leading-[0.82] text-ink text-[7rem] md:text-[12rem]"
                  style={{
                    fontVariationSettings: "'opsz' 144, 'wght' 500",
                    letterSpacing: "-0.045em",
                  }}
                >
                  Nebula
                </span>
              </div>
              {/* OpenSource —— 发丝线 + 宽距朱砂细字，编辑感收束 */}
              <div className="mt-4 flex items-center gap-5">
                <span className="h-px w-16 bg-vermillion/50" />
                <span
                  className="font-display italic text-vermillion text-[1.6rem] md:text-[2.6rem]"
                  style={{
                    fontVariationSettings: "'opsz' 9, 'wght' 400",
                    letterSpacing: "0.42em",
                  }}
                >
                  OpenSource
                </span>
              </div>
            </motion.div>

            {/* 标题 —— Fraunces 衬线，分两层 */}
            <h1 className="display-tight text-[3.5rem] text-ink md:text-[5.5rem]">
              <span className="block font-display-italic text-ink-soft">
                一个属于你的
              </span>
              <span className="block">
                自托管{" "}
                <span className="text-vermillion">代码平台</span>
              </span>
            </h1>

            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-ink-soft">
              Nebula OpenSource 是介于 GitHub 与 Gitea 之间的自托管代码平台。
              <span className="text-ink"> 私有可控、极致简约</span>，动效丝滑得令人过目难忘——
              把你的代码平台，部署在自己的服务器上。
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Link to="/explore">
                <Magnetic strength={0.25}>
                  <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    浏览仓库
                  </Button>
                </Magnetic>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" leftIcon={<Terminal className="h-4 w-4" />}>
                  自托管指南
                </Button>
              </Link>
            </motion.div>

            {/* 数据条 —— 纸白卡片，发丝线分隔 */}
            <motion.div variants={fadeUp} className="mt-4 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-md border border-line-subtle bg-line-subtle">
              {[
                { v: "8.4k", l: "Stars" },
                { v: "3×", l: "快于 Gitea" },
                { v: "12MB", l: "内存峰值" },
              ].map((s) => (
                <div key={s.l} className="bg-paper-pure px-4 py-3">
                  <div className="font-display text-2xl text-ink">{s.v}</div>
                  <div className="meta-caps text-ink-mute">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* 右：打字终端 */}
          <div className="relative">
            <TypingTerminal />
          </div>
        </div>

        {/* 向下指示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-ink-mute"
          >
            <span className="meta-caps">向下探索</span>
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
