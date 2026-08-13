import { useEffect, useState } from "react";
export default function PracticePlayer({
  lesson,
  duration,
  onComplete,
  onExit,
}) {
  const [remaining, setRemaining] = useState(duration);
  const [paused, setPaused] = useState(false);
  const [safety, setSafety] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () =>
        setRemaining((v) => {
          if (v <= 1) {
            clearInterval(id);
            onComplete();
            return 0;
          }
          return v - 1;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [paused, onComplete]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0"),
    ss = String(remaining % 60).padStart(2, "0");
  const step =
    lesson.steps[
      Math.min(
        lesson.steps.length - 1,
        Math.floor((duration - remaining) / (duration / lesson.steps.length)),
      )
    ];
  return (
    <main className="practice">
      <button
        className="text-button close"
        onClick={onExit}
        aria-label="退出练习"
      >
        ×
      </button>
      <p>
        第 {lesson.day} 天 · {lesson.skill}
      </p>
      <h1>{lesson.title}</h1>
      <div className="timer" aria-live="off">
        {mm}:{ss}
      </div>
      <div className="breath" />
      <p className="guidance">{step}</p>
      <div className="practice-actions">
        <button onClick={() => setPaused((v) => !v)}>
          {paused ? "继续" : "暂停"}
        </button>
        <button onClick={() => document.body.classList.toggle("eyes-open")}>
          睁眼模式
        </button>
        <button onClick={() => setSafety(true)}>我不舒服</button>
      </div>
      {safety && (
        <section className="safety" role="dialog" aria-label="不适时的帮助">
          <h2>先停止向内观察</h2>
          <p>
            睁开眼睛，看看周围三件物品，感觉双脚接触地面。你可以立即结束练习。
          </p>
          <button onClick={onExit}>结束练习</button>
          <button onClick={() => setSafety(false)}>我可以继续</button>
        </section>
      )}
    </main>
  );
}
