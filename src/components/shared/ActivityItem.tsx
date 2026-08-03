import { Link } from "react-router";
import { motion } from "motion/react";
import { GitCommit, CircleDot, Star, GitFork, UserPlus } from "lucide-react";
import type { Activity } from "@/types";
import { Avatar } from "@/components/ui/Avatar";
import { getUser } from "@/data/users";
import { timeAgo } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const activityMeta = {
  commit: { icon: GitCommit, color: "text-vermillion" },
  issue: { icon: CircleDot, color: "text-forest" },
  star: { icon: Star, color: "text-vermillion" },
  fork: { icon: GitFork, color: "text-prussian" },
  follow: { icon: UserPlus, color: "text-ink-soft" },
};

export function ActivityItem({ activity }: { activity: Activity }) {
  const actor = getUser(activity.actor);
  const meta = activityMeta[activity.type];
  const Icon = meta.icon;

  return (
    <motion.div
      variants={fadeUp}
      className="flex items-start gap-3 px-3 py-3 transition-colors hover:bg-paper-warm/60"
    >
      <div className="mt-1.5 h-2 w-2 shrink-0 bg-vermillion" />
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.color)} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2 text-sm">
          {actor && (
            <Link
              to={`/${actor.username}`}
              className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-vermillion"
            >
              <Avatar username={actor.username} name={actor.name} hue={actor.avatarHue} size={18} />
              {actor.username}
            </Link>
          )}
          <span className="text-ink-soft">{activity.targetText}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[0.7rem] text-ink-mute">
          {activity.targetRepo && (
            <Link to={`/${activity.targetRepo}`} className="text-prussian link-underline">
              {activity.targetRepo}
            </Link>
          )}
          <span>· {timeAgo(activity.date)}</span>
        </div>
      </div>
    </motion.div>
  );
}
