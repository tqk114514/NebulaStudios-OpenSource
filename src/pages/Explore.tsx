import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, SlidersHorizontal, Flame, Star, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { RepoCard } from "@/components/shared/RepoCard";
import { LanguageDot } from "@/components/ui/LanguageDot";
import { repos } from "@/data/repos";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Language } from "@/types";

type SortKey = "stars" | "recent";

const languages: (Language | "All")[] = ["All", "Zig", "Rust", "Go", "TypeScript", "C"];

export default function Explore() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState<Language | "All">("All");
  const [sort, setSort] = useState<SortKey>("stars");

  const filtered = useMemo(() => {
    let list = repos.filter((r) => !r.isPrivate);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q)),
      );
    }
    if (lang !== "All") list = list.filter((r) => r.language === lang);
    list = [...list].sort((a, b) =>
      sort === "stars" ? b.stars - a.stars : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return list;
  }, [query, lang, sort]);

  return (
    <PageShell>
      <div className="container py-12 md:py-16">
        {/* 头部 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.08)}
          className="mb-10 flex flex-col gap-6"
        >
          <motion.div variants={fadeUp}>
            <span className="meta-caps text-vermillion">
              <span className="section-mark mr-1.5 not-italic">§ 01</span>
              Explore
            </span>
            <h1 className="display-tight mt-3 text-5xl text-ink md:text-6xl">
              探索 <span className="text-vermillion">平台</span>
            </h1>
            <p className="mt-4 max-w-2xl text-ink-soft">
              浏览社区中燃烧的公开仓库。{repos.length} 个项目，由独立开发者与极客团队自托管。
            </p>
          </motion.div>

          {/* 搜索栏 */}
          <motion.div variants={fadeUp} className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索仓库名、描述、主题..."
              className="h-12 w-full rounded-md border border-line-subtle bg-paper-pure pl-11 pr-4 text-sm text-ink placeholder:text-ink-mute outline-none transition-colors focus:border-vermillion/40 focus:bg-paper-pure"
            />
          </motion.div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          {/* 侧栏 */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
            <div className="flex flex-col gap-2">
              <h3 className="mb-2 flex items-center gap-1.5 meta-caps text-ink-mute">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                语言
              </h3>
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                    lang === l
                      ? "bg-vermillion-tint text-ink"
                      : "text-ink-soft hover:bg-paper-warm hover:text-ink",
                  )}
                >
                  {l !== "All" && <LanguageDot language={l as Language} size={9} />}
                  {l === "All" && <span className="h-2 w-2 rounded-full bg-ink-mute" />}
                  {l === "All" ? "全部" : l}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="mb-2 flex items-center gap-1.5 meta-caps text-ink-mute">
                排序
              </h3>
              {[
                { key: "stars" as const, label: "Stars 最多", icon: Star },
                { key: "recent" as const, label: "最近更新", icon: Clock },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                    sort === s.key
                      ? "bg-vermillion-tint text-ink"
                      : "text-ink-soft hover:bg-paper-warm hover:text-ink",
                  )}
                >
                  <s.icon className="h-3.5 w-3.5" />
                  {s.label}
                </button>
              ))}
            </div>

            <div className="rounded-md border border-line-subtle bg-paper-pure p-4 shadow-card">
              <Flame className="h-4 w-4 text-vermillion-deep" />
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                本周最热：<span className="text-ink">aurora/forge-core</span>，新增 412 stars。
              </p>
            </div>
          </aside>

          {/* 仓库网格 */}
          <motion.div
            key={`${query}-${lang}-${sort}`}
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.05)}
            className="grid gap-4 md:grid-cols-2"
          >
            {filtered.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-subtle py-20 text-ink-mute">
                <Search className="h-6 w-6" />
                <p>没有匹配的仓库</p>
              </div>
            ) : (
              filtered.map((repo, i) => <RepoCard key={`${repo.owner}/${repo.name}`} repo={repo} index={i} />)
            )}
          </motion.div>
        </div>
      </div>
      <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} />
    </PageShell>
  );
}
