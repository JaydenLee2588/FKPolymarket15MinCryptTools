# DECISION_LOG — 工程决策登记

更新日期：2026-11-25｜阶段：M0 Day 1

权威治理依据：[项目章程 V1.0](PROJECT_CHARTER_AND_LEARNING_ROADMAP.md)。本登记采用 DEC 编号，编号为本次整理建议；不替代章程。APPROVED 表示负责人已明确批准，PROPOSED 表示待批准，OBSERVED 表示实施事实而非审批。

| ID | 决策 | 依据及影响 | 状态 |
|---|---|---|---|
| DEC-001 | 工程学习与可复现实验优先 | 盈利不是强制验收指标 | APPROVED |
| DEC-002 | 单一维度优化、控制变量 | 避免错误归因 | APPROVED |
| DEC-003 | 功能与性能双重回归 | 正确性与实时性并重 | APPROVED |
| DEC-004 | 模块化单体及 Hot/Cold Path | 避免不必要的跨进程开销；具体设计待测 | APPROVED |
| DEC-005 | 独立实验分支、PR及报告 | 可追溯、可回滚 | APPROVED |
| DEC-006 | ChatGPT 负责架构、教学及独立审查 | 实施与审查分离 | APPROVED |
| DEC-007 | Codex 负责实施、测试及数据采集 | 负责人保留最终验收权 | APPROVED |
| DEC-008 | 默认禁止未经批准的真实资金交易 | 不运行下单、授权等操作 | APPROVED |
| DEC-009 | M0 验收后启动架构优化 | 先测量后优化 | APPROVED |
| DEC-010 | 章程及相关规范保存至 GitHub | 文档版本化 | APPROVED |
| DEC-011 | 保留现有 Lightweight Tag | 原计划 Annotated；现有 Tag 已正确指向基线，无需返工 | APPROVED |
| DEC-012 | 将内置 CLOB Client 纳入静态基线 | 发现独立 package.json 和 pnpm 锁文件；不安装或升级 | APPROVED |
| DEC-013 | Day 1 限定为静态审计 | 安装、运行、功能及性能验证留待 M0 后续任务 | APPROVED |
| DEC-014 | 本轮文档由 ChatGPT 起草，负责人可手动提交 | Codex 剩余额度约 2%；不改变长期角色分工 | OBSERVED（文档已提交 PR #1） |

## DEC-011 详细记录

- 基线：`pqse-baseline-v0.0`，Commit `182e54fa20639b3650f6c6d78b8be8d72d7f135f`。
- 证据：用户终端 `git cat-file -t` 返回 `commit`，远端 Tag 返回一条记录，HEAD 与 Tag 解引用 SHA 一致。
- 备选：删除重建 Annotated Tag；不推荐，增加引用变更风险而无运行时收益。
- 建议：保留现有 Tag，禁止移动或覆盖；未来正式版本优先采用 Annotated Tag。
- 审批：2026-11-25，项目负责人明确批准。性能影响：无运行时影响。

## 变更管理

新增决策记录日期、备选方案、证据、影响、审批人及状态；被替代决策保留并注明替代编号。涉及实验范围、性能阈值、资金操作的决策必须事前审批。章程中的评分目标、周期、阈值仍为暂定，不在本次批准范围内。

## Day 1 正式审批记录

审批日期：2026-11-25

- DEC-011：APPROVED
- DEC-012：APPROVED
- DEC-013：APPROVED
- 最终验收意见：原则同意，完成校验及归档后合并。
- PR #1 由项目负责人执行合并。
