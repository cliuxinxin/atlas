# 「观心」零基础冥想学习 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Atlas 中新增一个可在桌面与手机使用的冥想学习应用，让新手完成 7 天训练、理解三种知识视角，并安全分享学习成果。

**Architecture:** 新建独立 React + Vite 项目 `projects/meditation-guide`。课程与知识内容存放于纯数据模块，进度通过版本化 localStorage store 管理，界面由今日、练习、复盘、路径、探索、我的和分享卡片等聚焦组件组成；首版不依赖后端或账号。

**Tech Stack:** React 19、Vite 7、Vitest、Testing Library、原生 CSS、Web Audio/HTMLAudio 降级为文字计时引导、localStorage。

## Global Constraints

- 用户两次点击内能开始默认 3 分钟练习。
- 完整实现前 7 天，展示但锁定第 8–21 天结构。
- 同一练习提供科学、生活、传统三种明确标注的解释，传统主张不得写成科学事实。
- 不声称诊断、治疗或替代专业心理与医疗服务。
- 所有功能在不登录、不授权通知、不分享的情况下可用。
- 分享内容默认不包含情绪、不适、精确练习时间或其他敏感信息。
- 动画尊重 `prefers-reduced-motion`，核心操作支持键盘和屏幕阅读器。

## File Map

- `projects/meditation-guide/package.json`：项目命令与依赖。
- `projects/meditation-guide/vite.config.js`：Atlas 基础路径与 Vitest 环境。
- `projects/meditation-guide/index.html`：应用入口与元信息。
- `projects/meditation-guide/project.json`：Atlas 入口页标题与简介。
- `projects/meditation-guide/src/main.jsx`：React 启动。
- `projects/meditation-guide/src/App.jsx`：视图路由与应用状态编排。
- `projects/meditation-guide/src/content/curriculum.js`：21 天地图、前 7 天完整课程及三视角内容。
- `projects/meditation-guide/src/state/progress.js`：版本化本地进度、偏好与恢复逻辑。
- `projects/meditation-guide/src/components/PracticePlayer.jsx`：计时、暂停、恢复、文字引导和安全退出。
- `projects/meditation-guide/src/components/Reflection.jsx`：课后反馈与下一课建议。
- `projects/meditation-guide/src/components/Perspectives.jsx`：三视角渐进展开。
- `projects/meditation-guide/src/components/ShareCard.jsx`：隐私可控的第 7 天成果卡。
- `projects/meditation-guide/src/styles.css`：设计令牌、响应式布局、动效与打印/分享样式。
- `projects/meditation-guide/src/test/setup.js`：DOM 测试环境。
- `projects/meditation-guide/src/**/*.test.{js,jsx}`：行为测试。

---

### Task 1: 项目骨架与课程领域模型

**Interfaces:**
- Produces: `curriculum: Lesson[]`，其中 `Lesson` 包含 `day,title,skill,duration,steps,perspectives,masterInsight,safetyMode`。

- [ ] 写 `curriculum.test.js`，断言共有 21 个节点、前 7 个可练习、每个可练习节点具有三种视角与非空步骤。
- [ ] 运行 `npm test -- curriculum.test.js`，确认因模块缺失而失败。
- [ ] 创建 Vite 配置、入口、项目元数据和 `curriculum.js`；第 1–7 天写入可直接朗读的引导步骤，第 8–21 天写入标题、能力和锁定摘要。
- [ ] 再次运行测试并确认通过。
- [ ] 提交 `feat: scaffold meditation curriculum`。

### Task 2: 版本化进度与个性化规则

**Interfaces:**
- Consumes: `curriculum`。
- Produces: `loadProgress(storage)`, `saveProgress(storage,state)`, `completeSession(state,{day,duration,reflection,note})`, `recommendNext(state)`。

- [ ] 写 `progress.test.js`，覆盖空存储、损坏 JSON、旧版本迁移、完成课程、重复完成、心情不持久化到分享数据和下一课推荐。
- [ ] 运行该测试并确认失败。
- [ ] 实现不可变状态更新、存储异常降级与只基于时长/引导偏好的推荐规则。
- [ ] 运行测试并确认通过。
- [ ] 提交 `feat: persist meditation learning progress`。

### Task 3: 今日首页与 21 天能力地图

**Interfaces:**
- Consumes: `curriculum`, `loadProgress`, `recommendNext`。
- Produces: 可访问的 `TodayView` 与 `PathView`，通过 `onStart(day)` 启动练习。

- [ ] 写 `App.test.jsx`，断言首页只突出今日练习、首次默认 3 分钟、路径正确显示已完成/当前/锁定状态，且两次点击内进入播放器。
- [ ] 运行测试并确认失败。
- [ ] 实现应用壳、四项底部导航、今日页、路径页和轻量状态路由。
- [ ] 运行测试并确认通过。
- [ ] 提交 `feat: add meditation home and learning path`。

### Task 4: 可中断且安全的练习播放器

**Interfaces:**
- Consumes: `Lesson`, `duration`, `onComplete`, `onExit`。
- Produces: `PracticePlayer`，支持计时、暂停/恢复、逐步文字提示、睁眼模式和不适面板。

- [ ] 写 `PracticePlayer.test.jsx`，用假时钟覆盖倒计时、暂停、恢复、刷新恢复提示、完成回调以及“不舒服”入口。
- [ ] 运行测试并确认失败。
- [ ] 实现播放器；没有音频时始终显示文字引导，不调用屏息或强制控制呼吸。
- [ ] 运行测试并确认通过。
- [ ] 提交 `feat: add safe guided practice player`。

### Task 5: 复盘、三视角和探索页

**Interfaces:**
- Consumes: `Lesson`, `progress`, `completeSession`。
- Produces: `Reflection`, `Perspectives`, `ExploreView`。

- [ ] 写组件测试，断言三种反馈均被正常接纳、跳过复盘仍可继续、三视角标签明确、每次只展开一个深度面板、大师洞见注明传统/来源类型。
- [ ] 运行测试并确认失败。
- [ ] 实现完成后的“复盘 → 三视角 → 大师一分钟 → 明日预告”，以及按“专注、情绪、慈心”组织的探索页。
- [ ] 运行测试并确认通过。
- [ ] 提交 `feat: add reflection and layered learning`。

### Task 6: 分享卡与隐私设置

**Interfaces:**
- Consumes: 完成记录、能力节点、用户主动保存的心得。
- Produces: `buildShareModel(progress, options)` 与 `ShareCard`。

- [ ] 写测试，断言默认模型只有天数、总分钟、能力和邀请链接；情绪、不适、精确时间永不进入；心得必须显式开启才出现。
- [ ] 运行测试并确认失败。
- [ ] 实现第 7 天解锁、字段开关、预览、复制分享文字和浏览器分享 API 降级。
- [ ] 运行测试并确认通过。
- [ ] 提交 `feat: add privacy-first learning share card`。

### Task 7: 视觉系统、响应式与无障碍

**Interfaces:**
- Consumes: 所有已实现视图。
- Produces: 完整 `styles.css` 与视觉资产；不改变领域接口。

- [ ] 基于批准规格生成完整移动主屏、练习态和桌面态视觉概念，提取颜色、字体、间距、容器、图标和动效令牌。
- [ ] 实现清醒安静的自然中性色界面、呼吸焦点、清晰焦点样式、窄屏布局与减少动画模式。
- [ ] 增加 axe/语义测试，覆盖导航名称、按钮标签、对话框焦点与颜色以外的状态表达。
- [ ] 运行组件测试、`npm run build` 和 Atlas 根构建。
- [ ] 提交 `style: complete meditation learning experience`。

### Task 8: 浏览器端到端验收

**Interfaces:**
- Consumes: 完整应用。
- Produces: 已验证的核心路径和截图证据。

- [ ] 启动本地应用，在桌面视口走通“首页 → 3 分钟练习 → 复盘 → 三视角 → 下一课”。
- [ ] 在手机视口验证导航、播放器、安全面板、路径和分享预览无溢出。
- [ ] 刷新页面验证进度恢复；禁用 localStorage 验证无记录模式。
- [ ] 使用 `view_image` 对比批准概念与最新桌面/手机截图，修复所有可见偏差。
- [ ] 运行 `npm test`、项目构建、根构建与 `git diff --check`，记录通过结果。
- [ ] 提交 `test: verify meditation learning flow`。

