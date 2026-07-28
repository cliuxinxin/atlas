import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Chevron, Close, Download, Menu } from "./icons";
import { benchmarkGroups, cases, chapters, metrics } from "./data";

const pdfUrl = `${import.meta.env.BASE_URL}k3_tech_report.pdf`;

function K3Mark() {
  return (
    <a className="brand" href="#overview" aria-label="回到概览">
      <span className="brand-mark">K3</span>
      <span>Kimi K3 技术报告解析</span>
    </a>
  );
}

function Header({ active, onMenu }) {
  return (
    <header className="topbar">
      <K3Mark />
      <nav className="topnav" aria-label="主导航">
        {chapters.map((chapter) => (
          <a key={chapter.id} className={active === chapter.id ? "active" : ""} href={`#${chapter.id}`}>
            {chapter.label.replace("总览", "").replace("开放 3T 时代", "概览").replace("预训练与后训练", "训练").replace("评测结果", "评测").replace("应用案例", "案例")}
          </a>
        ))}
      </nav>
      <a className="pdf-link" href={pdfUrl} target="_blank" rel="noreferrer">
        阅读原文 <span>PDF · 47 页</span> <ArrowUpRight size={16} />
      </a>
      <button className="menu-button" type="button" onClick={onMenu} aria-label="打开章节导航">
        <Menu />
      </button>
    </header>
  );
}

function ChapterNav({ active, open, onClose }) {
  return (
    <aside className={`chapter-nav ${open ? "open" : ""}`}>
      <div className="mobile-nav-head">
        <span>报告目录</span>
        <button type="button" onClick={onClose} aria-label="关闭章节导航"><Close /></button>
      </div>
      <div className="rail-title">目录 · 6 章</div>
      <nav aria-label="报告章节">
        {chapters.map((chapter) => (
          <a key={chapter.id} className={active === chapter.id ? "active" : ""} href={`#${chapter.id}`} onClick={onClose}>
            <span className="chapter-number">{chapter.number}</span>
            <span className="chapter-copy">
              <strong>{chapter.label}</strong>
              <small>{chapter.detail}</small>
              <em>第 {chapter.pages} 页</em>
            </span>
          </a>
        ))}
      </nav>
      <a className="download-link" href={pdfUrl} download>
        <Download />
        <span><strong>下载 PDF</strong><small>完整报告 · 1.7 MB</small></span>
      </a>
    </aside>
  );
}

function ProgressRail({ progress, active }) {
  const chapter = chapters.find((item) => item.id === active) ?? chapters[0];
  return (
    <aside className="progress-rail">
      <div>
        <span className="rail-label">阅读进度</span>
        <strong>{Math.round(progress)}%</strong>
      </div>
      <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      <div className="takeaways">
        <span className="rail-label">本章坐标</span>
        <b>{chapter.number}</b>
        <strong>{chapter.label}</strong>
        <p>{chapter.detail}</p>
      </div>
      <div className="rail-source">
        <span>来源</span>
        <a href="https://github.com/MoonshotAI/Kimi-K3" target="_blank" rel="noreferrer">
          MoonshotAI / Kimi-K3 <ArrowUpRight size={14} />
        </a>
      </div>
    </aside>
  );
}

function SectionHead({ number, title, intro }) {
  return (
    <header className="section-head">
      <span>{number}</span>
      <div><h2>{title}</h2><p>{intro}</p></div>
    </header>
  );
}

function Overview() {
  return (
    <section id="overview" className="chapter-section overview-section">
      <div className="page-index">第 1 章 / 共 6 章</div>
      <h1>开放 3T 时代</h1>
      <p className="lead">
        Kimi K3 同时推进预训练规模与测试时计算：用混合注意力延伸序列，用跨层注意力打通深度，
        再以高稀疏 MoE 扩展宽度，最终形成一个原生多模态、面向长程智能体的开放模型。
      </p>
      <div className="metric-row">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong><span>{metric.label}</span><small>{metric.note}</small>
          </div>
        ))}
      </div>
      <div className="thesis">
        <span>一句话结论</span>
        <p>这不是单纯把参数堆到 2.8T，而是围绕“百万 Token 的长程行动”重新设计模型、训练与系统。</p>
      </div>
    </section>
  );
}

const axisData = [
  {
    axis: "序列 / Sequence",
    title: "Hybrid KDA–MLA",
    description: "每个 Block 由 3 层 KDA 与 1 层 Gated MLA 组成，让线性长序列混合与全局注意力交替出现。",
    facts: ["69 KDA + 24 MLA", "3 : 1 混合比例", "NoPE 外推至 1M"]
  },
  {
    axis: "深度 / Depth",
    title: "Attention Residuals",
    description: "每层不再只接收上一层结果，而是用学习到的伪查询，从 Embedding 与所有历史 Block 中选择信息。",
    facts: ["跨层选择性检索", "稳定深层信息流", "93 层主干网络"]
  },
  {
    axis: "宽度 / Width",
    title: "Stable LatentMoE",
    description: "把路由计算放入低维潜空间，并结合 SiTU-GLU 与 Quantile Balancing，稳定极端稀疏训练。",
    facts: ["896 Routed Experts", "每 Token 激活 16 个", "2 个 Shared Experts"]
  }
];

function Architecture() {
  return (
    <section id="architecture" className="chapter-section">
      <SectionHead number="02" title="三轴协同的架构设计" intro="K3 的核心不是单点创新，而是在序列、网络深度与模型宽度三个维度上同时改善信息流。" />
      <div className="axis-diagram">
        {axisData.map((item, index) => (
          <article className="axis" key={item.axis}>
            <div className="axis-label"><span>0{index + 1}</span>{item.axis}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <ul>{item.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            {index < axisData.length - 1 ? <div className="connector" aria-hidden="true"><span /></div> : null}
          </article>
        ))}
      </div>
      <div className="architecture-note">
        <strong>原生视觉路径</strong>
        <p>MoonViT-V2 从预训练开始就与语言主干联合优化，而不是在语言模型完成后再做视觉对齐。</p>
        <span>401M ViT 参数 · 27 层 · Patch 14</span>
      </div>
    </section>
  );
}

function Training() {
  const stages = [
    ["01", "预训练", "Web、代码、数学、知识与大规模视觉语料，从 8K 扩至 64K。"],
    ["02", "长上下文冷却", "通过 256K → 1M 的课程学习，把昂贵长序列计算集中在少量预算内。"],
    ["03", "多领域 RL", "覆盖通用推理、知识、代码、智能体与多种 reasoning effort。"],
    ["04", "多教师蒸馏", "将不同领域和思考强度的专家策略整合进一个统一模型。"]
  ];
  return (
    <section id="training" className="chapter-section">
      <SectionHead number="03" title="从预训练到百万 Token 强化学习" intro="训练目标从“预测下一个 Token”延伸为长时间持续推理、行动、观察、验证与适应。" />
      <div className="training-flow">
        {stages.map(([number, title, copy]) => (
          <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>
        ))}
      </div>
      <blockquote>
        <span>关键设计</span>
        <p>真正的长文本不只是“更长的数据”。K3 会合成只有跨越完整 1M 上下文才能解开的多模态子任务，避免模型退化为局部匹配。</p>
      </blockquote>
    </section>
  );
}

function Infrastructure() {
  const items = [
    ["KDA systems co-design", "融合 Kernel、KDA Context Parallelism 与状态感知 Prefix Cache，让递归状态可跨设备、跨请求延续。"],
    ["MoonEP", "静态计算形状与零拷贝通信，实现负载完全均衡的 Expert Parallel 训练。"],
    ["Persistent Agentic RL", "部分 Rollout、外部 KV Cache、可恢复 microVM Sandbox 共同保留长程模型与环境状态。"],
    ["Fleet scheduling", "按缓存命中、Token 预算与请求类型调度，隔离突发的长上下文流量。"]
  ];
  return (
    <section id="infrastructure" className="chapter-section">
      <SectionHead number="04" title="把 3T 模型和 1M 轨迹跑起来" intro="论文把基础设施视为模型能力的一部分：如果状态无法被保留，百万 Token 的 Agentic RL 就无法成立。" />
      <div className="infra-list">
        {items.map(([title, copy], index) => (
          <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><Chevron /></article>
        ))}
      </div>
    </section>
  );
}

function Evaluation() {
  const [groupKey, setGroupKey] = useState("coding");
  const [selected, setSelected] = useState(0);
  const group = benchmarkGroups[groupKey];
  const active = group.rows[selected];

  const changeGroup = (key) => {
    setGroupKey(key);
    setSelected(0);
  };

  return (
    <section id="evaluation" className="chapter-section">
      <SectionHead number="05" title="优势明确，边界也明确" intro="K3 在代码和智能体任务上尤其强；研究级推理仍是论文主动承认的差距。" />
      <div className="benchmark-tabs" role="tablist" aria-label="评测分类">
        {Object.entries(benchmarkGroups).map(([key, value]) => (
          <button key={key} className={groupKey === key ? "active" : ""} type="button" onClick={() => changeGroup(key)} role="tab" aria-selected={groupKey === key}>
            {value.label}
          </button>
        ))}
      </div>
      <div className="benchmark-layout">
        <div className="benchmark-table">
          <div className="table-head"><span>Benchmark</span><span>Kimi K3</span><span>相对尺度</span></div>
          {group.rows.map((row, index) => (
            <button type="button" className={selected === index ? "active" : ""} key={row.name} onClick={() => setSelected(index)}>
              <span>{row.name}</span><strong>{row.score.toFixed(1)}</strong>
              <i><span style={{ width: `${row.score}%` }} /></i><Chevron size={15} />
            </button>
          ))}
        </div>
        <aside className="benchmark-detail" aria-live="polite">
          <span>当前解读</span><strong>{active.name}</strong><b>{active.score.toFixed(1)}</b><p>{active.note}</p>
        </aside>
      </div>
      <p className="method-note">注：不同基准的量纲与评测协议不同，分数不应横向相加；页面保留报告中的原始数值。</p>
    </section>
  );
}

function Cases() {
  return (
    <section id="cases" className="chapter-section cases-section">
      <SectionHead number="06" title="能力最终体现在长程作品里" intro="报告中的案例比单轮问答更接近真实工作：持续调用工具、验证中间结果，并留下可运行的交付物。" />
      <div className="case-list">
        {cases.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span><h3>{item.title}</h3><p>{item.summary}</p><strong>{item.fact}</strong>
          </article>
        ))}
      </div>
      <div className="closing">
        <h2>开放权重，开放的是一条工程路径。</h2>
        <p>K3 的价值不仅是榜单成绩，还包括 KDA、Attention Residuals、稀疏 MoE、长程 RL 与服务系统如何彼此咬合的完整证据链。</p>
        <a href={pdfUrl} target="_blank" rel="noreferrer">继续阅读完整报告 <ArrowUpRight /></a>
      </div>
      <footer>
        <span>内容来源：Moonshot AI · Kimi K3 Technical Report</span>
        <a href="../">返回 Atlas</a>
      </footer>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("overview");
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const chapterIds = useMemo(() => new Set(chapters.map((chapter) => chapter.id)), []);

  useEffect(() => {
    const onScroll = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maximum > 0 ? Math.min(100, (window.scrollY / maximum) * 100) : 0);
    };
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && chapterIds.has(visible.target.id)) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -55% 0px", threshold: [0.08, 0.25, 0.5] });
    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapterIds]);

  return (
    <>
      <Header active={active} onMenu={() => setMenuOpen(true)} />
      <ChapterNav active={active} open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen ? <button className="nav-scrim" type="button" onClick={() => setMenuOpen(false)} aria-label="关闭导航遮罩" /> : null}
      <main className="reader">
        <Overview />
        <Architecture />
        <Training />
        <Infrastructure />
        <Evaluation />
        <Cases />
      </main>
      <ProgressRail progress={progress} active={active} />
    </>
  );
}

