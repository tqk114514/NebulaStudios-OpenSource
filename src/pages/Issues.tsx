import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  CircleDot,
  CheckCircle2,
  Search,
  Plus,
  MessageCircle,
  LayoutList,
  Columns3,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LabelBadge } from "@/components/ui/Badge";
import { getRepo } from "@/data/repos";
import { getUser } from "@/data/users";
import { getIssuesForRepo } from "@/data/issues";
import { timeAgo } from "@/lib/format";
import { staggerContainer, fadeUp, pageTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/types";

type View = "list" | "board";
type Filter = IssueStatus | "all";

export default function Issues() {
  const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;
  const allIssues = useMemo(
    () => (owner && repoName ? getIssuesForRepo(`${owner}/${repoName}`) : []),
    [owner, repoName],
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("list");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = allIssues;
    if (filter !== "all") list = list.filter((i) => i.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((i) => i.title.toLowerCase().includes(q));
    }
    return list;
  }, [allIssues, filter, query]);

  // RepoLayout 已处理仓库不存在的 404
  if (!repo) return null;

  const openCount = allIssues.filter((i) => i.status === "open").length;
  const closedCount = allIssues.filter((i) => i.status === "closed").length;

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
    >
      <div className="mt-6 mb-5 flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm text-ink-soft">
          共 {allIssues.length} 个 Issue
        </span>
        <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          新建 Issue
        </Button>
      </div>

      {/* 工具栏 */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-md border border-line-subtle bg-paper-warm p-1">
            {(["open", "closed", "all"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  filter === f ? "bg-paper-pure text-ink shadow-card" : "text-ink-soft hover:text-ink",
                )}
              >
                {f === "open" ? `Open · ${openCount}` : f === "closed" ? `Closed · ${closedCount}` : `全部 · ${allIssues.length}`}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="筛选 issue..."
              className="h-9 w-full rounded-md border border-line-subtle bg-paper-pure pl-9 pr-3 text-sm text-ink placeholder:text-ink-mute outline-none focus:border-vermillion/40"
            />
          </div>

          <div className="ml-auto flex items-center gap-1 rounded-md border border-line-subtle bg-paper-warm p-1">
            {([
              { v: "list" as const, icon: LayoutList },
              { v: "board" as const, icon: Columns3 },
            ]).map((t) => (
              <button
                key={t.v}
                onClick={() => setView(t.v)}
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  view === t.v ? "bg-paper-pure text-ink shadow-card" : "text-ink-mute hover:text-ink",
                )}
                aria-label={t.v === "list" ? "列表视图" : "看板视图"}
              >
                <t.icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>

        {/* 内容 */}
        <AnimatePresence mode="wait">
          {view === "list" ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={staggerContainer(0.04)}
              className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure"
            >
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-ink-mute">没有匹配的 Issue</div>
              ) : (
                <div className="divide-y divide-line-subtle">
                  {filtered.map((issue) => {
                    const assignee = issue.assignee ? getUser(issue.assignee) : undefined;
                    return (
                      <motion.div
                        key={issue.id}
                        variants={fadeUp}
                        whileHover={{ x: 2 }}
                        className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-paper-warm"
                      >
                        {issue.status === "open" ? (
                          <CircleDot className="mt-1 h-4 w-4 shrink-0 text-vermillion" />
                        ) : (
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-forest" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-ink hover:text-vermillion">
                              {issue.title}
                            </span>
                            {issue.labels.map((l) => (
                              <LabelBadge key={l} label={l} />
                            ))}
                          </div>
                          <p className="mt-1 font-mono text-xs text-ink-mute">
                            #{issue.number} · 由 {issue.author} 于 {timeAgo(issue.createdAt)} 开启
                          </p>
                        </div>
                        {assignee && (
                          <Avatar username={assignee.username} name={assignee.name} hue={assignee.avatarHue} size={22} />
                        )}
                        {issue.comments.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {issue.comments.length}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <BoardView
              key="board"
              issues={filtered}
            />
          )}
        </AnimatePresence>
    </motion.div>
  );
}

function BoardView({ issues }: { issues: ReturnType<typeof getIssuesForRepo> }) {
  const open = issues.filter((i) => i.status === "open");
  const closed = issues.filter((i) => i.status === "closed");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="grid gap-4 md:grid-cols-2"
    >
      {[
        { title: "Open", list: open, color: "text-vermillion" },
        { title: "Closed", list: closed, color: "text-forest" },
      ].map((col) => (
        <div key={col.title} className="rounded-md border border-line-subtle bg-paper-warm p-3">
          <div className="mb-3 flex items-center gap-2 px-2">
            <span className={col.color}>●</span>
            <h3 className="font-display text-base text-ink">{col.title}</h3>
            <span className="font-mono text-xs text-ink-mute">{col.list.length}</span>
          </div>
          <div className="flex flex-col gap-2">
            {col.list.map((issue) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-md border border-line-subtle bg-paper-pure p-3 transition-colors hover:border-line-strong"
              >
                <p className="text-sm text-ink">{issue.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {issue.labels.slice(0, 2).map((l) => (
                    <LabelBadge key={l} label={l} />
                  ))}
                  <span className="ml-auto font-mono text-[0.7rem] text-ink-mute">
                    #{issue.number}
                  </span>
                </div>
              </motion.div>
            ))}
            {col.list.length === 0 && (
              <div className="py-8 text-center text-xs text-ink-mute">空</div>
            )}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
