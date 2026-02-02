# Polymarket BTC 15m 助手

一个用于 Polymarket **"Bitcoin Up or Down" 15分钟** 市场的实时控制台交易助手。

它结合了：
- Polymarket 市场筛选 + 看涨/看跌 (UP/DOWN) 价格 + 流动性
- Polymarket 实时 WS **Chainlink BTC/USD 当前价格** (与 Polymarket UI 上显示的源相同)
- 通过 HTTP/WSS RPC 回退到链上 Chainlink (Polygon) 数据
- 币安 (Binance) 现货价格作为参考
- 短期技术分析快照 (平均烛图 Heiken Ashi, RSI, MACD, VWAP, Delta 1/3m)
- 一个简单的实时 **预测 (多/空 %)**，源自助手当前的技术分析评分

## 环境要求

- Node.js **18+** (https://nodejs.org/en)
- npm (通常随 Node 一起安装)


## 从终端运行 (分步指南)

### 1) 克隆代码库

```bash
git clone https://github.com/FrondEnt/PolymarketBTC15mAssistant.git
```

替代方案 (不使用 git):

- 点击 GitHub 上的绿色 `<> Code` 按钮
- 选择 `Download ZIP`
- 解压 ZIP 文件
- 在解压后的项目文件夹中打开终端

然后在项目文件夹中打开终端。

### 2) 安装依赖

```bash
npm install
```

### 3) (可选) 设置环境变量

你可以无需额外配置直接运行 (内置了默认值)，但为了更稳定的 Chainlink 回退机制，建议至少配置一个 Polygon RPC。

#### Windows PowerShell (当前终端会话)

```powershell
$env:POLYGON_RPC_URL = "https://polygon-rpc.com"
$env:POLYGON_RPC_URLS = "https://polygon-rpc.com,https://rpc.ankr.com/polygon"
$env:POLYGON_WSS_URLS = "wss://polygon-bor-rpc.publicnode.com"
```

可选的 Polymarket 设置:

```powershell
$env:POLYMARKET_AUTO_SELECT_LATEST = "true"
# $env:POLYMARKET_SLUG = "btc-updown-15m-..."   # 锁定特定市场
```

#### Windows CMD (当前终端会话)

```cmd
set POLYGON_RPC_URL=https://polygon-rpc.com
set POLYGON_RPC_URLS=https://polygon-rpc.com,https://rpc.ankr.com/polygon
set POLYGON_WSS_URLS=wss://polygon-bor-rpc.publicnode.com
```

可选的 Polymarket 设置:

```cmd
set POLYMARKET_AUTO_SELECT_LATEST=true
REM set POLYMARKET_SLUG=btc-updown-15m-...
```

注意:
- 这些环境变量仅适用于当前终端窗口。
- 如果你需要永久生效的环境变量，请通过 Windows 系统环境变量设置，或使用你喜欢的 `.env` 加载器。

## 配置

本项目从环境变量中读取配置。

你可以在 shell 中设置它们，或者创建一个 `.env` 文件并使用你喜欢的方法加载它。

### Polymarket

- `POLYMARKET_AUTO_SELECT_LATEST` (默认: `true`)
  - 当为 `true` 时，自动选择最新的 15分钟市场。
- `POLYMARKET_SERIES_ID` (默认: `10192`)
- `POLYMARKET_SERIES_SLUG` (默认: `btc-up-or-down-15m`)
- `POLYMARKET_SLUG` (可选)
  - 如果设置，助手将锁定特定的市场 slug。
- `POLYMARKET_LIVE_WS_URL` (默认: `wss://ws-live-data.polymarket.com`)

### Polygon 上的 Chainlink (回退机制)

- `CHAINLINK_BTC_USD_AGGREGATOR`
  - 默认: `0xc907E116054Ad103354f2D350FD2514433D57F6f`

HTTP RPC:
- `POLYGON_RPC_URL` (默认: `https://polygon-rpc.com`)
- `POLYGON_RPC_URLS` (可选，逗号分隔)
  - 示例: `https://polygon-rpc.com,https://rpc.ankr.com/polygon`

WSS RPC (可选，但推荐用于更实时的回退):
- `POLYGON_WSS_URL` (可选)
- `POLYGON_WSS_URLS` (可选，逗号分隔)

### 代理支持 (Proxy)

本机器人支持 HTTP(S) 代理，用于 HTTP 请求 (fetch) 和 WebSocket 连接。

支持的环境变量 (标准):

- `HTTPS_PROXY` / `https_proxy`
- `HTTP_PROXY` / `http_proxy`
- `ALL_PROXY` / `all_proxy`

示例:

PowerShell:

```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:8080"
# 或者
$env:ALL_PROXY = "socks5://127.0.0.1:1080"
```

CMD:

```cmd
set HTTPS_PROXY=http://127.0.0.1:8080
REM 或者
set ALL_PROXY=socks5://127.0.0.1:1080
```

#### 带用户名 + 密码的代理 (简易指南)

1) 获取你的代理主机和端口 (例如: `1.2.3.4:8080`)。

2) 将你的登录名和密码添加到 URL 中:

- HTTP/HTTPS 代理:
  - `http://USERNAME:PASSWORD@HOST:PORT`
- SOCKS5 代理:
  - `socks5://USERNAME:PASSWORD@HOST:PORT`

3) 在终端中设置并运行机器人。

PowerShell:

```powershell
$env:HTTPS_PROXY = "http://USERNAME:PASSWORD@HOST:PORT"
npm start
```

CMD:

```cmd
set HTTPS_PROXY=http://USERNAME:PASSWORD@HOST:PORT
npm start
```

重要提示: 如果你的密码包含特殊字符，如 `@` 或 `:`，你必须对其进行 URL 编码。

示例:
- 密码: `p@ss:word`
- 编码后: `p%40ss%3Aword`
- 代理 URL: `http://user:p%40ss%3Aword@1.2.3.4:8080`

## 运行

```bash
npm start
```

### 停止

在终端中按 `Ctrl + C`。

### 更新到最新版本

```bash
git pull
npm install
npm start
```

## 注意事项 / 故障排除

- 如果你看不到 Chainlink 更新:
  - Polymarket WS 可能暂时不可用。机器人会通过 Polygon RPC 回退到 Chainlink 链上价格。
  - 确保至少配置了一个可用的 Polygon RPC URL。
- 如果控制台看起来像是在“刷屏”:
  - 渲染器使用 `readline.cursorTo` + `clearScreenDown` 来保持屏幕稳定静止，但某些终端可能表现不同。

## 安全声明

这不是财务建议。使用风险自负。

created by @krajekis
