import { useMemo } from 'react';
import {
    calculateMonths,
    calculateInflationAdjustedAmount,
    calculateFutureValue,
    calculateSIP
} from '../utils/formulas';

export const useFinancialAdvisor = (goals) => {
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
                expectedReturn
            } = goal;

            const months = calculateMonths(startDate, targetDate);
            const years = months / 12;

            // 1. Calculate Inflation Adjusted Target
            const inflAdjustedCost = calculateInflationAdjustedAmount(amountNeededToday, inflation, years);

            // 2. Calculate Future Value of Current Corpus
            const corpusFV = calculateFutureValue(currentCorpus, expectedReturn, years);

            // 3. Calculate "Already Covered" by existing Monthly Investment
            // FV of existing SIP
            const monthlyRate = expectedReturn / 12 / 100;
            let existingSipFV = 0;
            if (months > 0 && monthlyRate > 0) {
                existingSipFV = monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
            } else if (months > 0) {
                existingSipFV = monthlyInvestment * months;
            }

            const totalProjectedWealth = corpusFV + existingSipFV;
            const shortfall = inflAdjustedCost - totalProjectedWealth;

            // 4. Calculate Required NEW SIP for the shortfall
            let requiredSip = 0;
            if (shortfall > 0) {
                requiredSip = calculateSIP(shortfall, expectedReturn, months);
            }

            // 5. Advisor Suggestions
            let suggestion = "";
            let assetClass = "";
            let riskProfile = "";

            if (years < 3) {
                assetClass = "Debt / Liquid Funds";
                riskProfile = "Low";
                suggestion = "Time is too short for equity. Stick to safer Debt instruments.";
            } else if (years < 5) {
                assetClass = "Hybrid / Balanced Advantage";
                riskProfile = "Moderate";
                suggestion = "Market volatility can impact short-term goals. Hybrid funds offer balance.";
            } else if (years < 8) {
                assetClass = "Large Cap / Flexi Cap Equity";
                riskProfile = "High";
                suggestion = "Good horizon for Equity. Stick to stable Large/Flexi cap funds.";
            } else {
                assetClass = "Mid / Small Cap Equity";
                riskProfile = "Very High";
                suggestion = "Long term allows you to ride out volatility. maximize returns with Mid/Small caps.";
            }

            const status = shortfall <= 0 ? "On Track" : "Action Needed";

            const actionInsight = shortfall <= 0
                ? `Great job! Your current investments should cover this goal.`
                : `Start an additional SIP of ₹${Math.ceil(requiredSip).toLocaleString('en-IN')} in ${assetClass}.`;

            return {
                id,
                months,
                years,
                inflAdjustedCost,
                corpusFV,
                shortfall,
                requiredSip,
                assetClass,
                riskProfile,
                suggestion,
                status,
                actionInsight
            };
        });
    }, [goals]);

    return insights;
};
