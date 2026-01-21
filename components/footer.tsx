import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="mt-0">
            {/* Main footer section with emerald background */}
            <div className="bg-[#AEEBD1] rounded-t-[40px] md:rounded-t-[60px] relative overflow-hidden">
                <div className="max-w-[1170px] mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 lg:py-20">
                    {/* Content wrapper */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
                        {/* Left side - Title */}
                        <h2 className="text-black text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal leading-[115%] tracking-[-0.5px] max-w-[400px]">
                            See where you appear in AI Search
                        </h2>

                        {/* Right side - Buttons */}
                        <div className="flex flex-row items-center gap-3 lg:gap-4">
                            <Link
                                href="/dashboard-pro"
                                className="w-full sm:w-auto bg-white text-[#1E1B30] px-8 py-4 rounded-[110px] text-xs font-medium uppercase tracking-wide hover:bg-gray-100 transition-all whitespace-nowrap"
                            >
                                GET EARLY ACCESS
                            </Link>
                            <Link
                                href="https://x.com/AINETdotcc"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1E1B30] text-white px-6 md:px-7 py-3 md:py-3.5 rounded-full text-xs md:text-sm font-medium uppercase tracking-wide hover:bg-[#2a2640] transition-all whitespace-nowrap"
                            >
                                CONTACT US
                            </Link>
                        </div>
                    </div>

                    {/* Bottom row - Copyright and Social */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                        <p className="text-[#1E1B30] text-xs md:text-sm font-normal">
                            Copyright © {new Date().getFullYear()} AINET. All rights reserved
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="https://x.com/AINETdotcc" target="_blank" rel="noopener noreferrer" className="text-[#1E1B30] hover:opacity-70 transition-opacity">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
