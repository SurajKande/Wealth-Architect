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
              insights.map((insight) => {
                const goal = goals.find(g => g.id === insight.id);
                const rec = insight.primaryRecommendation;
                const isAchievable = insight.status !== 'NOT_ACHIEVABLE';

                return (
                  <div key={insight.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/[0.07] backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{goal.name}</h3>
                        <div className="flex gap-4 text-sm text-gray-400 mt-1 uppercase tracking-wider">
                          <span>{goal.targetDate}</span>
                          <span>•</span>
                          <span className={insight.years < 3 ? "text-red-400" : "text-emerald-400"}>{Math.round(insight.years * 10) / 10} Years away</span>
                        </div>
                      </div>
                      <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm font-bold ${isAchievable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                        {insight.status.replace('_', ' ')}
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-gray-400 text-xs mb-1">Target (Infl. Adj)</div>
                        <div className="text-2xl font-bold text-white">₹ {(insight.inflAdjustedCost / 100000).toFixed(2)} L</div>
                        <div className="text-xs text-gray-500 mt-1">Cost Today: ₹ {(goal.amountNeededToday / 100000).toFixed(2)} L</div>
                      </div>

                      <div className="bg-black/20 p-4 rounded-xl">
                        <div className="text-gray-400 text-xs mb-1">Best Projected Corpus</div>
                        <div className={`text-2xl font-bold ${isAchievable ? 'text-blue-300' : 'text-amber-400'}`}>
                          ₹ {(rec.projectedCorpus / 100000).toFixed(2)} L
                        </div>
                        <div className="text-xs text-gray-500 mt-1">@ {rec.returnUsed}% Return</div>
                      </div>

                      <div className={`bg-black/20 p-4 rounded-xl border relative overflow-hidden ${isAchievable ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
                        <div className={`absolute inset-0 ${isAchievable ? 'bg-emerald-500/5' : 'bg-red-500/5'}`}></div>
                        <div className="text-gray-400 text-xs mb-1 font-bold">REQUIRED MONTHLY SIP</div>
                        <div className={`text-3xl font-bold ${isAchievable ? 'text-emerald-400' : 'text-red-400'}`}>
                          ₹ {Math.ceil(rec.requiredExtraSip).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs opacity-70 mt-1 text-gray-400">
                          {isAchievable ? 'To achieve goal' : `Shortfall: ₹ ${Math.round(rec.shortfall).toLocaleString()}`}
                        </div>
                      </div>
                    </div>

                    {/* Recommendation Engine Output */}
                    <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="flex items-center gap-2 text-blue-300 font-bold text-sm uppercase">
                          <ShieldCheck size={16} /> Recommendation Engine
                        </h4>
                        <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          Conf: {Math.round(rec.confidenceScore)}/100
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-col md:flex-row gap-4 text-sm">
                          <div className="flex-1 p-3 bg-black/20 rounded-lg border border-white/5">
                            <span className="block text-xs text-gray-400 mb-1">Suggested Category</span>
                            <strong className="text-white text-lg">{rec.category}</strong>
                          </div>
                          <div className="flex-1 p-3 bg-black/20 rounded-lg border border-white/5">
                            <span className="block text-xs text-gray-400 mb-1">Risk Profile</span>
                            <strong className={rec.risk === 'HIGH' || rec.risk === 'VERY HIGH' ? 'text-red-300' : 'text-emerald-300'}>
                              {rec.risk}
                            </strong>
                          </div>
                        </div>

                        {/* Warnings / Suggestions */}
                        {insight.suggestions.length > 0 && (
                          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                              <AlertTriangle size={12} /> System Warnings
                            </div>
                            <ul className="list-disc list-inside text-amber-200/80 text-sm space-y-1">
                              {insight.suggestions.map((msg, i) => (
                                <li key={i}>{msg}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tweaks Section */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-3 text-center md:text-left">Interactive Tweaks</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div className="text-xs text-gray-500 flex items-center">
                          Note: Return slider removed. Returns are now determined by the Recommendation Engine based on asset class.
                        </div>
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
