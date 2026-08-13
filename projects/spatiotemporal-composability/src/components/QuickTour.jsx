import { quickTour } from "../content";

export default function QuickTour() {
  return <section id="quick-tour" className="quick-tour page-section">
    <header className="section-title"><span>QUICK TOUR · 10 MIN</span><h2>先建立一条完整的直觉</h2><p>沿着一个插件的生命周期，看论文如何把“可卸载”和“懂依赖”变成同一套运行时范式。</p></header>
    <div className="tour-list">
      {quickTour.map((item) => <article key={item.id} className={`tour-step ${item.tone}`} data-testid="tour-step">
        <div className="tour-index"><strong>{item.number}</strong><span>{item.minutes}</span></div>
        <div className="tour-copy"><p className="concept-label">{item.concept}</p><h3>{item.title}</h3><p>{item.thesis}</p><aside><b>工程类比</b>{item.analogy}</aside></div>
        <a className="page-ref" href="#reference">原文 pp. {item.pages.join("–")}</a>
      </article>)}
    </div>
  </section>;
}
