import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import {
  Star,
  GitFork,
  Eye,
  Tag,
  Scale,
  Link2,
  GitCommit,
  ChevronDown,
  BookOpen,
  Play,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LanguageDot, LanguageLabel } from "@/components/ui/LanguageDot";
import { FileTree } from "@/components/code/FileTree";
import { CodeViewer } from "@/components/code/CodeViewer";
import { Markdown } from "@/components/Markdown";
import { getRepo } from "@/data/repos";
import { getUser } from "@/data/users";
import { getFileTree, getReadme } from "@/data/files";
import { timeAgo, compactNumber } from "@/lib/format";
import { pageTransition } from "@/lib/motion";
import type { FileNode } from "@/types";

export default function Repository() {
  const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;

  const tree = useMemo(
    () => (owner && repoName ? getFileTree(owner, repoName) : []),
    [owner, repoName],
  );

  const [selectedPath, setSelectedPath] = useState("src/pack/reader.zig");

  // RepoLayout 已处理仓库不存在的 404，子页面不会渲染；此处防御性返回
  if (!repo) return null;

  const readme = getReadme(repo.owner, repo.name, repo.description);

  function findFileByPath(nodes: FileNode[], path: string, prefix = ""): FileNode | undefined {
    for (const n of nodes) {
      const cur = prefix ? `${prefix}/${n.name}` : n.name;
      if (cur === path) return n;
      if (n.children) {
        const found = findFileByPath(n.children, path, cur);
        if (found) return found;
      }
    }
    return undefined;
  }

  const selectedFile = findFileByPath(tree, selectedPath);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      className="mt-6 grid gap-6 lg:grid-cols-[1fr_280px]"
    >
          {/* 左：文件浏览 */}
          <div className="flex flex-col gap-4">
            {/* 分支栏 */}
            <div className="flex items-center gap-3 rounded-md border border-line-subtle bg-paper-pure px-4 py-2.5">
              <button className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-ink transition-colors hover:bg-paper-warm">
                <GitCommit className="h-4 w-4 text-ink-mute" />
                {repo.defaultBranch}
                <ChevronDown className="h-3.5 w-3.5 text-ink-mute" />
              </button>
              <div className="h-4 w-px bg-line-subtle" />
              <span className="font-mono text-xs text-ink-soft">
                {repo.recentCommits.length} 次提交
              </span>
              <div className="ml-auto flex items-center gap-1">
                <button className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-ink-soft transition-colors hover:bg-paper-warm hover:text-ink">
                  <Play className="h-3.5 w-3.5" />
                  Actions
                </button>
              </div>
            </div>

            {/* 文件树 + 代码 */}
            <div className="grid gap-4 md:grid-cols-[260px_1fr]">
              <div className="rounded-md border border-line-subtle bg-paper-pure p-2">
                <div className="px-2 py-1.5 meta-caps text-ink-mute">
                  文件
                </div>
                <FileTree
                  nodes={tree}
                  selectedPath={selectedPath}
                  onSelect={(_node, path) => setSelectedPath(path)}
                  defaultExpanded={["src", "src/pack"]}
                />
              </div>

              <div>
                {selectedFile && selectedFile.content ? (
                  <CodeViewer
                    code={selectedFile.content}
                    language={selectedFile.language}
                    filename={selectedFile.name}
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-md border border-line-subtle bg-paper-pure text-ink-mute">
                    选择一个文件查看
                  </div>
                )}
              </div>
            </div>

            {/* README */}
            <div className="overflow-hidden rounded-md border border-line-subtle bg-paper-pure">
              <div className="flex items-center gap-2 border-b border-line-subtle bg-paper-warm px-5 py-3">
                <BookOpen className="h-4 w-4 text-ink-soft" />
                <span className="font-mono text-sm text-ink">README.md</span>
              </div>
              <div className="px-6 py-5">
                <Markdown content={readme} />
              </div>
            </div>

            {/* 最近提交 */}
            <div className="rounded-md border border-line-subtle bg-paper-pure">
              <div className="border-b border-line-subtle px-5 py-3 meta-caps text-ink-mute">
                最近提交
              </div>
              <div className="flex flex-col divide-y divide-line-subtle">
                {repo.recentCommits.map((c, i) => (
                  <motion.div
                    key={c.sha}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <Avatar username={c.author} name={getUser(c.author)?.name} hue={getUser(c.author)?.avatarHue} size={26} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-ink">{c.message}</p>
                      <p className="font-mono text-[0.7rem] text-ink-mute">
                        {c.author} · {timeAgo(c.date)}
                      </p>
                    </div>
                    <code className="rounded bg-paper-warm px-2 py-0.5 font-mono text-[0.7rem] text-ink-soft">
                      {c.sha}
                    </code>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 右：侧栏元信息 */}
          <aside className="flex flex-col gap-5">
            <div className="paper-card rounded-md p-4">
              <h3 className="mb-2 font-display text-base text-ink">关于</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{repo.description}</p>
              {repo.homepage && (
                <a
                  href={`https://${repo.homepage}`}
                  className="link-underline mt-3 inline-flex items-center gap-1.5 text-sm"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  {repo.homepage}
                </a>
              )}
              <div className="mt-4 flex flex-col gap-2 border-t border-line-subtle pt-3 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-2">
                  <Scale className="h-4 w-4 text-ink-mute" />
                  {repo.license}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Star className="h-4 w-4 text-ink-mute" />
                  {compactNumber(repo.stars)} stars
                </span>
                <span className="inline-flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-ink-mute" />
                  {compactNumber(repo.forks)} forks
                </span>
                <span className="inline-flex items-center gap-2">
                  <Eye className="h-4 w-4 text-ink-mute" />
                  {compactNumber(repo.watchers)} watching
                </span>
                <span className="inline-flex items-center gap-2">
                  <Tag className="h-4 w-4 text-ink-mute" />
                  更新于 {timeAgo(repo.updatedAt)}
                </span>
              </div>
            </div>

            {/* 语言分布 */}
            <div className="paper-card rounded-md p-4">
              <h3 className="mb-3 font-display text-base text-ink">语言</h3>
              <div className="mb-3 flex h-1.5 overflow-hidden rounded-full">
                <div className="bg-[#f7a41d]" style={{ width: "78%" }} />
                <div className="bg-[#89e051]" style={{ width: "14%" }} />
                <div className="bg-ink-mute" style={{ width: "8%" }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <LanguageLabel language={repo.language} />
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <LanguageDot language="Shell" size={10} /> Shell
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink-mute" /> Other
                </span>
              </div>
            </div>

            {/* 贡献者 */}
            <div className="paper-card rounded-md p-4">
              <h3 className="mb-3 font-display text-base text-ink">贡献者</h3>
              <div className="flex flex-wrap gap-2">
                {[repo.owner, "soren", "mira", "nyx"].map((u) => {
                  const user = getUser(u);
                  return user ? (
                    <Link key={u} to={`/${u}`} title={user.name}>
                      <Avatar username={user.username} name={user.name} hue={user.avatarHue} size={36} ring />
                    </Link>
                  ) : null;
                })}
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line-subtle bg-paper-warm font-mono text-xs text-ink-soft">
                  +18
                </div>
              </div>
            </div>
          </aside>
    </motion.div>
  );
}
