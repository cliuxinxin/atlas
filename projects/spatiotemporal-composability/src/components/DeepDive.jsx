import { deepDiveChapters } from "../content";

const kindLabel = { paper: "论文证明", implementation: "Cordis 实现", analogy: "工程解读", open: "开放问题" };

export default function DeepDive() {
  return <section id="deep-dive" className="deep-dive page-section">
    <header className="section-title"><span>DEEP DIVE · 10 CHAPTERS</span><h2>需要时，再向下走一层</h2><p>每一章先说人话，再连接工程，最后才展开公式与形式化结论。</p></header>
    <div className="chapter-list">{deepDiveChapters.map((chapter) => <article id={chapter.id} key={chapter.id} className="deep-chapter">
      <div className="chapter-no">{chapter.number}</div><div className="chapter-body"><div className={`kind ${chapter.kind}`}>{kindLabel[chapter.kind]}</div><h3>{chapter.title}</h3><p className="plain">{chapter.plain}</p><div className="developer-note"><span>DEV NOTE</span><p>{chapter.developer}</p></div><details><summary>展开公式与形式化要点 <i>pp. {chapter.pages.join("–")}</i></summary><p data-testid="formal-note">{chapter.formal}</p></details></div>
    </article>)}</div>
  </section>;
}
