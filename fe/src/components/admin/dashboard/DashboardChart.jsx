import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label, valueFormatter, color }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">{label}</p>
        <p className="text-base font-serif font-bold text-neutral-900 dark:text-white" style={{ color }}>
          {valueFormatter(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardChart = ({
  data,
  dataKey,
  title,
  color = '#8884d8',
  valueFormatter = (val) => val,
  chartType = 'area', // 'area' | 'bar'
  subtitle,
  totalValue,
}) => {
  const [activeType, setActiveType] = useState(chartType);
  const gradientId = `gradient-${dataKey}-${title?.replace(/\s/g, '')}`;

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/30 dark:hover:shadow-neutral-900/30">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-start justify-between">
        <div>
          <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
            {title}
          </h3>
          {totalValue && (
            <p className="text-2xl font-serif font-bold text-neutral-900 dark:text-white mt-1">{totalValue}</p>
          )}
          {subtitle && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Chart type toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-0.5">
          <button
            onClick={() => setActiveType('area')}
            className={`p-1.5 rounded-md transition-all duration-200 ${activeType === 'area'
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
          >
            <span className="material-symbols-outlined text-base">show_chart</span>
          </button>
          <button
            onClick={() => setActiveType('bar')}
            className={`p-1.5 rounded-md transition-all duration-200 ${activeType === 'bar'
              ? 'bg-white dark:bg-neutral-700 shadow-sm text-neutral-900 dark:text-white'
              : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
          >
            <span className="material-symbols-outlined text-base">bar_chart</span>
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          {activeType === 'area' ? (
            <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                stroke="rgba(128, 128, 128, 0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#a3a3a3' }}
                stroke="transparent"
                tickMargin={12}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a3a3a3' }}
                stroke="transparent"
                tickFormatter={valueFormatter}
                width={45}
              />
              <Tooltip
                content={<CustomTooltip valueFormatter={valueFormatter} color={color} />}
                cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.4 }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: '#fff',
                  fill: color,
                  className: 'drop-shadow-md',
                }}
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`${gradientId}-bar`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.85} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.45} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="0"
                stroke="rgba(128, 128, 128, 0.06)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#a3a3a3' }}
                stroke="transparent"
                tickMargin={12}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#a3a3a3' }}
                stroke="transparent"
                tickFormatter={valueFormatter}
                width={45}
              />
              <Tooltip
                content={<CustomTooltip valueFormatter={valueFormatter} color={color} />}
                cursor={{ fill: 'rgba(128,128,128,0.04)' }}
              />
              <Bar
                dataKey={dataKey}
                fill={`url(#${gradientId}-bar)`}
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
