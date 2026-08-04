import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/sections/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { StatsBand } from "@/components/sections/StatsBand";
import { CTASection } from "@/components/sections/CTASection";
import { Footer } from "@/components/layout/Footer";
import { SectionTitle } from "@/components/ui/Card";
import { LanguageDot } from "@/components/ui/LanguageDot";
import { repos } from "@/data/repos";
import { compactNumber } from "@/lib/format";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

export default function Landing() {
  const trending = [...repos].sort((a, b) => b.stars - a.stars).slice(0, 5);

  return (
    <main id="main">
      <Hero />

      <FeatureGrid />

      {/* 趋势仓库展示 */}
      <section className="relative py-24">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerContainer(0.06)}
          >
            <motion.div variants={fadeUp} className="mb-10 flex items-end justify-between">
              <SectionTitle
                eyebrow="社区趋势"
                mark="§ 02"
                title={
                  <span className="font-display-italic text-ink-soft">
                    平台中燃烧的项目
                  </span>
                }
              />
              <Link
                to="/explore"
                className="group inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-vermillion"
              >
                查看全部
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <div className="flex flex-col divide-y divide-line-subtle overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
              {trending.map((repo, i) => (
                <motion.div
                  key={`${repo.owner}/${repo.name}`}
                  variants={fadeUp}
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <Link
                    to={`/${repo.owner}/${repo.name}`}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-paper-warm"
                  >
                    <span className="w-8 font-display text-2xl text-ink-faint">
                      0{i + 1}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="font-medium text-ink">
                        {repo.owner}/<span className="text-vermillion">{repo.name}</span>
                      </span>
                      <span className="line-clamp-1 text-sm text-ink-soft">
                        {repo.description}
                      </span>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                      <LanguageDot language={repo.language} size={10} />
                      <span className="text-xs text-ink-mute">{repo.language}</span>
                    </div>
                    <div className="flex w-20 justify-end font-mono text-sm text-ink-soft">
                      ★ {compactNumber(repo.stars)}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <StatsBand />
      <CTASection />
      <Footer />
    </main>
  );
}
