import { Arrow } from "./Icons";

export default function Hero({ pdfUrl }) {
  return <section id="overview" className="hero page-section">
    <div className="hero-meta"><span>论文交互导读 · 88 页</span><span>阅读时间：10 分钟 / 深入阅读</span></div>
    <h1><span>时空可组合性</span><small>A Programming Paradigm for<br />Spatiotemporal Composability</small></h1>
    <p className="authors">Yifan Shi · Wei Zhang · Tianyi Cui <i /> Peking University · DeepSeek-AI</p>
    <div className="hero-thesis">
      <span>一句话读懂</span>
      <p>动态组件不仅要能被加入，还必须能在任意时刻<strong>干净退出</strong>，并随依赖的<strong>出现、消失与替换</strong>正确响应。</p>
    </div>
    <div className="hero-actions">
      <a className="primary-link" href="#quick-tour">10 分钟看懂 <Arrow /></a>
      <a href="#deep-dive">进入完整导读</a>
      <a href={pdfUrl} target="_blank" rel="noreferrer">阅读原论文 PDF ↗</a>
    </div>
    <div className="axis-intro" aria-label="论文的两个维度">
      <div className="temporal"><b>TIME / 时间</b><strong>效果能否被完整撤销？</strong><span>revertible effects</span></div>
      <div className="axis-cross">×</div>
      <div className="spatial"><b>SPACE / 空间</b><strong>依赖能否被声明与响应？</strong><span>reactive coeffects</span></div>
    </div>
  </section>;
}
