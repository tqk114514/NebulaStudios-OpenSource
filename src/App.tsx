import { BrowserRouter, Routes, Route, useLocation } from "react-router";
import { AnimatePresence } from "motion/react";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { RepoLayout } from "@/components/repo/RepoLayout";
import Landing from "@/pages/Landing";
import Explore from "@/pages/Explore";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Repository from "@/pages/Repository";
import Issues from "@/pages/Issues";
import IssueDetail from "@/pages/IssueDetail";
import Pulls from "@/pages/Pulls";
import PullRequest from "@/pages/PullRequest";

/**
 * 路由 key：仓库子路由（/:owner/:repo/*）共用 /:owner/:repo 作为 key，
 * 避免 RepoLayout 在子路由切换时重新挂载；其他路由用完整 pathname
 */
function getRouteKey(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `/${parts[0]}/${parts[1]}`;
  }
  return pathname;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getRouteKey(location.pathname)}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Landing />
            </PageTransition>
          }
        />
        <Route
          path="/explore"
          element={
            <PageTransition>
              <Explore />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/:username"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        {/* 仓库路由 —— RepoLayout 常驻，子路由只换 Outlet 内容 */}
        <Route path="/:owner/:repo" element={<RepoLayout />}>
          <Route index element={<Repository />} />
          <Route path="issues" element={<Issues />} />
          <Route path="issues/:id" element={<IssueDetail />} />
          <Route path="pulls" element={<Pulls />} />
          <Route path="pulls/:id" element={<PullRequest />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  // Landing 首页自带 Hero，不显示顶栏；其余页面常驻顶栏（不随路由切换重新挂载）
  const showNavbar = pathname !== "/";
  return (
    <>
      <AnimatePresence>
        {showNavbar && <Navbar key="navbar" />}
      </AnimatePresence>
      <AnimatedRoutes />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
