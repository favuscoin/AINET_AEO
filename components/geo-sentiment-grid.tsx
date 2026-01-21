'use client';

interface Region {
    name: string;
    percentage: number;
    trend: string;
    code: string;
}

interface GeoSentimentGridProps {
    type: 'positive' | 'negative';
    regions: Region[];
}

export default function GeoSentimentGrid({ type, regions }: GeoSentimentGridProps) {
    const isPositive = type === 'positive';

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPositive ? 'bg-emerald-100' : 'bg-pink-100'
                    }`}>
                    <span className="text-xl">{isPositive ? '😊' : '😞'}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                    {isPositive ? 'Positive Sentiment' : 'Negative Sentiment'}
                </h3>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {regions.map((region, index) => {
                    // Generate color intensity based on percentage
                    const intensity = Math.min(100, Math.max(20, region.percentage));
                    const bgColor = isPositive
                        ? `rgba(16, 185, 129, ${intensity / 400 + 0.1})` // emerald with lighter opacity for light theme
                        : `rgba(236, 72, 153, ${intensity / 400 + 0.1})`; // pink with lighter opacity for light theme

                    return (
                        <div
                            key={index}
                            className="relative group rounded-lg p-4 border border-gray-200 hover:scale-105 transition-all cursor-pointer overflow-hidden min-h-[120px]"
                            style={{ backgroundColor: bgColor }}
                        >
                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isPositive ? 'bg-emerald-100' : 'bg-pink-100'
                                }`} />

                            <div className="relative z-10">
                                <div className="text-lg mb-2">{region.code}</div>
                                <div className="text-gray-900 font-semibold text-sm mb-1">{region.name}</div>
                                <div className={`text-xs font-medium ${isPositive ? 'text-emerald-700' : 'text-pink-700'
                                    }`}>
                                    {region.trend} {region.percentage}%
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
