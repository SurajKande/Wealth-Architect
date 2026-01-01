import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../utils/financialUtils';

const WealthGrowthChart = ({ data, themeColor = "#10b981" }) => {
    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-80 lg:h-96 p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={themeColor} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6b7280" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#6b7280" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />

                    <XAxis
                        dataKey="year"
                        stroke="#9ca3af"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={(year) => `Year ${year}`}
                    />

                    <YAxis
                        stroke="#9ca3af"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        tickFormatter={(value) => formatCurrency(value)}
                        width={60}
                    />

                    <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem' }}
                        formatter={(value) => [formatCurrency(value), ""]}
                        labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
                        labelFormatter={(label) => `Year ${label}`}
                    />

                    <Legend wrapperStyle={{ paddingTop: '1rem' }} />

                    <Area
                        type="monotone"
                        dataKey="invested"
                        name="Total Invested Amount"
                        stroke="#9ca3af"
                        fillOpacity={1}
                        fill="url(#colorInvested)"
                        strokeDasharray="5 5"
                    />

                    <Area
                        type="monotone"
                        dataKey="value"
                        name="Projected Wealth"
                        stroke={themeColor}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WealthGrowthChart;
