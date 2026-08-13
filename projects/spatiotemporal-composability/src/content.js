export const quickTour = [
  { id: "problem", number: "01", minutes: "2 min", title: "动态加入不难，干净退出才难", thesis: "重启进程能清空副作用，却也丢掉缓存、连接与进行中的工作。", analogy: "卸载一个编辑器插件，不该要求整个插件宿主一起重启。", concept: "粗粒度替代方案", pages: [4, 5, 6], tone: "unified" },
  { id: "time", number: "02", minutes: "2 min", title: "时间维度：把每次改变连同撤销方式一起记录", thesis: "组件退出时，运行时应完整撤销它造成的长期副作用。", analogy: "注册监听器时就保存 unsubscribe；创建定时器时就保存 clearTimer。", concept: "revertible effects", pages: [9, 12, 15, 17], tone: "temporal" },
  { id: "space", number: "03", minutes: "2 min", title: "空间维度：依赖变化应成为生命周期事件", thesis: "组件声明它需要什么，Context 每次变化都按规格通知它。", analogy: "数据库服务出现时激活分析插件，消失时暂停，换实例时重新绑定。", concept: "reactive coeffects", pages: [17, 19, 22], tone: "spatial" },
  { id: "context", number: "04", minutes: "2 min", title: "一个 Context，同时承载修改与需求", thesis: "effect 写入环境，coeffect 观察环境；观察等价帮助判断两个效果能否互不干扰。", analogy: "同一张服务表既是插件注册能力的地方，也是其他插件查找依赖的地方。", concept: "unified context", pages: [22, 23, 27], tone: "unified" },
  { id: "system", number: "05", minutes: "2 min", title: "从局部保证，走向交错运行的组件系统", thesis: "论文用 components、fibers 与操作语义说明多个动态组件如何加载、迭代、失败和撤出。", analogy: "Cordis 把理论落到 effect tracking、依赖解析、配置协调和热更新。", concept: "dynamic composition", pages: [28, 38, 54, 66], tone: "unified" },
];

export const deepDiveChapters = [
  { id: "motivation", number: "01", title: "问题：组件为什么不能像函数一样好组合？", plain: "静态组合有词法作用域和模块解析兜底；运行中的组件却会留下长期资源，还会遇到不断变化的依赖。", developer: "VSCode 插件和自演化 Agent harness 展示了同一矛盾：进程级重启太粗，组件级治理又缺少统一模型。", formal: "论文把要求拆成正交的 temporal composability 与 spatial composability。", kind: "paper", pages: [4, 5, 6] },
  { id: "preliminaries", number: "02", title: "预备知识：effect 写环境，coeffect 读环境", plain: "effect 描述计算会改变什么；coeffect 描述计算需要环境提供什么。", developer: "前者像‘我要注册一个路由’，后者像‘我需要一个数据库服务’。", formal: "经典系统多在编译期和词法作用域内推理；本文把二者提升为运行时机制。", kind: "analogy", pages: [7, 8] },
  { id: "effects", number: "03", title: "可撤销效果：改变与逆操作同行", plain: "每个 Context 变换都返回在当前状态有效的逆操作，运行时替组件保管。", developer: "撤出组件时只执行它保存的清理动作；若效果交错，还需要独立性保证撤销不破坏别人。", formal: "effect function 形如 Γ → Γ × (Γ → Γ)；witness 要求返回的 inverse 在应用点恢复原状态。", kind: "paper", pages: [9, 12, 15, 17] },
  { id: "coeffects", number: "04", title: "反应式余效果：声明需求，响应变化", plain: "组件给出需求规格；Context 改变后，运行时判断它应激活、停用还是保持不变。", developer: "不用每个插件自己轮询服务表，也不用把依赖变化逻辑散落在业务代码中。", formal: "notification 相对 specification 分类为 activating、deactivating 或 neutral，并可经 isolation/interception 控制视野。", kind: "paper", pages: [17, 19, 20, 22] },
  { id: "context", number: "05", title: "统一 Context：两条轴在这里相交", plain: "组件对环境的写入，会改变其他组件看到的依赖；两者必须属于同一运行时事实。", developer: "注册 Database 是一个 effect，同时也是满足 AnalyticsPlugin coeffect 的 Context 变化。", formal: "论文以 coeffect 的 observational equivalence 为 effects 提供 independence 判据。", kind: "paper", pages: [22, 23, 27] },
  { id: "calculus", number: "06", title: "动态组合演算：把生命周期写成状态转换", plain: "component 描述可组合单元，fiber 表示一次运行中的实例。", developer: "演算覆盖加载、撤出、迭代、异步和失败，让‘正在变化’也成为模型的一部分。", formal: "base calculus 经 transitions in progress 扩展，显式刻画 withdrawal、iteration、asynchrony 与 failure。", kind: "paper", pages: [28, 30, 34, 35, 37] },
  { id: "metatheory", number: "07", title: "元理论：它究竟保证了什么", plain: "在论文规则与前提内，局部的可撤销与依赖反应能提升为整个交错组件系统的性质。", developer: "你得到的是一组可检查的系统规则，不是‘任何 cleanup 函数都一定安全’。", formal: "作者证明 preservation、temporal/spatial composability、progress 与 confluence。", kind: "paper", pages: [38, 42, 43, 45, 47, 49] },
  { id: "cordis", number: "08", title: "Cordis：从演算到可用的 meta-framework", plain: "Cordis 提供 effect tracking、coeffect resolution 与声明式组件加载器。", developer: "它把组件生命周期、配置协调和 HMR 放进同一套 Context 机制；Koishi 是案例。", formal: "实现章节覆盖 core library、effect tracking、coeffect operations、component lifecycle、context access 与 loader。", kind: "implementation", pages: [54, 56, 57, 58, 61, 62, 64, 66] },
  { id: "discussion", number: "09", title: "讨论：模型边界在哪里", plain: "组件级组合并不自动等于安全沙箱、版本兼容或任意循环依赖可解。", developer: "边界外的 I/O、服务复用、权限、依赖版本和粒度仍需架构选择。", formal: "论文逐项讨论 system boundary、multiplexing、access control、language choice、mutual dependencies 与 co-design。", kind: "open", pages: [67, 68, 69, 70, 71, 72, 73] },
  { id: "assessment", number: "10", title: "评价：这篇论文最有价值的视角", plain: "它把‘能否完整退出’和‘能否随依赖变化’提升为动态组合的两条基本坐标。", developer: "即使不采用 Cordis，也可用这两问审视插件系统、Agent harness 和热更新架构。", formal: "结论重申统一的运行时 effect/coeffect Context 与动态组合演算。", kind: "analogy", pages: [79] },
];

export const glossary = [
  ["Temporal composability", "时间可组合性", "组件撤出后完整撤销自己的环境修改", 4],
  ["Spatial composability", "空间可组合性", "声明并响应组件间依赖", 4],
  ["Effect", "效果", "计算对环境造成的修改", 7],
  ["Coeffect", "余效果", "计算对环境提出的需求", 7],
  ["Context", "上下文", "组件共同观察和改变的运行时环境", 9],
  ["Revertible effect", "可撤销效果", "携带当前应用点逆操作的效果", 12],
  ["Reactive coeffect", "反应式余效果", "随 Context 变化重新判定的依赖规格", 17],
  ["Observational equivalence", "观察等价", "从需求观察角度不可区分", 23],
  ["Component", "组件", "拥有规格与生命周期的动态组合单元", 28],
  ["Fiber", "纤程", "组件的一次运行实例", 28],
  ["Withdrawal", "撤出", "从交错系统中移除组件贡献", 34],
  ["Progress", "进展", "合法状态不会无故卡死", 47],
  ["Confluence", "合流性", "允许的不同执行顺序汇合到等价结果", 49],
].map(([term, label, definition, page]) => ({ term, label, definition, page }));

export const contributions = [
  ["可撤销效果", "为每个 Context 变换追踪显式 inverse，建立局部时间可组合性。"],
  ["反应式余效果", "用规格和通知管理依赖变化，建立局部空间可组合性。"],
  ["统一 Context", "将 effect 与 coeffect Context 合并为一种编程范式。"],
  ["动态组合演算", "把局部机制提升到交错组件系统的元理论。"],
  ["Cordis", "实现核心库、声明式 loader、配置协调与热模块替换。"],
].map(([title, detail], index) => ({ number: index + 1, title, detail, page: 6 }));

export const claimBoundaries = [
  { title: "效果恢复", proves: "有见证的逆操作在规定条件下恢复状态；独立效果可选择性撤出。", doesNotProve: "任意副作用都能自动推导逆操作，或外部世界总能回滚。", pages: [12, 15, 17] },
  { title: "依赖反应", proves: "Context 变化可依规格触发激活、停用或中性通知。", doesNotProve: "两个同名服务在语义、版本或安全上必然兼容。", pages: [19, 20] },
  { title: "系统元理论", proves: "形式演算内满足 preservation、时空可组合性、progress 与 confluence。", doesNotProve: "任意生产代码只要用了 cleanup 就自动获得这些性质。", pages: [42, 43, 45, 47, 49] },
  { title: "Cordis 边界", proves: "核心机制可在真实 meta-framework 与 Koishi 中实现。", doesNotProve: "组件自动获得操作系统级隔离、权限控制或版本治理。", pages: [54, 66, 67, 69, 72] },
];

export const pageMap = deepDiveChapters.map(({ id, title, pages }) => ({ id, title, pages }));
