import { useCallback, useEffect, useState } from "react";
import { curriculum } from "./content/curriculum";
import {
  completeSession,
  loadProgress,
  recommendNext,
  saveProgress,
} from "./state/progress";
import PracticePlayer from "./components/PracticePlayer";
import Perspectives from "./components/Perspectives";
import ShareCard from "./components/ShareCard";
const nav = [
  ["today", "今日"],
  ["path", "路径"],
  ["explore", "探索"],
  ["profile", "我的"],
];
function Path({ progress, onStart }) {
  return (
    <main className="page path">
      <p className="kicker">从回来，到带回生活</p>
      <h1>21 天能力地图</h1>
      <p className="intro">
        前 7 天学习基本动作，后 14 天逐步把觉察带入情绪与生活。
      </p>
      <div className="path-list">
        {curriculum.map((x) => {
          const done = progress.completed.includes(x.day),
            locked = x.locked;
          return (
            <article
              key={x.day}
              className={done ? "done" : locked ? "locked" : "available"}
            >
              <span>{String(x.day).padStart(2, "0")}</span>
              <div>
                <small>
                  第 {x.day} 天 · {x.skill}
                </small>
                <h2>{x.title}</h2>
                <p>{done ? "已完成" : locked ? "尚未解锁" : "可以练习"}</p>
              </div>
              {!locked && (
                <button onClick={() => onStart(x.day)}>
                  {done ? "再练一次" : "开始"}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}
export default function App() {
  const [tab, setTab] = useState("today");
  const [progress, setProgress] = useState(() => loadProgress(localStorage));
  const [active, setActive] = useState(null);
  const [review, setReview] = useState(null);
  useEffect(() => {
    saveProgress(localStorage, progress);
  }, [progress]);
  const day = recommendNext(progress);
  const lesson = curriculum[day - 1];
  const finish = useCallback(() => {
    setProgress((p) =>
      completeSession(p, { day: active.day, duration: active.duration }),
    );
    setReview(active.lesson);
    setActive(null);
  }, [active]);
  if (active)
    return (
      <PracticePlayer
        lesson={active.lesson}
        duration={active.duration}
        onComplete={finish}
        onExit={() => setActive(null)}
      />
    );
  if (review)
    return (
      <main className="review">
        <p className="kicker">练习完成</p>
        <h1>刚才的一切，都算练习</h1>
        <p className="intro">
          走神、分心、烦躁或平静，都是心的自然状态。你发现了，并曾经回来，这就是练习。
        </p>
        <div className="reflection">
          <h2>现在感觉如何？</h2>
          {["更紧一些", "差不多", "更松一些", "跳过"].map((x) => (
            <button key={x}>{x}</button>
          ))}
        </div>
        <Perspectives lesson={review} />
        <aside className="master">
          <small>一分钟洞见 · 编辑总结</small>
          <p>“觉察是开始，温柔是方法，持续是关键。”</p>
          <span>综合正念训练中的非评判与耐心原则，并非大师原话。</span>
        </aside>
        <button
          className="primary next"
          onClick={() => {
            setReview(null);
            setTab("path");
          }}
        >
          继续学习路径
        </button>
      </main>
    );
  const start = (n) => {
    const l = curriculum[n - 1];
    setActive({ day: n, lesson: l, duration: l.duration });
  };
  return (
    <div className="app">
      <header className="top">
        <a href="../" aria-label="返回 Atlas">
          观心
        </a>
        <span>{progress.completed.length}/7</span>
      </header>
      {tab === "today" && (
        <main className="today">
          <p>
            第 {day} 天 · {lesson.title}
          </p>
          <h1>今天，只练习回来</h1>
          <p className="intro">不需要清空念头。发现走神，再温和地回来。</p>
          <div className="breath hero-breath" />
          <button className="primary" onClick={() => start(day)}>
            开始 {lesson.duration / 60} 分钟
          </button>
          <button className="secondary">调整时长</button>
          <p className="assurance">可以睁眼、换姿势，也可以随时停止</p>
        </main>
      )}
      {tab === "path" && <Path progress={progress} onStart={start} />}{" "}
      {tab === "explore" && (
        <main className="page explore">
          <h1>从不同角度理解练习</h1>
          <p className="intro">
            科学解释、生活应用与传统智慧并列呈现，不要求你选择一种身份。
          </p>
          {curriculum.slice(0, 3).map((item) => (
            <Perspectives lesson={item} key={item.day} />
          ))}
        </main>
      )}
      {tab === "profile" && (
        <main className="page">
          <h1>我的练习</h1>
          <p>
            已完成 {progress.completed.length} 天 · 共{" "}
            {Math.round(progress.totalSeconds / 60)} 分钟
          </p>
          {progress.completed.length >= 7 ? (
            <ShareCard progress={progress} />
          ) : (
            <p className="locked-share">
              完成第 7 天后，将生成一张不含敏感信息的学习地图。
            </p>
          )}
        </main>
      )}
      <nav className="bottom" aria-label="主导航">
        {nav.map(([key, label]) => (
          <button
            className={tab === key ? "active" : ""}
            onClick={() => setTab(key)}
            key={key}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
