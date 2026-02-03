/**
 * 形态检测引擎
 * 基于 VWAP + MACD + RSI 的 10 种形态识别
 */

// 形态类型定义
const PATTERNS = {
    // 🚀 顺势多头
    ROCKET_LAUNCH: {
        name: '火箭发射',
        signalType: '🚀 顺势多',
        trend: '大涨 【大涨】',
        action: '【买涨】',
        recommend: '✅ 强烈推荐'
    },
    AERIAL_REFUEL: {
        name: '空中加油',
        signalType: '🚀 顺势多',
        trend: '续涨 【涨】',
        action: '【买涨】',
        recommend: '✅ 推荐'
    },
    // 📉 顺势空头
    GUILLOTINE: {
        name: '断头铡刀',
        signalType: '📉 顺势空',
        trend: '急跌 【大跌】',
        action: '【买跌】',
        recommend: '✅ 强烈推荐'
    },
    UNDERWATER_DEAD: {
        name: '水下死叉',
        signalType: '📉 顺势空',
        trend: '深跌 【大跌】',
        action: '【买跌】',
        recommend: '✅ 推荐'
    },
    // 🎣 反转多头
    BULLISH_DIV: {
        name: '底背离',
        signalType: '🎣 反转多',
        trend: '反弹 【涨】',
        action: '【买涨】',
        recommend: '⚠️ 谨慎'
    },
    OVERSOLD: {
        name: '极度超卖',
        signalType: '🎣 反转多',
        trend: '触底 【涨】',
        action: '【买涨】',
        recommend: '⚠️ 谨慎'
    },
    // 🏃 反转空头
    BEARISH_DIV: {
        name: '顶背离',
        signalType: '🏃 反转空',
        trend: '变盘 【跌】',
        action: '【买跌】',
        recommend: '⚠️ 谨慎'
    },
    CLIMAX_TOP: {
        name: '情绪高潮',
        signalType: '🏃 反转空',
        trend: '暴跌 【大跌】',
        action: '【买跌】',
        recommend: '✅ 强烈推荐'
    },
    // 🕸️ 震荡
    CHOPPING: {
        name: '织布机',
        signalType: '🕸️ 震荡',
        trend: '无',
        action: '【观望】',
        recommend: '❌ 不推荐'
    },
    TRAP: {
        name: '假突破',
        signalType: '🕸️ 震荡',
        trend: '回落 【微跌】',
        action: '【观望】',
        recommend: '❌ 不推荐'
    }
};

/**
 * 获取价格位置描述 (vs VWAP)
 */
function getVwapPosition(vwapDist) {
    if (vwapDist === null || vwapDist === undefined) return { text: '-', code: 'neutral' };

    const pct = Math.abs(vwapDist * 100);

    if (pct < 0.05) return { text: '缠绕粘合', code: 'neutral' };
    if (vwapDist > 0.003) return { text: '极度远离(上方)', code: 'far_above' };
    if (vwapDist > 0.001) return { text: '远离(上方)', code: 'above' };
    if (vwapDist > 0) return { text: '站稳上方', code: 'slightly_above' };
    if (vwapDist < -0.003) return { text: '极度远离(下方)', code: 'far_below' };
    if (vwapDist < -0.001) return { text: '远离(下方)', code: 'below' };
    return { text: '跌破下方', code: 'slightly_below' };
}

/**
 * 获取 MACD 状态描述
 */
function getMacdStatus(macd) {
    if (!macd) return { text: '-', code: 'neutral' };

    const { hist, histDelta, macd: macdLine, signal } = macd;

    // 金叉/死叉判断 (基于柱状图正负)
    const isGoldenCross = hist > 0 && histDelta > 0;
    const isDeadCross = hist < 0 && histDelta < 0;
    const isNearZero = Math.abs(hist) < 0.5;

    if (isNearZero && Math.abs(histDelta) < 0.2) {
        return { text: '零轴粘合', code: 'zero_line' };
    }
    if (isGoldenCross) {
        return { text: '金叉/红柱放大', code: 'golden_cross' };
    }
    if (isDeadCross) {
        return { text: '死叉/绿柱放大', code: 'dead_cross' };
    }
    if (hist > 0 && histDelta < 0) {
        return { text: '红柱缩短', code: 'red_shrink' };
    }
    if (hist < 0 && histDelta > 0) {
        return { text: '绿柱缩短', code: 'green_shrink' };
    }
    if (hist < 0 && macdLine < 0) {
        return { text: '零轴下方', code: 'below_zero' };
    }

    return { text: hist > 0 ? '看涨' : '看跌', code: 'neutral' };
}

/**
 * 获取 RSI 状态描述
 */
function getRsiStatus(rsi, rsiSlope) {
    if (rsi === null || rsi === undefined) return { text: '-', code: 'neutral' };

    const slope = rsiSlope ?? 0;  // 防御性空值处理
    const slopeDir = slope > 0.2 ? '↑' : slope < -0.2 ? '↓' : '';

    if (rsi > 85) return { text: `>85 极度超买${slopeDir}`, code: 'extreme_overbought' };
    if (rsi > 70) return { text: `>70 超买${slopeDir}`, code: 'overbought' };
    if (rsi > 55) return { text: `突破55${slopeDir}`, code: 'bullish' };
    if (rsi >= 45 && rsi <= 55) return { text: `45-55 中性${slopeDir}`, code: 'neutral_zone' };
    if (rsi < 20) return { text: `<20 极度超卖${slopeDir}`, code: 'extreme_oversold' };
    if (rsi < 30) return { text: `<30 超卖${slopeDir}`, code: 'oversold' };
    if (rsi < 45) return { text: `跌破45${slopeDir}`, code: 'bearish' };

    return { text: `${rsi.toFixed(0)}${slopeDir}`, code: 'neutral' };
}

/**
 * 检测当前形态
 * @param {Object} params 
 * @returns {Object} 形态检测结果
 */
export function detectPattern({ vwapDist, macd, rsi, rsiSlope, prevRsi }) {
    const vwapPos = getVwapPosition(vwapDist);
    const macdStatus = getMacdStatus(macd);
    const rsiStatus = getRsiStatus(rsi, rsiSlope);

    // 防御性空值处理
    const safeRsiSlope = rsiSlope ?? 0;

    let pattern = null;
    let confidence = 0;

    // 1. 🚀 火箭发射: VWAP上方 + MACD金叉/红柱放大 + RSI>55↑
    if (
        vwapDist > 0 &&
        macd && macd.hist > 0 && macd.histDelta > 0 &&
        rsi > 55 && safeRsiSlope > 0
    ) {
        pattern = PATTERNS.ROCKET_LAUNCH;
        confidence = 0.9;
    }

    // 2. 🚀 空中加油: 回踩VWAP不破 + 绿柱缩短 + RSI 45-50拐头
    else if (
        vwapDist !== null && vwapDist > -0.001 && vwapDist < 0.002 &&
        macd && macd.hist < 0 && macd.histDelta > 0 &&
        rsi >= 45 && rsi <= 55 && safeRsiSlope > 0
    ) {
        pattern = PATTERNS.AERIAL_REFUEL;
        confidence = 0.8;
    }

    // 3. 📉 断头铡刀: VWAP下方 + MACD死叉/绿柱放大 + RSI<45↓
    else if (
        vwapDist < 0 &&
        macd && macd.hist < 0 && macd.histDelta < 0 &&
        rsi < 45 && safeRsiSlope < 0
    ) {
        pattern = PATTERNS.GUILLOTINE;
        confidence = 0.9;
    }

    // 4. 📉 水下死叉: 反弹不过VWAP + 零轴下死叉 + RSI<60拐头
    else if (
        vwapDist !== null && vwapDist < 0 && vwapDist > -0.002 &&
        macd && macd.macd < 0 && macd.hist < 0 && macd.histDelta < 0 &&
        rsi < 60 && safeRsiSlope < 0
    ) {
        pattern = PATTERNS.UNDERWATER_DEAD;
        confidence = 0.8;
    }

    // 5. 🎣 底背离: 远离VWAP下方 + 绿柱缩短 + RSI抬高 (价格低但RSI抬高)
    else if (
        vwapDist !== null && vwapDist < -0.001 &&
        macd && macd.hist < 0 && macd.histDelta > 0 &&
        prevRsi !== null && rsi > prevRsi
    ) {
        pattern = PATTERNS.BULLISH_DIV;
        confidence = 0.7;
    }

    // 6. 🎣 极度超卖: 远离VWAP下方 + 低位金叉 + RSI<20
    else if (
        vwapDist !== null && vwapDist < -0.001 &&
        macd && macd.hist > 0 && macd.histDelta > 0 &&
        rsi < 20
    ) {
        pattern = PATTERNS.OVERSOLD;
        confidence = 0.75;
    }

    // 7. 🏃 顶背离: 远离VWAP上方 + 红柱缩短 + RSI走低 (价格高但RSI走低)
    else if (
        vwapDist !== null && vwapDist > 0.001 &&
        macd && macd.hist > 0 && macd.histDelta < 0 &&
        prevRsi !== null && rsi < prevRsi
    ) {
        pattern = PATTERNS.BEARISH_DIV;
        confidence = 0.7;
    }

    // 8. 🏃 情绪高潮: 极度远离VWAP + 红柱停滞 + RSI>85
    else if (
        vwapDist !== null && vwapDist > 0.003 &&
        macd && macd.hist > 0 && Math.abs(macd.histDelta) < 0.3 &&
        rsi > 85
    ) {
        pattern = PATTERNS.CLIMAX_TOP;
        confidence = 0.85;
    }

    // 9. 🕸️ 织布机: VWAP粘合 + 零轴粘合 + RSI 45-55
    else if (
        vwapDist !== null && Math.abs(vwapDist) < 0.0005 &&
        macd && Math.abs(macd.hist) < 0.5 &&
        rsi >= 45 && rsi <= 55
    ) {
        pattern = PATTERNS.CHOPPING;
        confidence = 0.8;
    }

    // 10. 🕸️ 假突破: 瞬间突破 + 无量 + RSI疲软 (难以精确检测，作为默认震荡)
    else if (
        vwapDist !== null && Math.abs(vwapDist) < 0.001 &&
        macd && Math.abs(macd.histDelta) < 0.2 &&
        rsi >= 48 && rsi <= 52
    ) {
        pattern = PATTERNS.TRAP;
        confidence = 0.6;
    }

    // 默认：无明确形态
    if (!pattern) {
        // 根据整体方向给出基础判断 (添加 rsi null 检查)
        const safeRsi = rsi ?? 50;  // 默认中性值
        if (vwapDist > 0 && safeRsi > 50) {
            pattern = { name: '偏多震荡', signalType: '🕸️ 震荡', trend: '偏涨 【微涨】', action: '【观望】', recommend: '❌ 不推荐' };
        } else if (vwapDist < 0 && safeRsi < 50) {
            pattern = { name: '偏空震荡', signalType: '🕸️ 震荡', trend: '偏跌 【微跌】', action: '【观望】', recommend: '❌ 不推荐' };
        } else {
            pattern = { name: '无明确形态', signalType: '🕸️ 震荡', trend: '不明', action: '【观望】', recommend: '❌ 不推荐' };
        }
        confidence = 0.5;
    }

    return {
        patternName: pattern.name,
        signalType: pattern.signalType,
        vwapPosition: vwapPos.text,
        macdStatus: macdStatus.text,
        rsiStatus: rsiStatus.text,
        predictedTrend: pattern.trend,
        actionSuggestion: pattern.action,
        recommendEntry: pattern.recommend,
        confidence
    };
}
