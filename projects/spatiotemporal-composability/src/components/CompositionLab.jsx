import { useMemo, useReducer } from "react";
import { getAvailableActions, getContextRows, getDependencyEdges, getLabSummary, initialLabState, labReducer, recommendedActions } from "../lab/state";
import { ContextView, DependencyGraph, OperationLog } from "./LabViews";

const controls = [
  ["LOAD_PLUGIN", "加载插件", "load"], ["PROVIDE_DATABASE", "提供数据库", "provide"], ["REPLACE_DATABASE", "替换为 v2", "replace"], ["REMOVE_DATABASE", "移除数据库", "removeDatabase"], ["UNLOAD_PLUGIN", "卸载插件", "unload"],
];

function statusText(state) {
  if (!state.pluginLoaded) return "未加载";
  if (!state.database) return state.log.some(({ title }) => title === "依赖不再满足") ? "依赖缺失" : "等待 Database";
  return `运行中 · Database ${state.database}`;
}

export default function CompositionLab() {
  const [state, dispatch] = useReducer(labReducer, initialLabState);
  const available = getAvailableActions(state);
  const next = recommendedActions.find((type) => {
    const control = controls.find(([candidate]) => candidate === type);
    return control && available[control[2]];
  });
  const nextLabel = controls.find(([type]) => type === next)?.[1] || "重新开始";
  const rows = useMemo(() => getContextRows(state), [state]);
  const edges = useMemo(() => getDependencyEdges(state), [state]);
  return <section id="lab" className="lab page-section">
    <header className="section-title inverse"><span>INTERACTIVE MODEL</span><h2>亲手运行一次组件生命周期</h2><p>这是用于解释论文机制的教学模型，不是 Cordis 内部实现的逐行复刻。</p></header>
    <div className="lab-toolbar"><div><span>AnalyticsPlugin 状态</span><strong data-testid="lab-status">{statusText(state)}</strong></div><div className="lab-actions">{controls.map(([type, label, key]) => <button key={type} type="button" disabled={!available[key]} onClick={() => dispatch({ type })}>{label}</button>)}<button type="button" onClick={() => dispatch({ type: "RESET" })}>重置</button></div><button className="next-action" type="button" onClick={() => dispatch({ type: next || "RESET" })}>下一步：{nextLabel} →</button></div>
    <p className="sr-only" aria-live="polite">{getLabSummary(state)}</p>
    <div className="lab-grid"><ContextView rows={rows} /><DependencyGraph state={state} edges={edges} /><OperationLog log={state.log} /></div>
  </section>;
}
