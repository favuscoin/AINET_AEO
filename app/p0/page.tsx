'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function P0Page() {
    useEffect(() => {
        // Set body background to match hero section
        document.body.style.backgroundImage = 'url(/p0/bg0.svg)';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundColor = '#F3F2F0';

        // Cleanup on unmount
        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundRepeat = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundColor = '';
        };
    }, []);

    return (
        <div
            className="min-h-screen"
        >
            {/* Hero Section */}
            <section
                className="relative bg-[#F3F2F0]"
                style={{
                    backgroundImage: 'url(/p0/bg0.svg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            >
                <div className="pt-24 md:pt-32 pb-0">
                    <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-normal leading-[98%] tracking-[-1px] text-black mb-3 md:mb-4">
                                Turn AI Traffic Into <br />Revenue with AINET
                            </h1>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
                                <Link
                                    href="#"
                                    className="w-full sm:w-auto bg-[#AEEBD1] text-[#1E1B30] px-6 md:px-8 py-4 md:py-5 rounded-[110px] text-xs font-medium uppercase tracking-wider hover:bg-[#1E1B30] hover:text-white transition-all text-center"
                                >
                                    get early access
                                </Link>
                                <Link
                                    href="https://x.com/ainternetfdn"
                                    className="w-full sm:w-auto bg-[#1E1B30] text-white px-6 md:px-8 py-4 md:py-5 rounded-[110px] text-xs font-medium uppercase tracking-wider hover:bg-white hover:text-[#1E1B30] transition-all text-center"
                                >
                                    contact us
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Image container - network diagram */}
                    <div className="mt-8 md:mt-12 lg:mt-16 relative">
                        <div className="max-w-[1170px] mx-auto pl-4 sm:pl-6 lg:pl-8">
                            <div className="relative">
                                <Image
                                    src="/p0/a1.svg"
                                    alt="Internet of Agents Network"
                                    width={1170}
                                    height={400}
                                    className="w-full h-auto max-w-none"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Decorative buttons graphic at bottom center */}
                        <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-xs md:max-w-md lg:max-w-lg px-4">
                            <Image
                                src="/p0/buttons.svg"
                                alt="AINET Features"
                                width={600}
                                height={100}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="bg-white py-12 md:py-16 lg:py-20">
                <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-[692px] mx-auto text-center">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-normal leading-[128%] tracking-[-1px] text-[#A1A1A1]">
                            <span className="text-black">
                                AInternet rebuilds the internet's economic layer{' '}
                                <span className="hidden sm:inline"><br /></span>
                                for the agent-native web,
                            </span>
                            <br />
                            starting with the marketing platform for the age of superintelligence
                        </h2>
                    </div>
                </div>
            </section>

            {/* AINET Stack Section */}
            <div
                className="pt-12 md:pt-20 lg:pt-[100px]"
                style={{
                    backgroundImage: 'url(/p0/bg0.svg)',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
            >
                <section className="mb-6 md:mb-8">
                    <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-[24px] md:rounded-[40px] p-6 sm:p-8 md:p-12 lg:p-[52px_60px_72px]">
                            {/* Stack Content */}
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
                                {/* Left Side */}
                                <div className="w-full lg:max-w-[380px]">
                                    <span className="text-black text-lg md:text-xl font-normal leading-[128%] tracking-[-1px] block">
                                        [Full Stack Visibility & Analytics for AI Search]
                                    </span>
                                    <h2 className="text-black text-3xl md:text-4xl lg:text-[40px] font-normal leading-[128%] tracking-[-1px] my-4 md:my-6">
                                        Visibility & Analytics from AI Search and the actions to drive growth
                                    </h2>
                                    <p className="text-[#A1A1A1] text-lg md:text-xl lg:text-2xl font-normal leading-[128%] tracking-[-1px] mb-8 md:mb-12 lg:mb-[70px]">
                                        Capture millions of clicks from customers discovering new products and brands through ChatGPT
                                    </p>
                                </div>

                                {/* Right Side - Feature Cards */}
                                <div className="w-full lg:max-w-[496px] lg:ml-auto">
                                    {/* Card 1 */}
                                    <div className="rounded-[20px] md:rounded-[32px] border border-[#DFDEDC] mb-4 md:mb-6">
                                        <div className="flex items-center gap-3 md:gap-5 p-4 md:p-6 border-b border-[#DFDEDC]">
                                            <Image
                                                src="/p0/token.svg"
                                                alt="Cloud Icon"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                                            />
                                            <h3 className="text-black text-xl md:text-2xl font-normal leading-[128%] tracking-[-1px]">
                                                How AI actually decides
                                            </h3>
                                        </div>
                                        <div className="p-4 md:p-6">
                                            <p className="text-[#A1A1A1] text-base md:text-lg font-normal leading-[140%]">
                                                AI answer engines don't crawl SEO pages or rank blue links. They form opinions by learning from real signals across the open web: community discussions, third-party mentions, structured and unstructured context, and consistency over time. The brands that dominate these signals become the default answers returned by AI.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="rounded-[20px] md:rounded-[32px] border border-[#DFDEDC] mb-4 md:mb-6">
                                        <div className="flex items-center gap-3 md:gap-5 p-4 md:p-6 border-b border-[#DFDEDC]">
                                            <Image
                                                src="/p0/manage-icon.svg"
                                                alt="Protocol Icon"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                                            />
                                            <h3 className="text-black text-xl md:text-2xl font-normal leading-[128%] tracking-[-1px]">
                                                See how AI talks about you
                                            </h3>
                                        </div>
                                        <div className="p-4 md:p-6">
                                            <p className="text-[#A1A1A1] text-base md:text-lg font-normal leading-[140%]">
                                                AINET GEO shows you how ChatGPT and other answer engines currently describe your brand, where those answers come from, and which sources most strongly influence AI opinions in your category. No guesswork, no assumptions: just clear visibility into how AI actually sees you.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card 3 */}
                                    <div className="rounded-[20px] md:rounded-[32px] border border-[#DFDEDC]">
                                        <div className="flex items-center gap-3 md:gap-5 p-4 md:p-6 border-b border-[#DFDEDC]">
                                            <Image
                                                src="/p0/control-icon.svg"
                                                alt="Contracts Icon"
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                                            />
                                            <h3 className="text-black text-xl md:text-2xl font-normal leading-[128%] tracking-[-1px]">
                                                Shape the outcome
                                            </h3>
                                        </div>
                                        <div className="p-4 md:p-6">
                                            <p className="text-[#A1A1A1] text-base md:text-lg font-normal leading-[140%]">
                                                Once the signals are visible, we help you strengthen the sources AI already trusts, create content aligned with how AI systems learn and cite information, and shift your brand from being merely mentioned to being actively recommended. This is Generative Engine Optimization.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
