import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Plus,
  Home,
  FolderGit2,
  Bell,
  Search,
  Upload,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { RepoCard } from "@/components/shared/RepoCard";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { currentUser } from "@/data/users";
import { repos } from "@/data/repos";
import { getFeedActivities } from "@/data/activity";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

// 单用户自托管场景：只保留有落点的导航项（其余无对应页面，已移除）
const navItems = [
  { icon: Home, label: "概览", to: "/dashboard" },
  { icon: FolderGit2, label: "仓库", to: `/${currentUser.username}`, count: currentUser.repos },
];

export default function Dashboard() {
  const myRepos = repos.filter((r) => r.owner === currentUser.username);
  const feed = getFeedActivities();

  // 我的仓库搜索（本地过滤）
  const [query, setQuery] = useState("");
  const filteredRepos = useMemo(() => {
    if (!query.trim()) return myRepos;
    const q = query.toLowerCase();
    return myRepos.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.language.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q)),
    );
  }, [myRepos, query]);

  return (
    <PageShell showFooter={false}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.05)}
        className="container py-8 md:py-10"
      >
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* 侧栏 */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:h-fit">
            {/* 用户卡 */}
            <motion.div variants={fadeUp} className="paper-card rounded-md p-5">
              <div className="flex items-center gap-3">
                <Avatar
                  username={currentUser.username}
                  name={currentUser.name}
                  hue={currentUser.avatarHue}
                  size={48}
                />
                <div className="min-w-0">
                  <Link to={`/${currentUser.username}`} className="block truncate font-semibold text-ink hover:text-vermillion">
                    {currentUser.name}
                  </Link>
                  <p className="truncate font-mono text-xs text-ink-mute">@{currentUser.username}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-ink-soft">
                <span>
                  <span className="font-semibold text-ink">{currentUser.followers}</span> 关注者
                </span>
                <span>
                  <span className="font-semibold text-ink">{currentUser.following}</span> 关注中
                </span>
              </div>
            </motion.div>

            {/* 导航 */}
            <motion.nav variants={fadeUp} className="flex flex-col gap-1 rounded-md border border-line-subtle bg-paper-pure p-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                    item.to === "/dashboard"
                      ? "bg-vermillion-tint text-ink"
                      : "text-ink-soft hover:bg-paper-warm hover:text-ink",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="font-mono text-xs text-ink-mute">{item.count}</span>
                  )}
                </Link>
              ))}
            </motion.nav>

            <motion.div variants={fadeUp}>
              <Button fullWidth variant="secondary" size="sm" leftIcon={<Bell className="h-4 w-4" />}>
                通知 · 3
              </Button>
            </motion.div>
          </aside>

          {/* 主体 */}
          <div className="flex flex-col gap-8">
            {/* 顶部欢迎 + 搜索 */}
            <motion.div variants={fadeUp} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl text-ink">
                    下午好，<span className="text-vermillion">{currentUser.name.split(" ")[0]}</span>
                  </h1>
                  <p className="mt-1 text-sm text-ink-soft">
                    你有 3 个未读通知，2 个 Issue 等待处理。
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" leftIcon={<Upload className="h-4 w-4" />}>
                    导入仓库
                  </Button>
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    新建仓库
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="在你的仓库中搜索..."
                  className="h-11 w-full rounded-md border border-line-subtle bg-paper-pure pl-10 pr-4 text-sm text-ink placeholder:text-ink-mute outline-hidden focus:border-vermillion/40"
                />
              </div>
            </motion.div>

            {/* 我的仓库 */}
            <motion.section variants={fadeUp}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="display-tight text-xl text-ink">
                  <span className="section-mark mr-2 not-italic">§</span>我的仓库
                </h2>
                <Link to="/explore" className="text-sm text-prussian link-underline">
                  查看全部 →
                </Link>
              </div>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.05)}
                className="grid gap-4 md:grid-cols-2"
              >
                {filteredRepos.map((repo, i) => (
                  <RepoCard key={`${repo.owner}/${repo.name}`} repo={repo} index={i} showOwner={false} />
                ))}
                {filteredRepos.length === 0 && (
                  <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line-strong bg-paper-warm/50 text-ink-mute md:col-span-2">
                    <Search className="h-6 w-6" />
                    <p className="text-sm">没有匹配的仓库</p>
                  </div>
                )}
              </motion.div>
            </motion.section>

            {/* 关注动态 */}
            <motion.section variants={fadeUp}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="display-tight text-xl text-ink">
                  <span className="section-mark mr-2 not-italic">§</span>关注动态
                </h2>
                <span className="font-mono text-xs text-ink-mute">最近 7 天</span>
              </div>
              <div className="rounded-md border border-line-subtle bg-paper-pure p-2">
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer(0.04)}
                  className="flex flex-col"
                >
                  {feed.map((a) => (
                    <ActivityItem key={a.id} activity={a} />
                  ))}
                </motion.div>
              </div>
            </motion.section>
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}
