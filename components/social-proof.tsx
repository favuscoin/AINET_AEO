'use client';

interface SocialProofProps {
    title?: string;
    logos?: Array<{
        name: string;
        width: number;
        height: number;
    }>;
}

export function SocialProof({
    title = "Powering 500+ Marketing and Growth Teams",
    logos = []
}: SocialProofProps) {
    // Placeholder logos for demonstration
    const defaultLogos = [
        { name: "Company 1", width: 120, height: 40 },
        { name: "Company 2", width: 120, height: 40 },
        { name: "Company 3", width: 120, height: 40 },
        { name: "Company 4", width: 120, height: 40 },
        { name: "Company 5", width: 120, height: 40 },
        { name: "Company 6", width: 120, height: 40 },
    ];

    const displayLogos = logos.length > 0 ? logos : defaultLogos;

    return (
        <section className="py-16 bg-zinc-900 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
                        {title}
                    </p>
                </div>

                {/* Logo grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-50">
                    {displayLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center h-12 px-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Placeholder for logo */}
                            <div className="bg-zinc-800 rounded-lg px-6 py-3 border border-zinc-700">
                                <span className="text-zinc-500 text-xs font-medium">{logo.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
