import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
export function CLV() {
  const [showForm, setShowForm] = useState(false);

  // Mock CLV stats
  const stats = {
    totalBets: 24,
    winRate: 62.5,
    totalProfit: 1250.50,
    avgCLV: 3.2,
  };

  // Mock bets data
  const bets = [
    {
      id: '1',
      game: 'Chiefs @ Bills',
      line: -3.5,
      odds: -110,
      amount: 100,
      result: 'won',
      clv: 2.1,
      profit: 90.91,
    },
    {
      id: '2',
      game: 'Cowboys @ Eagles',
      line: 7.5,
      odds: -105,
      amount: 150,
      result: 'lost',
      clv: -1.8,
      profit: -150,
    },
    {
      id: '3',
      game: 'Ravens @ Steelers',
      line: 2.5,
      odds: +110,
      amount: 200,
      result: 'won',
      clv: 4.2,
      profit: 220,
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-primary-900 mb-2">
            CLV Tracking
          </h1>
          <p className="text-primary-600">
            Track your betting performance and closing line value
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Bet
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-primary-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-primary-900" />
            </div>
            <h3 className="text-sm font-medium text-primary-600">Total Bets</h3>
          </div>
          <div className="text-2xl font-semibold text-primary-900">{stats.totalBets}</div>
        </div>

        <div className="bg-white rounded-lg border border-primary-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-green/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent-green" />
            </div>
            <h3 className="text-sm font-medium text-primary-600">Win Rate</h3>
          </div>
          <div className="text-2xl font-semibold text-primary-900">{stats.winRate}%</div>
        </div>

        <div className="bg-white rounded-lg border border-primary-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-amber/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-accent-amber" />
            </div>
            <h3 className="text-sm font-medium text-primary-600">Total Profit</h3>
          </div>
          <div className={`text-2xl font-semibold ${
            stats.totalProfit >= 0 ? 'text-accent-green' : 'text-accent-rose'
          }`}>
            ${stats.totalProfit.toFixed(2)}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-primary-100 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-900" />
            </div>
            <h3 className="text-sm font-medium text-primary-600">Avg CLV</h3>
          </div>
          <div className="text-2xl font-semibold text-primary-900">{stats.avgCLV}%</div>
        </div>
      </div>

      {/* Bets List */}
      <div className="bg-white rounded-lg border border-primary-100">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">
            Your Bets
          </h2>
          
          {bets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-primary-400 mb-4">
                <BarChart3 className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">No bets logged yet</h3>
              <p className="text-primary-600">Start tracking your betting performance by logging your first bet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Game</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Line</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Odds</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">CLV</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Result</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-primary-600">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet) => (
                    <tr key={bet.id} className="border-b border-primary-100">
                      <td className="py-3 px-4 text-sm text-primary-900">{bet.game}</td>
                      <td className="py-3 px-4 text-sm text-primary-900">{bet.line}</td>
                      <td className="py-3 px-4 text-sm text-primary-900">{bet.odds}</td>
                      <td className="py-3 px-4 text-sm text-primary-900">${bet.amount}</td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        bet.clv >= 0 ? 'text-accent-green' : 'text-accent-rose'
                      }`}>
                        {bet.clv >= 0 ? '+' : ''}{bet.clv}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          bet.result === 'won' 
                            ? 'bg-accent-green/10 text-accent-green'
                            : bet.result === 'lost'
                            ? 'bg-accent-rose/10 text-accent-rose'
                            : 'bg-primary-100 text-primary-600'
                        }`}>
                          {bet.result}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        bet.profit >= 0 ? 'text-accent-green' : 'text-accent-rose'
                      }`}>
                        {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bet Form Modal Placeholder */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-primary-900 mb-4">Log New Bet</h3>
            <p className="text-primary-600 mb-4">This feature will be implemented in the full version.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 bg-primary-900 text-white px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
