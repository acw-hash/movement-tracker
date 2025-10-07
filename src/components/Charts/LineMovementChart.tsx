import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import type { LineMovement } from '@/types';

interface LineMovementChartProps {
  data: LineMovement[];
}

export function LineMovementChart({ data }: LineMovementChartProps) {
  // Transform data for the chart with enhanced formatting
  const chartData = data.map(movement => ({
    time: new Date(movement.current_timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    value: movement.new_value,
    change: movement.change_amount,
    type: movement.movement_type,
    timestamp: movement.current_timestamp,
  }));

  // Calculate trend direction for gradient
  const firstValue = chartData[0]?.value || 0;
  const lastValue = chartData[chartData.length - 1]?.value || 0;
  const isPositive = lastValue >= firstValue;

  return (
    <div className="w-full h-96 relative">
      {/* Premium chart container with glass morphism */}
      <div className="absolute inset-0 card-glass rounded-2xl p-6">
        <div className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                {/* Premium gradient definitions */}
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.8}/>
                  <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="rgba(255, 255, 255, 0.1)" 
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="time" 
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
              />
              
              <YAxis 
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
                tickFormatter={(value) => value.toFixed(1)}
              />
              
              {/* Reference line for opening value */}
              {chartData.length > 0 && (
                <ReferenceLine 
                  y={chartData[0].value} 
                  stroke="rgba(255, 255, 255, 0.3)" 
                  strokeDasharray="3 3"
                  strokeWidth={1}
                />
              )}
              
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(28, 28, 33, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                  padding: '16px 20px',
                  backdropFilter: 'blur(20px)',
                }}
                formatter={(value: number, _name: string, props: any) => [
                  <div key="value" className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      props.payload?.type === 'up' ? 'bg-accent-green' : 'bg-accent-red'
                    }`}></div>
                    <span className="font-mono font-bold text-white">{value.toFixed(1)}</span>
                  </div>,
                  'Line Value'
                ]}
                labelFormatter={(label) => (
                  <div className="text-white font-semibold text-sm">
                    Time: {label}
                  </div>
                )}
                labelStyle={{
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '12px',
                }}
                cursor={{ stroke: 'rgba(99, 102, 241, 0.5)', strokeWidth: 2 }}
              />
              
              {/* Premium area chart with gradient */}
              <Area
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={{ 
                  fill: isPositive ? "#10B981" : "#EF4444", 
                  strokeWidth: 0, 
                  r: 4,
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))' }
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: isPositive ? "#10B981" : "#EF4444", 
                  strokeWidth: 3,
                  fill: 'white',
                  style: { 
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4))',
                    animation: 'pulse 2s infinite'
                  }
                }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Premium chart header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            isPositive ? 'bg-accent-green shadow-glow-green' : 'bg-accent-red shadow-glow-red'
          }`}></div>
          <span className="text-white font-semibold text-sm">
            Line Movement
          </span>
        </div>
      </div>
      
      {/* Premium stats overlay */}
      <div className="absolute top-6 right-6 z-10">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-dark-400 font-medium">Current</div>
            <div className="text-lg font-mono font-bold text-white">
              {chartData[chartData.length - 1]?.value.toFixed(1) || '0.0'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-dark-400 font-medium">Change</div>
            <div className={`text-sm font-mono font-bold ${
              isPositive ? 'text-accent-green' : 'text-accent-red'
            }`}>
              {isPositive ? '+' : ''}{((lastValue - firstValue)).toFixed(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
