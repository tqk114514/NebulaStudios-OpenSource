import { useState } from "react";
import { useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  GitPullRequest,
  GitCommit,
  Check,
  X,
  Loader,
  Clock,
  Plus,
  Minus,
  MessageSquare,
  CheckCircle2,
  XCircle,
  GitBranch,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { PRStatusBadge } from "@/components/ui/Badge";
import { DiffViewer } from "@/components/code/DiffViewer";
import { getRepo } from "@/data/repos";
import { getUser } from "@/data/users";
import { getPullRequest } from "@/data/pulls";
import { timeAgo } from "@/lib/format";
import { pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CheckStatus } from "@/types";

const checkIcon: Record<CheckStatus, { icon: typeof Check; color: string; bg: string }> = {
  pass: { icon: CheckCircle2, color: "text-forest", bg: "bg-forest-tint" },
  fail: { icon: XCircle, color: "text-vermillion-deep", bg: "bg-vermillion-tint" },
  pending: { icon: Clock, color: "text-ink-mute", bg: "bg-paper-warm" },
  running: { icon: Loader, color: "text-prussian", bg: "bg-prussian-tint" },
};

export default function PullRequest() {
  const { owner, repo: repoName, id } = useParams<{ owner: string; repo: string; id: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;
  const pr = owner && repoName && id ? getPullRequest(`${owner}/${repoName}`, Number(id)) : undefined;
  const [tab, setTab] = useState<"conversation" | "files">("conversation");

  // RepoLayout 已处理仓库不存在的 404
  if (!repo || !pr) return null;

  const author = getUser(pr.author);
  const passed = pr.checks.filter((c) => c.status === "pass").length;
  const failed = pr.checks.filter((c) => c.status === "fail").length;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
    >
      {/* 标题区 */}
      <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="font-display text-3xl text-ink md:text-4xl">
              {pr.title}{" "}
              <span className="font-mono text-xl text-ink-mute">#{pr.number}</span>
            </h1>
            <div className="mt-1.5">
              <PRStatusBadge status={pr.status} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
            <div className="flex items-center gap-2">
              {author && <Avatar username={author.username} name={author.name} hue={author.avatarHue} size={22} />}
              <span>
                <span className="font-medium text-ink">{pr.author}</span> 想合并 {pr.comments.length} 条评论
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-line-subtle bg-paper-warm px-2.5 py-1 font-mono text-xs">
              <GitBranch className="h-3 w-3 text-vermillion" />
              {pr.branch}
              <ArrowLeft className="h-3 w-3 rotate-180 text-ink-mute" />
              <span className="text-ink-mute">{pr.baseBranch}</span>
            </span>
            <span className="font-mono text-xs text-ink-mute">
              {pr.additions} 增 · {pr.deletions} 删 · {pr.files.length} 文件
            </span>
          </div>
        </div>

        {/* 操作栏 */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {pr.status === "open" && (
            <>
              <Button size="sm" leftIcon={<GitPullRequest className="h-4 w-4" />}>
                合并 Pull Request
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<X className="h-4 w-4" />}>
                关闭
              </Button>
            </>
          )}
          {pr.status === "merged" && (
            <Button variant="secondary" size="sm" disabled leftIcon={<Check className="h-4 w-4" />}>
              已合并
            </Button>
          )}
        </div>

        {/* Tab 栏 */}
        <div className="mb-6 border-b border-line-subtle">
          <nav className="flex gap-1">
            {[
              { v: "conversation" as const, label: "对话", icon: MessageSquare, count: pr.comments.length },
              { v: "files" as const, label: "文件变更", icon: GitCommit, count: pr.files.length },
            ].map((t) => (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3 text-sm transition-colors",
                  tab === t.v ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                <span className="rounded-xs bg-paper-warm px-1.5 py-0.5 font-mono text-[0.65rem]">{t.count}</span>
                {tab === t.v && (
                  <motion.span
                    layoutId="pr-tab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-vermillion"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* 主区 */}
          <div className="flex flex-col gap-5">
            {tab === "conversation" ? (
              <>
                {/* 评论时间线 */}
                <div className="flex flex-col gap-4">
                  {pr.comments.map((c, i) => {
                    const user = getUser(c.author);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure"
                      >
                        <div className="flex items-center gap-2 border-b border-line-subtle bg-paper-warm px-4 py-2.5">
                          {user && <Avatar username={user.username} name={user.name} hue={user.avatarHue} size={24} />}
                          <span className="text-sm font-medium text-ink">{c.author}</span>
                          <span className="font-mono text-xs text-ink-mute">评论于 {timeAgo(c.createdAt)}</span>
                          {i === 0 && (
                            <span className="ml-auto inline-flex items-center gap-1 rounded-xs bg-vermillion-tint px-2 py-0.5 font-mono text-[0.65rem] text-vermillion-deep">
                              作者
                            </span>
                          )}
                        </div>
                        <div className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
                          {c.body}
                        </div>
                      </motion.div>
                    );
                  })}
                  {pr.comments.length === 0 && (
                    <div className="rounded-md border border-dashed border-line-subtle py-12 text-center text-ink-mute">
                      暂无评论
                    </div>
                  )}
                </div>

                {/* 评论框 */}
                <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
                  <div className="border-b border-line-subtle px-4 py-2.5 text-sm text-ink-soft">
                    留下评论
                  </div>
                  <textarea
                    placeholder="写下你的评审意见..."
                    className="h-24 w-full resize-none bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-mute outline-none"
                  />
                  <div className="flex justify-end gap-2 border-t border-line-subtle px-4 py-2.5">
                    <Button variant="secondary" size="sm">关闭 Issue</Button>
                    <Button size="sm">评论</Button>
                  </div>
                </div>
              </>
            ) : (
              <DiffViewer files={pr.files} />
            )}
          </div>

          {/* 侧栏 */}
          <aside className="flex flex-col gap-5">
            {/* 检查状态 */}
            <div className="paper-card rounded-md p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-ink">检查</h3>
                <span className="font-mono text-xs text-ink-soft">
                  <span className="text-forest">{passed} 通过</span>
                  {failed > 0 && <span className="text-vermillion-deep"> · {failed} 失败</span>}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {pr.checks.map((c) => {
                  const meta = checkIcon[c.status];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={c.name}
                      className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-paper-warm/60"
                    >
                      <span className={cn("inline-flex h-6 w-6 items-center justify-center rounded-md", meta.bg)}>
                        <Icon className={cn("h-3.5 w-3.5", meta.color, c.status === "running" && "animate-spin")} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs text-ink">{c.name}</p>
                      </div>
                      <span className="font-mono text-[0.7rem] text-ink-mute">{c.duration}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 变更统计 */}
            <div className="paper-card rounded-md p-4">
              <h3 className="mb-3 font-semibold text-ink">变更</h3>
              <div className="flex flex-col gap-2 text-sm">
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <Plus className="h-4 w-4 text-forest" />
                  <span className="text-forest font-mono">{pr.additions}</span> 行新增
                </span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <Minus className="h-4 w-4 text-vermillion-deep" />
                  <span className="text-vermillion-deep font-mono">{pr.deletions}</span> 行删除
                </span>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-vermillion/20">
                  <div
                    className="h-full bg-forest"
                    style={{
                      width: `${(pr.additions / (pr.additions + pr.deletions)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 分支信息 */}
            <div className="paper-card rounded-md p-4">
              <h3 className="mb-3 font-semibold text-ink">分支</h3>
              <div className="flex flex-col gap-2 font-mono text-xs">
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <GitBranch className="h-3.5 w-3.5 text-vermillion" />
                  {pr.branch}
                </span>
                <span className="text-ink-mute">↓ 合并至</span>
                <span className="inline-flex items-center gap-2 text-ink-soft">
                  <GitBranch className="h-3.5 w-3.5 text-ink-mute" />
                  {pr.baseBranch}
                </span>
              </div>
            </div>
          </aside>
        </div>
    </motion.div>
  );
}
