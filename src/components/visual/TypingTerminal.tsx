import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface TypingTerminalProps {
  className?: string;
}

/** 锚定值：仓库大小（MiB）—— 动画内部固定数据 */
const REPO_SIZE_MIB = 50;

/** 网速区间（MiB/s）：MIN 最低，MODE 经常值，MAX 峰值 */
const SPEED_MIN = 5;
const SPEED_MODE = 8;
const SPEED_MAX = 10;

/** ±2% 浮动 —— 每次会话数字略有差异，增加真实感 */
const jitter = (v: number) => v * (1 + (Math.random() * 2 - 1) * 0.02);

/** 仓库对象数（由仓库大小推算，平均对象 10.6 KB） */
const REPO_OBJECTS = Math.round((REPO_SIZE_MIB * 1024) / jitter(10.6));
/** 压缩对象数（由对象数推算，占比 29.5%） */
const COMPRESSED_OBJECTS = Math.round(REPO_OBJECTS * jitter(0.295));
/** delta 数（由对象数推算，占比 59%） */
const DELTA_COUNT = Math.round(REPO_OBJECTS * jitter(0.59));

/** push 对象数（新分支提交，小规模） */
const PUSH_OBJECTS = Math.round(jitter(14));
/** push 压缩对象数（占比 57%） */
const PUSH_COMPRESSED = Math.round(PUSH_OBJECTS * jitter(0.57));
/** push delta 数（占比 43%） */
const PUSH_DELTA = Math.round(PUSH_OBJECTS * jitter(0.43));
/** push 数据大小（KiB，每对象约 0.23 KiB） */
const PUSH_SIZE_KIB = (PUSH_OBJECTS * jitter(0.23)).toFixed(2);

/** zig build 真实快照序列（基于真实输出提取，逐个刷新模拟编译过程） */
const BUILD_SNAPSHOTS: string[][] = [
  [
    `[3] Compile Build Script`,
    `├─ [2947/2947] Linking`,
    `├─ [533/533] Code Generation`,
    `└─ [3878] Semantic Analysis`,
    `      └─ array_list.AlignedManaged(debug.Pdb.Module,null).append`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [3981/3982] Linking`,
    `├─ [960/961] Code Generation`,
    `│   └─ Io.Threaded.AlertableSyscall.finish`,
    `└─ [5097] Semantic Analysis`,
    `      └─ Io.Threaded.AlertableSyscall.finish`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [5021/5021] Linking`,
    `├─ [1373/1373] Code Generation`,
    `└─ [6354] Semantic Analysis`,
    `      └─ Io.Threaded.dirReadWindows`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [6419/6420] Linking`,
    `├─ [1685/1686] Code Generation`,
    `│   └─ Build.Watch.Os__struct_59624.wait`,
    `└─ [8237] Semantic Analysis`,
    `      └─ Build.Watch.Os__struct_59624.wait`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [7380/7381] Linking`,
    `├─ [2169/2170] Code Generation`,
    `│   └─ Io.Writer.print__anon_65200`,
    `└─ [9311] Semantic Analysis`,
    `      └─ Io.Writer.print__anon_65200`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [8208/8208] Linking`,
    `├─ [2518/2518] Code Generation`,
    `└─ [11035] Semantic Analysis`,
    `      └─ Target.Cpu.Arch.allCpu.Models`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [8473/8473] Linking`,
    `├─ [2520/2520] Code Generation`,
    `└─ [11986] Semantic Analysis`,
    `      └─ Target.xtensa.all_features`,
  ],
  [
    `[3] Compile Build Script`,
    `├─ [9037/9037] Linking`,
    `├─ [2769/2769] Code Generation`,
    `└─ [11986] Semantic Analysis`,
    `      └─ Target.xtensa.all_features`,
  ],
  [
    `[5] Compile Build Script`,
    `└─ [15565/15565] Linking`,
    `      └─ LLVM Emit Object`,
  ],
  [
    `[0/3] steps`,
    `└─ [4] compile exe  bench Debug native`,
    `      └─ [7731/7731] Linking`,
    `            └─ LLVM Emit Object`,
  ],
];

/** 三角分布采样：网速以 [SPEED_MIN, SPEED_MAX] 为软区间，峰值 SPEED_MODE 最常出现
 *  采样后再 jitter ±2%，允许偶尔超出硬性范围，更接近真实网络波动 */
function sampleSpeed(): number {
  const u = Math.random();
  const min = SPEED_MIN, mode = SPEED_MODE, max = SPEED_MAX;
  const fc = (mode - min) / (max - min);
  const base = u < fc
    ? min + Math.sqrt(u * (max - min) * (mode - min))
    : max - Math.sqrt((1 - u) * (max - min) * (max - mode));
  return jitter(base);
}

type ScriptLine =
  | { kind: "text"; text: string; className?: string; delay: number; typing?: boolean }
  | { kind: "progress"; delay: number; totalMiB: number }
  | { kind: "build"; delay: number };

/**
 * 剧本：行级输出，命令出现间隔 0.1-0.4s，按现实命令特化偏移
 * —— 命令输入行偏长（用户"敲入"），瞬时响应偏短，build 偏长（编译耗时）
 */
const script: ScriptLine[] = [
  { kind: "text", text: "$ git clone ssh://git@opensource.nebulastudios.top/aurora/forge-core.git", className: "text-ink", delay: 350, typing: true },
  { kind: "text", text: "Cloning into 'forge-core'...", className: "text-ink-soft", delay: 120 },
  { kind: "text", text: `remote: Enumerating objects: ${REPO_OBJECTS}, done.`, className: "text-ink-mute", delay: 180 },
  { kind: "text", text: `remote: Counting objects: 100% (${REPO_OBJECTS}/${REPO_OBJECTS}), done.`, className: "text-ink-mute", delay: 160 },
  { kind: "text", text: `remote: Compressing objects: 100% (${COMPRESSED_OBJECTS}/${COMPRESSED_OBJECTS}), done.`, className: "text-ink-mute", delay: 140 },
  { kind: "progress", delay: 100, totalMiB: REPO_SIZE_MIB },
  { kind: "text", text: `Resolving deltas: 100% (${DELTA_COUNT}/${DELTA_COUNT}), done.`, className: "text-prussian", delay: 180 },
  { kind: "text", text: "$ cd forge-core && zig build", className: "text-ink", delay: 400, typing: true },
  { kind: "build", delay: 300 },
  { kind: "text", text: "\u00A0", className: "text-ink-mute", delay: 400 },
  { kind: "text", text: "$ git push origin perf/stream-pack", className: "text-ink", delay: 300, typing: true },
  { kind: "text", text: `Enumerating objects: ${PUSH_OBJECTS}, done.`, className: "text-ink-mute", delay: 200 },
  { kind: "text", text: `Counting objects: 100% (${PUSH_OBJECTS}/${PUSH_OBJECTS}), done.`, className: "text-ink-mute", delay: 180 },
  { kind: "text", text: `Compressing objects: 100% (${PUSH_COMPRESSED}/${PUSH_COMPRESSED}), done.`, className: "text-ink-mute", delay: 180 },
  { kind: "text", text: `Writing objects: 100% (${PUSH_OBJECTS}/${PUSH_OBJECTS}), ${PUSH_SIZE_KIB} KiB | ${(jitter(8)).toFixed(2)} MiB/s, done.`, className: "text-ink-mute", delay: 350 },
  { kind: "text", text: `Total ${PUSH_OBJECTS} (delta ${PUSH_DELTA}), reused 0 (delta 0), pack-reused 0`, className: "text-ink-mute", delay: 250 },
  { kind: "text", text: `remote: Resolving deltas: 100% (${PUSH_DELTA}/${PUSH_DELTA}), done.`, className: "text-ink-mute", delay: 250 },
  { kind: "text", text: "To ssh://git@opensource.nebulastudios.top/aurora/forge-core.git", className: "text-ink-soft", delay: 200 },
  { kind: "text", text: " * [new branch]      perf/stream-pack -> perf/stream-pack", className: "text-forest", delay: 250 },
];

/**
 * 印刷感终端 —— 行级输出（非逐字打字），clone 进度按随机网速走 0→100%
 * 播放一次即停，不循环
 */
export function TypingTerminal({ className }: TypingTerminalProps) {
  const [lines, setLines] = useState<{ text: string; className?: string }[]>([]);
  const [progressLine, setProgressLine] = useState<string | null>(null);
  const [buildSnapshot, setBuildSnapshot] = useState<string[] | null>(null);
  const [typingActive, setTypingActive] = useState(false);
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // prefers-reduced-motion：跳过全部打字/进度/build 动画，直接渲染完成态输出
    // （setTimeout 延迟到 effect 之后应用，避免 effect 内同步 setState）
    if (reduceMotion) {
      const t = window.setTimeout(() => {
        const staticLines: { text: string; className?: string }[] = [];
        for (const line of script) {
          if (line.kind === "text") {
            staticLines.push({ text: line.text, className: line.className });
          } else if (line.kind === "progress") {
            staticLines.push({
              text: `Receiving objects: 100% (${REPO_OBJECTS}/${REPO_OBJECTS}), ${line.totalMiB.toFixed(2)} MiB | ${SPEED_MODE.toFixed(2)} MiB/s, done.`,
              className: "text-prussian",
            });
          } else {
            const snap = BUILD_SNAPSHOTS[BUILD_SNAPSHOTS.length - 1];
            staticLines.push(...snap.map((t) => ({ text: t, className: "text-prussian" })));
          }
        }
        setLines(staticLines);
        setProgressLine(null);
        setBuildSnapshot(null);
        setTypingActive(false);
        setDone(true);
      }, 0);
      return () => window.clearTimeout(t);
    }

    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

    async function play() {
      // 清空状态（StrictMode 双调用时复位第一轮残留）
      setLines([]);
      setProgressLine(null);
      setBuildSnapshot(null);
      setTypingActive(false);
      setDone(false);

      await wait(600);
      if (cancelled) return;

      for (const line of script) {
        if (cancelled) return;
        await wait(line.delay);
        if (cancelled) return;

        if (line.kind === "progress") {
          // git clone 真实输出：单行原地刷新数字（\r 效果），完成时固化为 done. 行
          // 所有元素每秒同步刷新一次；显示 speed 为全程平均速度 = downloaded / elapsed
          await new Promise<void>((resolve) => {
            let downloaded = 0;
            let instSpeed = sampleSpeed();
            const tickMs = 1000;
            const startTs = Date.now();

            const tick = () => {
              if (cancelled) { resolve(); return; }
              // 每秒重新采样瞬时网速并累积下载量
              instSpeed = sampleSpeed();
              downloaded += instSpeed * (tickMs / 1000);

              const pct = Math.min(100, (downloaded / line.totalMiB) * 100);
              const received = Math.min(REPO_OBJECTS, Math.floor((downloaded / line.totalMiB) * REPO_OBJECTS));
              const elapsedSec = (Date.now() - startTs) / 1000;
              const avgSpeed = elapsedSec > 0 ? downloaded / elapsedSec : instSpeed;

              if (downloaded >= line.totalMiB) {
                // 固化完成行到 lines
                setProgressLine(null);
                setLines((prev) => [
                  ...prev,
                  {
                    text: `Receiving objects: 100% (${REPO_OBJECTS}/${REPO_OBJECTS}), ${line.totalMiB.toFixed(2)} MiB | ${avgSpeed.toFixed(2)} MiB/s, done.`,
                    className: "text-prussian",
                  },
                ]);
                setTimeout(resolve, 220);
              } else {
                // 原地刷新这一行
                setProgressLine(`Receiving objects: ${String(Math.floor(pct)).padStart(3)}% (${received}/${REPO_OBJECTS}), ${downloaded.toFixed(2)} MiB | ${avgSpeed.toFixed(2)} MiB/s`);
                setTimeout(tick, tickMs);
              }
            };
            setTimeout(tick, tickMs);
          });
        } else if (line.kind === "build") {
          // zig build：逐个快照刷新（多行整体重绘），模拟真实编译输出
          await new Promise<void>((resolve) => {
            const tickMs = 300;
            let i = 0;
            const tick = () => {
              if (cancelled) { resolve(); return; }
              if (i >= BUILD_SNAPSHOTS.length) {
                setBuildSnapshot(null);
                setTimeout(resolve, 200);
                return;
              }
              setBuildSnapshot(BUILD_SNAPSHOTS[i]);
              i++;
              setTimeout(tick, tickMs);
            };
            setTimeout(tick, tickMs);
          });
        } else {
          if (line.typing) {
            // 打字机效果：逐字显示命令行（模拟用户敲入），光标跟在已打出的字后面
            setTypingActive(true);
            setLines((prev) => [...prev, { text: "", className: line.className }]);
            for (let i = 0; i < line.text.length; i++) {
              if (cancelled) return;
              await wait(35);
              if (cancelled) return;
              const partial = line.text.slice(0, i + 1);
              setLines((prev) => {
                const next = [...prev];
                next[next.length - 1] = { text: partial, className: line.className };
                return next;
              });
            }
            setTypingActive(false);
          } else {
            setLines((prev) => [...prev, { text: line.text, className: line.className }]);
          }
        }
      }
      if (!cancelled) setDone(true);
    }

    play();
    return () => { cancelled = true; };
  }, [reduceMotion]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, progressLine, buildSnapshot, typingActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26, delay: 0.3 }}
      className={`code-surface overflow-hidden rounded-md border border-line-subtle shadow-card ${className ?? ""}`}
      style={{ transformPerspective: 1200 }}
    >
      {/* 标题栏 —— 印刷感元数据，无 macOS 圆点 */}
      <div className="flex items-center gap-2.5 border-b border-line-subtle bg-paper-warm px-4 py-2.5">
        <span className="inline-block h-2.5 w-2.5 bg-vermillion" aria-hidden />
        <span className="meta-caps text-ink-mute">
          aurora@nebula-opensource
        </span>
        <span className="font-mono text-[0.65rem] text-ink-faint">— zsh — 92×24</span>
        <span className="ml-auto font-mono text-[0.65rem] text-ink-mute">
          forge-core
        </span>
      </div>

      {/* 终端内容 */}
      <div
        ref={containerRef}
        className="code-scroll h-[340px] overflow-y-auto px-5 py-4 font-mono text-[0.82rem] leading-relaxed"
      >
        {lines.map((l, i) => {
          const isLast = i === lines.length - 1;
          return (
            <div key={i} className={l.className ?? "text-ink"}>
              {l.text}
              {typingActive && isLast && <span className="caret" />}
            </div>
          );
        })}

        {/* clone 进度行 —— 单行原地刷新数字，完成后固化为 done. 行 */}
        {progressLine && (
          <div className="text-prussian">{progressLine}</div>
        )}

        {/* zig build 树状输出 —— 多行整体刷新，固定预留 6 行避免行数变化导致跳动 */}
        {buildSnapshot && (
          <div className="text-prussian">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>{buildSnapshot[i] ?? "\u00A0"}</div>
            ))}
          </div>
        )}

        {/* 光标 —— 打字中跟在末行字后（见上 map），非打字时独立显示；完成后停在 $ 提示符 */}
        {!typingActive && !progressLine && !buildSnapshot && (
          <div className="text-ink">
            {done ? "$ " : ""}<span className="caret" />
          </div>
        )}
      </div>
    </motion.div>
  );
}
