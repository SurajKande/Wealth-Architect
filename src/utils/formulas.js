export const calculateMonths = (startDate, targetDate) => {
    const start = new Date(startDate);
    const target = new Date(targetDate);
    let months = (target.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += target.getMonth();
    return months <= 0 ? 0 : months;
};

export const calculateInflationAdjustedAmount = (currentAmount, inflationRate, years) => {
    return currentAmount * Math.pow(1 + inflationRate / 100, years);
};

export const calculateFutureValue = (principal, rate, years) => {
    return principal * Math.pow(1 + rate / 100, years);
};

export const calculateSIP = (targetAmount, annualRate, months) => {
    if (months <= 0) return 0;
    if (annualRate === 0) return targetAmount / months;

    const monthlyRate = annualRate / 12 / 100;
    // SIP Formula (Investment at beginning of period)
    // FV = P * [ ((1+r)^n - 1) / r ] * (1+r)
    // P = FV / ( [ ((1+r)^n - 1) / r ] * (1+r) )

    const factor = (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    const sip = targetAmount / (factor * (1 + monthlyRate));
    return sip;
};
