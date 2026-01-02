
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Decision, OutcomeType, AIInsight } from '../types';

interface DashboardProps {
  decisions: Decision[];
  insights: AIInsight | null;
  loadingAI: boolean;
}

const COLORS = {
  [OutcomeType.SUCCESS]: '#10b981',
  [OutcomeType.FAILURE]: '#ef4444',
  [OutcomeType.PARTIAL]: '#f59e0b',
  [OutcomeType.PENDING]: '#94a3b8'
};

const Dashboard: React.FC<DashboardProps> = ({ decisions, insights, loadingAI }) => {
  const stats = {
    total: decisions.length,
    reviewed: decisions.filter(d => d.review).length,
    success: decisions.filter(d => d.review?.outcome === OutcomeType.SUCCESS).length,
    failure: decisions.filter(d => d.review?.outcome === OutcomeType.FAILURE).length,
    partial: decisions.filter(d => d.review?.outcome === OutcomeType.PARTIAL).length,
  };

  const pieData = [
    { name: 'Success', value: stats.success, color: COLORS[OutcomeType.SUCCESS] },
    { name: 'Failure', value: stats.failure, color: COLORS[OutcomeType.FAILURE] },
    { name: 'Partial', value: stats.partial, color: COLORS[OutcomeType.PARTIAL] },
  ].filter(d => d.value > 0);

  const barData = Object.values(OutcomeType).map(type => ({
    name: type,
    count: decisions.filter(d => d.review?.outcome === type || (!d.review && type === OutcomeType.PENDING)).length
  }));

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-sm font-bold uppercase">Total Decisions</p>
          <p className="text-3xl font-black text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-emerald-500 text-sm font-bold uppercase">Successful</p>
          <p className="text-3xl font-black text-slate-800">{stats.success}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-rose-500 text-sm font-bold uppercase">Failure Rate</p>
          <p className="text-3xl font-black text-slate-800">
            {stats.reviewed > 0 ? Math.round((stats.failure / stats.reviewed) * 100) : 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-indigo-500 text-sm font-bold uppercase">Learning Velocity</p>
          <p className="text-3xl font-black text-slate-800">{stats.reviewed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Distribution Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Outcome Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic">
              Need more reviewed decisions for data visualization.
            </div>
          )}
        </div>

        {/* AI Insights Section */}
        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col h-[400px] overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center">
              <span className="mr-2">✨</span> AI Pattern Detection
            </h3>
            {loadingAI && <div className="animate-spin h-5 w-5 border-2 border-indigo-400 border-t-transparent rounded-full"></div>}
          </div>

          <div className="flex-grow overflow-y-auto space-y-6 pr-2 custom-scrollbar">
            {insights ? (
              <>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Detected Patterns</h4>
                  <ul className="space-y-2">
                    {insights.patterns.map((p, i) => (
                      <li key={i} className="text-sm bg-slate-800 p-2 rounded-lg border border-slate-700">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Cognitive Biases</h4>
                  <div className="flex flex-wrap gap-2">
                    {insights.cognitiveBiases.map((b, i) => (
                      <span key={i} className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs font-bold">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Growth Reflections</h4>
                  <ul className="space-y-2">
                    {insights.suggestedReflections.map((r, i) => (
                      <li key={i} className="text-sm text-slate-300 italic border-l-2 border-slate-700 pl-3">
                        "{r}"
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-sm text-center">
                {stats.reviewed < 3 ? "Review at least 3 decisions to unlock deep AI patterns." : "Generating insights..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
