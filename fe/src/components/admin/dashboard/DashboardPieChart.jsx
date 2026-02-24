import React, { useMemo, useState, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Sector } from 'recharts';

const COLORS = [
    '#6366f1', // indigo
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#14b8a6', // teal
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const total = payload[0]?.payload?.total || 0;
        const percent = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
        return (
            <div className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 px-4 py-3 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
                    {payload[0].name}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className="text-base font-serif font-bold text-neutral-900 dark:text-white">
                        {payload[0].value}
                    </p>
                    <p className="text-xs text-neutral-400">({percent}%)</p>
                </div>
            </div>
        );
    }
    return null;
};

// Active shape renderer for hover effect on donut
const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value, percent } = props;

    return (
        <g>
            <text x={cx} y={cy - 8} textAnchor="middle" fill="currentColor" className="text-neutral-900 dark:text-white" style={{ fontSize: 22, fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                {value}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill="#a3a3a3" style={{ fontSize: 11, fontFamily: 'system-ui' }}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius - 4}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                opacity={0.9}
            />
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const DashboardPieChart = ({ data, title }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const chartData = useMemo(() => {
        if (!data) return [];
        const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
        return data.map(item => ({
            name: item.date,
            value: item.value,
            total,
        }));
    }, [data]);

    const total = useMemo(() => chartData.reduce((sum, d) => sum + d.value, 0), [chartData]);

    const onPieEnter = useCallback((_, index) => {
        setActiveIndex(index);
    }, []);

    const onPieLeave = useCallback(() => {
        setActiveIndex(null);
    }, []);

    return (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/30 dark:hover:shadow-neutral-900/30">
            <div className="px-6 pt-6">
                <h3 className="text-xs font-sans uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-500">
                    {title}
                </h3>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 p-4">
                {/* Pie Chart */}
                <div className="h-[260px] w-full lg:w-3/5 min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={95}
                                paddingAngle={3}
                                dataKey="value"
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        style={{
                                            filter: activeIndex === index ? `drop-shadow(0 0 6px ${COLORS[index % COLORS.length]}55)` : 'none',
                                            transition: 'filter 0.3s ease',
                                        }}
                                    />
                                ))}
                            </Pie>
                            {activeIndex === null && (
                                <>
                                    <text x="50%" y="47%" textAnchor="middle" fill="currentColor" className="text-neutral-900 dark:text-white" style={{ fontSize: 26, fontFamily: 'Georgia, serif', fontWeight: 700 }}>
                                        {total}
                                    </text>
                                    <text x="50%" y="57%" textAnchor="middle" fill="#a3a3a3" style={{ fontSize: 11, fontFamily: 'system-ui' }}>
                                        Total
                                    </text>
                                </>
                            )}
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="w-full lg:w-2/5 space-y-2 px-2 pb-4 lg:pb-0">
                    {chartData.map((entry, index) => {
                        const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
                        return (
                            <div
                                key={entry.name}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 cursor-default ${activeIndex === index ? 'bg-neutral-100 dark:bg-neutral-800' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                                onMouseEnter={() => setActiveIndex(index)}
                                onMouseLeave={() => setActiveIndex(null)}
                            >
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{entry.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-neutral-900 dark:text-white font-mono">{entry.value}</span>
                                    <span className="text-xs text-neutral-400 dark:text-neutral-500 w-12 text-right">{percent}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DashboardPieChart;
