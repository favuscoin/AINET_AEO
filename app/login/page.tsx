'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Footer } from '@/components/footer';

function LoginForm() {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate invite code
    if (inviteCode !== 'INTERNETOFAGENTS') {
      setError('Invalid invite code. Please check and try again.');
      setLoading(false);
      return;
    }

    // Save invite code to localStorage
    localStorage.setItem('ainet_invite_code', inviteCode);

    // Redirect to dashboard-pro
    window.location.href = '/dashboard-pro';
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Mint gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-300 via-emerald-400 to-emerald-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/90 via-emerald-400/90 to-emerald-500/90" />
        <div className="relative z-10 max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">Join thousands of developers</h1>
          <p className="text-lg opacity-90">
            Start building with our powerful API and unlock new possibilities for your applications.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited API access</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Real-time collaboration</span>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-start pt-32 lg:items-center lg:pt-0 justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden mb-8 flex justify-center">
              <Image
                src="/Union1.png"
                alt="AIInternet"
                width={90}
                height={18}
                priority
              />
            </div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Get AINET Early Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your exclusive invite code to continue
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                Invite Code
              </label>
              <input
                id="inviteCode"
                name="inviteCode"
                type="text"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Enter your invite code"
              />
              <p className="mt-1 text-xs text-gray-500">Required to access AINET</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-ainet-mint w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 h-10 px-4"
              >
                {loading ? 'Verifying...' : 'Enter'}
              </button>
            </div>
          </form>

          {/* Mobile-only footer */}
          <div className="lg:hidden mt-16 pt-8 border-t border-gray-200">
            <div className="text-center space-y-4">
              <p className="text-gray-600 text-sm">
                Copyright © {new Date().getFullYear()} AINET. All rights reserved
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://x.com/AINETdotcc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}