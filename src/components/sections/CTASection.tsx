import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

/**
 * 印刷感 CTA —— 纸白底 + 朱砂左边框 + 命令行
 * 无粒子，无渐变；朱砂左边框作强调
 */
export function CTASection() {
  return (
    <section className="relative py-32">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="relative flex flex-col items-center gap-6 overflow-hidden rounded-md border border-line-subtle border-l-2 border-l-vermillion bg-paper-pure px-8 py-20 text-center shadow-page md:px-16 md:py-28"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-sm border border-vermillion/30 bg-vermillion-tint px-3.5 py-1.5">
            <Rocket className="h-3.5 w-3.5 text-vermillion" />
            <span className="meta-caps text-vermillion-deep">三分钟自托管</span>
          </motion.div>

          <motion.h2 variants={fadeUp} className="display-tight max-w-3xl text-5xl text-ink md:text-7xl">
            把代码平台
            <br />
            <span className="text-vermillion">部署到自己的服务器</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="max-w-xl text-lg text-ink-soft">
            一行命令拉起，零配置即可使用。你的代码、你的规则、你的服务器。
          </motion.p>

          <motion.div variants={fadeUp} className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard">
              <Magnetic strength={0.25}>
                <Button size="lg" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                  立即开始
                </Button>
              </Magnetic>
            </Link>
            <Link to="/explore">
              <Button variant="secondary" size="lg">
                浏览公开仓库
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="code-surface mt-6 rounded-md border border-line-subtle px-5 py-3 font-mono text-sm">
            <span className="text-ink-mute">$</span>{" "}
            <span className="text-vermillion-deep">docker run</span>
            <span className="text-ink"> -d -p 3000:3000 nebula-opensource/forge-core</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
