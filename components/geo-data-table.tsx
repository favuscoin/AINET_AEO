'use client';

import { useState } from 'react';

interface RegionData {
    rank: number;
    region: string;
    flag: string;
    adoptionRate: number;
    change24h: number;
    change7d: number;
    topProject: string;
    sentiment: number;
    marketActivity: number;
    sparklineData: number[];
}

const mockData: RegionData[] = [
    { rank: 1, region: 'Bitcoin', flag: '₿', adoptionRate: 34.4, change24h: 2.19, change7d: 0.31, topProject: 'ChatGPT', sentiment: 764, marketActivity: 289.95, sparklineData: [20, 35, 30, 45, 40, 55, 50, 65, 70] },
    { rank: 2, region: 'Ethereum', flag: '⟠', adoptionRate: 18.4, change24h: 18.18, change7d: 0.1, topProject: 'Claude', sentiment: 2393.10, marketActivity: 13.65, sparklineData: [30, 25, 35, 30, 40, 45, 50, 55, 60] },
    { rank: 3, region: 'Solana', flag: '◎', adoptionRate: 18.4, change24h: 17.85, change7d: 0.25, topProject: 'Perplexity', sentiment: 722, marketActivity: 186.75, sparklineData: [40, 35, 45, 50, 48, 55, 60, 58, 65] },
    { rank: 4, region: 'Cardano', flag: '₳', adoptionRate: 10.7, change24h: 0.7, change7d: -0.04, topProject: 'Gemini', sentiment: 0.43, marketActivity: 333.35, sparklineData: [50, 48, 45, 42, 40, 38, 35, 33, 30] },
    { rank: 5, region: 'Polygon', flag: '⬡', adoptionRate: 12.5, change24h: 0.69, change7d: 0.11, topProject: 'ChatGPT', sentiment: 10.75, marketActivity: 97.73, sparklineData: [25, 30, 35, 40, 45, 50, 55, 60, 65] },
    { rank: 6, region: 'Avalanche', flag: 'AVAX', adoptionRate: 0.672, change24h: 0.68, change7d: 0.01, topProject: 'Claude', sentiment: -1, marketActivity: 288.79, sparklineData: [60, 55, 50, 48, 45, 43, 40, 38, 35] },
    { rank: 7, region: 'Polkadot', flag: 'DOT', adoptionRate: 0.702, change24h: 0.65, change7d: -0.02, topProject: 'Perplexity', sentiment: 193.43, marketActivity: 66.55, sparklineData: [35, 40, 38, 42, 45, 48, 50, 52, 55] },
    { rank: 8, region: 'Chainlink', flag: 'LINK', adoptionRate: 0.65, change24h: 0.64, change7d: 0.01, topProject: 'Gemini', sentiment: -1, marketActivity: 468.18, sparklineData: [45, 48, 50, 52, 55, 58, 60, 62, 65] },
];

type TimePeriod = 'Now' | '7D' | '1M' | '3M' | 'YTD';

export default function GeoDataTable() {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('Now');

    const periods: TimePeriod[] = ['Now', '7D', '1M', '3M', 'YTD'];

    const renderSparkline = (data: number[]) => {
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min;
        const width = 80;
        const height = 30;

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        }).join(' ');

        const isPositive = data[data.length - 1] > data[0];

        return (
            <svg width={width} height={height} className="inline-block">
                <polyline
                    points={points}
                    fill="none"
                    stroke={isPositive ? '#10b981' : '#ef4444'}
                    strokeWidth="2"
                />
            </svg>
        );
    };

    return (
        <div className="w-full">
            {/* Time Period Filters */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Crypto Prompt Rankings</h3>
                <div className="flex gap-2">
                    {periods.map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedPeriod === period
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Crypto</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Prompt Volume</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">24h</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">7d</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Top AI</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Sentiment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Activity</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {mockData.map((row) => (
                            <tr
                                key={row.rank}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-4 text-sm text-gray-500">{row.rank}</td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{row.flag}</span>
                                        <span className="text-gray-900 font-medium">{row.region}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-gray-900 font-medium">{row.adoptionRate}%</td>
                                <td className="px-4 py-4">
                                    <span className={row.change24h > 0 ? 'text-emerald-600' : 'text-red-600'}>
                                        {row.change24h > 0 ? '▲' : '▼'} {Math.abs(row.change24h)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={row.change7d > 0 ? 'text-emerald-600' : 'text-red-600'}>
                                        {row.change7d > 0 ? '▲' : '▼'} {Math.abs(row.change7d)}
                                    </span>
                                </td>
                                <td className="px-4 py-4 text-gray-900">{row.topProject}</td>
                                <td className="px-4 py-4">
                                    <span className={row.sentiment > 0 ? 'text-emerald-600' : 'text-red-600'}>
                                        {row.sentiment > 0 ? '▲' : '▼'} {Math.abs(row.sentiment)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className={row.marketActivity > 0 ? 'text-emerald-600' : 'text-red-600'}>
                                        {row.marketActivity > 0 ? '▲' : '▼'} {Math.abs(row.marketActivity)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">{renderSparkline(row.sparklineData)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
