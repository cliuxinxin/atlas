import React from "react";
import { curriculum } from "../content/curriculum";
export function buildShareModel(progress, { includeNote = false } = {}) {
  const model = {
    days: progress.completed.length,
    minutes: Math.round(progress.totalSeconds / 60),
    skills: progress.completed.map((day) => curriculum[day - 1].skill),
  };
  if (includeNote && progress.notes?.[progress.completed.at(-1)])
    model.note = progress.notes[progress.completed.at(-1)];
  return model;
}
export default function ShareCard({ progress }) {
  const [includeNote, setIncludeNote] = React.useState(false);
  const model = buildShareModel(progress, { includeNote });
  const text = `我在观心完成了 ${model.days} 天练习，学习了：${model.skills.join("、")}。`;
  return (
    <section className="share">
      <h2>分享我的学习地图</h2>
      <p>
        {model.days} 天 · {model.minutes} 分钟
      </p>
      <p>{model.skills.join(" · ")}</p>
      <label>
        <input
          type="checkbox"
          checked={includeNote}
          onChange={(e) => setIncludeNote(e.target.checked)}
        />
        包含我主动保存的心得
      </label>
      <button onClick={() => navigator.clipboard?.writeText(text)}>
        复制分享文字
      </button>
      <small>心情、不适与精确练习时间不会被分享。</small>
    </section>
  );
}
