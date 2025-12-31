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
        schemeCode: '119598' // SBI Liquid Fund Direct Growth (Example)
    },
    SHORT_DEBT: {
        id: 'short_debt',
        name: 'Short-term Debt Funds',
        risk: 'LOW-MODERATE',
        minReturn: 6,
        maxReturn: 7,
        schemeCode: '119800' // SBI Short Term Debt Fund
    },
    CONSERVATIVE_HYBRID: {
        id: 'cons_hybrid',
        name: 'Conservative Hybrid Funds',
        risk: 'MODERATE',
        minReturn: 7,
        maxReturn: 9,
        schemeCode: '102885' // SBI Conservative Hybrid Fund
    },
    AGGRESSIVE_HYBRID: {
        id: 'agg_hybrid',
        name: 'Aggressive Hybrid Funds',
        risk: 'MODERATE-HIGH',
        minReturn: 10,
        maxReturn: 12,
        schemeCode: '102861' // SBI Equity Hybrid Fund
    },
    LARGE_CAP: {
        id: 'large_cap',
        name: 'Large Cap Equity Funds',
        risk: 'HIGH',
        minReturn: 12,
        maxReturn: 14,
        schemeCode: '119770' // SBI Bluechip Fund
    },
    FLEXI_CAP: {
        id: 'flexi_cap',
        name: 'Flexi Cap / Index Funds',
        risk: 'VERY HIGH',
        minReturn: 14,
        maxReturn: 18,
        schemeCode: '125497' // SBI Flexicap Fund
    }
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
 * @param {number} rate - Annual interest rate (in %)
 * @param {number} months - Number of months
 * @param {number} pmt - Monthly SIP amount
 */
export const calculateSIPFV = (rate, months, pmt) => {
    const r = rate / 100 / 12; // Monthly rate
    if (r === 0) return pmt * months;
    return pmt * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
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
