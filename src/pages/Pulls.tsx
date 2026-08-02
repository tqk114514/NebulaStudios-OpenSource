import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import {
  GitPullRequest,
  Check,
  GitBranch,
  Plus,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { getRepo } from "@/data/repos";
import { getUser } from "@/data/users";
import { getPullsForRepo } from "@/data/pulls";
import { timeAgo } from "@/lib/format";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { PRStatus } from "@/types";

type Filter = PRStatus | "all";

const statusStyle: Record<PRStatus, { color: string; icon: typeof GitPullRequest }> = {
  open: { color: "text-vermillion", icon: GitPullRequest },
  closed: { color: "text-vermillion-deep", icon: GitPullRequest },
  merged: { color: "text-prussian", icon: Check },
  draft: { color: "text-ink-mute", icon: GitPullRequest },
};

export default function Pulls() {
  const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;
  const allPRs = useMemo(
    () => (owner && repoName ? getPullsForRepo(`${owner}/${repoName}`) : []),
    [owner, repoName],
  );

  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return allPRs;
    return allPRs.filter((p) => p.status === filter);
  }, [allPRs, filter]);

  // RepoLayout 已处理仓库不存在的 404
  if (!repo) return null;

  const openCount = allPRs.filter((p) => p.status === "open").length;
  const closedCount = allPRs.filter((p) => p.status !== "open").length;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
    >
      {/* 计数 + 新建 */}
      <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-ink-soft">
          共 {allPRs.length} 个 Pull Request
        </span>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          新建 Pull Request
        </Button>
      </div>

      {/* 筛选栏 */}
      <div className="mb-5 flex items-center gap-1 rounded-md border border-line-subtle bg-paper-warm p-1">
          {([
            { v: "open" as const, label: `Open · ${openCount}` },
            { v: "closed" as const, label: `Closed · ${closedCount}` },
            { v: "all" as const, label: `全部 · ${allPRs.length}` },
          ]).map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                filter === f.v ? "bg-paper-pure text-ink shadow-card" : "text-ink-soft hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* PR 列表 */}
        <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-ink-mute">没有匹配的 Pull Request</div>
          ) : (
            <div className="divide-y divide-line-subtle">
              {filtered.map((pr) => {
                const author = getUser(pr.author);
                const style = statusStyle[pr.status];
                const Icon = style.icon;
                return (
                  <motion.div
                    key={pr.id}
                    whileHover={{ x: 2 }}
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-paper-warm"
                  >
                    <Icon className={cn("mt-1 h-4 w-4 shrink-0", style.color)} />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/${repo.owner}/${repo.name}/pulls/${pr.number}`}
                        className="font-semibold text-ink hover:text-vermillion"
                      >
                        {pr.title}
                      </Link>
                      <p className="mt-1 font-mono text-xs text-ink-mute">
                        #{pr.number} · 由 {pr.author} 于 {timeAgo(pr.createdAt)} 开启
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-ink-mute">
                        <span className="inline-flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          {pr.branch}
                          <span className="text-ink-faint">→</span>
                          {pr.baseBranch}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono">
                          <span className="text-forest">+{pr.additions}</span>
                          <span className="text-vermillion-deep">−{pr.deletions}</span>
                        </span>
                      </div>
                    </div>
                    {author && (
                      <Avatar username={author.username} name={author.name} hue={author.avatarHue} size={22} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
    </motion.div>
  );
}
