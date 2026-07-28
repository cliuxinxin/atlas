import { useEffect, useState } from "react";

const pdfUrl = `${import.meta.env.BASE_URL}graph-engineering-systems.pdf`;

const stages = [
  {
    id: "loop", number: "01", short: "Loop", title: "可验证循环",
    subtitle: "一次只改一件事",
    copy: "Autoresearch 把研究装进一个有评估、有回滚的执行环境。Agent 提议变更，跑约 5 分钟训练，只保留让指标改善的提交。",
    signal: "可验证 · 可逆 · 短反馈 · 有边界",
    color: "#ff9e18"
  },
  {
    id: "swarm", number: "02", short: "Swarm", title: "异步智能体群",
    subtitle: "并行探索，而非共享长对话",
    copy: "AgentHub 让大量 Agent 在不同分支探索。Git 提交承载实验，消息板承载假设与失败，协作的核心从合并主干变成遍历搜索图。",
    signal: "专业分工 · 独立上下文 · 并行搜索",
    color: "#38bdf8"
  },
  {
    id: "dag", number: "03", short: "DAG", title: "工作谱系",
    subtitle: "让替代路线继续存活",
    copy: "提交是节点，父提交是边。系统能够查询谁尝试了什么、哪些叶子仍未评估、哪条谱系改善最快，而不必把所有历史塞回上下文。",
    signal: "谱系 · 分支 · 证据 · 可追溯",
    color: "#3dd6c6"
  },
  {
    id: "graph", number: "04", short: "Knowledge Graph", title: "持久共享记忆",
    subtitle: "图保存事实，DAG 保存工作",
    copy: "知识图谱记录实体、声明、来源与关系；任务只检索一个有边界的相关子图。它不会把声明变成真理，但能让证据、冲突和不确定性可检查。",
    signal: "实体解析 · 溯源 · 多跳查询 · 版本化",
    color: "#6aa8ff"
  }
];

const path = [
  ["Day 1", "反思循环", "保存每版产物；明确评价标准与停止规则。"],
  ["Day 2", "添加工具", "只为一个已测量的错误类别增加一种工具。"],
  ["Week 1", "结构化计划", "路径会变化时才规划；先验证依赖再执行。"],
  ["Week 2", "角色分工", "从生成者 + 批评者开始，以产物契约交接。"],
  ["Month 1", "持久图", "保存实体、声明、来源、运行、版本与开放问题。"],
  ["Month 2", "规模化 Swarm", "先定义 reducer，再设置并发、预算和验证门。"]
];

const metrics = [
  ["抽取", "实体 / 关系 F1", "高精度可能掩盖漏抽"],
  ["消歧", "Pairwise P / R", "压缩率高可能是过度合并"],
  ["图结构", "组件数 / 密度", "连成一片不一定更正确"],
  ["查询", "答案 + 引用路径", "流畅答案可能引用错边"],
  ["工作流", "成功率 / 成本", "更多 Agent 可能只增加活动量"],
  ["运维", "恢复 / 修正率", "平均值会隐藏灾难性失败"]
];

const checklist = ["目标可测试", "指标区分进步", "变更可回滚", "工具参数有类型", "产物契约明确", "每条声明可溯源", "消歧可逆", "预算有上限", "趋势被监控", "中断后可恢复"];

function Mark() {
  return <span className="mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" /></svg>;
}

function Graph({ active, setActive }) {
  return (
    <div className="graph" aria-label="Loop 到知识图谱的架构演进图">
      <div className="graph-head"><span>体系演进图谱</span><em>控制流</em><em>知识流</em></div>
      <svg className="edges" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="arrow-a" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#ff9e18"/></marker>
          <marker id="arrow-b" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#4ca5ff"/></marker>
        </defs>
        <path className="control" d="M155 165H290M380 165H510M600 165H735" markerEnd="url(#arrow-a)" />
        <path className="knowledge" d="M765 112C700 32 570 32 535 112M765 112C690 8 350 5 325 112M765 215C690 315 340 315 325 218M540 218C510 283 355 283 325 218" markerEnd="url(#arrow-b)" />
      </svg>
      <div className="nodes">
        {stages.map((item) => (
          <button key={item.id} onClick={() => setActive(item.id)} className={`node ${active === item.id ? "active" : ""}`} style={{ "--node": item.color }}>
            <span>{item.number}</span>
            <b>{item.short}</b>
            <small>{item.title}</small>
          </button>
        ))}
      </div>
      <div className="node-detail">
        {stages.map(item => item.id === active ? <div key={item.id}>
          <span style={{ color: item.color }}>{item.number} / {item.short}</span>
          <h3>{item.subtitle}</h3><p>{item.copy}</p><strong>{item.signal}</strong>
        </div> : null)}
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState("loop");
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? (scrollY / max) * 100 : 0);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <div className="progress"><span style={{ width: `${progress}%` }} /></div>
      <header className="topbar">
        <a className="brand" href="#overview"><Mark /><span>GRAPH <b>/ SYSTEMS</b></span></a>
        <nav className={menu ? "open" : ""}>
          <a href="#overview" onClick={() => setMenu(false)}>总览</a>
          <a href="#progression" onClick={() => setMenu(false)}>方法演进</a>
          <a href="#architecture" onClick={() => setMenu(false)}>架构选型</a>
          <a href="#build" onClick={() => setMenu(false)}>构建路径</a>
          <a href="#quality" onClick={() => setMenu(false)}>质量体系</a>
        </nav>
        <a className="pdf" href={pdfUrl} target="_blank" rel="noreferrer">下载 PDF <ArrowIcon /></a>
        <button className="menu" aria-label="打开导航" onClick={() => setMenu(value => !value)}>菜单</button>
      </header>

      <main>
        <section className="hero" id="overview">
          <div className="hero-copy">
            <h1>从单一循环，<br />到<span>图上协作</span></h1>
            <p>真正的瓶颈往往不是下一次模型调用，而是记忆与评估放在哪里。这份报告把自治实验、多智能体协作、工作 DAG 与知识图谱连接成一条可落地的工程路线。</p>
            <div className="thesis"><b>核心命题</b><span>让隐式状态变显式，让易失记忆变持久，让估计变证据。</span></div>
          </div>
          <Graph active={active} setActive={setActive} />
        </section>

        <section className="section progression" id="progression">
          <header className="section-head"><span>01</span><div><h2>每一层，只解决一个新瓶颈</h2><p>架构不是成熟度徽章。只有当前一层的限制真实存在时，下一层才值得付出复杂度。</p></div></header>
          <div className="rail">
            {stages.map(item => <button key={item.id} onClick={() => setActive(item.id)} className={active === item.id ? "active" : ""}>
              <i style={{ "--dot": item.color }} /><span>{item.number}</span><b>{item.short}</b><small>{item.title}</small>
            </button>)}
          </div>
        </section>

        <section className="section architecture" id="architecture">
          <header className="section-head"><span>02</span><div><h2>先问六个问题，再选架构</h2><p>这不是“Agent 越多越好”的路线图，而是一套复杂度预算。</p></div></header>
          <div className="decision">
            <div className="questions">
              {[
                ["01", "成功可验证吗？", "不可验证，就先定义测试、证据要求或人工决策。"],
                ["02", "步骤稳定吗？", "稳定用 Chain；变化大才需要 Planner 或 Orchestrator。"],
                ["03", "子任务独立吗？", "独立才并行；耦合写入必须显式建依赖。"],
                ["04", "替代路线要保留吗？", "要保留，使用 DAG 而不是强迫所有结果合并。"],
                ["05", "事实要跨会话存活吗？", "需要时持久化产物与图状态，而非对话摘要。"],
                ["06", "成本和延迟允许吗？", "加 Worker 前先限定调用数、并发、Token 和时间。"]
              ].map(([n, q, a]) => <article key={n}><b>{n}</b><div><h3>{q}</h3><p>{a}</p></div></article>)}
            </div>
            <aside className="rule">
              <span>最小可靠单元</span>
              <code>inspect → propose → apply<br />→ evaluate → keep | revert</code>
              <p>Autoresearch 有效，是因为结果可测、动作可逆、反馈够短、环境有边界。</p>
            </aside>
          </div>
        </section>

        <section className="section build" id="build">
          <header className="section-head"><span>03</span><div><h2>从一天的循环，到两个月的群体</h2><p>先保存产物，再保存对话；先定义 reducer，再扩大 fan-out。</p></div></header>
          <div className="build-path">
            {path.map(([time, title, copy], index) => <article key={time}>
              <span>{String(index + 1).padStart(2, "0")}</span><small>{time}</small><h3>{title}</h3><p>{copy}</p>
            </article>)}
          </div>
          <div className="planes">
            <h3>参考生产架构 / 五个平面</h3>
            <div>{["Control 目标与预算", "Execution 工具与隔离", "Artifact 版本化产物", "Graph 实体与谱系", "Evaluation 测试与评审"].map((x, i) => <span key={x}><b>0{i + 1}</b>{x}</span>)}</div>
          </div>
        </section>

        <section className="section quality" id="quality">
          <header className="section-head"><span>04</span><div><h2>评估每一层，不只评估最终答案</h2><p>图工程的危险不是“跑不起来”，而是系统流畅地扩大错误。</p></div></header>
          <div className="quality-grid">
            <div className="metric-table">
              <div className="metric-row heading"><span>层</span><span>关键指标</span><span>最常见误读</span></div>
              {metrics.map(row => <div className="metric-row" key={row[0]}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}
            </div>
            <aside className="warning"><span>不要使用图，当——</span><p>任务彼此独立；不需要跨会话状态；一个关系表足够；来源溯源不重要；或抽取错误会超过遍历收益。</p><strong>图只有在连接查询、变化关系、溯源或共享世界状态成为核心时，才赚回成本。</strong></aside>
          </div>
          <div className="checklist">
            <h3>Production checklist</h3>
            {checklist.map((item, index) => <span key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</span>)}
          </div>
        </section>

        <section className="conclusion">
          <p>一个可靠的图工程系统，应当让每个重要输出都能追溯到：</p>
          <h2>目标、计划、产物、来源、图路径、评估决策，以及有边界的执行记录。</h2>
          <a href={pdfUrl} target="_blank" rel="noreferrer">阅读 11 页完整报告 <ArrowIcon /></a>
        </section>
      </main>
      <footer><div className="brand"><Mark /><span>GRAPH <b>/ SYSTEMS</b></span></div><p>基于《Graph Engineering Systems》独立中文解析</p><a href="#overview">返回顶部 ↑</a></footer>
    </>
  );
}

export default App;
