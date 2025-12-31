import React, { useState, useEffect } from 'react';
import { PlusCircle, Calendar, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const GoalInput = ({ onAddGoal }) => {
    // Helper to get local date in YYYY-MM-DD format (fixes UTC issue)
    const getTodayString = () => {
        const d = new Date();
        return d.toLocaleDateString('en-CA');
    };

    const [goal, setGoal] = useState({
        name: '',
        startDate: getTodayString(),
        targetDate: '',
        amountNeededToday: '',
        inflation: 6,
        currentCorpus: '',
        monthlyInvestment: '',
        priority: 3,
        expectedReturn: 12
    });

    // Fetch precise India time on mount
    useEffect(() => {
        const fetchIndiaTime = async () => {
            try {
                const res = await fetch('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
                const data = await res.json();
                if (data.datetime) {
                    const apiDate = data.datetime.split('T')[0];
                    setGoal(prev => ({ ...prev, startDate: apiDate }));
                }
            } catch (e) {
                console.log("Using system date:", getTodayString());
            }
        };
        fetchIndiaTime();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGoal(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!goal.name || !goal.targetDate || !goal.amountNeededToday) return;

        // Convert numeric strings to numbers
        const newGoal = {
            ...goal,
            id: Date.now(),
            amountNeededToday: Number(goal.amountNeededToday),
            inflation: Number(goal.inflation),
            currentCorpus: Number(goal.currentCorpus) || 0,
            monthlyInvestment: Number(goal.monthlyInvestment) || 0,
            priority: Number(goal.priority),
            expectedReturn: Number(goal.expectedReturn)
        };

        onAddGoal(newGoal);
        // Reset minimal fields
        setGoal(prev => ({
            ...prev,
            name: '',
            amountNeededToday: '',
            startDate: getTodayString() // Reset to today
        }));
    };

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PlusCircle className="text-emerald-400" /> New Goal
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Goal Name</label>
                    <input
                        type="text"
                        name="name"
                        value={goal.name}
                        onChange={handleChange}
                        placeholder="e.g. Retirement, Kids Education"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={goal.startDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Target Date</label>
                    <input
                        type="date"
                        name="targetDate"
                        value={goal.targetDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Cost Today (₹)</label>
                    <input
                        type="number"
                        name="amountNeededToday"
                        value={goal.amountNeededToday}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Current Corpus (₹)</label>
                    <input
                        type="number"
                        name="currentCorpus"
                        value={goal.currentCorpus}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Planned Monthly Investment (₹)</label>
                    <input
                        type="number"
                        name="monthlyInvestment"
                        value={goal.monthlyInvestment}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Inflation %</label>
                        <input
                            type="number"
                            name="inflation"
                            value={goal.inflation}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">Exp Return %</label>
                        <input
                            type="number"
                            name="expectedReturn"
                            value={goal.expectedReturn}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        />
                    </div>
                </div>

                <button type="submit" className="md:col-span-2 mt-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-0.5">
                    Add Goal to Plan
                </button>
            </form>
        </div>
    );
};

export default GoalInput;
