import { motion } from "motion/react";
import {
  Shield,
  Zap,
  GitBranch,
  Lock,
  Container,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { SectionTitle } from "@/components/ui/Card";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  accent: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: "极致性能",
    desc: "纯 Zig 核心，clone 比同类快 3 倍。流式 pack 解析让大仓库内存峰值 < 16MB。",
    accent: "text-vermillion",
  },
  {
    icon: Shield,
    title: "私有可控",
    desc: "数据从未离开你的服务器。单二进制部署，零外部依赖，备份即拷贝。",
    accent: "text-prussian",
  },
  {
    icon: GitBranch,
    title: "完整工作流",
    desc: "Issue、PR、代码评审、分支保护一应俱全。迁移 Git 仓库零成本。",
    accent: "text-forest",
  },
  {
    icon: Lock,
    title: "安全签名",
    desc: "SSH / HTTP 双协议，Webhook 走 HMAC-SHA256，2FA 与令牌权限开箱即用。",
    accent: "text-vermillion-deep",
  },
  {
    icon: Container,
    title: "内置 CI",
    desc: "容器化 job，分层缓存让构建快 4 倍。一行 YAML 描述你的流水线。",
    accent: "text-prussian-deep",
  },
  {
    icon: Webhook,
    title: "可扩展",
    desc: "自定义 pre-receive / post-receive 钩子，RESTful API 与 OAuth 应用支持。",
    accent: "text-forest",
  },
];

/**
 * 特性矩阵 —— 纸白卡片 + 工程色图标
 * 无光晕，无毛玻璃；hover 时边框加深 + 极轻上移
 */
export function FeatureGrid() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.05)}
        >
          <motion.div variants={fadeUp}>
            <SectionTitle
              eyebrow="为什么是 Nebula OpenSource"
              mark="§ 01"
              title={
                <>
                  为代码而生的
                  <br />
                  <span className="text-vermillion">工程美学</span>
                </>
              }
              description="在保留现代体验的同时，把性能与私有性推到极致。每一个细节都经过打磨。"
            />
          </motion.div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} feature={f} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative overflow-hidden rounded-md border border-line-subtle bg-paper-pure p-6 transition-colors duration-300 hover:border-line-strong"
    >
      <div className="relative">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-line-subtle bg-paper-warm">
          <Icon className={`h-5 w-5 ${feature.accent}`} />
        </div>
        <h3 className="mb-2 font-display text-xl text-ink">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{feature.desc}</p>
      </div>

      {/* 底部发丝线 */}
      <div className="mt-5 h-px w-full bg-line-subtle" />
    </motion.div>
  );
}
