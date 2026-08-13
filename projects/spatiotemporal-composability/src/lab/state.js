const eventEffect = { id: "event", label: "事件监听 / analytics:track" };
const timerEffect = { id: "timer", label: "定时任务 / flush every 30s" };

export const initialLabState = Object.freeze({
  pluginLoaded: false,
  pluginActive: false,
  loggerAvailable: true,
  database: null,
  effects: [],
  log: [],
  nextId: 1,
});

export const recommendedActions = [
  "LOAD_PLUGIN", "PROVIDE_DATABASE", "REPLACE_DATABASE", "REMOVE_DATABASE", "UNLOAD_PLUGIN",
];

const row = (state, direction, title, detail, concept) => ({
  id: state.nextId,
  direction,
  title,
  detail,
  concept,
});

const append = (state, entries, patch) => ({
  ...state,
  ...patch,
  log: [...state.log, ...entries.map((entry, index) => ({ ...entry, id: state.nextId + index }))],
  nextId: state.nextId + entries.length,
});

export function getAvailableActions(state) {
  return {
    load: !state.pluginLoaded,
    provide: state.pluginLoaded && !state.database,
    replace: state.pluginLoaded && state.database === "v1",
    removeDatabase: state.pluginLoaded && Boolean(state.database),
    unload: state.pluginLoaded,
  };
}

export function labReducer(state, action) {
  const available = getAvailableActions(state);
  switch (action.type) {
    case "LOAD_PLUGIN":
      if (!available.load) return state;
      return append(state, [row(state, "notify", "加载 AnalyticsPlugin", "声明需要 Logger 与 Database；当前只满足 Logger。", "coeffect specification")], { pluginLoaded: true });
    case "PROVIDE_DATABASE":
      if (!available.provide) return state;
      return append(state, [
        row(state, "apply", "提供 Database v1", "Context 增加数据库服务。", "effect"),
        row(state, "notify", "依赖已满足", "AnalyticsPlugin 收到 activating 通知。", "reactive coeffect"),
        row(state, "apply", "激活插件效果", "注册事件监听与定时刷新，并记录逆操作。", "revertible effect"),
      ], { database: "v1", pluginActive: true, effects: [eventEffect, timerEffect] });
    case "REPLACE_DATABASE":
      if (!available.replace) return state;
      return append(state, [
        row(state, "notify", "Database 身份变化", "旧依赖停用，插件撤销绑定并连接 v2。", "reactive coeffect"),
      ], { database: "v2", pluginActive: true, effects: [eventEffect, timerEffect] });
    case "REMOVE_DATABASE":
      if (!available.removeDatabase) return state;
      return append(state, [
        row(state, "revert", "撤销定时任务", "运行 clearTimer；Logger 与其他 Context 项保持不变。", "inverse"),
        row(state, "revert", "撤销事件监听", "运行 unsubscribe；插件不再产生分析效果。", "inverse"),
        row(state, "notify", "依赖不再满足", "AnalyticsPlugin 收到 deactivating 通知。", "reactive coeffect"),
      ], { database: null, pluginActive: false, effects: [] });
    case "UNLOAD_PLUGIN": {
      if (!available.unload) return state;
      const reversals = state.pluginActive ? [
        row(state, "revert", "撤销插件效果", "清理事件监听与定时任务。", "withdrawal"),
      ] : [];
      return append(state, [...reversals, row(state, "revert", "卸载 AnalyticsPlugin", "仅移除该组件的声明与贡献；Logger 继续可用。", "withdrawal")], { pluginLoaded: false, pluginActive: false, effects: [] });
    }
    case "RESET":
      return initialLabState;
    default:
      return state;
  }
}

export function getContextRows(state) {
  return [
    { id: "logger", label: "Logger", present: state.loggerAvailable, owner: "Host" },
    { id: "database", label: state.database ? `Database ${state.database}` : "Database", present: Boolean(state.database), owner: "Host" },
    { id: "plugin", label: "AnalyticsPlugin", present: state.pluginLoaded, owner: "Loader" },
    { id: "event", label: eventEffect.label, present: state.effects.some(({ id }) => id === "event"), owner: "AnalyticsPlugin" },
    { id: "timer", label: timerEffect.label, present: state.effects.some(({ id }) => id === "timer"), owner: "AnalyticsPlugin" },
  ];
}

export function getDependencyEdges(state) {
  if (!state.pluginLoaded) return [];
  const edges = [{ source: "AnalyticsPlugin", target: "Logger", type: "required" }];
  if (state.database) edges.push({ source: "AnalyticsPlugin", target: `Database ${state.database}`, type: "required" });
  return edges;
}

export function getLabSummary(state) {
  if (!state.pluginLoaded) return "AnalyticsPlugin 未加载；Logger 可用。";
  if (!state.database) return "AnalyticsPlugin 已加载，但 Database 依赖缺失。";
  return `AnalyticsPlugin 运行中，当前连接 Database ${state.database}，拥有 ${state.effects.length} 个可撤销效果。`;
}
