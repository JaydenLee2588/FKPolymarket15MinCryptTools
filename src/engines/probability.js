import { clamp } from "../utils.js";

// 标准正态分布累积分布函数 (CDF)
function normalCDF(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014337 * Math.exp(-x * x / 2);
  const prob = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x > 0 ? 1 - prob : prob;
}

// 计算理论胜率 (基于价格距离和剩余时间)
function calculateTheoreticalProb(currentPrice, strikePrice, minutesLeft, volatilityPerMin = 50) {
  if (currentPrice === null || strikePrice === null || minutesLeft <= 0) return 0.5;

  // 波动率随时间衰减：剩余时间越短，价格越难波动，这就导致 Z-Score 非线性放大
  // Sigma = UnitVol * sqrt(Time)
  const sigma = volatilityPerMin * Math.sqrt(minutesLeft);

  // Z = (Price - Strike) / Sigma
  const zScore = (currentPrice - strikePrice) / (sigma || 0.001); // 避免除以零

  return normalCDF(zScore);
}

export function scoreDirection(inputs) {
  const {
    price,
    priceToBeat,     // [NEW] 目标价格
    minutesLeft,     // [NEW] 剩余时间
    vwap,
    vwapSlope,
    rsi,
    rsiSlope,
    macd,
    heikenColor,
    heikenCount,
    failedVwapReclaim
  } = inputs;

  // 1. 计算理论基准概率 (Theoretical Baseline)
  // 假设 BTC 每分钟标准差约为 $50 (对于 $80k 价格这大约是 0.06% 波动率，15分钟约 0.25%)
  const volatility = 50;
  let baseProb = 0.5;

  if (price !== null && priceToBeat !== null && Number.isFinite(price) && Number.isFinite(priceToBeat)) {
    baseProb = calculateTheoreticalProb(price, priceToBeat, minutesLeft, volatility);
  }

  // 2. 计算技术面加成 (Technical Modifiers)
  // 技术指标只在基准概率上进行微调，而不是决定一切
  // 范围：-0.2 (强空) 到 +0.2 (强多)
  let techScore = 0;

  if (price !== null && vwap !== null) {
    if (price > vwap) techScore += 0.05;
    else techScore -= 0.05;
  }

  if (vwapSlope !== null) {
    if (vwapSlope > 0) techScore += 0.05;
    else if (vwapSlope < 0) techScore -= 0.05;
  }

  if (rsi !== null && rsiSlope !== null) {
    if (rsi > 55 && rsiSlope > 0) techScore += 0.05;
    else if (rsi < 45 && rsiSlope < 0) techScore -= 0.05;

    // 超买超卖反转逻辑
    if (rsi > 75) techScore -= 0.05; // 过热减分
    if (rsi < 25) techScore += 0.05; // 超卖加分
  }

  if (macd?.hist !== null) {
    if (macd.hist > 0) techScore += 0.05;
    else techScore -= 0.05;

    if (macd.histDelta > 0) techScore += 0.03;
    else techScore -= 0.03;
  }

  if (heikenColor) {
    if (heikenColor === "green" && heikenCount >= 2) techScore += 0.04;
    else if (heikenColor === "red" && heikenCount >= 2) techScore -= 0.04;
  }

  if (failedVwapReclaim === true) techScore -= 0.08;

  // 3. 合成最终概率
  // 限制在 0.01 - 0.99 之间，保留一点黑天鹅空间
  const rawUp = clamp(baseProb + techScore, 0.01, 0.99);

  // 4. 下行概率
  const rawDown = 1 - rawUp;

  // 返回格式保持一致，虽然内部逻辑变了
  // 注意：不再使用 upScore/downScore 绝对值逻辑，而是概率逻辑
  // 为了兼容旧接口，构造虚拟的 score
  return {
    upScore: rawUp * 10,
    downScore: rawDown * 10,
    rawUp
  };
}

export function applyTimeAwareness(rawUp, remainingMinutes, windowMinutes) {
  // 新逻辑下，rawUp 已经包含了时间衰减 (通过 Z-Score sigma)，
  // 所以这里不需要再做强制回归 0.5 的操作。
  // 我们直接返回 rawUp，或者只做极小幅度的平滑。

  return { timeDecay: 0, adjustedUp: rawUp, adjustedDown: 1 - rawUp };
}
