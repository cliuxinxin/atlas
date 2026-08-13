export function ContextView({ rows }) {
  return <section className="lab-panel context-panel"><header><span>01</span><h3>当前 Context</h3></header><div className="context-rows">
    {rows.map((item) => <div key={item.id} data-testid={`context-${item.id}`} className={item.present ? "present" : "absent"}><i /><span><strong>{item.label}</strong><small>{item.owner}</small></span><b>{item.present ? (item.id === "logger" ? "可用" : "存在") : "缺席"}</b></div>)}
  </div></section>;
}

export function DependencyGraph({ state, edges }) {
  return <section className="lab-panel graph-panel"><header><span>02</span><h3>依赖拓扑</h3></header><div className="graph-canvas">
    <svg viewBox="0 0 420 190" role="img" aria-labelledby="graph-title"><title id="graph-title">AnalyticsPlugin 对 Logger 与 Database 的依赖</title>
      {edges.map((edge, index) => <path key={edge.target} d={`M142 95 C 210 ${index ? 150 : 35}, 250 ${index ? 150 : 35}, 292 ${index ? 150 : 35}`} />)}
    </svg>
    <div className={`graph-node plugin ${state.pluginLoaded ? "online" : ""}`}>Analytics<br /><b>Plugin</b></div>
    <div className="graph-node logger online">Logger</div>
    <div className={`graph-node database ${state.database ? "online" : ""}`}>{state.database ? `Database ${state.database}` : "Database ?"}</div>
  </div><ul className="edge-list">{edges.length ? edges.map((edge) => <li key={edge.target}>{edge.source} → {edge.target}（必需）</li>) : <li>插件尚未声明运行中的依赖</li>}</ul></section>;
}

export function OperationLog({ log }) {
  return <section className="lab-panel log-panel"><header><span>03</span><h3>操作 / 逆操作</h3></header><ol>{log.length ? log.map((item) => <li key={item.id} className={item.direction}><i>{String(item.id).padStart(2, "0")}</i><div><strong>{item.title}</strong><p>{item.detail}</p><span>{item.concept}</span></div></li>) : <li className="empty-log">选择一个操作，观察运行时如何留下可撤销记录。</li>}</ol></section>;
}
