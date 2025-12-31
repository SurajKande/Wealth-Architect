import { useState, useEffect, useMemo } from 'react';
import {
    ASSET_CATEGORIES,
    calculateFV,
    calculateSIPFV,
    calculateRequiredSIP,
    inflationAdjust,
    getMonthsDifference,
    calculateConfidenceScore,
    fetchHistoricalCAGR
} from '../utils/financialUtils';

export const useFinancialAdvisor = (goals) => {
    // 1. State for dynamic market rates (fetched from API)
    const [marketRates, setMarketRates] = useState({});

    // 2. Fetch Historical Data on Mount
    useEffect(() => {
        const fetchRates = async () => {
            const newRates = {};
            const promises = Object.values(ASSET_CATEGORIES).map(async (category) => {
                const cagr = await fetchHistoricalCAGR(category.schemeCode);
                if (cagr !== null) {
                    newRates[category.id] = cagr;
                }
            });
            await Promise.all(promises);
            setMarketRates(newRates);
        };
        fetchRates();
    }, []);

    // 3. Generate Insights
    const insights = useMemo(() => {
        return goals.map(goal => {
            const {
                id,
                name,
                startDate,
                targetDate,
                amountNeededToday,
                inflation,
                currentCorpus,
                monthlyInvestment,
            } = goal;

            // Basic Calculations
            const months = getMonthsDifference(startDate, targetDate);
            const years = months / 12;
            const inflAdjustedCost = inflationAdjust(amountNeededToday, inflation, years);

            // Feasibility & Recommendation Logic
            const recommendations = [];
            let isAchievable = false;
            let bestCorpus = 0;
            const warnings = [];

            // Analyze each Asset Category
            Object.values(ASSET_CATEGORIES).forEach(category => {
                // Determine effective return rate
                // Use API rate if available and sensible, else use avg of hardcoded range
                // Cap the API rate to category max to avoid unrealistic projections
                let rate = marketRates[category.id] || (category.minReturn + category.maxReturn) / 2;
                rate = Math.min(rate, category.maxReturn);

                // Calculate Projected Corpus for this category
                const corpusFV = calculateFV(rate, years, currentCorpus);
                const sipFV = calculateSIPFV(rate, months, monthlyInvestment);
                const totalProjected = corpusFV + sipFV;

                if (totalProjected > bestCorpus) {
                    bestCorpus = totalProjected;
                }

                // Check gap
                const shortfall = inflAdjustedCost - totalProjected;
                const gapPercentage = Math.max(0, shortfall / inflAdjustedCost);

                // Feasibility Check for this specific category
                // For "Achievable", we allow a tiny margin of error or exact match
                if (shortfall <= 0) {
                    isAchievable = true;
                }

                // Calculate required SIP if not meeting
                const requiredSip = calculateRequiredSIP(Math.max(0, shortfall), rate, months);

                recommendations.push({
                    category,
                    rate,
                    projectedCorpus: totalProjected,
                    shortfall,
                    requiredSip,
                    gapPercentage,
                    confidence: calculateConfidenceScore(years, category.risk, gapPercentage)
                });
            });

            // Sort recommendations by Confidence Score first, then Shortfall (ascending)
            recommendations.sort((a, b) => b.confidence - a.confidence);

            // Determine Status
            let status = "Achievable";
            if (!isAchievable) {
                // If even the best category (highest return) fails
                status = "NOT_ACHIEVABLE";
                warnings.push("Target corpus not achievable with current inputs.");
            }

            // Select Recommendations
            // Primary: Best Confidence Score that is Achievable (or best available if none)
            let primaryRec = recommendations.find(r => r.shortfall <= 0);

            // If none are fully achievable with current inputs, pick the one that gets closest (smallest shortfall)
            if (!primaryRec) {
                // Sort by failure gap
                const bestEffort = [...recommendations].sort((a, b) => a.shortfall - b.shortfall)[0];
                primaryRec = bestEffort;
            }

            // Logic for short term goals (< 1 year) overrides return optimization
            if (months < 12) {
                const liquidRec = recommendations.find(r => r.category.id === 'liquid');
                if (liquidRec) primaryRec = liquidRec;
                warnings.push("Short duration. Capital protection prioritized.");
            }

            // Select Specific Scenarios for "What-If" Analysis
            const scenarios = {
                conservative: recommendations.find(r => r.category.id === 'liquid'),
                balanced: recommendations.find(r => r.category.id === 'agg_hybrid'),
                aggressive: recommendations.find(r => r.category.id === 'flexi_cap')
            };

            const alternativeScenarios = [
                { type: 'Conservative', ...scenarios.conservative },
                { type: 'Balanced', ...scenarios.balanced },
                { type: 'Aggressive', ...scenarios.aggressive }
            ].filter(s => s.category)
                .map(s => ({
                    type: s.type,
                    category: s.category.name, // Flattened for UI consistency
                    categoryId: s.category.id, // For selection matching
                    risk: s.category.risk,
                    returnUsed: s.rate.toFixed(2),
                    projectedCorpus: s.projectedCorpus,
                    shortfall: s.shortfall,
                    requiredExtraSip: s.requiredSip,
                    confidenceScore: s.confidence
                }));

            // Construct Final Insight Object
            return {
                id,
                name,
                targetDate,
                years,
                status, // achiveable / not_achievable
                inflAdjustedCost,
                currentCorpus,
                monthlyInvestment,

                // Primary Recommendation Details
                primaryRecommendation: {
                    category: primaryRec.category.name,
                    categoryId: primaryRec.category.id,
                    risk: primaryRec.category.risk,
                    returnUsed: primaryRec.rate.toFixed(2),
                    projectedCorpus: primaryRec.projectedCorpus,
                    shortfall: primaryRec.shortfall,
                    requiredExtraSip: primaryRec.requiredSip,
                    confidenceScore: primaryRec.confidence
                },

                alternativeScenarios, // New: Exposed for UI

                // For UI Display
                suggestions: warnings,
                bestCorpus: bestCorpus, // To show "Best Possible"
            };
        });
    }, [goals, marketRates]);

    return insights;
};
