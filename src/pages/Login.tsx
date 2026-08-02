import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Terminal,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

/** 输入框样式 —— 与 Navbar 等组件统一描边（border-line-subtle + vermillion focus） */
const inputCls =
  "w-full h-11 rounded-md border border-line-subtle bg-paper-pure pl-10 pr-3 text-sm text-ink placeholder:text-ink-mute outline-none transition-colors focus:border-vermillion/50 focus:ring-2 focus:ring-vermillion/10";

/**
 * 印刷感登录页 —— 左侧品牌叙事（纸格背景），右侧表单（纯白）
 * 无粒子，无渐变；朱砂作激活态与强调
 */
export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1100);
  }

  const strength = Math.min(4, Math.floor(pwd.length / 3));
  const strengthLabel = ["", "弱", "一般", "良好", "强"][strength];
  const strengthColor = [
    "bg-ink-faint",
    "bg-vermillion",
    "bg-vermillion-deep",
    "bg-forest",
    "bg-prussian",
  ][strength];

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      {/* 左：品牌叙事 */}
      <div className="relative hidden overflow-hidden border-r border-line-subtle bg-paper lg:block">
        <div className="absolute inset-0 bg-paper-grid bg-paper-grid-fade opacity-60" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[500px]"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(226,69,28,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex h-full flex-col justify-center p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer(0.12)}
            className="flex flex-col gap-6"
          >
            <motion.h1 variants={fadeUp} className="display-tight text-5xl text-ink xl:text-6xl">
              欢迎回到
              <br />
              <span className="text-vermillion">你的代码平台</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="max-w-md text-lg text-ink-soft">
              自托管、极简、丝滑。在一个属于你自己的服务器上，托管一切。
            </motion.p>

            <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-3">
              {[
                { icon: Zap, text: "比 Gitea 快 3 倍，内存峰值 12MB" },
                { icon: Shield, text: "数据从未离开你的服务器" },
                { icon: Terminal, text: "单二进制部署，零依赖" },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-3 text-sm text-ink-soft">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-subtle bg-paper-pure">
                    <f.icon className="h-4 w-4 text-vermillion" />
                  </span>
                  {f.text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="mt-12 flex items-center gap-3 font-mono text-xs text-ink-mute">
            <span>© 2026 Nebula OpenSource</span>
            <span className="h-1 w-1 bg-ink-faint" />
            <a href="#" className="hover:text-ink-soft">文档</a>
            <span className="h-1 w-1 bg-ink-faint" />
            <a href="#" className="hover:text-ink-soft">隐私</a>
          </div>
        </div>
      </div>

      {/* 右：表单 */}
      <div className="relative flex items-center justify-center bg-paper px-6 py-12">
        <motion.div
          layout
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="relative w-full max-w-sm"
        >
          {/* 模式切换 */}
          <div className="mb-8 flex items-center gap-1 rounded-md border border-line-subtle bg-paper-pure p-1">
            {(["login", "register"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="relative flex-1 rounded-xs px-4 py-2 text-sm font-medium transition-colors"
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-mode"
                    className="absolute inset-0 rounded-xs bg-vermillion-tint border border-vermillion/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn("relative", mode === m ? "text-vermillion-deep" : "text-ink-soft")}>
                  {m === "login" ? "登录" : "注册"}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-3xl text-ink">
                {mode === "login" ? "继续旅程" : "启程出发"}
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                {mode === "login" ? "登录到你的 Nebula OpenSource 账户" : "创建你的账户，3 秒即可开始"}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
                {mode === "register" && (
                  <Field label="用户名" icon={User} placeholder="aurora">
                    <input
                      required
                      className={inputCls}
                      placeholder="aurora"
                    />
                  </Field>
                )}
                <Field label="邮箱" icon={Mail} placeholder="you@example.com">
                  <input
                    type="email"
                    required
                    className={inputCls}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="密码" icon={Lock}>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
                    <input
                      type={showPwd ? "text" : "password"}
                      required
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      className={cn(inputCls, "pr-10")}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink"
                      aria-label={showPwd ? "隐藏密码" : "显示密码"}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                {/* 密码强度条（仅注册） */}
                <AnimatePresence>
                  {mode === "register" && pwd.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors",
                              i <= strength ? strengthColor : "bg-line-subtle",
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[0.7rem] text-ink-mute">{strengthLabel}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {mode === "login" && (
                  <div className="flex items-center justify-between text-xs">
                    <label className="inline-flex items-center gap-2 text-ink-soft">
                      <input type="checkbox" className="h-3.5 w-3.5 rounded border-line-strong bg-transparent accent-vermillion" />
                      记住我
                    </label>
                    <a href="#" className="text-prussian hover:underline">忘记密码？</a>
                  </div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={loading}
                  rightIcon={!loading ? <ArrowRight className="h-4 w-4" /> : undefined}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper-pure/40 border-t-paper-pure" />
                      {mode === "login" ? "登录中..." : "创建中..."}
                    </span>
                  ) : mode === "login" ? "登录" : "创建账户"}
                </Button>
              </form>

              <p className="mt-10 text-center text-xs text-ink-mute">
                {mode === "login" ? "还没有账户？" : "已有账户？"}{" "}
                <button
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
                  className="font-medium text-vermillion hover:underline"
                >
                  {mode === "login" ? "注册一个" : "去登录"}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  icon: typeof Mail;
  placeholder?: string;
  children: React.ReactNode;
}

function Field({ label, icon: Icon, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="meta-caps text-ink-mute">{label}</span>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
        {children}
      </div>
    </label>
  );
}
