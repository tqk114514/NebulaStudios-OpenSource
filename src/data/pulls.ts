import type { PullRequest } from "@/types";

export const pullRequests: PullRequest[] = [
  {
    id: 1,
    number: 218,
    repoKey: "aurora/forge-core",
    title: "perf(pack): 流式打包大仓库，内存占用降至 12MB",
    status: "open",
    author: "aurora",
    branch: "perf/stream-pack",
    baseBranch: "main",
    additions: 312,
    deletions: 88,
    createdAt: "2026-07-15",
    checks: [
      { name: "build / zig-0.13", status: "pass", duration: "1m 42s" },
      { name: "build / zig-0.14", status: "pass", duration: "1m 38s" },
      { name: "test / unit", status: "pass", duration: "2m 11s" },
      { name: "test / integration", status: "running", duration: "进行中" },
      { name: "bench / clone-linux", status: "pending", duration: "排队中" },
    ],
    files: [
      {
        path: "src/pack/reader.zig",
        additions: 124,
        deletions: 41,
        hunks: [
          {
            header: "@@ -18,9 +18,14 @@ pub fn readPack(reader: anytype) !Pack {",
            lines: [
              { type: "context", oldNo: 18, newNo: 18, content: "pub fn readPack(reader: anytype) !Pack {" },
              { type: "context", oldNo: 19, newNo: 19, content: "    var buf: [4096]u8 = undefined;" },
              { type: "del", oldNo: 20, newNo: undefined, content: "    const all = try reader.readAllAlloc(allocator, 1 << 32);" },
              { type: "del", oldNo: 21, newNo: undefined, content: "    return parsePack(all);" },
              { type: "add", oldNo: undefined, newNo: 20, content: "    var stream = BufferedStream.init(reader, &buf);" },
              { type: "add", oldNo: undefined, newNo: 21, content: "    return parsePackStream(&stream);" },
              { type: "add", oldNo: undefined, newNo: 22, content: "}" },
              { type: "context", oldNo: 22, newNo: 23, content: "" },
              { type: "context", oldNo: 23, newNo: 24, content: "test \"readPack 增量\" {" },
            ],
          },
        ],
      },
      {
        path: "src/pack/stream.zig",
        additions: 188,
        deletions: 47,
        hunks: [
          {
            header: "@@ -1,4 +1,12 @@ const std = @import(\"std\");",
            lines: [
              { type: "context", oldNo: 1, newNo: 1, content: "const std = @import(\"std\");" },
              { type: "add", oldNo: undefined, newNo: 2, content: "" },
              { type: "add", oldNo: undefined, newNo: 3, content: "pub const BufferedStream = struct {" },
              { type: "add", oldNo: undefined, newNo: 4, content: "    buf: []u8," },
              { type: "add", oldNo: undefined, newNo: 5, content: "    pos: usize = 0," },
              { type: "add", oldNo: undefined, newNo: 6, content: "    len: usize = 0," },
              { type: "add", oldNo: undefined, newNo: 7, content: "    reader: anytype," },
              { type: "add", oldNo: undefined, newNo: 8, content: "" },
              { type: "add", oldNo: undefined, newNo: 9, content: "    pub fn fill(self: *@This()) !void {" },
              { type: "add", oldNo: undefined, newNo: 10, content: "        self.len = try self.reader.read(self.buf);" },
              { type: "add", oldNo: undefined, newNo: 11, content: "        self.pos = 0;" },
              { type: "add", oldNo: undefined, newNo: 12, content: "    }" },
            ],
          },
        ],
      },
      {
        path: "README.md",
        additions: 0,
        deletions: 0,
        hunks: [
          {
            header: "@@ -42,3 +42,3 @@ Nebula OpenSource 的核心 Git 服务实现。",
            lines: [
              { type: "context", oldNo: 42, newNo: 42, content: "- 单二进制部署，体积 < 8MB" },
              { type: "del", oldNo: 43, newNo: undefined, content: "- clone 大仓库内存占用约 2GB" },
              { type: "add", oldNo: undefined, newNo: 43, content: "- clone 大仓库内存占用 < 16MB（流式）" },
            ],
          },
        ],
      },
    ],
    comments: [
      { author: "soren", body: "流式实现很干净。bench 跑出来 clone linux 内核峰值 12MB，比之前好两个数量级。", createdAt: "2026-07-15" },
      { author: "aurora", body: "等 integration 过了就合。", createdAt: "2026-07-15" },
    ],
  },
  {
    id: 2,
    number: 215,
    repoKey: "aurora/forge-core",
    title: "fix(ssh): 修复握手指针悬空导致的偶发 panic",
    status: "merged",
    author: "aurora",
    branch: "fix/ssh-dangle",
    baseBranch: "main",
    additions: 24,
    deletions: 12,
    createdAt: "2026-07-14",
    checks: [
      { name: "build / zig-0.13", status: "pass", duration: "1m 39s" },
      { name: "test / unit", status: "pass", duration: "2m 04s" },
    ],
    files: [
      {
        path: "src/net/ssh.zig",
        additions: 24,
        deletions: 12,
        hunks: [
          {
            header: "@@ -88,7 +88,11 @@ fn handshake(conn: *Conn) !void {",
            lines: [
              { type: "context", oldNo: 88, newNo: 88, content: "fn handshake(conn: *Conn) !void {" },
              { type: "del", oldNo: 89, newNo: undefined, content: "    const key = conn.session.key.assume();" },
              { type: "add", oldNo: undefined, newNo: 89, content: "    const key = conn.session.key orelse {" },
              { type: "add", oldNo: undefined, newNo: 90, content: "        return error.MissingSessionKey;" },
              { type: "add", oldNo: undefined, newNo: 91, content: "    };" },
              { type: "context", oldNo: 90, newNo: 92, content: "    try writeKey(conn, key);" },
            ],
          },
        ],
      },
    ],
    comments: [
      { author: "nyx", body: "assume 改成显式检查，更稳。LGTM。", createdAt: "2026-07-14" },
    ],
  },
  {
    id: 3,
    number: 142,
    repoKey: "mira/motion-kit",
    title: "feat: 新增 useMagnetic 钩子，磁吸悬停",
    status: "open",
    author: "mira",
    branch: "feat/magnetic",
    baseBranch: "main",
    additions: 96,
    deletions: 4,
    createdAt: "2026-07-16",
    checks: [
      { name: "build / vite", status: "pass", duration: "48s" },
      { name: "test / vitest", status: "pass", duration: "22s" },
      { name: "lint", status: "pass", duration: "9s" },
    ],
    files: [
      {
        path: "src/hooks/useMagnetic.ts",
        additions: 88,
        deletions: 2,
        hunks: [
          {
            header: "@@ -1,3 +1,40 @@ import { useMotionValue, useSpring } from \"motion/react\";",
            lines: [
              { type: "context", oldNo: 1, newNo: 1, content: "import { useMotionValue, useSpring } from \"motion/react\";" },
              { type: "add", oldNo: undefined, newNo: 2, content: "" },
              { type: "add", oldNo: undefined, newNo: 3, content: "export function useMagnetic(strength = 0.4) {" },
              { type: "add", oldNo: undefined, newNo: 4, content: "  const x = useMotionValue(0);" },
              { type: "add", oldNo: undefined, newNo: 5, content: "  const y = useMotionValue(0);" },
              { type: "add", oldNo: undefined, newNo: 6, content: "  const sx = useSpring(x, { stiffness: 320, damping: 24 });" },
              { type: "add", oldNo: undefined, newNo: 7, content: "  const sy = useSpring(y, { stiffness: 320, damping: 24 });" },
              { type: "add", oldNo: undefined, newNo: 8, content: "" },
              { type: "add", oldNo: undefined, newNo: 9, content: "  return { sx, sy, onMouseMove, onMouseLeave };" },
              { type: "add", oldNo: undefined, newNo: 10, content: "}" },
            ],
          },
        ],
      },
    ],
    comments: [],
  },
  {
    id: 4,
    number: 99,
    repoKey: "kael/tide-db",
    title: "feat(snapshot): 增量快照，重启恢复 < 200ms",
    status: "open",
    author: "kael",
    branch: "feat/incr-snapshot",
    baseBranch: "main",
    additions: 244,
    deletions: 31,
    createdAt: "2026-07-13",
    checks: [
      { name: "build / go-1.22", status: "pass", duration: "1m 12s" },
      { name: "test / raft", status: "fail", duration: "3m 28s" },
      { name: "bench", status: "pending", duration: "排队中" },
    ],
    files: [
      {
        path: "raft/snapshot.go",
        additions: 156,
        deletions: 22,
        hunks: [
          {
            header: "@@ -30,8 +30,12 @@ func (s *Store) Snapshot() (io.Reader, error) {",
            lines: [
              { type: "context", oldNo: 30, newNo: 30, content: "func (s *Store) Snapshot() (io.Reader, error) {" },
              { type: "del", oldNo: 31, newNo: undefined, content: "\ts.full.Lock()" },
              { type: "add", oldNo: undefined, newNo: 31, content: "\t// 增量快照：只写自上次以来的变更" },
              { type: "add", oldNo: undefined, newNo: 32, content: "\treturn s.delta.Snapshot(s.lastIndex)" },
              { type: "context", oldNo: 32, newNo: 33, content: "}" },
            ],
          },
        ],
      },
    ],
    comments: [
      { author: "aurora", body: "raft 测试挂了一个，看起来是 lastIndex 没更新。修一下就能合。", createdAt: "2026-07-14" },
    ],
  },
];

export function getPullRequest(repoKey: string, number: number): PullRequest | undefined {
  return pullRequests.find((p) => p.repoKey === repoKey && p.number === number);
}

export function getPullsForRepo(repoKey: string): PullRequest[] {
  return pullRequests.filter((p) => p.repoKey === repoKey);
}
