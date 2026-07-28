import { useEffect, useState } from "react";

const pdfUrl = `${import.meta.env.BASE_URL}deepseek-v4.pdf`;

const chapters = [
  ["overview", "1", "总览", "百万 Token 与双模型"],
  ["architecture", "2", "架构", "CSA · HCA · mHC"],
  ["efficiency", "3", "效率", "计算与内存成本"],
  ["training", "4", "训练", "32T+ Token 与 OPD"],
  ["evaluation", "5", "评测", "知识、推理与智能体"],
  ["practice", "6", "实战", "搜索、白领与代码"]
];

const models = {
  pro: {
    name: "V4‑Pro",
    params: "1.6T",
    active: "49B",
    flops: 27,
    kv: 10,
    use: "高性能研究、复杂推理与长程智能体",
    detail: "以更大知识容量换取顶级综合能力；Max 模式在多个开放模型评测中建立新高点。"
  },
  flash: {
    name: "V4‑Flash",
    params: "284B",
    active: "13B",
    flops: 10,
    kv: 7,
    use: "低延迟服务、批量任务与成本敏感场景",
    detail: "规模更小，但增加思考预算后仍能保持强推理表现，是面向吞吐量的效率版本。"
  }
};

const benchmarks = {
  reasoning: [
    ["LiveCodeBench", "93.5", "Pass@1", "报告对照表最高结果"],
    ["Codeforces", "3206", "Rating", "在人类选手中约排第 23"],
    ["Apex Shortlist", "90.2", "Pass@1", "高难度数学推理"],
    ["GPQA Diamond", "90.1", "Pass@1", "接近前沿闭源模型"]
  ],
  long: [
    ["MRCR 1M", "83.5", "MMR", "超过 Gemini‑3.1‑Pro"],
    ["CorpusQA 1M", "62.0", "ACC", "面向真实文档问答"],
    ["上下文长度", "1M", "Tokens", "原生训练与推理支持"],
    ["V4‑Pro KV", "10%", "vs V3.2", "百万 Token 时的缓存占用"]
  ],
  agent: [
    ["SWE Verified", "80.6", "Resolved", "长程软件工程"],
    ["BrowseComp", "83.4", "Pass@1", "网页搜索智能体"],
    ["MCPAtlas", "73.6", "Pass@1", "跨工具泛化"],
    ["R&D Coding", "67", "Pass Rate", "内部真实研发任务"]
  ]
};

function Icon({ children, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">{children}</svg>;
}

function Arrow({ size }) {
  return <Icon size={size}><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" /></Icon>;
}

function Download() {
  return <Icon><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" stroke="currentColor" strokeWidth="1.7" /></Icon>;
}

function Menu() {
  return <Icon><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" /></Icon>;
}

function Header({ active, openMenu }) {
  return (
    <header className="topbar">
      <a className="brand" href="#overview"><span>V4</span><strong>DeepSeek‑V4 技术报告解析</strong></a>
      <nav aria-label="主导航">
        {chapters.map(([id,, label]) => <a className={active === id ? "active" : ""} href={`#${id}`} key={id}>{label}</a>)}
      </nav>
      <a className="paper-link" href={pdfUrl} target="_blank" rel="noreferrer"><Download /> 阅读论文 PDF</a>
      <button className="menu-btn" type="button" onClick={openMenu} aria-label="打开目录"><Menu /></button>
    </header>
  );
}

function Sidebar({ active, progress, open, close }) {
  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="mobile-sidebar-head"><strong>报告目录</strong><button type="button" onClick={close}>关闭</button></div>
        <nav aria-label="章节目录">
          {chapters.map(([id, number, label, detail]) => (
            <a className={active === id ? "active" : ""} href={`#${id}`} key={id} onClick={close}>
              <b>{number}</b><span><strong>{label}</strong><small>{detail}</small></span>
            </a>
          ))}
        </nav>
        <div className="reading-progress">
          <div><span>阅读进度</span><b>{Math.round(progress)}%</b></div>
          <i><span style={{ width: `${progress}%` }} /></i>
          <small>arXiv:2606.19348v1</small>
        </div>
      </aside>
      {open ? <button className="scrim" type="button" onClick={close} aria-label="关闭目录遮罩" /> : null}
    </>
  );
}

function SectionTitle({ number, title, description }) {
  return <header className="section-title"><b>{number}</b><div><h2>{title}</h2><p>{description}</p></div></header>;
}

function EfficiencyBars({ model }) {
  const selected = models[model];
  const rows = [
    ["DeepSeek‑V3.2", 100, 100, "基线"],
    ["V4‑Pro", 27, 10, "高性能"],
    ["V4‑Flash", 10, 7, "高效率"]
  ];
  return (
    <div className="efficiency-chart">
      <div className="chart-head"><h3>百万 Token 时的推理成本</h3><span>DeepSeek‑V3.2 = 100%</span></div>
      <div className="chart-labels"><span>模型</span><span>单 Token FLOPs</span><span>KV Cache</span></div>
      {rows.map(([name, flops, kv, note]) => (
        <div className={`chart-row ${selected.name.includes(name.replace("V4‑", "")) ? "selected" : ""}`} key={name}>
          <div><strong>{name}</strong><small>{note}</small></div>
          <div className="bar-cell"><i><span style={{ width: `${flops}%` }} /></i><b>{flops}%</b></div>
          <div className="bar-cell kv"><i><span style={{ width: `${kv}%` }} /></i><b>{kv}%</b></div>
        </div>
      ))}
    </div>
  );
}

function Overview({ model, setModel }) {
  const selected = models[model];
  return (
    <section id="overview" className="section overview">
      <div className="mode-switch" aria-label="模型模式">
        <span>模型模式</span>
        {Object.entries(models).map(([key, item]) => <button className={model === key ? "active" : ""} type="button" onClick={() => setModel(key)} key={key}>{item.name.replace("V4‑", "")}</button>)}
      </div>
      <h1>百万 Token，<br />不必付出百万代价</h1>
      <p className="lead">DeepSeek‑V4 把长上下文效率当作第一设计目标：先压缩 KV，再选择性地计算注意力，让百万 Token 从实验指标变成可常态使用的工作空间。</p>
      <div className="overview-grid">
        <article className="selected-model">
          <span>当前模型</span><h2>{selected.name}</h2>
          <div><strong>{selected.params}</strong><small>总参数</small></div>
          <div><strong>{selected.active}</strong><small>激活参数</small></div>
          <p>{selected.detail}</p>
        </article>
        <div className="hero-metrics">
          <div><strong>1M</strong><span>上下文长度</span><small>1,048,576 Tokens</small></div>
          <div><strong>32T+</strong><span>训练 Token</span><small>Flash 32T · Pro 33T</small></div>
        </div>
      </div>
      <EfficiencyBars model={model} />
    </section>
  );
}

const architecture = [
  ["CSA", "压缩稀疏注意力", "沿序列维度压缩 KV，再由轻量 Indexer 选出最相关条目进行稀疏注意力。"],
  ["HCA", "高度压缩注意力", "更激进地压缩 KV，但保留密集注意力，覆盖全局信息与低频关键线索。"],
  ["mHC", "流形约束超连接", "将残差映射限制在双随机矩阵流形上，使深层信号传播保持非扩张与稳定。"],
  ["Muon", "优化器", "用混合 Newton–Schulz 迭代改善收敛，同时专门抑制注意力 Logit 爆炸。"]
];

function Architecture() {
  return (
    <section id="architecture" className="section">
      <SectionTitle number="02" title="四块拼图，围绕长上下文重新排列" description="V4 延续 DeepSeekMoE 与 MTP，同时替换注意力结构、强化残差通道，并引入 Muon。" />
      <div className="architecture-flow">
        {architecture.map(([code, title, copy], index) => (
          <article key={code}><b>{code}</b><h3>{title}</h3><p>{copy}</p><span>0{index + 1}</span>{index < 3 ? <Arrow /> : null}</article>
        ))}
      </div>
      <div className="architecture-summary"><strong>协同结果</strong><p>CSA 控制计算量，HCA 保住全局信息，mHC 稳住深层网络，Muon 缩短训练路径。</p></div>
    </section>
  );
}

function Efficiency() {
  return (
    <section id="efficiency" className="section blue-section">
      <SectionTitle number="03" title="效率来自全链路，而不只是一条公式" description="从 FP4 专家权重到异构 KV Cache，再到磁盘前缀复用，系统共同决定 1M 上下文是否经济。" />
      <div className="efficiency-list">
        {[
          ["27% / 10%", "V4‑Pro", "相对 V3.2 的单 Token FLOPs / KV Cache"],
          ["10% / 7%", "V4‑Flash", "相对 V3.2 的单 Token FLOPs / KV Cache"],
          ["FP4", "专家权重", "训练后期量化感知，减少 MoE 内存与计算"],
          ["On‑disk", "KV Cache", "将共享前缀从显存扩展到磁盘存储"]
        ].map(([value, label, copy]) => <article key={label}><strong>{value}</strong><h3>{label}</h3><p>{copy}</p></article>)}
      </div>
    </section>
  );
}

function Training() {
  return (
    <section id="training" className="section">
      <SectionTitle number="04" title="先培养专家，再合并为一个模型" description="预训练之外，V4 的后训练采用领域专家训练与 On‑Policy Distillation 两阶段路线。" />
      <div className="timeline">
        {[
          ["01", "32T / 33T 预训练", "Flash 与 Pro 分别在 32T、33T 高质量 Token 上训练。"],
          ["02", "SFT 建立领域能力", "数学、代码、Agent 与指令遵循分别使用高质量数据启动。"],
          ["03", "GRPO 强化学习", "用针对成功标准设计的 Reward Model 优化领域行为。"],
          ["04", "On‑Policy Distillation", "统一模型作为学生，通过 reverse KL 学习所有教师策略。"]
        ].map(([num, title, copy]) => <article key={num}><b>{num}</b><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
    </section>
  );
}

function Evaluation() {
  const [tab, setTab] = useState("reasoning");
  return (
    <section id="evaluation" className="section">
      <SectionTitle number="05" title="成绩很强，报告也保留了边界" description="Pro‑Max 在开放模型中建立新基线，但知识与 Agent 任务仍与最强闭源系统存在差距。" />
      <div className="tabs" role="tablist">
        {[["reasoning", "知识与推理"], ["long", "1M 长上下文"], ["agent", "智能体"]].map(([key, label]) => <button role="tab" aria-selected={tab === key} className={tab === key ? "active" : ""} type="button" onClick={() => setTab(key)} key={key}>{label}</button>)}
      </div>
      <div className="benchmark-grid">
        {benchmarks[tab].map(([name, value, unit, note]) => <article key={name}><span>{name}</span><strong>{value}</strong><small>{unit}</small><p>{note}</p></article>)}
      </div>
      <p className="boundary"><b>论文原话的态度：</b>推理能力距离最前沿闭源模型约有 3–6 个月的发展差距；Agent 公开评测总体仍略逊于最强闭源模型。</p>
    </section>
  );
}

function Practice() {
  return (
    <section id="practice" className="section practice">
      <SectionTitle number="06" title="最终问题：它能不能接手真实工作？" description="报告用搜索、中文白领任务和内部研发工作负载补充自动化基准。" />
      <div className="practice-rows">
        {[
          ["搜索", "长文档检索与 Agentic Search", "百万上下文支撑跨文档证据整合"],
          ["中文白领任务", "63% non‑loss rate", "相对 Opus‑4.6‑Max 的盲测结果"],
          ["真实研发 Coding", "67% Pass Rate", "30 个经过筛选的内部研发任务"],
          ["开发者调查", "91% Yes / Lean Yes", "85 位日常使用者对主力 Coding 模型的判断"]
        ].map(([title, value, copy]) => <article key={title}><h3>{title}</h3><strong>{value}</strong><p>{copy}</p><Arrow /></article>)}
      </div>
      <div className="closing">
        <h2>V4 的真正主张不是“更长”，而是“长得起”。</h2>
        <p>当每个新 Token 的计算与缓存成本被压低，长程推理、持续 Agent 工作流乃至在线学习才有可扩展的系统基础。</p>
        <a href={pdfUrl} target="_blank" rel="noreferrer">阅读完整论文 <Arrow /></a>
      </div>
      <footer><span>DeepSeek‑AI · arXiv:2606.19348v1</span><a href="../">返回 Atlas</a></footer>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState("overview");
  const [model, setModel] = useState("pro");
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? Math.min(100, scrollY / max * 100) : 0);
      const readingLine = scrollY + Math.min(innerHeight * 0.35, 320);
      let current = chapters[0][0];
      chapters.forEach(([id]) => {
        const node = document.getElementById(id);
        if (node && node.offsetTop <= readingLine) current = id;
      });
      setActive(current);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header active={active} openMenu={() => setMenu(true)} />
      <Sidebar active={active} progress={progress} open={menu} close={() => setMenu(false)} />
      <main>
        <Overview model={model} setModel={setModel} />
        <Architecture />
        <Efficiency />
        <Training />
        <Evaluation />
        <Practice />
      </main>
    </>
  );
}
