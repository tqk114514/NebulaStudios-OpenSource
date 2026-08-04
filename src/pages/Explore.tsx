import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Search, Star, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { RepoCard } from "@/components/shared/RepoCard";
import { repos } from "@/data/repos";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SortKey = "stars" | "recent";

export default function Explore() {
  // URL 参数作为唯一状态源：q 由 Navbar 搜索框写入，sort 由本页排序按钮写入
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const sort = (searchParams.get("sort") as SortKey) ?? "stars";

  const setQuery = (q: string) => {
    // 只更新 q，保留其余参数（如 sort），避免搜索时清空排序状态
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (q.trim()) next.set("q", q.trim());
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };

  const setSort = (s: SortKey) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (s === "stars") next.delete("sort");
        else next.set("sort", s);
        return next;
      },
      { replace: true },
    );
  };

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
    list = [...list].sort((a, b) =>
      sort === "stars" ? b.stars - a.stars : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    return list;
  }, [query, sort]);

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
              探索
            </h1>            <p className="mt-4 max-w-2xl text-ink-soft">
              浏览所有公开仓库
            </p>
          </motion.div>

          {/* 搜索栏 */}
          <motion.div variants={fadeUp} className="relative max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索仓库 / 用户 / 主题..."
              aria-label="搜索仓库 / 用户 / 主题"
              name="q"
              autoComplete="off"
              className="h-12 w-full rounded-md border border-line-subtle bg-paper-pure pl-11 pr-4 text-sm text-ink placeholder:text-ink-mute outline-hidden transition-colors focus:border-vermillion/40 focus:bg-paper-pure"
            />
          </motion.div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[200px_1fr]">
          {/* 侧栏 */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:h-fit">
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
                  aria-pressed={sort === s.key}
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

          </aside>

          {/* 仓库网格 */}
          <motion.div
            key={`${query}-${sort}`}
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
    </PageShell>
  );
}
