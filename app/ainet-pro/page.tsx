import Link from 'next/link';
import FeatureCard from '@/components/feature-card';
import FeatureSection from '@/components/feature-section';

export default function AINETPROPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

                <div className="relative max-w-7xl mx-auto">
                    {/* Hero Content */}
                    <div className="text-center space-y-8 mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            AI Brand Monitoring
                            <br />
                            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                Platform
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
                            The ultimate AI-powered platform you need to turn unstructured brand mentions into actionable insights.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/register"
                                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/25"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                href="/plans"
                                className="px-8 py-4 border border-white/20 hover:border-emerald-500/50 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm"
                            >
                                Explore Pricing
                            </Link>
                        </div>
                    </div>

                    {/* Quick Access Feature Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        <FeatureCard icon="search" title="Brand Search" href="#brand-search" />
                        <FeatureCard icon="trending" title="Sentiment Tracking" href="#sentiment" />
                        <FeatureCard icon="users" title="Competitor Analysis" href="#competitors" />
                        <FeatureCard icon="bell" title="Real-time Alerts" href="#alerts" />
                    </div>
                </div>
            </section>

            {/* Feature Sections */}
            <section className="py-20 px-6 space-y-32">
                <div className="max-w-7xl mx-auto space-y-32">
                    {/* Brand Search */}
                    <div id="brand-search">
                        <FeatureSection
                            label="Brand Search"
                            title="Search for Instant Insights"
                            description="Search any ticker, topic, or trend for instant insights in seconds across thousands of premium AI platforms and queries."
                            imageSrc="/brand-search-screenshot.png"
                            imageAlt="Brand search interface showing mentions across AI platforms"
                            videoLink="#"
                        />
                    </div>

                    {/* Sentiment Tracking */}
                    <div id="sentiment">
                        <FeatureSection
                            label="Sentiment Tracking"
                            title="Monitor Brand Sentiment"
                            description="Track how AI models perceive your brand with real-time sentiment analysis. Identify trends, spot issues early, and understand your brand's reputation across all major AI platforms."
                            imageSrc="/sentiment-dashboard.png"
                            imageAlt="Sentiment analysis dashboard with charts and metrics"
                            reverse
                        />
                    </div>

                    {/* Competitor Analysis */}
                    <div id="competitors">
                        <FeatureSection
                            label="Competitor Analysis"
                            title="Track Your Competition"
                            description="See how you stack up against competitors in AI visibility. Monitor their mentions, compare sentiment scores, and identify gaps in your AI presence strategy."
                            imageSrc="/competitor-comparison.png"
                            imageAlt="Competitor comparison dashboard"
                        />
                    </div>

                    {/* Real-time Alerts */}
                    <div id="alerts">
                        <FeatureSection
                            label="Real-time Alerts"
                            title="Stay Informed Instantly"
                            description="Get notified the moment your brand is mentioned, sentiment changes, or competitors make moves. Configure custom alerts to never miss what matters most."
                            imageSrc="/alerts-interface.png"
                            imageAlt="Real-time alerts notification interface"
                            reverse
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Teaser Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent" />

                <div className="relative max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Choose Your Plan
                    </h2>
                    <p className="text-xl text-zinc-400">
                        Start monitoring your AI brand visibility today with flexible pricing options for teams of all sizes.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/plans"
                            className="inline-flex px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-emerald-500/25"
                        >
                            View Pricing Plans
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
