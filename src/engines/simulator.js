/**
 * 模拟交易引擎
 * 管理持仓状态、入场/出场判断、交易日志
 */

import fs from "node:fs";
import path from "node:path";

// 持仓状态
let positions = []; // 支持多个持仓

// 已结算的回合 (防止重复结算)
const settledRounds = new Set();

// 当前回合已入场的方向 (防止同方向重复入场)
const enteredDirections = new Map(); // roundSlug -> Set<'UP'|'DOWN'>

// 当前回合信息
let currentRound = {
    slug: null,
    startTime: null,
    trades: []
};

// 日志文件路径
let logFilePath = null;

/**
 * 初始化日志文件
 */
function initLogFile() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timeStr = now.toTimeString().slice(0, 5).replace(":", "");
    const filename = `trades_${dateStr}_${timeStr}.log`;

    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    logFilePath = path.join(logsDir, filename);
    console.log(`[Simulator] Log file: ${logFilePath}`);
}

/**
 * 写入日志
 */
function writeLog(message) {
    if (!logFilePath) initLogFile();

    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logFilePath, line);
    console.log(`[Trade] ${message}`);
}

/**
 * 写入回合分隔线
 */
function writeRoundSeparator() {
    if (!logFilePath) initLogFile();
    fs.appendFileSync(logFilePath, "\n" + "-".repeat(80) + "\n\n");
}

/**
 * 检查是否应该入场
 * @param {Object} params
 * @returns {Object|null} 入场信号或null
 */
export function checkEntry({
    pattern,
    edge,
    marketUp,
    marketDown,
    minutesLeft,
    windowMinutes = 15,
    roundSlug = null
}) {
    // 条件1: 必须是"强烈推荐"
    if (!pattern?.recommendEntry?.includes("强烈推荐")) {
        // console.log(`[Debug] Pattern not strong enough: ${pattern?.recommendEntry}`);
        return null;
    }

    // 条件2: 必须在前5分钟内
    const elapsedMinutes = windowMinutes - minutesLeft;
    if (elapsedMinutes > 5) {
        return null;
    }

    // 判断方向
    const action = pattern.actionSuggestion;
    const side = action?.includes("买涨") ? "UP" : action?.includes("买跌") ? "DOWN" : null;
    if (!side) return null;

    // 条件5: 检查是否已在本回合同方向入场过 (防重复)
    if (roundSlug) {
        const entered = enteredDirections.get(roundSlug);
        if (entered?.has(side)) {
            return null; // 已入场过，不重复入场
        }
    }

    // 获取对应方向的市场价格和edge
    const marketPrice = side === "UP" ? marketUp : marketDown;
    const edgeValue = side === "UP" ? edge?.edgeUp : edge?.edgeDown;

    // Debug output when we have a strong pattern
    console.log(`[Simulator] Strong Pattern Found: ${pattern.patternName}, Side: ${side}, Edge: ${edgeValue?.toFixed(3)}, Price: ${marketPrice}`);

    // 条件3: edge > 0.1（暂时缩小做测试）
    if (edgeValue === null || edgeValue <= 0.1) {
        console.log(`[Simulator] Edge too low: ${edgeValue?.toFixed(3)} <= 0.1`);
        return null;
    }

    // 条件4: 市场价格 < 0.75（暂时放大做测试）
    if (marketPrice === null || marketPrice >= 0.75) {
        console.log(`[Simulator] Market price too high: ${marketPrice} >= 0.75`);
        return null;
    }

    // 条件4: 市场价格 < 0.75（暂时放大做测试）
    if (marketPrice === null || marketPrice >= 0.75) {
        return null;
    }

    return {
        side,
        marketPrice,
        edge: edgeValue,
        pattern: pattern.patternName
    };
}

/**
 * 执行买入
 */
export function executeBuy({ side, marketPrice, edge, pattern, roundSlug }) {
    const pos = {
        side,
        entryPrice: marketPrice,
        entryTime: new Date(),
        roundSlug,
        pattern,
        edge
    };

    positions.push(pos);
    currentRound.trades.push(pos);

    // 记录已入场方向
    if (roundSlug) {
        if (!enteredDirections.has(roundSlug)) {
            enteredDirections.set(roundSlug, new Set());
        }
        enteredDirections.get(roundSlug).add(side);
    }

    const directionText = side === "UP" ? "涨" : "跌";
    writeLog(`买入 | 方向: ${directionText} | 价格: ${marketPrice.toFixed(3)} | Edge: ${edge.toFixed(3)} | 形态: ${pattern}`);

    return pos;
}

/**
 * 检查是否应该出场 (止盈)
 */
export function checkExit({ position, currentMarketUp, currentMarketDown }) {
    const currentPrice = position.side === "UP" ? currentMarketUp : currentMarketDown;

    if (currentPrice === null) return null;

    // 价差达到0.2就止盈
    const priceDiff = currentPrice - position.entryPrice;

    if (priceDiff >= 0.2) {
        return {
            reason: "TAKE_PROFIT",
            exitPrice: currentPrice,
            profit: priceDiff
        };
    }

    return null;
}

/**
 * 执行卖出
 */
export function executeSell({ position, exitPrice, reason }) {
    const profit = exitPrice - position.entryPrice;
    const directionText = position.side === "UP" ? "涨" : "跌";

    writeLog(`卖出 | 方向: ${directionText} | 买入价: ${position.entryPrice.toFixed(3)} | 卖出价: ${exitPrice.toFixed(3)} | 盈亏: ${profit >= 0 ? "+" : ""}${profit.toFixed(3)} | 原因: ${reason}`);

    // 从持仓中移除
    positions = positions.filter(p => p !== position);

    return { profit };
}

/**
 * 处理回合结算
 */
export function handleSettlement({ roundSlug, settlementResult, marketUp, marketDown }) {
    // 防止重复结算
    if (settledRounds.has(roundSlug)) {
        return [];
    }
    settledRounds.add(roundSlug);

    // settlementResult: "UP" 或 "DOWN"
    const settledPositions = positions.filter(p => p.roundSlug === roundSlug);

    if (settledPositions.length === 0) {
        writeRoundSeparator();
        // 清理入场记录
        enteredDirections.delete(roundSlug);
        return [];
    }

    const results = [];

    for (const pos of settledPositions) {
        // 决议结算盈亏
        let settlementProfit;
        if (pos.side === settlementResult) {
            // 获胜：获得 1 - 入场价格
            settlementProfit = 1 - pos.entryPrice;
        } else {
            // 失败：损失入场价格
            settlementProfit = -pos.entryPrice;
        }

        const directionText = pos.side === "UP" ? "涨" : "跌";
        const resultText = settlementResult === "UP" ? "涨" : "跌";

        writeLog(`决议 | 持仓方向: ${directionText} | 买入价: ${pos.entryPrice.toFixed(3)} | 决议结果: ${resultText} | 盈亏: ${settlementProfit >= 0 ? "+" : ""}${settlementProfit.toFixed(3)}`);

        results.push({ position: pos, settlementProfit });
    }

    // 清空该回合持仓
    positions = positions.filter(p => p.roundSlug !== roundSlug);
    // 清理入场记录
    enteredDirections.delete(roundSlug);

    writeRoundSeparator();

    return results;
}

/**
 * 检测新回合开始
 */
export function onNewRound(slug) {
    if (currentRound.slug && currentRound.slug !== slug) {
        // 回合切换，写入分隔线
        writeRoundSeparator();
    }

    currentRound = {
        slug,
        startTime: new Date(),
        trades: []
    };

    writeLog(`新回合开始: ${slug}`);
}

/**
 * 获取当前持仓
 */
export function getPositions() {
    return [...positions];
}

/**
 * 获取当前回合信息
 */
export function getCurrentRound() {
    return { ...currentRound };
}

// 初始化日志
initLogFile();
