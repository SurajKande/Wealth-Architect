import React, { useState } from 'react';
import GoalInput from './components/GoalInput';
import { useFinancialAdvisor } from './hooks/useFinancialAdvisor';
import { TrendingUp, ShieldCheck, AlertTriangle, IndianRupee } from 'lucide-react';

function App() {
  const [goals, setGoals] = useState([]);
  const insights = useFinancialAdvisor(goals);

  const handleAddGoal = (goal) => {
    setGoals([...goals, goal]);
  };

  const handleUpdateGoal = (id, field, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, [field]: Number(value) } : g));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-['Inter'] selection:bg-emerald-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-900/20 to-transparent opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Wealth Architect
          </h1>
          <p className="text-gray-400 text-lg">Your Personalized AI Financial Planner for the Indian Market</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Input */}
          <div className="lg:col-span-4">
            <GoalInput onAddGoal={handleAddGoal} />

            <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                <TrendingUp size={20} /> Market Assumptions
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                These default assumptions drive our recommendations based on historical Indian market data.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex justify-between"><span>Inflation</span> <span className="text-white font-mono">6%</span></li>
                <li className="flex justify-between"><span>Equity Return</span> <span className="text-white font-mono">12-15%</span></li>
                <li className="flex justify-between"><span>Debt Return</span> <span className="text-white font-mono">6-8%</span></li>
              </ul>
            </div>
          </div>

          {/* Right Panel: Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-12 border-2 border-dashed border-white/10 rounded-3xl text-gray-500">
                <IndianRupee size={64} className="mb-4 opacity-20" />
                <h3 className="text-2xl font-bold mb-2">No Goals Added Yet</h3>
                <p>Start by adding your financial goals on the left.</p>
              </div>
            ) : (
              insights.map((insight, index) => {
                const goal = goals.find(g => g.id === insight.id);
                return (
                  <div key={insight.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/[0.07] backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{goal.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1 uppercase tracking-wider">
                          <span>{goal.targetDate}</span>
                          <span>•</span>
                          <span className={insight.year < 3 ? "text-red-400" : "text-emerald-400"}>{Math.round(insight.years * 10) / 10} Years away</span>
                        </div>
                      </div>
                      <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold ${insight.shortfall <= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                        {insight.status}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-gray-400 text-xs mb-1">Target Amount (Infl. Adj)</div>
                        <div className="text-2xl font-bold text-white">₹ {(insight.inflAdjustedCost / 100000).toFixed(2)} L</div>
                        <div className="text-xs text-gray-500 mt-1">Today's Cost: ₹ {(goal.amountNeededToday / 100000).toFixed(2)} L</div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-gray-400 text-xs mb-1">Projected Corpus</div>
                        <div className="text-2xl font-bold text-blue-300">₹ {(insight.corpusFV / 100000).toFixed(2)} L</div>
                        <div className="text-xs text-gray-500 mt-1">Existing Assets</div>
                      </div>
                      <div className="bg-black/20 p-4 rounded-xl border border-emerald-500/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5"></div>
                        <div className="text-emerald-400 text-xs mb-1 font-bold">REQUIRED MONTHLY SIP</div>
                        <div className="text-3xl font-bold text-emerald-400">₹ {Math.ceil(insight.requiredSip).toLocaleString('en-IN')}</div>
                        <div className="text-xs text-emerald-500/70 mt-1">To cover shortfall</div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6">
                      <h4 className="flex items-center gap-2 text-blue-300 font-bold mb-2 text-sm uppercase">
                        <ShieldCheck size={16} /> Action Insight
                      </h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {insight.actionInsight}
                        {insight.shortfall > 0 && (
                          <span className="block mt-2 text-blue-200/60 text-xs">
                            Suggestion: Invest in <strong>{insight.assetClass}</strong> (Risk: {insight.riskProfile}). {insight.suggestion}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Tweaks Section */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-3 text-center md:text-left">Interactive Tweaks</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Return ({goal.expectedReturn}%)</span>
                            <span className="text-[10px] text-gray-500">Risk Tweak</span>
                          </label>
                          <input
                            type="range" min="4" max="18" step="0.5"
                            value={goal.expectedReturn}
                            onChange={(e) => handleUpdateGoal(goal.id, 'expectedReturn', e.target.value)}
                            className="w-full accent-emerald-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Monthly Inv (₹ {goal.monthlyInvestment.toLocaleString()})</span>
                            <span className="text-[10px] text-gray-500">Budget Tweak</span>
                          </label>
                          <input
                            type="range" min="0" max="100000" step="1000"
                            value={goal.monthlyInvestment}
                            onChange={(e) => handleUpdateGoal(goal.id, 'monthlyInvestment', e.target.value)}
                            className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        {/* Time tweak is tricky as it changes date, maybe just a display for now or a complex date changer. 
                                            Let's leave it as re-editing the goal via form for now? 
                                            Or maybe a +/- Years slider?
                                        */}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
