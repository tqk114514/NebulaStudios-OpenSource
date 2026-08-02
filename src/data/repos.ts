import type { Repository } from "@/types";

export const repos: Repository[] = [
  {
    owner: "aurora",
    name: "forge-core",
    description:
      "Nebula OpenSource 的核心 Git 服务实现 —— 纯 Zig 编写，单二进制部署，推送速度比 Gitea 快 3 倍。",
    language: "Zig",
    stars: 8421,
    forks: 612,
    watchers: 187,
    issues: 24,
    topics: ["git", "self-hosted", "zig", "code-hosting", "forge"],
    defaultBranch: "main",
    isPrivate: false,
    license: "MIT",
    updatedAt: "2026-07-15",
    homepage: "opensource.nebulastudios.top",
    recentCommits: [
      { sha: "a3f1c92", message: "feat(pack): 流式打包大仓库，内存占用降至 12MB", author: "aurora", date: "2026-07-15" },
      { sha: "8e2b4d1", message: "fix(ssh): 修复握手指针悬空导致的偶发 panic", author: "aurora", date: "2026-07-14" },
      { sha: "c01f7a8", message: "perf(refs): 引用解析走 simd，热路径快 41%", author: "soren", date: "2026-07-12" },
      { sha: "f55a0e3", message: "docs: 补充自定义 Hook 的编写指南", author: "mira", date: "2026-07-10" },
    ],
  },
  {
    owner: "aurora",
    name: "zig-parse",
    description: "零依赖的 Zig HTML/XML 解析器，SIMD 加速，比 lexbor 快 1.8 倍。",
    language: "Zig",
    stars: 3120,
    forks: 188,
    watchers: 64,
    issues: 8,
    topics: ["zig", "parser", "html", "simd", "zero-dependency"],
    defaultBranch: "main",
    isPrivate: false,
    license: "MIT",
    updatedAt: "2026-07-11",
    recentCommits: [
      { sha: "b21d9ee", message: "feat: 支持自闭合标签的流式识别", author: "aurora", date: "2026-07-11" },
      { sha: "7c8a1f0", message: "test: 补充 1200+ HTML5 规范用例", author: "kira", date: "2026-07-09" },
    ],
  },
  {
    owner: "aurora",
    name: "ember",
    description: "极简 KV 缓存，内存映射 + 异步刷盘，适合边缘节点。",
    language: "Rust",
    stars: 1876,
    forks: 94,
    watchers: 41,
    issues: 5,
    topics: ["rust", "cache", "kv-store", "embedded"],
    defaultBranch: "main",
    isPrivate: false,
    license: "Apache-2.0",
    updatedAt: "2026-07-08",
    recentCommits: [
      { sha: "e44c2b1", message: "perf(io): io_uring 后端，写延迟 p99 降 60%", author: "aurora", date: "2026-07-08" },
    ],
  },
  {
    owner: "kael",
    name: "tide-db",
    description: "教学级 Raft 共识实现的嵌入式 KV 数据库，注释比代码多。",
    language: "Go",
    stars: 4521,
    forks: 387,
    watchers: 102,
    issues: 16,
    topics: ["go", "raft", "database", "distributed", "educational"],
    defaultBranch: "main",
    isPrivate: false,
    license: "MIT",
    updatedAt: "2026-07-13",
    recentCommits: [
      { sha: "d90a3f2", message: "feat(snapshot): 增量快照，重启恢复 < 200ms", author: "kael", date: "2026-07-13" },
      { sha: "1b77ce8", message: "fix(election): 修复网络分区后的预投票死锁", author: "kael", date: "2026-07-11" },
    ],
  },
  {
    owner: "mira",
    name: "motion-kit",
    description: "一套 React 动效原语，spring 物理编排，让界面有头有尾。",
    language: "TypeScript",
    stars: 6234,
    forks: 421,
    watchers: 156,
    issues: 11,
    topics: ["react", "animation", "motion", "spring", "typescript"],
    defaultBranch: "main",
    isPrivate: false,
    license: "MIT",
    updatedAt: "2026-07-16",
    recentCommits: [
      { sha: "9ff2c10", message: "feat: 新增 useMagnetic 钩子，磁吸悬停", author: "mira", date: "2026-07-16" },
      { sha: "2ad8e44", message: "docs: 重写编排动画章节", author: "mira", date: "2026-07-14" },
    ],
  },
  {
    owner: "drift",
    name: "micro-kernel",
    description: "为 RISC-V 写的微内核，IPC 走消息传递，周末项目。",
    language: "C",
    stars: 1245,
    forks: 88,
    watchers: 73,
    issues: 9,
    topics: ["c", "kernel", "risc-v", "osdev", "microkernel"],
    defaultBranch: "trunk",
    isPrivate: false,
    license: "GPL-3.0",
    updatedAt: "2026-07-06",
    recentCommits: [
      { sha: "5e1a7c3", message: "feat(sched): 抢占式调度器，优先级继承", author: "drift", date: "2026-07-06" },
    ],
  },
  {
    owner: "nyx",
    name: "zk-starter",
    description: "零知识证明入门套件，PLONK 电路模板与可信设置工具链。",
    language: "Rust",
    stars: 2987,
    forks: 234,
    watchers: 88,
    issues: 7,
    topics: ["rust", "zkp", "cryptography", "plonk", "privacy"],
    defaultBranch: "main",
    isPrivate: false,
    license: "MIT",
    updatedAt: "2026-07-09",
    recentCommits: [
      { sha: "c3f8a91", message: "feat(circuit): 通用 Merkle 包含证明模板", author: "nyx", date: "2026-07-09" },
    ],
  },
  {
    owner: "soren",
    name: "forge-runner",
    description: "Nebula OpenSource 的 CI 引擎，容器化 job，缓存命中后构建快 4 倍。",
    language: "Go",
    stars: 3762,
    forks: 256,
    watchers: 94,
    issues: 13,
    topics: ["go", "ci", "runner", "containers", "devtools"],
    defaultBranch: "main",
    isPrivate: false,
    license: "Apache-2.0",
    updatedAt: "2026-07-15",
    recentCommits: [
      { sha: "8d2f0a4", message: "feat(cache): 分层缓存键，命中率 +37%", author: "soren", date: "2026-07-15" },
      { sha: "f1c92e0", message: "fix(runtime): 修复 OOM 时容器未清理", author: "soren", date: "2026-07-12" },
    ],
  },
];

export function getRepo(owner: string, name: string): Repository | undefined {
  return repos.find((r) => r.owner === owner && r.name === name);
}

export function getRepoByKey(key: string): Repository | undefined {
  return repos.find((r) => `${r.owner}/${r.name}` === key);
}

export function repoKey(r: { owner: string; name: string }): string {
  return `${r.owner}/${r.name}`;
}

// 语言 → 颜色映射
export const languageColors: Record<string, string> = {
  TypeScript: "#2A5A8C",
  Rust: "#A67852",
  Go: "#0E7A9C",
  Zig: "#C77E12",
  Python: "#2A5A8C",
  Swift: "#C03A1F",
  Kotlin: "#7A4FC4",
  Lua: "#1B3A6B",
  C: "#4A4845",
  Markdown: "#1B3A6B",
  Shell: "#4E7A2A",
};
