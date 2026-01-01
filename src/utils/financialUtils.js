/**
 * Financial Calculation Utilities
 */

// Asset Categories with Hardcoded Return Ranges and Risk Levels
export const ASSET_CATEGORIES = {
    LIQUID: {
        id: 'liquid',
        name: 'Liquid / Arbitrage Funds',
        risk: 'LOW',
        minReturn: 5,
        maxReturn: 6,
        schemeCode: '119598', // SBI Liquid Fund (Proxy for category)
        recommendedFunds: [
            { name: "SBI Liquid Fund Direct Growth", isin: "INF200K01UT4", schemeCode: "119598" },
            { name: "ICICI Prudential Liquid Fund Direct Growth", isin: "INF109K01886", schemeCode: "120586" }
        ]
    },
    SHORT_DEBT: {
        id: 'short_debt',
        name: 'Short-term Debt Funds',
        risk: 'LOW-MODERATE',
        minReturn: 6,
        maxReturn: 7,
        schemeCode: '119803', // SBI Short Term Debt
        recommendedFunds: [
            { name: "SBI Short Term Debt Fund Direct Growth", isin: "INF200K01VA1", schemeCode: "119803" },
            { name: "HDFC Short Term Debt Fund Direct Growth", isin: "INF179K01BC7", schemeCode: "119053" }
        ]
    },
    CONSERVATIVE_HYBRID: {
        id: 'cons_hybrid',
        name: 'Conservative Hybrid Funds',
        risk: 'MODERATE',
        minReturn: 7,
        maxReturn: 9,
        schemeCode: '119642', // SBI Conservative Hybrid
        recommendedFunds: [
            { name: "SBI Conservative Hybrid Fund Direct Growth", isin: "INF200K01VE3", schemeCode: "119642" },
            { name: "Kotak Debt Hybrid Fund Direct Growth", isin: "INF174K01LS2", schemeCode: "119830" }
        ]
    },
    AGGRESSIVE_HYBRID: {
        id: 'agg_hybrid',
        name: 'Aggressive Hybrid Funds',
        risk: 'MODERATE-HIGH',
        minReturn: 10,
        maxReturn: 12,
        schemeCode: '119363', // ICICI Pru Equity & Debt
        recommendedFunds: [
            { name: "ICICI Pru Equity & Debt Fund Direct Growth", isin: "INF109K01Y07", schemeCode: "119363" },
            { name: "Quant Absolute Fund Direct Growth", isin: "INF966L01026", schemeCode: "120822" }
        ]
    },
    LARGE_CAP: {
        id: 'large_cap',
        name: 'Large Cap Equity Funds',
        risk: 'HIGH',
        minReturn: 12,
        maxReturn: 14,
        schemeCode: '118776', // Nippon India Large Cap
        recommendedFunds: [
            { name: "Nippon India Large Cap Fund Direct Growth", isin: "INF204K01884", schemeCode: "118776" },
            { name: "HDFC Top 100 Fund Direct Growth", isin: "INF179KA1ER3", schemeCode: "119062" }
        ]
    },
    FLEXI_CAP: {
        id: 'flexi_cap',
        name: 'Flexi Cap / Index Funds',
        risk: 'VERY HIGH',
        minReturn: 14,
        maxReturn: 18,
        schemeCode: '122639', // Parag Parikh Flexi Cap
        recommendedFunds: [
            { name: "Parag Parikh Flexi Cap Fund Direct Growth", isin: "INF879O01027", schemeCode: "122639" },
            { name: "UTI Nifty 50 Index Fund Direct Growth", isin: "INF789F01XA0", schemeCode: "120716" }
        ]
    }
};

/**
 * Returns specific fund recommendations for a given category ID
 */
export const getFundRecommendations = (categoryId) => {
    const category = Object.values(ASSET_CATEGORIES).find(c => c.id === categoryId || c.name === categoryId);
    return category ? category.recommendedFunds : [];
};

/**
 * Calculates the Future Value of a Single Sum (Lumpsum)
 * @param {number} rate - Annual interest rate (in %)
 * @param {number} nper - Number of years
 * @param {number} pv - Present Value (Initial Amount)
 */
export const calculateFV = (rate, nper, pv) => {
    const r = rate / 100;
    return pv * Math.pow((1 + r), nper);
};

/**
 * Calculates the Future Value of a SIP (Monthly Investment)
 * Supports Annual Step-Up if stepUpRate > 0
 * @param {number} rate - Annual interest rate (in %)
 * @param {number} months - Number of months
 * @param {number} pmt - Monthly SIP amount
 * @param {number} stepUpRate - Annual step-up increment (in %)
 */
export const calculateSIPFV = (rate, months, pmt, stepUpRate = 0) => {
    let r = rate / 100 / 12; // Monthly return rate

    // If no step-up, use the faster formula
    if (stepUpRate === 0) {
        if (r === 0) return pmt * months;
        return pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
    }

    // Iterative calculation for Step-Up SIP
    // Because mixing Monthly Compounding with Annual Step-Up is complex for a single formula
    let totalValue = 0;
    let currentPmt = pmt;
    let totalInvested = 0;

    for (let i = 1; i <= months; i++) {
        // Add investment
        totalValue += currentPmt;
        totalInvested += currentPmt;

        // Apply monthly growth
        totalValue *= (1 + r);

        // Increase SIP amount every 12 months
        if (i % 12 === 0) {
            currentPmt = currentPmt * (1 + stepUpRate / 100);
        }
    }

    return totalValue;
};

/**
 * Calculates the Future Value "Schedule" (Year by Year) for building Charts
 * @returns {Array} Array of { year, invested, value }
 */
export const calculateWealthGrowthCurve = (rate, months, currentCorpus, monthlyPmt, stepUpRate = 0) => {
    let r = rate / 100 / 12;
    let totalValue = currentCorpus;
    let totalInvested = currentCorpus;
    let currentPmt = monthlyPmt;
    const dataPoints = [];

    // Start point (Year 0)
    dataPoints.push({
        year: 0,
        invested: Math.round(totalInvested),
        value: Math.round(totalValue)
    });

    for (let i = 1; i <= months; i++) {
        // Add monthly investment
        totalValue += currentPmt;
        totalInvested += currentPmt;

        // Apply monthly return
        totalValue *= (1 + r);

        // Annual Step-Up Logic
        if (i % 12 === 0) {
            currentPmt = currentPmt * (1 + stepUpRate / 100);

            // Record Data Point at the end of each year
            dataPoints.push({
                year: i / 12,
                invested: Math.round(totalInvested),
                value: Math.round(totalValue)
            });
        }
    }

    // Handle remaining months if not a full year
    if (months % 12 !== 0) {
        dataPoints.push({
            year: Number((months / 12).toFixed(1)),
            invested: Math.round(totalInvested),
            value: Math.round(totalValue)
        });
    }

    return dataPoints;
};

/**
 * Calculates the Required Monthly SIP to reach a Target Corpus
 * @param {number} target - Future Target Value
 * @param {number} rate - Annual interest rate (in %)
 * @param {number} months - Number of months
 */
export const calculateRequiredSIP = (target, rate, months) => {
    const r = rate / 100 / 12;
    if (r === 0) return target / months;
    return target / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
};

/**
 * Adjusts an amount for inflation
 * @param {number} currentCost - Cost of goal today
 * @param {number} inflationRate - Annual inflation rate (in %)
 * @param {number} years - Number of years usually
 */
export const inflationAdjust = (currentCost, inflationRate, years) => {
    return calculateFV(inflationRate, years, currentCost);
};

/**
 * Calculates the number of months between two dates
 */
export const getMonthsDifference = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
};

/**
 * Calculates a Confidence Score (0-100) for a recommendation
 */
export const calculateConfidenceScore = (years, riskLevel, gapPercentage) => {
    // Base score
    let score = 100;

    // Time Horizon Penalty
    // If trying to achieve high returns in short time
    if (years < 3 && ['HIGH', 'VERY HIGH'].includes(riskLevel)) score -= 40;
    if (years < 1 && riskLevel !== 'LOW') score -= 50;

    // Gap Penalty (How far off they are)
    if (gapPercentage > 0) {
        // Reduce score by the % shortfall, capped at 50
        score -= Math.min(gapPercentage * 100, 50);
    }

    // Cap between 0 and 100
    return Math.max(0, Math.min(100, score));
};

/**
 * Helper to fetch NAV data from MFAPI
 * Returns a promise that resolves to the CAGR or null
 */
export const fetchHistoricalCAGR = async (schemeCode, years = 3) => {
    try {
        const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) return null;

        const navData = data.data;
        // MFAPI returns data in reverse chronological order (newest first)

        const latestNav = parseFloat(navData[0].nav);
        const latestDate = navData[0].date; // DD-MM-YYYY

        // Find date ~ 'years' ago
        // This is a rough estimation, for production use distinct date parsing
        const daysRequired = years * 365;
        // Assuming daily data, index approx daysRequired (accounting for weekends/holidays is complex, simpler approximation here)
        // Data usually has ~250 trading days a year
        const indexApprox = Math.floor(years * 250);

        if (indexApprox >= navData.length) return null; // Not enough history

        const oldNav = parseFloat(navData[indexApprox].nav);

        // CAGR formula: (End / Start) ^ (1/n) - 1
        return (Math.pow(latestNav / oldNav, 1 / years) - 1) * 100;

    } catch (error) {
        console.warn("MFAPI Fetch Error:", error);
        return null;
    }
};

/**
 * Smartly formats currency numbers into K (Thousands), L (Lakhs), or Cr (Crores)
 * @param {number} value - The amount to format
 * @returns {string} - Formatted string
 */
export const formatCurrency = (value) => {
    if (value === undefined || value === null) return "₹ 0";
    const absValue = Math.abs(value);

    if (absValue >= 10000000) { // >= 1 Crore
        return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    } else if (absValue >= 100000) { // >= 1 Lakh
        return `₹ ${(value / 100000).toFixed(2)} L`;
    } else if (absValue >= 1000) { // >= 1 Thousand
        return `₹ ${(value / 1000).toFixed(2)} K`;
    } else {
        return `₹ ${value.toFixed(0)}`;
    }
};

