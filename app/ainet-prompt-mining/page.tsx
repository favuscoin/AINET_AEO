import GeoEventCard from '@/components/geo-event-card';
import GeoSentimentGrid from '@/components/geo-sentiment-grid';
import GeoDataTable from '@/components/geo-data-table';

export default function AINETPromptMiningPage() {
    // Mock data for market events
    const marketEvents = [
        {
            region: 'Bitcoin',
            regionFlag: '₿',
            project: 'ChatGPT',
            description: 'Top prompt: "How does Bitcoin halving affect price?" - 2.4M queries this week',
            sentiment: 'positive' as const,
            timestamp: '2 hrs ago',
        },
        {
            region: 'Ethereum',
            regionFlag: '⟠',
            project: 'Claude',
            description: 'Trending: "Ethereum gas fees optimization strategies" - 1.8M searches',
            sentiment: 'positive' as const,
            timestamp: '5 hrs ago',
        },
        {
            region: 'Solana',
            regionFlag: '◎',
            project: 'Perplexity',
            description: 'Rising query: "Is Solana network stable now?" - sentiment shift detected',
            sentiment: 'negative' as const,
            timestamp: '8 hrs ago',
        },
        {
            region: 'Cardano',
            regionFlag: '₳',
            project: 'Gemini',
            description: 'Popular: "Cardano smart contracts vs Ethereum" - 950K queries',
            sentiment: 'neutral' as const,
            timestamp: '12 hrs ago',
        },
        {
            region: 'Polygon',
            regionFlag: '⬡',
            project: 'ChatGPT',
            description: 'Trending: "Best DeFi protocols on Polygon" - 1.2M searches',
            sentiment: 'positive' as const,
            timestamp: '1 day ago',
        },
    ];

    // Mock data for positive sentiment prompts
    const positivePrompts = [
        { name: 'Bitcoin', percentage: 89, trend: '▲', code: '₿' },
        { name: 'Ethereum', percentage: 85, trend: '▲', code: '⟠' },
        { name: 'BNB', percentage: 82, trend: '▲', code: 'BNB' },
        { name: 'Solana', percentage: 78, trend: '▲', code: '◎' },
        { name: 'XRP', percentage: 75, trend: '▲', code: 'XRP' },
        { name: 'Cardano', percentage: 72, trend: '▲', code: '₳' },
        { name: 'Avalanche', percentage: 70, trend: '▲', code: 'AVAX' },
        { name: 'Polygon', percentage: 68, trend: '▲', code: '⬡' },
    ];

    // Mock data for negative sentiment prompts
    const negativePrompts = [
        { name: 'Terra', percentage: 85, trend: '▼', code: 'LUNA' },
        { name: 'FTX Token', percentage: 72, trend: '▼', code: 'FTT' },
        { name: 'Celsius', percentage: 68, trend: '▼', code: 'CEL' },
        { name: 'Voyager', percentage: 65, trend: '▼', code: 'VGX' },
        { name: 'BitConnect', percentage: 58, trend: '▼', code: 'BCC' },
        { name: 'OneCoin', percentage: 55, trend: '▼', code: 'ONE' },
        { name: 'SafeMoon', percentage: 52, trend: '▼', code: 'SAFEMOON' },
        { name: 'Squid Game', percentage: 48, trend: '▼', code: 'SQUID' },
    ];

    return (
        <div className="min-h-screen bg-black">
            {/* Announcement Banner */}
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 py-3 px-6 text-center">
                <p className="text-black text-sm font-medium">
                    🔍 New prompt data analyzed from 50M+ AI queries this week. <span className="underline cursor-pointer">View more</span>
                </p>
            </div>

            {/* Stats Bar */}
            <div className="border-b border-white/10 bg-zinc-900/50 py-3 px-6">
                <div className="max-w-7xl mx-auto flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Prompt sentiment:</span>
                        <span className="text-white font-semibold">72/100</span>
                        <span className="text-emerald-400">▲ 5.2%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Prompts tracked:</span>
                        <span className="text-white font-semibold">50M+</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-zinc-400">Crypto projects:</span>
                        <span className="text-white font-semibold">2,400+</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
                {/* Hero Section */}
                <section className="text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        AINET <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">PROMPT MINING</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto">
                        Discover what people are asking AI about crypto - Track trending prompts, sentiment, and query patterns across 50M+ searches
                    </p>
                </section>

                {/* Market Events */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Trending Prompts</h2>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-white">←</span>
                            </button>
                            <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors">
                                <span className="text-white">→</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {marketEvents.map((event, index) => (
                            <GeoEventCard key={index} {...event} />
                        ))}
                    </div>
                </section>

                {/* Sentiment Heatmap */}
                <section className="grid lg:grid-cols-2 gap-8">
                    <GeoSentimentGrid type="positive" regions={positivePrompts} />
                    <GeoSentimentGrid type="negative" regions={negativePrompts} />
                </section>

                {/* Data Table */}
                <section>
                    <GeoDataTable />
                </section>

                {/* CTA Section */}
                <section className="py-16 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Unlock Prompt Intelligence
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Get access to advanced prompt analytics, trending queries, and real-time sentiment tracking for your crypto projects
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/register"
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/25"
                        >
                            Start Free Trial
                        </a>
                        <a
                            href="/plans"
                            className="px-8 py-4 border border-white/20 hover:border-emerald-500/50 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm"
                        >
                            View Pricing
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
}
