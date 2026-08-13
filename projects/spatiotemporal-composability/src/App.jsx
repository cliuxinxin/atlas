import { useEffect, useState } from "react";
import CompositionLab from "./components/CompositionLab";
import DeepDive from "./components/DeepDive";
import Hero from "./components/Hero";
import { CloseIcon, MenuIcon } from "./components/Icons";
import QuickTour from "./components/QuickTour";
import ReferenceIndex from "./components/ReferenceIndex";

const nav = [["overview", "概览"], ["quick-tour", "10 分钟速览"], ["lab", "交互演示"], ["deep-dive", "完整导读"], ["reference", "术语与边界"]];

export default function App() {
  const [active, setActive] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const pdfUrl = `${import.meta.env.BASE_URL}paper.pdf`;

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (typeof IntersectionObserver === "undefined") return () => window.removeEventListener("scroll", onScroll);
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)), { rootMargin: "-20% 0px -65%" });
    nav.forEach(([id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => { observer.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <div className="app-shell">
    <header className="topbar"><a className="brand" href="#overview"><b>ST</b><span>Spatiotemporal<br />Composability</span></a><nav>{nav.slice(1).map(([id, label]) => <a className={active === id ? "active" : ""} key={id} href={`#${id}`}>{label}</a>)}</nav><a className="top-pdf" href={pdfUrl} target="_blank" rel="noreferrer">PDF · 88 页 ↗</a><button type="button" className="menu-button" aria-label="打开目录" onClick={() => setMenuOpen(true)}><MenuIcon /></button><i className="progress" style={{ width: `${progress}%` }} /></header>
    <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}><button type="button" aria-label="关闭目录" onClick={() => setMenuOpen(false)}><CloseIcon /></button>{nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</aside>
    <aside className="chapter-rail"><span>阅读路径</span>{nav.map(([id, label], index) => <a className={active === id ? "active" : ""} key={id} href={`#${id}`}><b>0{index + 1}</b>{label}</a>)}<em>SCROLL<br />TO EXPLORE</em></aside>
    <main><Hero pdfUrl={pdfUrl} /><QuickTour /><CompositionLab /><DeepDive /><ReferenceIndex pdfUrl={pdfUrl} /></main>
    <footer><span>Atlas / Paper Reader</span><a href="#overview">回到顶部 ↑</a><p>内容基于论文原文整理；工程类比用于解释，不替代作者的形式定义。</p></footer>
  </div>;
}
