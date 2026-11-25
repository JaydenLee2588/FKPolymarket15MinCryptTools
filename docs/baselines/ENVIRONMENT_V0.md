# ENVIRONMENT_V0 — 原始系统实验环境基线

## 1. 基本信息

| 项目 | 内容 |
| --- | --- |
| 项目名称 | Polymarket Quantitative System Engineering |
| 项目简称 | PQSE |
| 基线版本 | V0.0 |
| 基线Tag | pqse-baseline-v0.0 |
| 基线Commit SHA | 182e54fa20639b3650f6c6d78b8be8d72d7f135f |
| 记录时间 | 2026-11-25 01:56:03 -0500 |
| 环境用途 | 本地开发及性能基准测试 |

## 2. 硬件环境

| 项目 | 规格 |
| --- | --- |
| 设备 | Mac mini |
| 处理器 | Apple M4 |
| CPU架构 | ARM64 |
| 物理CPU核心数 | 10 |
| 逻辑CPU核心数 | 10 |
| 统一内存 | 16GB |

## 3. 软件环境

| 项目 | 版本 |
| --- | --- |
| 操作系统 | macOS Tahoe 26.6.2 |
| 系统Build编号 | 25G83 |
| Node.js | v26.7.0 |
| npm | 11.19.0 |
| Git | 2.55.0 |
| Shell | zsh |

## 4. 环境验证命令

- sw_vers
- sysctl -n machdep.cpu.brand_string
- uname -m
- sysctl -n hw.physicalcpu
- sysctl -n hw.logicalcpu
- sysctl -n hw.memsize
- node -v
- npm -v
- git --version

## 5. 实验环境管理规范

- 后续性能对比实验优先使用本机。
- 同一实验的优化前后必须使用一致的软硬件环境。
- 操作系统、Node.js、npm及依赖版本发生变化时，必须记录。
- 环境发生重大变化后，应重新测量对照版本的性能基线。
- 不得将运行环境变化带来的性能改善直接归因于业务代码优化。
- 性能测试时应记录后台进程、系统负载及测试条件。

## 6. 已知风险与待验证事项

- 原始项目长期未更新，当前Node.js版本与原始开发环境可能存在差异。
- 原始项目声明的Node.js运行要求尚待核查。
- 当前依赖兼容性尚未验证。
- 当前系统启动状态尚未验证。
- 性能基准数据尚未采集。

## 7. 验收状态

本机环境信息采集：PASS

运行环境兼容性验证：PENDING

性能基线测量：PENDING