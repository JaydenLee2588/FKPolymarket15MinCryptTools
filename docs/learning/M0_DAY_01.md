# M0_DAY_01 — 项目初始化与原始版本锁定

日期：2026-11-25｜任务 PQSE-M0-D01｜状态：实施完成，待最终归档核查及合并

## 1. 学习目标

理解工程基线、Git 引用、环境控制、依赖锁定、文件指纹及证据驱动的优化流程。今天不修改业务代码、不执行真实交易、不追求性能改善。

## 2. 实践记录

| 操作 | 结果 | 学习意义 |
|---|---|---|
| Clone、核查 HEAD | 基线 SHA 182e54fa20639b3650f6c6d78b8be8d72d7f135f | 精确识别代码快照 |
| 创建及验证 Tag | pqse-baseline-v0.0，Lightweight | 命名基线、区分 Tag 对象和 Commit |
| 采集本机环境 | M4 / 16GB / Node v26.7.0 | 控制实验变量 |
| 查看依赖声明及锁文件 | 5 个直接依赖、19 个锁定条目 | 区分版本范围和解析结果 |
| SHA-256 校验 | 根项目及主要 SDK/配置文件 | 验证文件字节一致性 |
| 查看模块清单 | 发现独立 CLOB Client 子项目 | 区分目录组织与运行架构 |
| Git 差异检查 | 已跟踪文件无差异；七份未跟踪文档 | 约束变更范围 |

证据来自负责人提供的终端输出及截图，详细数据见 [基线清单](../baselines/BASELINE_V0_MANIFEST.md) 与 [环境记录](../baselines/ENVIRONMENT_V0.md)。

## 3. 工程知识笔记

| 概念 | 英文 | 本项目应用 |
|---|---|---|
| 工程基线 | Baseline | 对照版本、环境、输入、指标和结果的可追溯记录；当前仅完成静态部分 |
| 轻量/附注标签 | Lightweight / Annotated Tag | 前者直接引用对象，后者有独立 Tag 对象及元数据 |
| 控制变量 | Controlled Variables | 同一实验固定环境、依赖、配置和输入 |
| 语义化版本 | Semantic Versioning | ^6.11.1 允许兼容范围内的版本解析 |
| 依赖锁定 | Dependency Lockfile | 记录精确依赖树；npm ci 按锁文件安装，但尚未执行 |
| 直接/传递依赖 | Direct / Transitive Dependency | 根项目 5 个直接依赖，另有 14 个锁定条目 |
| 文件校验值 | SHA-256 Checksum | 检测文件内容变化，不等同于安全认证 |
| 第三方源码内置 | Vendoring | SDK 声明来源为官方仓库，源码一致性待核查 |
| 耦合与内聚 | Coupling / Cohesion | Day 2–4 从实际调用和职责分析，不凭目录评分 |
| 热路径/冷路径 | Hot Path / Cold Path | 后续测量关键路径延迟，避免非关键任务阻塞 |

## 4. 可复用检查命令

```bash
git rev-parse 'pqse-baseline-v0.0^{commit}'
git cat-file -t pqse-baseline-v0.0
git ls-remote --tags origin 'refs/tags/pqse-baseline-v0.0*'
git diff --name-status pqse-baseline-v0.0
git status --short --untracked-files=all
sw_vers
node -v
npm -v
git --version
shasum -a 256 package.json package-lock.json
```

## 5. 观察、假设与验证

- 事实：根项目锁定 ethers 6.16.0，SDK 声明 ethers ^5.7.1；存在 npm 与 pnpm 锁文件。
- 假设：若两个版本实际同时加载，可能增加资源消耗或维护成本。
- 验证：先检查导入及调用链，再测量资源与延迟；不预设统一版本一定有收益。
- 结论：当前证据不足以判断运行时影响，不实施优化。

## 6. 学习复盘

本次已实际执行 Git、环境采集、锁文件解析及校验命令。早期文档曾将 npm 版本误填为 Git 版本，终端证据显示 Git 为 2.55.0；已在环境记录中修正。交互式 zsh 中注释曾产生 command not found 错误，不影响已成功采集的命令结果。

自测问题（供负责人复习，不计作新的考试成绩）：

1. 为什么完整 Commit SHA 比 Tag 名称更适合精确识别基线？
2. 为什么锁定文件一致不能证明实际安装环境一致？
3. 为什么 ethers 双版本不能直接判定为性能问题？
4. 如果 Node.js 版本变化，怎样重新建立公平的对照实验？
5. 为什么 Day 1 不直接升级 SDK 或运行交易示例？

学习自评按章程 0–4 级由负责人填写：PENDING。正式性能结果：UNAVAILABLE。

## 7. 遗留事项与下一课

下一课为原始架构分析：从 src/index.js 出发追踪模块依赖、状态及调用关系，区分事实与假设。Day 1 不执行安装、启动、发布、真实交易或正式优化；运行兼容性、功能及性能基线仍待验证。

## 8. Git实践及最终审查记录

- 独立分支：docs/pqse-m0-day01
- 初始文档Commit：add6b473
- 第二轮审查Commit：c1306269
- Draft PR：https://github.com/JaydenLee2588/FKPolymarket15MinCryptTools/pull/1
- 已实践Branch、Stage、Commit、Push及Draft PR工作流。
- GitHub差异核查确认仅新增七份Markdown文档。
- 原始业务代码、依赖及配置未修改。
- 根项目两个文件与原始Tag哈希分别一致。
- 全部十项SHA-256与基线清单一致。
- DEC-011、DEC-012、DEC-013已获负责人批准。
- SDK开发依赖数量经程序统计修正为27。
- 最终归档核查及PR合并待完成。
- 未执行依赖安装、系统启动、性能测试或真实交易。
