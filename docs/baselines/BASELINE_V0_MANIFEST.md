# BASELINE_V0_MANIFEST — 原始系统基线清单

## 1. 基本信息

| 项目 | 内容 |
| --- | --- |
| 项目名称 | Polymarket Quantitative System Engineering |
| 项目简称 | PQSE |
| 基线版本 | V0.0 |
| 记录日期 | 2026-11-25 |
| 任务编号 | PQSE-M0-D01 |
| 基线类型 | Original System Baseline |
| GitHub仓库 | JaydenLee2588/FKPolymarket15MinCryptTools |
| 默认分支 | main |
| 基线Tag | pqse-baseline-v0.0 |
| Tag类型 | Lightweight Tag |
| 基线Commit | 182e54fa20639b3650f6c6d78b8be8d72d7f135f |

## 2. Git基线验证

- 本地Tag与远端Tag一致。
- Tag指向已确认的原始Commit。
- 检查时HEAD与基线Commit一致。
- 检查时本地main与origin/main一致。
- 已跟踪文件相对于原始基线无差异。
- 工作区仅存在Day 1新增的未跟踪文档。
- 原始业务代码未修改。
- 原始依赖文件未修改。

基线版本验证：PASS

原计划采用Annotated Tag，实际创建的是Lightweight Tag。现有Tag满足版本锁定要求，建议保留，项目负责人已于2026-11-25批准保留（DEC-011）。

## 3. 实验环境

详细环境信息参见：

`docs/baselines/ENVIRONMENT_V0.md`

| 项目 | 版本 |
| --- | --- |
| 设备 | Mac mini |
| CPU | Apple M4 |
| 架构 | ARM64 |
| CPU核心数 | 10 |
| 内存 | 16GB |
| 操作系统 | macOS Tahoe 26.6.2 |
| Build | 25G83 |
| Node.js | v26.7.0 |
| npm | 11.19.0 |
| Git | 2.55.0 |

## 4. 根项目依赖基线

| 项目 | 内容 |
| --- | --- |
| 项目名称 | polyassistant |
| 项目版本 | 0.1.0 |
| 模块类型 | ES Modules |
| 包管理器 | npm |
| 锁定文件 | package-lock.json |
| lockfileVersion | 3 |
| 直接依赖 | 5 |
| 锁定依赖条目 | 19 |
| 其他锁定条目 | 14 |
| Node.js版本约束 | 未声明 |
| 启动命令 | node src/index.js |
| 根项目测试命令 | 未声明 |
| 根项目Benchmark命令 | 未声明 |
| 根项目安装生命周期脚本 | 未声明 |

### 4.1 直接依赖

| 依赖 | 声明版本 | 锁定版本 |
| --- | --- | --- |
| ethers | ^6.11.1 | 6.16.0 |
| https-proxy-agent | ^7.0.6 | 7.0.6 |
| socks-proxy-agent | ^8.0.5 | 8.0.5 |
| undici | ^6.21.3 | 6.23.0 |
| ws | ^8.18.0 | 8.19.0 |

### 4.2 完整锁定依赖清单

| 依赖路径 | 锁定版本 |
| --- | --- |
| @adraffy/ens-normalize | 1.10.1 |
| @noble/curves | 1.2.0 |
| @noble/hashes | 1.3.2 |
| @types/node | 22.7.5 |
| aes-js | 4.0.0-beta.5 |
| agent-base | 7.1.4 |
| debug | 4.4.3 |
| ethers | 6.16.0 |
| ethers/node_modules/ws | 8.17.1 |
| https-proxy-agent | 7.0.6 |
| ip-address | 10.1.0 |
| ms | 2.1.3 |
| smart-buffer | 4.2.0 |
| socks | 2.8.7 |
| socks-proxy-agent | 8.0.5 |
| tslib | 2.7.0 |
| undici | 6.23.0 |
| undici-types | 6.19.8 |
| ws | 8.19.0 |

所有19个锁定依赖条目均未标记 hasInstallScript=true。

该结果仅代表锁定文件中的元数据检查，不构成完整的依赖安全审计。

## 5. 内置CLOB Client基线

| 项目 | 内容 |
| --- | --- |
| 目录 | src/clob_client/ |
| 名称 | @polymarket/clob-client |
| 声明版本 | 5.2.1 |
| 声明来源 | https://github.com/Polymarket/clob-client |
| 许可证声明 | MIT |
| 开发语言 | TypeScript |
| 包管理器 | pnpm@9.15.4 |
| 锁定文件 | pnpm-lock.yaml |
| Node.js要求 | >=20.10 |
| 运行时直接依赖 | 9 |
| 开发依赖 | 27 |
| 构建入口 | dist/index.js |
| 构建命令 | make build |
| 测试命令 | make test |
| Lint命令 | make lint |
| 发布命令 | pnpm build && npm publish --access public --provenance |

### 5.1 运行时依赖声明

| 依赖 | 声明版本 |
| --- | --- |
| @ethersproject/providers | ^5.7.2 |
| @ethersproject/units | ^5.7.0 |
| @ethersproject/wallet | ^5.7.0 |
| @polymarket/builder-signing-sdk | ^0.0.8 |
| @polymarket/order-utils | ^3.0.1 |
| axios | ^1.0.0 |
| browser-or-node | ^2.1.1 |
| ethers | ^5.7.1 |
| tslib | ^2.4.0 |

### 5.2 待验证事项

- SDK实际运行时使用情况。
- SDK与官方声明版本的源码一致性。
- SDK是否包含原作者定制修改。
- pnpm锁定依赖的精确版本及安装脚本。
- SDK实际构建状态。
- ethers v5与v6之间的交互关系。
- SDK测试及外部接口兼容性。

本阶段未安装或构建SDK，未执行SDK测试、发布或交易示例。

## 6. 文件SHA-256基线

### 6.1 根项目依赖文件

package.json：

`7a5d104a232732f30f3f9ded0d632c065b33c57da8cdee522d5931b88b6a2e79`

package-lock.json：

`38a95170aaa308919ffaec41227fc72056271683b4777689cb79a569dba3626e`

2026-11-25重新采集纯文本SHA-256输出，全部10个哈希值均为64位十六进制字符串，并与本清单一致。根项目两个文件的工作区哈希与原始Tag哈希分别一致。其余八个文件尚未逐一独立重算Tag哈希；GitHub差异核查确认PR仅新增文档。

### 6.2 配置及SDK文件

| 文件 | SHA-256 |
| --- | --- |
| src/config.js | 0d4338c13b5545cf82b6d400c1bf842343c501c72e29d106ab4278b11f16a5e0 |
| src/clob_client/src/config.ts | 0979dc5dcbc27aa94e50a88db0caac455e81e67c40d2897b0c49dd2043d7a456 |
| src/clob_client/examples/rfqConfig.ts | 04658a30b725aec1e9db85a9f11f3b78105a1250397802c4615cea8de1737fdc |
| src/clob_client/package.json | 897cedd85004ab92febeb8ccb28590a7f7b0130329bdc97ede927ac8e0aaa99a |
| src/clob_client/pnpm-lock.yaml | 4fa31dbc6029cd5cd8ea372acdfeb1e1398ffe0c99774202ae8592bc86a37e14 |
| src/clob_client/tsconfig.build.json | 451d5a444033003c23c5919b7feecd517a20b95b778530dcb058cf5acc3b5523 |
| src/clob_client/tsconfig.eslint.json | 84128630d8748a95c457b1bf686b7b9be670a30626358aa3d71973d1639977fc |
| src/clob_client/tsconfig.json | 5355cf54f59d69e9da8d74967166a1f885e34e8d45e002011183b64c211b3d76 |

## 7. 初步模块清单

| 模块 | 路径 |
| --- | --- |
| 应用入口 | src/index.js |
| 系统配置 | src/config.js |
| 数据采集 | src/data/ |
| 技术指标 | src/indicators/ |
| 分析与预测引擎 | src/engines/ |
| 网络代理 | src/net/ |
| 服务模块 | src/server.js |
| 公共工具 | src/utils.js |
| 内置CLOB Client | src/clob_client/ |

以上为静态目录分类，不代表已经确认的运行时调用链。

## 8. 初步工程发现

### FINDING-001：双依赖管理体系

根项目采用npm，内置SDK采用pnpm。

### FINDING-002：ethers双主版本依赖

根项目锁定ethers 6.16.0，SDK声明ethers ^5.7.1。

实际运行时影响尚未验证。

### FINDING-003：根项目缺少Node.js版本约束

根项目未声明engines字段。

### FINDING-004：根项目缺少自动化测试及Benchmark命令

内置SDK存在独立测试体系，但根项目未声明相关命令。

### FINDING-005：SDK源码内置

内置SDK声明来源为Polymarket官方CLOB Client仓库。

源码一致性及实际使用情况待验证。

### FINDING-006：外部接口兼容性风险

原始项目长期未更新，外部服务接口兼容性待验证。

## 9. 验证命令

- git fetch origin --tags
- git tag -l
- git rev-parse "pqse-baseline-v0.0^{commit}"
- git rev-parse HEAD
- git cat-file -t pqse-baseline-v0.0
- git ls-remote --tags origin
- git show --no-patch pqse-baseline-v0.0
- git diff --stat pqse-baseline-v0.0
- git diff --name-status pqse-baseline-v0.0
- git status --short --untracked-files=all
- cat package.json
- cat src/clob_client/package.json
- git ls-files src
- shasum -a 256

依赖版本通过Node.js只读解析package-lock.json获得。

## 10. 验收状态

| 验收项目 | 状态 |
| --- | --- |
| 原始Commit锁定 | PASS |
| Tag类型及指向验证 | PASS |
| 本地环境信息采集 | PASS |
| 根项目依赖静态审计 | PASS |
| SDK依赖声明审计 | PASS |
| 主要文件校验值采集 | PASS |
| 已跟踪文件一致性 | PASS |
| SDK完整锁定依赖审计 | PENDING |
| 依赖安全审计 | PENDING |
| 依赖安装验证 | PENDING |
| 系统启动验证 | PENDING |
| 功能基线测试 | PENDING |
| 性能基线测试 | PENDING |
| 外部API兼容性验证 | PENDING |

D01.05静态基线审计：PASS

M0完整基线验收：PENDING

## 11. 变更控制

本阶段不进行业务代码优化，不修改原始依赖及配置，不执行真实资金交易。

任何后续修复或优化必须独立记录，并按照项目章程进行审批、实验及回归验证。