import { useState } from "react";
const keys = ["science", "life", "tradition"];
export default function Perspectives({ lesson }) {
  const [active, setActive] = useState("science");
  return (
    <section className="perspectives">
      <h2>从不同角度理解这次练习</h2>
      <div className="perspective-tabs">
        {keys.map((k) => (
          <button
            className={active === k ? "active" : ""}
            onClick={() => setActive(k)}
            key={k}
          >
            {lesson.perspectives[k].label}
          </button>
        ))}
      </div>
      <article role="region" className={`perspective ${active}`}>
        <h3>{lesson.perspectives[active].label}</h3>
        <p>{lesson.perspectives[active].text}</p>
        <small>
          {active === "science"
            ? "参考：WHO 压力管理指南；数字正念研究综述"
            : active === "tradition"
              ? "传统来源类型：念住与入出息念教导"
              : "把练习带进日常的小建议"}
        </small>
      </article>
    </section>
  );
}
