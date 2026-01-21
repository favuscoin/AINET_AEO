'use client';

import Link from 'next/link';
import { Search, TrendingUp, Users, Bell } from 'lucide-react';

interface FeatureCardProps {
    icon: 'search' | 'trending' | 'users' | 'bell';
    title: string;
    href?: string;
}

const iconMap = {
    search: Search,
    trending: TrendingUp,
    users: Users,
    bell: Bell,
};

export default function FeatureCard({ icon, title, href }: FeatureCardProps) {
    const Icon = iconMap[icon];

    const content = (
        <div className="group relative p-6 rounded-xl bg-zinc-900/50 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer backdrop-blur-sm">
            <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>

            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}
