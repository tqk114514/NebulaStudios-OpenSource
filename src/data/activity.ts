import type { Activity } from "@/types";

export const activities: Activity[] = [
  { id: "a1", type: "commit", actor: "aurora", targetRepo: "aurora/forge-core", targetText: "perf(pack): 流式打包大仓库，内存占用降至 12MB", date: "2026-07-15T18:30" },
  { id: "a2", type: "pr", actor: "aurora", targetRepo: "aurora/forge-core", targetText: "#218 流式打包大仓库", date: "2026-07-15T17:10" },
  { id: "a3", type: "star", actor: "soren", targetRepo: "mira/motion-kit", targetText: "给 motion-kit 加星", date: "2026-07-16T09:22" },
  { id: "a4", type: "issue", actor: "kael", targetRepo: "aurora/forge-core", targetText: "#412 大仓库 clone 时内存峰值过高", date: "2026-07-12T11:00" },
  { id: "a5", type: "fork", actor: "drift", targetRepo: "kael/tide-db", targetText: "fork 了 tide-db", date: "2026-07-13T14:45" },
  { id: "a6", type: "commit", actor: "mira", targetRepo: "mira/motion-kit", targetText: "feat: 新增 useMagnetic 钩子", date: "2026-07-16T10:05" },
  { id: "a7", type: "pr", actor: "kael", targetRepo: "kael/tide-db", targetText: "#99 增量快照，重启恢复 < 200ms", date: "2026-07-13T16:20" },
  { id: "a8", type: "issue", actor: "drift", targetRepo: "mira/motion-kit", targetText: "#88 useMagnetic 在触摸设备上应自动禁用", date: "2026-07-14T08:15" },
  { id: "a9", type: "follow", actor: "nyx", targetText: "关注了 mira", date: "2026-07-14T19:30" },
  { id: "a10", type: "star", actor: "aurora", targetRepo: "kael/tide-db", targetText: "给 tide-db 加星", date: "2026-07-11T12:00" },
  { id: "a11", type: "commit", actor: "soren", targetRepo: "soren/forge-runner", targetText: "feat(cache): 分层缓存键，命中率 +37%", date: "2026-07-15T20:00" },
  { id: "a12", type: "pr", actor: "mira", targetRepo: "mira/motion-kit", targetText: "#142 新增 useMagnetic 钩子", date: "2026-07-16T10:08" },
];

export function getActivitiesForUser(username: string): Activity[] {
  return activities.filter((a) => a.actor === username);
}

export function getFeedActivities(): Activity[] {
  return activities;
}
