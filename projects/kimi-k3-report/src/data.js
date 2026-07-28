export const chapters = [
  { id: "overview", number: "01", label: "开放 3T 时代", detail: "概览与核心贡献", pages: "1–2" },
  { id: "architecture", number: "02", label: "模型架构总览", detail: "KDA · AttnRes · MoE", pages: "3–9" },
  { id: "training", number: "03", label: "预训练与后训练", detail: "数据、扩展与强化学习", pages: "10–17" },
  { id: "infrastructure", number: "04", label: "基础设施", detail: "3T 训练与 1M Agentic RL", pages: "18–24" },
  { id: "evaluation", number: "05", label: "评测结果", detail: "推理、代码与智能体", pages: "25–32" },
  { id: "cases", number: "06", label: "应用案例", detail: "长程执行与能力展示", pages: "33–34" }
];

export const metrics = [
  { value: "2.78T", label: "总参数", note: "K2 的 2.67 倍" },
  { value: "104.2B", label: "激活参数", note: "每个 Token 的有效计算" },
  { value: "1M", label: "上下文", note: "原生长程工作空间" },
  { value: "2.5×", label: "扩展效率", note: "相对 Kimi K2" }
];

export const benchmarkGroups = {
  coding: {
    label: "代码",
    rows: [
      { name: "Terminal-Bench 2.1", score: 88.3, note: "接近最高分 GPT-5.6 Sol 的 88.8；覆盖真实终端任务。" },
      { name: "FrontierSWE", score: 81.2, note: "在长程软件工程任务中显著领先多个对照模型。" },
      { name: "SWE-Marathon", score: 42.0, note: "报告表格中的最高结果，强调跨文件、跨阶段工程执行。" },
      { name: "ProgramBench", score: 77.8, note: "报告表格中的最高结果，体现程序综合与执行能力。" }
    ]
  },
  agentic: {
    label: "智能体",
    rows: [
      { name: "BrowseComp", score: 91.2, note: "复杂网页检索任务中排名第一；完整 1M 上下文、不压缩时为 90.4。" },
      { name: "DeepSearchQA", score: 95.0, note: "F1 得分，体现多轮深度检索和证据整合能力。" },
      { name: "ResearchRubrics", score: 76.2, note: "研究型任务中领先报告内公开对照结果。" },
      { name: "AutomationBench", score: 30.8, note: "在 600 个公开自动化任务子集上的结果。" }
    ]
  },
  reasoning: {
    label: "推理",
    rows: [
      { name: "GPQA Diamond", score: 93.5, note: "研究生级科学推理；与 GPT-5.5 并列，接近最高分 94.1。" },
      { name: "AA-LCR", score: 74.7, note: "报告表格中的最高结果，关注长上下文推理。" },
      { name: "HLE-Full + tools", score: 56.0, note: "研究级难题仍落后最强闭源系统，是报告明确指出的提升方向。" },
      { name: "CritPt", score: 23.4, note: "复杂研究推理的短板；报告对此保持了明确的边界说明。" }
    ]
  },
  vision: {
    label: "视觉",
    rows: [
      { name: "CharXiv + Python", score: 91.3, note: "图表理解与工具增强视觉推理表现突出。" },
      { name: "ZeroBench + Python", score: 41.0, note: "通过视觉在环工具调用处理高难度开放问题。" },
      { name: "MMMU-Pro + Python", score: 79.5, note: "跨学科多模态理解，工具使用明显提升结果。" },
      { name: "WorldVQA", score: 72.7, note: "面向世界知识的视觉问答结果。" }
    ]
  }
};

export const cases = [
  {
    number: "01",
    title: "GPU kernel 优化",
    summary: "在 AttnRes 内核上持续搜索并验证，达到 56.9 TFLOP/s。",
    fact: "约为 torch.compile 基线的 2.2×"
  },
  {
    number: "02",
    title: "从零构建 MiniTriton",
    summary: "完成从前端、IR pass、PTX codegen 到 CUDA runtime 的整套 GPU 编译器。",
    fact: "约 45,000 行代码"
  },
  {
    number: "03",
    title: "计算天体物理复现",
    summary: "阅读 20+ 篇论文、评估 300+ 个状态方程，并生成交互式研究看板。",
    fact: "约 2 小时完成"
  },
  {
    number: "04",
    title: "42 年 AI ASIC 研究",
    summary: "整合 87 份季报与 99 份原始 PDF，经历 120+ 轮迭代。",
    fact: "2,800+ 次网页检索"
  }
];

