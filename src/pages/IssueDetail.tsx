import { useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CircleDot,
  CheckCircle2,
  MessageSquare,
  User,
  Tag,
  CalendarDays,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IssueStatusBadge, LabelBadge } from "@/components/ui/Badge";
import { getRepo } from "@/data/repos";
import { getUser } from "@/data/users";
import { getIssue } from "@/data/issues";
import { timeAgo } from "@/lib/format";
import { pageTransition } from "@/lib/motion";

export default function IssueDetail() {
  const { owner, repo: repoName, id } = useParams<{ owner: string; repo: string; id: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;
  const issue = owner && repoName && id ? getIssue(`${owner}/${repoName}`, Number(id)) : undefined;
  const [status, setStatus] = useState<"open" | "closed">(issue?.status ?? "open");

  // RepoLayout 已处理仓库不存在的 404
  if (!repo) return null;

  if (!issue) {
    return (
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        className="mt-16 text-center"
      >
        <p className="font-display text-2xl text-ink">未找到该 Issue</p>
        <p className="mt-2 text-sm text-ink-mute">#{id} 不存在或不属于 {owner}/{repoName}</p>
        <Link
          to={`/${repo.owner}/${repo.name}/issues`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-prussian hover:text-prussian-deep"
        >
          <ArrowLeft className="h-4 w-4" />
          返回 Issues 列表
        </Link>
      </motion.div>
    );
  }

  const author = getUser(issue.author);
  const assignee = issue.assignee ? getUser(issue.assignee) : undefined;
  const open = status === "open";

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
    >
      {/* 返回 */}
      <Link
        to={`/${repo.owner}/${repo.name}/issues`}
        className="mt-6 mb-4 inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        返回 Issues
      </Link>

      {/* 标题区 */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="font-display text-3xl text-ink md:text-4xl">
            {issue.title}{" "}
            <span className="font-mono text-xl text-ink-mute">#{issue.number}</span>
          </h1>
          <div className="mt-1.5 flex items-center gap-2">
            <IssueStatusBadge status={open ? "open" : "closed"} />
            {issue.labels.map((l) => (
              <LabelBadge key={l} label={l} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
          <div className="flex items-center gap-2">
            {author && <Avatar username={author.username} name={author.name} hue={author.avatarHue} size={22} />}
            <span>
              <span className="font-medium text-ink">{issue.author}</span>{" "}
              {open ? "开启" : "关闭"}于 {timeAgo(issue.createdAt)}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-xs">
            <MessageSquare className="h-3.5 w-3.5" />
            {issue.comments.length} 条评论
          </span>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="mb-6 flex items-center gap-2">
        <Button
          size="sm"
          variant={open ? "primary" : "secondary"}
          leftIcon={open ? <CheckCircle2 className="h-4 w-4" /> : <CircleDot className="h-4 w-4" />}
          onClick={() => setStatus(open ? "closed" : "open")}
        >
          {open ? "关闭 Issue" : "重新打开"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* 主区 */}
        <div className="flex flex-col gap-5">
          {/* 正文 */}
          <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
            <div className="flex items-center gap-2 border-b border-line-subtle bg-paper-warm px-4 py-2.5">
              {author && <Avatar username={author.username} name={author.name} hue={author.avatarHue} size={24} />}
              <span className="text-sm font-medium text-ink">{issue.author}</span>
              <span className="font-mono text-xs text-ink-mute">描述于 {timeAgo(issue.createdAt)}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-xs bg-vermillion-tint px-2 py-0.5 font-mono text-[0.65rem] text-vermillion-deep">
                作者
              </span>
            </div>
            <div className="whitespace-pre-line px-5 py-4 text-sm leading-relaxed text-ink-soft">
              {issue.body}
            </div>
          </div>

          {/* 评论时间线 */}
          <div className="flex flex-col gap-4">
            {issue.comments.map((c, i) => {
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
                    {c.author === issue.author && (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-xs bg-vermillion-tint px-2 py-0.5 font-mono text-[0.65rem] text-vermillion-deep">
                        作者
                      </span>
                    )}
                  </div>
                  <div className="px-5 py-4 text-sm leading-relaxed text-ink-soft">{c.body}</div>
                </motion.div>
              );
            })}
            {issue.comments.length === 0 && (
              <div className="rounded-md border border-dashed border-line-subtle py-12 text-center text-ink-mute">
                暂无评论
              </div>
            )}
          </div>

          {/* 评论框 */}
          <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
            <div className="border-b border-line-subtle px-4 py-2.5 text-sm text-ink-soft">留下评论</div>
            <textarea
              placeholder="写下你的想法..."
              className="h-24 w-full resize-none bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-mute outline-none"
            />
            <div className="flex justify-end gap-2 border-t border-line-subtle px-4 py-2.5">
              <Button variant="secondary" size="sm">
                取消
              </Button>
              <Button size="sm">评论</Button>
            </div>
          </div>
        </div>

        {/* 侧栏 */}
        <aside className="flex flex-col gap-5">
          {/* 指派人 */}
          <div className="paper-card rounded-md p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
              <User className="h-4 w-4 text-ink-mute" />
              指派人
            </h3>
            {assignee ? (
              <div className="flex items-center gap-2.5">
                <Avatar username={assignee.username} name={assignee.name} hue={assignee.avatarHue} size={26} />
                <span className="text-sm text-ink">{assignee.name}</span>
              </div>
            ) : (
              <p className="text-sm text-ink-mute">未指派</p>
            )}
          </div>

          {/* 标签 */}
          <div className="paper-card rounded-md p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
              <Tag className="h-4 w-4 text-ink-mute" />
              标签
            </h3>
            {issue.labels.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {issue.labels.map((l) => (
                  <LabelBadge key={l} label={l} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-mute">无标签</p>
            )}
          </div>

          {/* 作者 */}
          <div className="paper-card rounded-md p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-ink">
              <CalendarDays className="h-4 w-4 text-ink-mute" />
              作者
            </h3>
            {author && (
              <div className="flex items-center gap-2.5">
                <Avatar username={author.username} name={author.name} hue={author.avatarHue} size={26} />
                <div className="min-w-0">
                  <Link
                    to={`/${author.username}`}
                    className="block truncate text-sm font-medium text-ink hover:text-vermillion"
                  >
                    {author.name}
                  </Link>
                  <p className="truncate font-mono text-xs text-ink-mute">@{author.username}</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
