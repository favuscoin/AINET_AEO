'use client';

interface GeoEventCardProps {
    region: string;
    project: string;
    description: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    timestamp: string;
    regionFlag: string;
}

export default function GeoEventCard({
    region,
    project,
    description,
    sentiment,
    timestamp,
    regionFlag,
}: GeoEventCardProps) {
    const sentimentColors = {
        positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        negative: 'text-red-400 bg-red-500/10 border-red-500/30',
        neutral: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    };

    const sentimentIcons = {
        positive: '▲',
        negative: '▼',
        neutral: '●',
    };

    return (
        <div className="flex-shrink-0 w-80 bg-white border border-gray-200 rounded-xl p-4 hover:border-emerald-500 transition-all hover:shadow-lg hover:shadow-emerald-500/10">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{regionFlag}</span>
                    <div>
                        <h3 className="text-gray-900 font-semibold">{region}</h3>
                        <p className="text-xs text-gray-500">{project}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${sentimentColors[sentiment]}`}>
                    {sentimentIcons[sentiment]} {sentiment}
                </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{timestamp}</span>
            </div>
        </div>
    );
}
