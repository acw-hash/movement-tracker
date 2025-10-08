import { useState } from 'react';
import { Plus, TrendingUp, DollarSign, BarChart3, Target, Trophy, Zap } from 'lucide-react';
import { format } from 'date-fns';

export function CLV() {
  const [showForm, setShowForm] = useState(false);

  // Mock CLV stats with more realistic data
  const stats = {
    totalBets: 47,
    winRate: 68.1,
    totalProfit: 2847.50,
    avgCLV: 4.7,
    roi: 12.3,
    bestMonth: 'October',
    longestStreak: 8,
  };

  // Mock bets data with more comprehensive information
  const bets = [
    {
      id: '1',
      game: 'Chiefs @ Bills',
      line: -3.5,
      odds: -110,
      amount: 100,
      result: 'won' as const,
      clv: 2.1,
      profit: 90.91,
      placedAt: new Date('2024-01-15T14:30:00'),
      closingLine: -3.0,
      closingOdds: -105,
    },
    {
      id: '2',
      game: 'Cowboys @ Eagles',
      line: 7.5,
      odds: -105,
      amount: 150,
      result: 'lost' as const,
      clv: -1.8,
      profit: -150,
      placedAt: new Date('2024-01-14T16:45:00'),
      closingLine: 7.0,
      closingOdds: -110,
    },
    {
      id: '3',
      game: 'Ravens @ Steelers',
      line: 2.5,
      odds: +110,
      amount: 200,
      result: 'won' as const,
      clv: 4.2,
      profit: 220,
      placedAt: new Date('2024-01-13T12:15:00'),
      closingLine: 3.0,
      closingOdds: +105,
    },
    {
      id: '4',
      game: '49ers @ Rams',
      line: -6.5,
      odds: -115,
      amount: 250,
      result: 'won' as const,
      clv: 3.1,
      profit: 217.39,
      placedAt: new Date('2024-01-12T18:20:00'),
      closingLine: -7.0,
      closingOdds: -120,
    },
    {
      id: '5',
      game: 'Packers @ Vikings',
      line: 1.5,
      odds: -108,
      amount: 175,
      result: 'lost' as const,
      clv: -0.9,
      profit: -175,
      placedAt: new Date('2024-01-11T15:30:00'),
      closingLine: 2.0,
      closingOdds: -110,
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Premium Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display font-bold text-gradient mb-4">
              CLV Tracking
            </h1>
            <p className="text-xl text-dark-400 leading-relaxed">
              Track your betting performance and closing line value
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-3"
          >
            <Plus className="w-5 h-5" />
            Log Bet
          </button>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wide">Total Bets</h3>
                <div className="text-3xl font-bold text-white">{stats.totalBets}</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-green to-brand-primary rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wide">Win Rate</h3>
                <div className="text-3xl font-bold text-accent-green">{stats.winRate}%</div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-accent-amber to-brand-secondary rounded-2xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wide">Total Profit</h3>
                <div className={`text-3xl font-bold ${
                  stats.totalProfit >= 0 ? 'text-accent-green' : 'text-accent-rose'
                }`}>
                  ${stats.totalProfit.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-secondary to-accent-amber rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wide">Avg CLV</h3>
                <div className="text-3xl font-bold text-white">{stats.avgCLV}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-accent-amber" />
            <h4 className="font-semibold text-white">Performance</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dark-400">ROI</span>
              <span className="text-accent-green font-bold">{stats.roi}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Best Month</span>
              <span className="text-white font-semibold">{stats.bestMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Longest Streak</span>
              <span className="text-accent-green font-bold">{stats.longestStreak} wins</span>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-accent-green" />
            <h4 className="font-semibold text-white">Recent Activity</h4>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-dark-400">Last 7 days: 3 bets</div>
            <div className="text-sm text-dark-400">This month: 12 bets</div>
            <div className="text-sm text-accent-green">Current streak: 4 wins</div>
          </div>
        </div>

        <div className="card-premium p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-5 h-5 text-brand-primary" />
            <h4 className="font-semibold text-white">CLV Breakdown</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Positive CLV</span>
              <span className="text-accent-green font-semibold">32 bets</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Negative CLV</span>
              <span className="text-accent-rose font-semibold">15 bets</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Best CLV</span>
              <span className="text-accent-green font-bold">+8.2%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bets List */}
      <div className="card-premium p-8">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-brand-primary" />
          <h2 className="text-2xl font-bold text-white">Your Bets</h2>
        </div>
        
        {bets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">No bets logged yet</h3>
            <p className="text-dark-400 max-w-md mx-auto leading-relaxed mb-6">
              Start tracking your betting performance by logging your first bet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Your First Bet
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Game</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Line</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Odds</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">CLV</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Result</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Profit</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-dark-400 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {bets.map((bet) => (
                  <tr key={bet.id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-colors">
                    <td className="py-4 px-4 text-sm text-white font-medium">{bet.game}</td>
                    <td className="py-4 px-4 text-sm text-white font-mono">{bet.line}</td>
                    <td className="py-4 px-4 text-sm text-white font-mono">{bet.odds > 0 ? '+' : ''}{bet.odds}</td>
                    <td className="py-4 px-4 text-sm text-white font-mono">${bet.amount}</td>
                    <td className={`py-4 px-4 text-sm font-bold ${
                      bet.clv >= 0 ? 'text-accent-green' : 'text-accent-rose'
                    }`}>
                      {bet.clv >= 0 ? '+' : ''}{bet.clv}%
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        bet.result === 'won' 
                          ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
                          : bet.result === 'lost'
                          ? 'bg-accent-rose/20 text-accent-rose border border-accent-rose/30'
                          : 'bg-dark-600 text-dark-300 border border-dark-500'
                      }`}>
                        {bet.result}
                      </span>
                    </td>
                    <td className={`py-4 px-4 text-sm font-bold ${
                      bet.profit >= 0 ? 'text-accent-green' : 'text-accent-rose'
                    }`}>
                      {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 text-sm text-dark-400">
                      {format(bet.placedAt, 'MMM d')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Premium Bet Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card-premium p-8 max-w-lg w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Log New Bet</h3>
            </div>
            
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-accent-amber to-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">Coming Soon</h4>
                <p className="text-dark-400 leading-relaxed">
                  The bet logging feature will be fully implemented in the next phase. 
                  This will include comprehensive bet tracking, CLV calculations, and performance analytics.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-ghost"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 btn-primary"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
