import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Search, Menu, X, Plus } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/explore", label: "探索" },
  { to: "/dashboard", label: "仪表盘" },
  { to: "/aurora", label: "个人主页" },
];

/**
 * 印刷感导航栏 —— 滚动后浮现纸白卡片
 * 无毛玻璃，无渐变；激活态用朱砂下划线
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // 路由变化时关闭移动端菜单 —— render 期间调整 state（React 官方推荐模式，
  // 避免在 effect 里同步 setState 造成级联渲染）
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMobileOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -24, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className={cn(
          "mx-auto flex h-16 items-center gap-6 px-5 transition-[max-width,margin,background-color,border-color,box-shadow] duration-300 md:px-8",
          scrolled
            ? "mt-3 max-w-[1180px] rounded-md border border-line-subtle bg-paper-pure shadow-card"
            : "max-w-[1400px] border border-transparent bg-transparent",
        )}
      >
        <Link to="/" className="flex items-center" aria-label="Nebula OpenSource 首页">
          <BrandMark showWordmark size={30} />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "text-ink"
                    : "text-ink-soft hover:text-ink",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-vermillion"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
            <input
              type="text"
              placeholder="搜索仓库 / 用户..."
              className="h-9 w-56 rounded-md border border-line-subtle bg-paper-pure pl-9 pr-12 text-sm text-ink placeholder:text-ink-mute outline-hidden transition-colors focus:border-vermillion/60 lg:w-64"
            />
            <kbd className="absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-line-subtle bg-paper-warm px-1.5 py-0.5 font-mono text-[0.65rem] text-ink-mute lg:block">
              /
            </kbd>
          </div>

          <Link to="/dashboard" className="hidden md:block">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              新建
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm">登录</Button>
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-soft hover:bg-paper-warm md:hidden"
            aria-label="菜单"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 rounded-md border border-line-subtle bg-paper-pure p-3 md:hidden shadow-card"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2.5 text-sm",
                      isActive
                        ? "bg-paper-warm text-ink"
                        : "text-ink-soft hover:text-ink",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
