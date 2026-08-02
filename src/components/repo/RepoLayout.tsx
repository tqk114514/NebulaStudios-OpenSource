import { Outlet, useMatch, useParams } from "react-router-dom";
import { PageShell } from "@/components/layout/PageShell";
import { RepoTabs, type RepoTabKey } from "@/components/repo/RepoTabs";
import { getRepo } from "@/data/repos";
import { getIssuesForRepo } from "@/data/issues";
import { getPullsForRepo } from "@/data/pulls";

/**
 * 仓库布局 —— RepoTabs 常驻（不随子路由切换重新挂载），Outlet 渲染子页面内容
 */
export function RepoLayout() {
  const { owner, repo: repoName } = useParams<{ owner: string; repo: string }>();
  const repo = owner && repoName ? getRepo(owner, repoName) : undefined;

  const matchIssues = useMatch("/:owner/:repo/issues");
  const matchPulls = useMatch("/:owner/:repo/pulls/*");
  const currentTab: RepoTabKey = matchIssues ? "issues" : matchPulls ? "pulls" : "";

  if (!repo) {
    return (
      <PageShell>
        <div className="container py-32 text-center">
          <h1 className="display-tight text-4xl text-ink">仓库不存在</h1>
          <p className="mt-3 text-ink-soft">找不到 {owner}/{repoName}</p>
        </div>
      </PageShell>
    );
  }

  const issues = getIssuesForRepo(`${repo.owner}/${repo.name}`);
  const pulls = getPullsForRepo(`${repo.owner}/${repo.name}`);
  const openIssues = issues.filter((i) => i.status === "open").length;
  const openPRs = pulls.filter((p) => p.status === "open").length;

  return (
    <PageShell showFooter={false}>
      <div className="container py-8 md:py-10">
        <RepoTabs
          owner={repo.owner}
          repo={repo.name}
          isPrivate={repo.isPrivate}
          stars={repo.stars}
          forks={repo.forks}
          watchers={repo.watchers}
          topics={repo.topics}
          openIssues={openIssues}
          openPRs={openPRs}
          currentTab={currentTab}
        />
        <Outlet />
      </div>
    </PageShell>
  );
}
