'use client';

import Image from 'next/image';
import { PlayCircle } from 'lucide-react';

interface FeatureSectionProps {
    label: string;
    title: string;
    description: string;
    imageSrc: string;
    imageAlt: string;
    videoLink?: string;
    reverse?: boolean;
}

export default function FeatureSection({
    label,
    title,
    description,
    imageSrc,
    imageAlt,
    videoLink,
    reverse = false,
}: FeatureSectionProps) {
    return (
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-dense' : ''}`}>
            {/* Text Content */}
            <div className={`space-y-6 ${reverse ? 'lg:col-start-2' : ''}`}>
                {/* Label Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {label}
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    {title}
                </h2>

                {/* Description */}
                <p className="text-xl text-zinc-400 leading-relaxed">
                    {description}
                </p>

                {/* Video Link */}
                {videoLink && (
                    <a
                        href={videoLink}
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors group"
                    >
                        <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Watch Video Demo</span>
                    </a>
                )}
            </div>

            {/* Image */}
            <div className={`relative ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/10">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        priority={!reverse}
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
}
