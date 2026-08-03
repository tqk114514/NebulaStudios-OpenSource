import { useState } from "react";
import { Link } from "react-router";
import { Code2, CircleDot, Star, GitFork, Eye, Copy, Check } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getUser } from "@/data/users";
import { compactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export type RepoTabKey = "" | "issues";

interface RepoTabsProps {
  owner: string;
  repo: string;
  isPrivate: boolean;
  stars: number;
  forks: number;
  watchers: number;
  topics: string[];
  openIssues: number;
  currentTab: RepoTabKey;
  className?: string;
}

/**
 * 仓库页 Tab 栏 —— 仓库标识（头像 + owner/repo + 公开标识）+ Star/Fork/Watch/clone + 代码/Issues/Pull Requests
 * 三个子页面共用，GitHub 风格按钮式 Tab
 */
export function RepoTabs({
  owner,
  repo,
  isPrivate,
  stars,
  forks,
  watchers,
  topics,
  openIssues,
  currentTab,
  className,
}: RepoTabsProps) {
  const ownerUser = getUser(owner);
  // TODO: starred 状态目前仅组件内本地维护，接后端后改为服务端数据
  const [starred, setStarred] = useState(false);
  const [copied, setCopied] = useState(false);
  const cloneUrl = `git@opensource.nebulastudios.top:${owner}/${repo}.git`;

  function copyClone() {
    navigator.clipboard?.writeText(cloneUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  const tabs: { label: string; icon: typeof Code2; to: RepoTabKey; count: number | null }[] = [
    { label: "代码", icon: Code2, to: "", count: null },
    { label: "Issues", icon: CircleDot, to: "issues", count: openIssues },
  ];

  return (
    <div className={className}>
      {/* 仓库标识 + 操作区 */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {ownerUser && (
            <Link to={`/${ownerUser.username}`} className="inline-flex items-center gap-2 text-ink-soft transition-colors hover:text-ink">
              <Avatar username={ownerUser.username} name={ownerUser.name} hue={ownerUser.avatarHue} size={28} />
              <span className="text-lg">{owner}</span>
            </Link>
          )}
          <span className="text-ink-mute">/</span>
          <h1 className="display-tight text-3xl text-ink">{repo}</h1>
          <Badge color="#5C5A52" bg="#EFEAE0" variant="outline">
            {isPrivate ? "私有" : "公开"}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStarred((v) => !v)}
            leftIcon={<Star className={cn("h-4 w-4", starred && "fill-vermillion text-vermillion")} />}
          >
            {starred ? "Starred" : "Star"} · {compactNumber(stars + (starred ? 1 : 0))}
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<GitFork className="h-4 w-4" />}>
            Fork · {compactNumber(forks)}
          </Button>
          <Button variant="secondary" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
            Watch · {compactNumber(watchers)}
          </Button>
          <div className="flex h-9 items-center gap-2 rounded-md border border-line-subtle bg-paper-pure pl-3 pr-1.5">
            <span className="font-mono text-xs text-ink-mute">git@</span>
            <span className="max-w-[180px] truncate font-mono text-xs text-ink-soft">
              {owner}/{repo}.git
            </span>
            <button
              onClick={copyClone}
              className="inline-flex h-6 w-6 items-center justify-center rounded text-ink-mute transition-colors hover:bg-paper-warm hover:text-ink"
              aria-label="复制克隆地址"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-vermillion" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 主题标签 */}
      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {topics.map((t) => (
            <span key={t} className="rounded-xs bg-prussian-tint px-2.5 py-0.5 font-mono text-[0.7rem] text-prussian">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Tab 按钮 */}
      <div className="mt-5 flex gap-1.5">
        {tabs.map((tab) => {
          const active = currentTab === tab.to;
          const to = tab.to ? `/${owner}/${repo}/${tab.to}` : `/${owner}/${repo}`;
          return (
            <Link
              key={tab.label}
              to={to}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-paper-warm text-ink shadow-card"
                  : "text-ink-soft hover:bg-paper-warm/60 hover:text-ink",
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count !== null && (
                <span className="rounded-xs bg-paper-pure px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-soft">
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
