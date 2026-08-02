import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import {
  MapPin,
  Building2,
  Users,
  FolderGit2,
  Link2,
  Calendar,
  UserPlus,
  Pencil,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Heatmap } from "@/components/visual/Heatmap";
import { RepoCard } from "@/components/shared/RepoCard";
import { ActivityItem } from "@/components/shared/ActivityItem";
import { getUser, currentUser } from "@/data/users";
import { getRepoByKey } from "@/data/repos";
import { getActivitiesForUser } from "@/data/activity";
import { staggerContainer, fadeUp, viewportOnce } from "@/lib/motion";
import { compactNumber } from "@/lib/format";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const user = username ? getUser(username) : undefined;

  if (!user) {
    return (
      <PageShell>
        <div className="container py-32 text-center">
          <h1 className="font-display text-4xl text-ink">用户不存在</h1>
          <Link to="/explore" className="mt-6 inline-block text-vermillion link-underline">
            ← 返回探索
          </Link>
        </div>
      </PageShell>
    );
  }

  const isMe = user.username === currentUser.username;
  const pinned = user.pinnedRepos
    .map((key) => getRepoByKey(key))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));
  const activities = getActivitiesForUser(user.username);
  const ownRepos = user.repos;

  return (
    <PageShell>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer(0.06)}
        className="container py-10 md:py-14"
      >
        {/* 头部资料 */}
        <motion.div variants={fadeUp} className="relative mb-10">
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end">
            {/* 头像 */}
            <div className="relative">
              <div className="relative rounded-full border border-line-subtle bg-paper-pure p-1.5">
                <Avatar
                  username={user.username}
                  name={user.name}
                  hue={user.avatarHue}
                  size={120}
                  className="!rounded-full"
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div>
                <h1 className="font-display text-5xl text-ink">{user.name}</h1>
                <p className="font-mono text-lg text-ink-soft">@{user.username}</p>
              </div>
              <p className="max-w-xl text-ink-soft">{user.bio}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft">
                {user.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-ink-mute" />
                    {user.location}
                  </span>
                )}
                {user.company && (
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-ink-mute" />
                    {user.company}
                  </span>
                )}
                {user.website && (
                  <a href={`https://${user.website}`} className="inline-flex items-center gap-1.5 text-prussian link-underline">
                    <Link2 className="h-4 w-4" />
                    {user.website}
                  </a>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-ink-mute" />
                  加入于 {user.joinedAt}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {isMe ? (
                <Button variant="secondary" size="sm" leftIcon={<Pencil className="h-4 w-4" />}>
                  编辑资料
                </Button>
              ) : (
                <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
                  关注
                </Button>
              )}
            </div>
          </div>

          {/* 统计三联 */}
          <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line-subtle bg-line">
            {[
              { icon: FolderGit2, value: ownRepos, label: "仓库" },
              { icon: Users, value: user.followers, label: "关注者" },
              { icon: UserPlus, value: user.following, label: "正在关注" },
            ].map((s) => (
              <button
                key={s.label}
                className="flex flex-col items-center gap-1 bg-paper-pure px-4 py-4 transition-colors hover:bg-paper-warm"
              >
                <span className="font-display text-2xl text-ink">{compactNumber(s.value)}</span>
                <span className="meta-caps text-ink-mute">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* 贡献热力图 */}
        <motion.section variants={fadeUp} className="mb-12 rounded-md border border-line-subtle bg-paper-pure p-6">
          <Heatmap username={user.username} />
        </motion.section>

        {/* 置顶 + 活动 双栏 */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* 置顶仓库 */}
          <motion.section variants={fadeUp}>
            <div className="mb-5 flex items-center gap-2">
              <h2 className="display-tight text-2xl text-ink">
                <span className="section-mark mr-2 not-italic">§</span>置顶仓库
              </h2>
              <span className="font-mono text-xs text-ink-mute">{pinned.length}</span>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerContainer(0.06)}
              className="grid gap-4 sm:grid-cols-2"
            >
              {pinned.map((repo, i) => (
                <RepoCard key={`${repo.owner}/${repo.name}`} repo={repo} index={i} showOwner={false} />
              ))}
            </motion.div>
          </motion.section>

          {/* 活动流 */}
          <motion.aside variants={fadeUp}>
            <div className="mb-5 flex items-center gap-2">
              <h2 className="display-tight text-2xl text-ink">
                <span className="section-mark mr-2 not-italic">§</span>最近活动
              </h2>
            </div>
            <div className="rounded-md border border-line-subtle bg-paper-pure p-2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.05)}
                className="flex flex-col"
              >
                {activities.map((a) => (
                  <ActivityItem key={a.id} activity={a} />
                ))}
              </motion.div>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </PageShell>
  );
}
