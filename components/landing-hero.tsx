'use client';

import Link from 'next/link';
import Image from 'next/image';

interface LandingHeroProps {
    badge?: string;
    headline: string;
    subheadline: string;
    description: string;
    primaryCta: {
        text: string;
        href: string;
    };
    secondaryCta: {
        text: string;
        href: string;
    };
    previewImage?: string;
}

export function LandingHero({
    badge = "AI Brand Monitoring Now Available",
    headline,
    subheadline,
    description,
    primaryCta,
    secondaryCta,
    previewImage = "/dashboard-preview.png"
}: LandingHeroProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 via-zinc-900 to-black pt-20 pb-32">
            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-900 to-black"></div>
            <div className="absolute inset-0 bg-grid-zinc-100 opacity-5"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left column - Text content */}
                    <div className="text-left animate-fade-in-up">
                        {/* Feature badge */}
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                            <span className="text-sm text-emerald-400 font-medium">{badge}</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            <span className="block text-white">{headline}</span>
                            <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                {subheadline}
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-zinc-400 mb-8 max-w-xl">
                            {description}
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={primaryCta.href}
                                className="btn-ainet-mint inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                            >
                                {primaryCta.text}
                            </Link>
                            <Link
                                href={secondaryCta.href}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8 bg-white/5 text-white hover:bg-white/10 border border-white/10"
                            >
                                {secondaryCta.text}
                            </Link>
                        </div>
                    </div>

                    {/* Right column - Product preview */}
                    <div className="relative animate-fade-in-scale animation-delay-400">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <Image
                                src={previewImage}
                                alt="Dashboard Preview"
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                priority
                            />
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent pointer-events-none"></div>
                        </div>
                        {/* Floating glow */}
                        <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl -z-10 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
