/**
 * QuantRiskMetrics Engine - Prop Firm Edition
 * Deterministic Monte Carlo simulation for complex risk architectures.
 */

import { FirmRules } from "@/types/supabase";

export interface SimulationParams {
    // Core Trading Parameters
    initialBalance: number;
    winRate: number; // 0.0 to 1.0
    rewardToRisk: number; // e.g. 2.0
    riskPerTrade: number; // 0.0 to 1.0 (percent of balance)

    // Stochastic & Advanced Params (Phase 4)
    winStdDev: number; // Volatility of R-multiple (e.g. 0.5 means wins vary from 1.5R to 2.5R usually)
    enableDefensive: boolean; // Risk Scaling: Halve risk if DD > 50% of Limit

    // Prop Firm Constraints (Data-Driven)
    rules: FirmRules;

    // Simulation Settings
    iterations: number;
    numberOfTrades: number;
}

export interface SimulationStats {
    distribution: {
        ruinProbability: number;
        successProbability: number; // Hit profit target
        medianFinalBalance: number;
    };
    metrics: {
        expectancy: number; // R-multiple expectancy
        profitFactor: number;
        kellyCriterion: number;
        propSafeKelly: number;
        medianRuinStep: number;
        maxAdverseExcursion: number;
        var95: number; // Value at Risk (5-Trade 95% Confidence)

        // Elite Metrics (Optimization Round)
        sharpeRatio: number;
        ulcerIndex: number;
        consistencyScore: number; // 0-100 score
    };
    violations: {
        consistencyBreach: boolean;
        minDaysBreach: boolean;
    };
    paths: SimulationPath[];
}

export interface SimulationPath {
    id: number;
    equityCurve: number[];
    isRuined: boolean;
    isSuccess: boolean;
    ruinStep?: number;
    // Elite Tracking
    totalProfit: number;
    maxDayProfit: number;
    daysTraded: number;
    squaredDrawdowns: number[]; // For Ulcer Index
    returns: number[]; // For Sharpe
}

export class MonteCarloSimulator {
    private params: SimulationParams;

    constructor(params: SimulationParams) {
        this.params = params;
    }

    // Helper: Box-Muller Transform for Normal Distribution
    private getGaussian(mean: number, stdDev: number): number {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return mean + z0 * stdDev;
    }

    public runBatch(): SimulationStats {
        // --- Validation ---
        if (!this.params) throw new Error("Simulator: Params missing");
        if (!this.params.rules) throw new Error("Simulator: Rules missing");

        const iterations = Math.max(1, Math.min(this.params.iterations || 1, 50000));
        const winRate = Math.max(0, Math.min(this.params.winRate || 0, 1));
        const rewardToRisk = Math.max(0.1, this.params.rewardToRisk || 0.1);
        const initialBalance = Math.max(1, this.params.initialBalance || 1);
        const numberOfTrades = Math.max(1, Math.min(this.params.numberOfTrades || 1, 1000));
        const drawdownLimit = Math.max(1, this.params.rules.drawdownLimit || 1);
        const profitTarget = Math.max(1, this.params.rules.profitTarget || 1);

        let ruinedCount = 0;
        let successCount = 0;
        const finalBalances = new Float32Array(iterations);
        const paths: SimulationPath[] = [];

        const varSamples: number[] = [];
        const MAX_CHART_PATHS = 50;
        const sampleRate = Math.max(1, Math.floor(iterations / MAX_CHART_PATHS));

        // Elite Aggregators (Optimization Round)
        let totalConsistencyRatio = 0;
        let runningSumSquaredDD = 0;
        let countSquaredDD = 0;
        let runningSumReturns = 0;
        let runningSumSqReturns = 0;
        let countReturns = 0;
        let cleanSuccessCount = 0;

        // Run Simulation Loop
        for (let i = 0; i < iterations; i++) {
            const isSampled = i % sampleRate === 0 && paths.length < MAX_CHART_PATHS;
            const path = this.simulatePath(i, isSampled) as SimulationPath & {
                sumSquaredDD: number, countDD: number, sumReturns: number, sumSqReturns: number, countReturns: number
            };

            if (path.isRuined) ruinedCount++;
            if (path.isSuccess) {
                successCount++;
                const consistencyRatio = path.totalProfit > 0 ? path.maxDayProfit / path.totalProfit : 0;
                const isConsistent = consistencyRatio <= (this.params.rules.consistencyThreshold || 0.4);
                const hasMinDays = path.daysTraded >= (this.params.rules.minTradingDays || 5);

                if (isConsistent && hasMinDays) {
                    cleanSuccessCount++;
                }

                totalConsistencyRatio += consistencyRatio;
            }

            finalBalances[i] = path.equityCurve[path.equityCurve.length - 1];

            // Aggregate metrics without storing huge arrays for every path
            if (!isSampled) {
                runningSumSquaredDD += path.sumSquaredDD;
                countSquaredDD += path.countDD;
                runningSumReturns += path.sumReturns;
                runningSumSqReturns += path.sumSqReturns;
                countReturns += path.countReturns;
            } else {
                // For sampled paths, we still need to aggregate their data
                path.squaredDrawdowns.forEach(v => { runningSumSquaredDD += v; countSquaredDD++; });
                path.returns.forEach(v => {
                    runningSumReturns += v;
                    runningSumSqReturns += v * v;
                    countReturns++;
                });
                paths.push(path);
            }

            // Sampling VaR (5-Trade Window)
            if (isSampled && path.equityCurve.length > 6) {
                const maxStart = path.equityCurve.length - 6;
                const startIdx = Math.floor(Math.random() * maxStart);
                const startEq = path.equityCurve[startIdx];
                const endEq = path.equityCurve[startIdx + 5];
                varSamples.push(endEq - startEq);
            }
        }

        finalBalances.sort();
        varSamples.sort((a, b) => a - b);

        // --- Elite Metrics Calculations ---

        // Sharpe Ratio (Simplified)
        let sharpeRatio = 0;
        if (countReturns > 1) {
            const meanReturn = runningSumReturns / countReturns;
            const variance = (runningSumSqReturns / countReturns) - (meanReturn * meanReturn);
            const stdDev = Math.sqrt(Math.max(0, variance));
            sharpeRatio = stdDev === 0 ? 0 : (meanReturn / stdDev) * Math.sqrt(252); // Annualized approximation
        }

        // Ulcer Index
        let ulcerIndex = 0;
        if (countSquaredDD > 0) {
            const meanSquaredDD = runningSumSquaredDD / countSquaredDD;
            ulcerIndex = Math.sqrt(meanSquaredDD);
        }

        // Consistency Score (0-100)
        const avgConsistencyRatio = successCount > 0 ? totalConsistencyRatio / successCount : 0;
        const consistencyScore = Math.max(0, 100 * (1 - avgConsistencyRatio));

        // --- Standard Metrics ---
        const lossRate = 1 - winRate;
        const expectancy = (winRate * rewardToRisk) - lossRate;
        const profitFactor = lossRate === 0 ? 999 : (winRate * rewardToRisk) / lossRate;
        const kelly = winRate - (lossRate / rewardToRisk);

        const drawdownPercent = this.params.rules.drawdownLimit / initialBalance;
        const positiveKelly = Math.max(0, kelly);
        const propSafeKelly = Math.min(positiveKelly * 0.1, drawdownPercent * 0.25, 0.015);

        const medianFinalBalance = finalBalances[Math.floor(iterations / 2)];
        const ruinedSteps = paths.filter(p => p.isRuined && p.ruinStep !== undefined).map(p => p.ruinStep!);
        ruinedSteps.sort((a, b) => a - b);
        const medianRuinStep = ruinedSteps.length > 0 ? ruinedSteps[Math.floor(ruinedSteps.length / 2)] : 0;

        let var95 = 0;
        if (varSamples.length > 0) {
            const index5th = Math.floor(varSamples.length * 0.05);
            const pnl5th = varSamples[index5th];
            var95 = pnl5th < 0 ? Math.abs(pnl5th) : 0;
        }

        return {
            distribution: {
                ruinProbability: (ruinedCount / iterations) * 100,
                successProbability: (successCount / iterations) * 100,
                medianFinalBalance
            },
            metrics: {
                expectancy,
                profitFactor,
                kellyCriterion: kelly,
                propSafeKelly,
                medianRuinStep,
                maxAdverseExcursion: 0,
                var95,
                sharpeRatio,
                ulcerIndex,
                consistencyScore
            },
            violations: {
                consistencyBreach: successCount > 0 && cleanSuccessCount < successCount,
                minDaysBreach: successCount > 0 && paths.some(p => p.isSuccess && p.daysTraded < (this.params.rules.minTradingDays || 5))
            },
            paths
        };
    }

    private simulatePath(id: number, isSampled: boolean = false): SimulationPath & {
        sumSquaredDD: number, countDD: number, sumReturns: number, sumSqReturns: number, countReturns: number
    } {
        const {
            initialBalance,
            numberOfTrades,
            winRate,
            rewardToRisk,
            riskPerTrade,
            rules,
            winStdDev,
            enableDefensive
        } = this.params;

        const {
            drawdownType,
            drawdownLimit,
            dailyLossLimit,
            profitTarget,
            enablePALock,
            enableBalanceLock,
            tradesPerDay
        } = rules;

        const equityCurve: number[] = [initialBalance];
        let currentEquity = initialBalance;
        let highWaterMark = initialBalance;

        let drawdownFloor = initialBalance - drawdownLimit;
        let startOfDayEquity = initialBalance;

        let isRuined = false;
        let isSuccess = false;
        let ruinStep = -1;

        // Elite Metrics Tracking
        let maxDayProfit = 0;
        let currentDayProfit = 0;
        let daysTraded = 0;

        // Running Aggregators (Memory Optimization)
        let sumSquaredDD = 0;
        let countDD = 0;
        let sumReturns = 0;
        let sumSqReturns = 0;
        let countReturns = 0;

        const squaredDrawdowns: number[] = [];
        const returns: number[] = [];

        for (let t = 1; t <= numberOfTrades; t++) {
            // New Day Check
            if (t % tradesPerDay === 1) {
                daysTraded++;
                currentDayProfit = 0;
            }

            // --- 1. Dynamic Risk Scaling (Defensive) ---
            let currentRiskPercent = riskPerTrade;
            if (enableDefensive) {
                const currentDD = highWaterMark - currentEquity;
                if (currentDD > (drawdownLimit * 0.5)) {
                    currentRiskPercent = riskPerTrade * 0.5;
                }
            }

            // --- 2. Execute Trade (Stochastic) ---
            const isWin = Math.random() < winRate;
            const riskAmount = currentEquity * currentRiskPercent;

            let pnl = 0;
            if (isWin) {
                let realizedR = rewardToRisk;
                if (winStdDev > 0) {
                    realizedR = this.getGaussian(rewardToRisk, winStdDev);
                    realizedR = Math.max(0, realizedR);
                }
                pnl = riskAmount * realizedR;
            } else {
                pnl = -riskAmount;
            }

            // Tracking Day Consistency
            currentDayProfit += pnl;
            if (currentDayProfit > maxDayProfit) maxDayProfit = currentDayProfit;

            // Metrics Update
            const ret = pnl / currentEquity;
            if (isSampled) {
                returns.push(ret);
            } else {
                sumReturns += ret;
                sumSqReturns += ret * ret;
                countReturns++;
            }

            // --- 3. Update Equity ---
            currentEquity += pnl;
            if (isSampled) equityCurve.push(currentEquity);

            // Tracking Drawdown for Ulcer Index
            const currentDDPercent = Math.max(0, (highWaterMark - currentEquity) / highWaterMark * 100);
            if (isSampled) {
                squaredDrawdowns.push(currentDDPercent * currentDDPercent);
            } else {
                sumSquaredDD += currentDDPercent * currentDDPercent;
                countDD++;
            }

            // --- 4. Check Success ---
            if (currentEquity >= initialBalance + profitTarget) {
                isSuccess = true;
                break;
            }

            // --- 5. Logic Branching by Rule Type ---
            const tradePeak = currentEquity;

            if (drawdownType === 'TRAILING_UNREALIZED') {
                if (tradePeak > highWaterMark) {
                    highWaterMark = tradePeak;
                    let newFloor = highWaterMark - drawdownLimit;
                    if (enablePALock) {
                        const lockThreshold = initialBalance + drawdownLimit + 100;
                        if (highWaterMark >= lockThreshold) {
                            newFloor = Math.max(drawdownFloor, initialBalance + 100);
                        }
                    }
                    if (newFloor > drawdownFloor) drawdownFloor = newFloor;
                }
            }
            else if (drawdownType === 'TRAILING_EOD') {
                const isEndOfDay = t % tradesPerDay === 0;
                if (isEndOfDay) {
                    if (currentEquity > highWaterMark) {
                        highWaterMark = currentEquity;
                        let newFloor = highWaterMark - drawdownLimit;
                        if (enableBalanceLock && highWaterMark >= initialBalance) {
                            newFloor = Math.max(newFloor, initialBalance);
                        }
                        if (newFloor > drawdownFloor) drawdownFloor = newFloor;
                    }
                } else {
                    if (tradePeak > highWaterMark) highWaterMark = tradePeak;
                }
            }

            // --- 6. Check Breaches ---
            if (currentEquity <= drawdownFloor) {
                isRuined = true;
                ruinStep = t;
                break;
            }

            const dailyLimitVal = dailyLossLimit ?? 0;
            if (dailyLimitVal > 0) {
                const dailyFloor = startOfDayEquity - dailyLimitVal;
                if (currentEquity <= dailyFloor) {
                    isRuined = true;
                    ruinStep = t;
                    break;
                }
                if (t % tradesPerDay === 0) startOfDayEquity = currentEquity;
            }
        }

        return {
            id,
            equityCurve: isSampled ? equityCurve : [initialBalance, currentEquity],
            isRuined,
            isSuccess,
            ruinStep,
            totalProfit: currentEquity - initialBalance,
            maxDayProfit,
            daysTraded,
            squaredDrawdowns,
            returns,
            sumSquaredDD,
            countDD,
            sumReturns,
            sumSqReturns,
            countReturns
        };
    }
}
