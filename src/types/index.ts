// 全局类型定义

export type Language =
  | "TypeScript"
  | "Rust"
  | "Go"
  | "Zig"
  | "Python"
  | "Swift"
  | "Kotlin"
  | "Lua"
  | "C"
  | "Markdown"
  | "Shell";

export interface User {
  username: string;
  name: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  following: number;
  repos: number;
  joinedAt: string;
  avatarHue: number; // 用于生成头像渐变
  pinnedRepos: string[]; // owner/repo
  website?: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface Repository {
  owner: string;
  name: string;
  description: string;
  language: Language;
  stars: number;
  forks: number;
  watchers: number;
  issues: number;
  topics: string[];
  defaultBranch: string;
  isPrivate: boolean;
  license: string;
  updatedAt: string;
  homepage?: string;
  recentCommits: Commit[];
}

export type IssueStatus = "open" | "closed";
export type IssueLabel =
  | "bug"
  | "enhancement"
  | "feature"
  | "docs"
  | "good-first-issue"
  | "help-wanted"
  | "question"
  | "wontfix";

export interface IssueComment {
  author: string;
  body: string;
  createdAt: string;
}

export interface Issue {
  id: number;
  number: number;
  repoKey: string; // owner/repo
  title: string;
  status: IssueStatus;
  labels: IssueLabel[];
  author: string;
  assignee?: string;
  createdAt: string;
  comments: IssueComment[];
}

export type PRStatus = "open" | "merged" | "closed" | "draft";
export type CheckStatus = "pass" | "fail" | "pending" | "running";

export interface CheckItem {
  name: string;
  status: CheckStatus;
  duration: string;
}

export interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

export interface DiffLine {
  type: "add" | "del" | "context";
  oldNo?: number;
  newNo?: number;
  content: string;
}

export interface PullRequest {
  id: number;
  number: number;
  repoKey: string;
  title: string;
  status: PRStatus;
  author: string;
  branch: string;
  baseBranch: string;
  additions: number;
  deletions: number;
  createdAt: string;
  checks: CheckItem[];
  files: DiffFile[];
  comments: IssueComment[];
}

export type FileNodeType = "file" | "dir";

export interface FileNode {
  name: string;
  type: FileNodeType;
  children?: FileNode[];
  content?: string;
  language?: Language;
  size?: number;
}

export type ActivityType = "commit" | "pr" | "issue" | "star" | "fork" | "follow";

export interface Activity {
  id: string;
  type: ActivityType;
  actor: string;
  targetRepo?: string;
  targetText: string;
  date: string;
}
