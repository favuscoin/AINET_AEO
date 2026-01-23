'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Use AIInternet light theme for homepage, p0 and dashboard-pro pages
  const isLightTheme = pathname === '/' || pathname === '/p0' || pathname === '/dashboard-pro';

  // Hide navigation menu items on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/forgot-password' || pathname === '/reset-password';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      setTimeout(() => {
        router.refresh();
        setIsLoggingOut(false);
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  if (isLightTheme) {
    // AIInternet themed navbar for p0 and dashboard-pro pages
    const navbarBg = pathname === '/dashboard-pro' ? 'bg-white' : '';

    return (
      <header className={`absolute top-0 left-0 w-full z-50 py-4 ${navbarBg}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <nav>
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/p0/logo.svg"
                  alt="AIInternet"
                  width={120}
                  height={30}
                  className="h-6 w-auto"
                  priority
                />
              </Link>

              {/* Desktop Navigation */}
              <ul className="hidden md:flex items-center gap-6 lg:gap-8">
              </ul>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <Link
                  href="#"
                  className="bg-white text-[#1E1B30] px-6 py-2.5 rounded-[110px] text-xs font-medium uppercase tracking-wider hover:bg-[#1E1B30] hover:text-white transition-all"
                >
                  DOCUMENTATION
                </Link>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2"
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6 text-[#1E1B30]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                {/* Mobile Menu Content */}
                <div className="px-4 py-6 space-y-4">
                </div>
              </div>
            )}
          </nav>
        </div>
      </header>
    );
  }

  // Default navbar for other pages
  return (
    <nav className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/airternet-logo.png"
                alt="AIrternet"
                width={60}
                height={12}
                className="h-4 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
          </div>

          {/* Center navigation - hidden on auth pages */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/og"
                className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                OG
              </Link>
              <Link
                href="/p0"
                className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                p0
              </Link>
              <Link
                href="/ainet-pro"
                className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                AINET PRO
              </Link>
              <Link
                href="/ainet-prompt-mining"
                className="text-sm font-medium text-zinc-300 hover:text-emerald-400 transition-colors"
              >
                AINET PROMPT MINING
              </Link>
              {session && (
                <>
                  <Link
                    href="/dashboard-pro"
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Dashboard PRO
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Right side - Auth buttons */}
          <div className="flex items-center space-x-4">
            {isPending ? (
              <div className="text-sm text-zinc-400">Loading...</div>
            ) : session ? (
              <>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-ainet-mint inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-9 px-4"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}