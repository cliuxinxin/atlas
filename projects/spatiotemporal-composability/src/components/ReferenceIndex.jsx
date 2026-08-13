import { claimBoundaries, contributions, glossary, pageMap } from "../content";

export default function ReferenceIndex({ pdfUrl }) {
  return <section id="reference" className="reference page-section">
    <header className="section-title"><span>REFERENCE</span><h2>带着边界，回到原论文</h2><p>区分论文所证明的、实现所展示的，以及仍需工程系统处理的部分。</p></header>
    <div className="reference-block"><h3>五项核心贡献</h3><ol className="contributions">{contributions.map((item) => <li key={item.number}><b>{String(item.number).padStart(2, "0")}</b><span><strong>{item.title}</strong>{item.detail}</span></li>)}</ol></div>
    <div className="reference-block"><h3>证明了什么 / 没有证明什么</h3><div className="boundaries">{claimBoundaries.map((item) => <article key={item.title}><h4>{item.title}</h4><div><b>✓ 证明了</b><p>{item.proves}</p></div><div><b>— 没有证明</b><p>{item.doesNotProve}</p></div><small>pp. {item.pages.join("–")}</small></article>)}</div></div>
    <div className="reference-columns"><div className="reference-block"><h3>术语速查</h3><dl>{glossary.map((item) => <div key={item.term}><dt><strong>{item.label}</strong><span>{item.term}</span></dt><dd>{item.definition}<small>p. {item.page}</small></dd></div>)}</dl></div><div className="reference-block page-map"><h3>网页 ↔ PDF</h3>{pageMap.map((item) => <a key={item.id} href={`#${item.id}`}><span>{item.title}</span><b>pp. {item.pages.join("–")}</b></a>)}<a className="pdf-download" href={pdfUrl} download>下载完整论文 PDF <b>88 pages ↓</b></a></div></div>
  </section>;
}
