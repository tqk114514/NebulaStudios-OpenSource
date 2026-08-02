import { Link } from "react-router";
import { motion } from "motion/react";
import { Star, GitFork, CircleDot } from "lucide-react";
import type { Repository } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { LanguageLabel } from "@/components/ui/LanguageDot";
import { Badge } from "@/components/ui/Badge";
import { getUser } from "@/data/users";
import { compactNumber, timeAgo } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface RepoCardProps {
  repo: Repository;
  index?: number;
  showOwner?: boolean;
  className?: string;
}

export function RepoCard({ repo, index = 0, showOwner = true, className }: RepoCardProps) {
  const owner = getUser(repo.owner);
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "paper-card group relative flex flex-col gap-4 rounded-md p-5 transition-colors duration-300 hover:border-line-strong",
        className,
      )}
    >
      {/* 顶部：所有者 + 语言 */}
      <div className="flex items-center gap-2 text-sm">
        {showOwner && owner && (
          <>
            <Link to={`/${repo.owner}`} className="flex items-center gap-2 text-ink-soft transition-colors hover:text-ink">
              <Avatar username={owner.username} name={owner.name} hue={owner.avatarHue} size={22} />
              <span>{repo.owner}</span>
            </Link>
            <span className="text-ink-mute">/</span>
          </>
        )}
        <Link
          to={`/${repo.owner}/${repo.name}`}
          className="font-display text-ink transition-colors group-hover:text-vermillion"
        >
          {repo.name}
        </Link>
        {repo.isPrivate && (
          <span className="rounded-xs border border-line-strong px-2 py-0.5 font-mono text-[0.65rem] text-ink-mute">
            私有
          </span>
        )}
      </div>

      {/* 描述 */}
      <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">
        {repo.description}
      </p>

      {/* 主题标签 */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <Badge key={t} color="#1B3A6B" bg="#E8EDF5">
              {t}
            </Badge>
          ))}
        </div>
      )}

      {/* 底部：语言 + 统计 + 更新 */}
      <div className="mt-auto flex items-center gap-4 pt-2 font-mono text-xs text-ink-mute">
        <LanguageLabel language={repo.language} className="font-mono text-ink-mute" />
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {compactNumber(repo.stars)}
        </span>
        <span className="inline-flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {compactNumber(repo.forks)}
        </span>
        {repo.issues > 0 && (
          <span className="inline-flex items-center gap-1">
            <CircleDot className="h-3.5 w-3.5" />
            {repo.issues}
          </span>
        )}
        <span className="ml-auto text-ink-mute">更新于 {timeAgo(repo.updatedAt)}</span>
      </div>
    </motion.div>
  );
}
