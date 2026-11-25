# Polymarket Quantitative System Engineering
## 项目章程与工程学习路线图 V1.0

| 项目 | 内容 |
|---|---|
| 项目简称 | PQSE |
| 状态 | APPROVED（十项核心决策已批准） |
| 日期 | 2026-11-25 |
| 仓库 | [FKPolymarket15MinCryptTools](https://github.com/JaydenLee2588/FKPolymarket15MinCryptTools) |
| 当前阶段 | M0 — Original System Baseline |
| 基线候选 SHA | `182e54fa20639b3650f6c6d78b8be8d72d7f135f` |
| 基线 Tag | `pqse-baseline-v0.0`（用户已创建，完整指向及类型待核验） |

> 本文为原 V1.0 章程的 Markdown 整理版。核心决策已获批准；评分目标、周期及性能阈值仍为暂定规划，须经 M0 实测确认。

## 1. 项目章程

以现有 Polymarket BTC 15 分钟行情预测工具为研究对象，通过渐进式、可度量、可复现的优化形成两项资产：模块化、低延迟、可测试的量化研究系统，以及完整的工程实验、技术决策和学习知识库。盈利不是强制验收指标。

| 优先级 | 目标 | 成功标准 |
|---|---|---|
| P0 | 工程学习 | 能独立分析问题、设计实验、解释结果 |
| P0 | 可度量工程 | 每项优化有基线、指标、报告 |
| P0 | 正确性 | 无未经批准的业务行为变化 |
| P1 | 实时性与可维护性 | 延迟改善或无显著退化，模块独立性提升 |
| P1 | 科学研究体系 | 可复现的样本外验证 |
| P2 | 概率预测与策略研究 | 统计验证、计入交易成本 |
| P3 | 执行工程 | 优先模拟验证 |

### 1.1 正式治理规范

| 编号 | 规范 |
|---|---|
| GOV-001 | 工程学习与可复现实验优先 |
| GOV-002 | 先测量、后优化 |
| GOV-003 | 单一维度优化、控制变量 |
| GOV-004 | 功能与性能双重回归 |
| GOV-005 | 模块化单体与 Hot/Cold Path |
| GOV-006 | 独立实验、分支、PR、报告 |
| GOV-007 | ChatGPT 负责架构、教学、独立审查 |
| GOV-008 | Codex 负责实施、测试、数据采集 |
| GOV-009 | 禁止未经批准的真实资金交易 |
| GOV-010 | M0 验收后方可正式优化 |
| GOV-011 | 文档及实验结果纳入 GitHub 版本管理 |

工程原则：Measure Before Optimize；Single-variable Optimization；Correctness First；Latency-aware Architecture；Reproducibility；Evidence-based Decision；Incremental Delivery；Avoid Overengineering；Learning-oriented Engineering；Safety by Design。区分事实、推断、建议及人工决策；缺失指标标记 `UNAVAILABLE`，不得编造数据。

## 2. 系统评估与指标字典

| 维度 | 初始定性评分 | 长期目标 | 客观指标 |
|---|---:|---:|---|
| 项目架构 | 7 | 9 | LOC、圈复杂度、认知复杂度、耦合度、循环依赖、测试覆盖率、回归通过率、变更影响范围、处理延迟 |
| 实时数据采集 | 8 | 9 | Data Latency、Freshness、Missing Rate、Duplicate Rate、Out-of-order Rate、Reconnect Time、API Request Rate、Availability |
| 概率模型 | 6 | 8 | Brier Score、Log Loss、Accuracy、ROC-AUC、Inference Latency、Out-of-sample Score |
| 概率校准 | 3 | 8 | ECE、MCE、Reliability Diagram、Calibration Slope、Intercept |
| 策略验证 | 3 | 9 | 回测可复现性、数据泄漏、Look-ahead Bias、Net PnL、Expected Value、Profit Factor、Maximum Drawdown、Sharpe Ratio、Sample Size、Walk-forward Performance |
| 交易执行 | 2 | 7 | Tick-to-Decision、Decision-to-Order、Order-to-Ack、Fill Rate、Slippage、Reject Rate、Recovery Time、Risk Control Coverage |
| 二次开发价值 | 8 | 9 | 模块接入时间、修改范围、接口兼容性、测试成本、文档完整度 |
| 等权平均 | 5.29 | 8.43 | 定性辅助指标，非实验验收依据 |

初始评分来自静态代码审查，非实测结果。二次开发价值是综合评价项。Brier Score = Σ(pᵢ−yᵢ)²/N；校准关注预测概率与实际发生频率的一致性。指标定义、采样窗口、工具版本及阈值在 M0 固化。

## 3. 性能工程规范

目标架构为同进程模块化单体。Hot Path：行情接收及内存快照 → 状态与特征计算 → 概率推理 → 决策 → 执行接口（未来）。Cold Path：日志、前端、存储、统计。非关键任务不得阻塞关键路径；避免不必要的网络请求、同步文件写入、对象复制。Node.js EventEmitter 默认同步，不能将事件分发等同于异步隔离。

| 指标 | 暂定长期目标 |
|---|---:|
| 模型计算 P99 | ≤ 1 ms |
| 特征计算 P99 | ≤ 5 ms |
| Tick-to-Decision P99 | ≤ 10 ms |
| 架构额外延迟 P99 | ≤ 1 ms |
| Event Loop Lag P99 | ≤ 10 ms |
| 连续运行 | ≥ 72 小时 |
| 内存泄漏 | 无持续异常增长 |
| 关键路径同步文件写入 | 0 次 |

上述目标不包含外部网络与交易所处理时间。对于非性能优化实验，暂定 P50/P95/P99 延迟退化不超过 5%，P99 同时满足绝对预算；CPU 和内存退化不超过 10%；数据正确性不得退化，未经批准的业务变化为零。M0 确定测量噪声、绝对误差容忍、重复次数及统计判定标准。超阈值必须记录取舍并人工审批。

## 4. 工程学习路线图

| 阶段 | 版本 | 预计周期 | 学习及交付 |
|---|---|---|---|
| M0 原始基线 | V0.0 | 1–2 周 | Git、Benchmark、Profiling、测试、事件循环；架构文档、固定输入、Golden Master、基线报告 |
| M1 架构优化 EXP-001 | V0.1 | 2–3 周 | SOLID、模块边界、依赖注入、数据契约、状态机、Hot/Cold Path；保持业务行为及性能兼容 |
| M2 数据采集 EXP-002 | V0.2 | 2–3 周 | WebSocket、REST、异步、缓存、增量计算、背压、时间戳、数据一致性；研究轮询、重复 K 线、断线恢复 |
| M3 概率模型 EXP-003 | V0.3 | 3–5 周 | 概率论、随机过程、波动率、特征工程、逻辑回归、LightGBM、过拟合；样本外比较 |
| M4 概率校准 EXP-004 | V0.4 | 2–3 周 | Platt Scaling、Isotonic Regression、ECE、Brier Score；研究开盘概率回归 50% 的合理性 |
| M5 策略验证 EXP-005 | V0.5 | 3–4 周 | 事件回放、回测、未来信息偏差、交易成本、Walk-forward、风险收益分析 |
| M6 执行工程 EXP-006 | V0.6 | 3–4 周 | 订单簿、订单生命周期、幂等性、滑点、成交模拟、仓位、熔断、异常恢复；默认模拟 |
| M7 综合评估 | V1.0 研究版 | 1 周 | 系统演进报告、成功及失败实验、工程取舍、知识沉淀 |

预计总周期 17–25 周，非固定期限。M3 前必须具备可信真实结算标签、时间对齐、最低限度样本外验证能力；完整策略验证体系在 M5 建立。模型候选依次为原始模型、动态波动率、统计模型、机器学习、证据支持的集成模型；简单模型优于复杂模型时保留简单模型。

## 5. 标准优化实验流程

1. 原理学习。
2. 原始代码分析。
3. 基线测量。
4. 优化假设与备选方案比较。
5. 人工审批目标、范围、风险及验收标准。
6. Codex 独立分支最小必要实施。
7. 功能、性能、副作用对比测试。
8. ChatGPT 独立审查。
9. 实验报告与人工验收，合并或拒绝、回滚。

每个实验预先定义自变量、因变量、控制变量、假设、验收标准、回归标准、回滚标准。不得将多个因素共同产生的收益归因于单一因素。Benchmark 固定硬件、OS、Node.js、依赖、配置、数据及运行条件；考虑 JIT、GC，设置预热及重复实验，记录 P50/P95/P99 和原始样本。建议 Mac mini 作为固定实验环境。

改善率：越低越好的指标 = (Before−After)/Before×100%；越高越好 = (After−Before)/Before×100%。基线为零时报告绝对变化。改善率不等于统计显著性。

状态：`PASS`（达到目标且回归通过）、`PARTIAL_PASS`（部分达到，取舍待批）、`FAIL`（未达到或不可接受退化）、`INCONCLUSIVE`（证据不足）、`ROLLED_BACK`（已撤销）、`UNAVAILABLE`（指标不可获取）。失败实验同样保存。

## 6. Engineering Optimization Report 模板

| 章节 | 必填内容 |
|---|---|
| 01 基本信息 | Experiment ID、名称、维度、日期、基线与优化 SHA、Issue、PR、状态 |
| 02 原理学习 | 相关理论及适用原因 |
| 03 原始实现 | 代码位置、流程、依赖、设计特点 |
| 04 问题与证据 | 事实、推断、假设分别记录 |
| 05 实验假设 | 自变量、因变量、控制变量、预期收益、副作用 |
| 06 方案比较 | 原理、优缺点、复杂度、选择及拒绝原因 |
| 07 实施记录 | 修改范围、模块、配置、依赖、遇到的问题 |
| 08 实验环境 | 硬件、OS、Node.js、依赖、数据校验值、命令、预热、样本量、重复次数、配置 |
| 09 优化前后结果 | 原始数据、统计结果、图表、指标对比 |
| 10 回归与副作用 | 功能、性能、资源、数据质量、接口兼容性 |
| 11 结论 | 假设是否成立、收益、代价、局限、状态、合并或回滚建议 |
| 12 学习总结 | 掌握知识、认知差异、工程取舍、可迁移经验、未理解问题 |
| 13 后续研究 | 遗留问题、候选任务、依赖 |
| 14 证据索引 | 代码、日志、原始数据、PR、资料 |

结果表：

| 指标 | Before | After | 绝对变化 | 相对变化 | 阈值 | 状态 |
|---|---|---|---|---|---|---|
| 待测 | UNAVAILABLE | UNAVAILABLE | — | — | 待定 | UNAVAILABLE |

## 7. 版本管理与知识库

每个正式版本保存 Git Tag、Commit SHA、报告、基准结果。基线 Tag 不得移动或覆盖。M1 可拆分 EXP-001.01 入口文件拆分、.02 数据契约、.03 合约状态管理、.04 模型接口、.05 配置管理、.06 回放接口、.07 关键路径验证；具体范围需独立审批。

```text
docs/
  project-management/  PROJECT_CHARTER.md, LEARNING_ROADMAP.md,
                       CURRENT_STATUS.md, DECISION_LOG.md, RISK_REGISTER.md
  standards/           ENGINEERING_PRINCIPLES.md, BENCHMARK_PROTOCOL.md,
                       EXPERIMENT_PROTOCOL.md, METRICS_DICTIONARY.md,
                       ACCEPTANCE_CRITERIA.md
  architecture/        ORIGINAL_ARCHITECTURE.md, CURRENT_ARCHITECTURE.md, DATA_FLOW.md
  baselines/           BASELINE_V0.md, BASELINE_V0.1.md
  experiments/         REPORT_TEMPLATE.md, EXP-001-Architecture/,
                       EXP-002-DataCollection/, EXP-003-ProbabilityModel/,
                       EXP-004-Calibration/, EXP-005-StrategyValidation/, EXP-006-Execution/
  learning/            KNOWLEDGE_INDEX.md, SOFTWARE_ENGINEERING.md,
                       PERFORMANCE_ENGINEERING.md, DATA_ENGINEERING.md,
                       STATISTICS.md, MACHINE_LEARNING.md, QUANTITATIVE_RESEARCH.md
benchmarks/            scripts/, fixtures/, results/
tests/                 unit/, integration/, regression/
```

大型行情数据使用清单、存储路径、版本及校验值管理，不直接提交 GitHub。目录按实际需要逐步建立。Git 工作流：Issue → Experiment Design → Human Approval → Feature Branch → Implementation → Benchmark & Tests → Draft PR → Independent Review → Report → Merge / Reject / Rollback。禁止未经批准直接向 main 提交业务代码。

## 8. 人机协作及学习机制

| 角色 | 职责 |
|---|---|
| Project Owner & Engineering Researcher | 理解原理、参与讨论、提出假设、审批、解释结果、最终验收 |
| ChatGPT — Architect & Engineering Mentor | 教学、架构、代码分析、实验设计、指标、独立审查、学习总结 |
| Codex — Implementation Engineer | 实施、测试、Benchmark、采集数据、文档、PR |

每个子实验先讨论技术原理和方案，再实施。例如 RSI 增量计算前，研究复杂度、中间状态、浮点一致性和内存代价。学习自评独立于系统评分：0 未学习、1 了解概念、2 能解释、3 能应用、4 能独立设计与评价。自评领域：软件架构、性能工程、实时数据工程、概率统计、机器学习、量化研究、执行工程、研发管理（总分 32）。

## 9. 风险登记

| ID | 风险 | 等级 | 应对 |
|---|---|---|---|
| R001 | 过度设计 | 高 | 最小变更、验证收益 |
| R002 | 延迟退化 | 高 | 性能回归与预算 |
| R003 | 错误结算标签 | 高 | 官方真实结算验证 |
| R004 | 数据源价格不一致 | 高 | 来源、时间戳、基差 |
| R005 | 数据泄漏 | 高 | 固定决策时点、时间序列验证 |
| R006 | 过拟合 | 高 | 独立样本外验证 |
| R007 | 多项优化混合 | 高 | 独立实验及 PR |
| R008 | AI 代码缺陷 | 高 | 测试与独立审查 |
| R009 | Benchmark 不稳定 | 中 | 预热、重复、统计 |
| R010 | 历史数据不足 | 高 | 积累数据、标记缺失 |
| R011 | Codex 额度不足 | 中 | 小任务及交接文档 |
| R012 | 未授权真实交易 | 高 | 默认禁用 |
| R013 | AI 替代学习 | 高 | 原理学习、人工审批 |
| R014 | 外部 API 变化 | 中 | 兼容性核查、监控、版本记录 |

补充观察（Day 1）：用户说明原工具约十个月未更新，因此 R014 需在基线审计中特别核查；当前尚未证明接口已失效。风险表随实验更新。

## 10. M0 详细实施计划

| Day | 任务 | 交付 |
|---|---|---|
| 1 | 项目初始化、版本锁定、环境及依赖记录 | 章程、基线 manifest、环境记录 |
| 2 | 原始架构分析 | ORIGINAL_ARCHITECTURE.md |
| 3 | Binance、Chainlink、Polymarket 数据流 | DATA_FLOW.md |
| 4 | 复杂度、耦合度、循环依赖 | 代码质量基线 |
| 5 | Profiling、Benchmark、P50/P95/P99、事件循环 | BENCHMARK_PROTOCOL.md |
| 6 | 性能测试工具开发 | Benchmark 脚本 |
| 7 | 多轮原始性能测量 | 原始性能数据 |
| 8 | Golden Master | 固定输入及回归测试 |
| 9 | 数据质量与结算标签审计 | 数据质量报告 |
| 10 | 汇总、评分、阶段验收 | BASELINE_V0.md、M0 验收报告 |

M0 验收：锁定完整 SHA；系统可启动或明确记录阻塞；架构文档、指标字典、Benchmark 协议完成；实测性能及原始数据保存；建立回归测试；完成数据质量审计；缺失项标记 UNAVAILABLE；业务算法及策略不修改；确认 M1 范围；基线报告经人工验收。必要条件未满足不得启动 M1。

## 11. 优化成果仪表盘

当前各维度暂沿用第 2 节初始定性评分；实测基线、实际性能改善均为 UNAVAILABLE；已完成正式优化方向 0/6。每次实验后更新当前评分、实测指标、实验状态及证据链接，不以主观评分替代实验结果。

## 12. 章程审批与启动

2026-11-25 项目负责人批准：工程学习与可复现实验优先；单一维度控制变量；功能及性能双重回归；模块化单体与 Hot/Cold Path；独立 PR 及报告；ChatGPT 架构教学审查；Codex 实施测试采集；禁止未经批准的真实资金交易；M0 先于架构优化；允许章程及规范保存至 GitHub。

当前进入 M0 Day 1。规划参数仍待 M0 实测确认。本文整理不代表已经完成仓库写入、环境检测或基准测试。
