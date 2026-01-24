'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Settings, BarChart3, Zap } from 'lucide-react';

function DashboardContent({ session }: { session: any }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to AINET Dashboard</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-2xl font-bold text-emerald-600">Active</p>
              </div>
              <Zap className="h-8 w-8 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-2xl font-bold">Early Access</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">User</p>
                <p className="text-2xl font-bold">AINET User</p>
              </div>
              <User className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <Mail className="h-5 w-5 mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Account Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{session.user?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level
              </label>
              <p className="text-gray-900">Early Access (Invite Code)</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 mr-2 text-gray-600" />
            <h2 className="text-xl font-semibold">Available Features</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-medium mb-2">Brand Monitor</h3>
              <p className="text-sm text-gray-600">Track your brand mentions across AI platforms</p>
            </div>

            <div className="border rounded-lg p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-medium mb-2">AI Analytics</h3>
              <p className="text-sm text-gray-600">Analyze your AI search visibility</p>
            </div>

            <div className="border rounded-lg p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-medium mb-2">Prompt Mining</h3>
              <p className="text-sm text-gray-600">Discover trending AI search queries</p>
            </div>

            <div className="border rounded-lg p-4 hover:border-emerald-500 transition-colors">
              <h3 className="font-medium mb-2">Competitor Analysis</h3>
              <p className="text-sm text-gray-600">See how you compare to competitors</p>
            </div>
          </div>
        </div>

        {/* Navigation to other pages */}
        <div className="mt-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-4">Explore AINET Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="/dashboard-pro"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <h3 className="font-medium mb-1">Dashboard Pro</h3>
              <p className="text-sm text-white/80">Advanced analytics and insights</p>
            </a>

            <a
              href="/ainet-prompt-mining"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-colors"
            >
              <h3 className="font-medium mb-1">Prompt Mining</h3>
              <p className="text-sm text-white/80">Discover AI search trends</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check invite code
    const inviteCode = localStorage.getItem('ainet_invite_code');

    if (inviteCode === 'INTERNETOFAGENTS') {
      setIsAuthorized(true);
      setIsChecking(false);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (isChecking || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Create a mock session object for components that expect it
  const mockSession = {
    user: {
      id: 'invite-user',
      email: 'invite@ainet.com',
      name: 'AINET User'
    }
  };

  return <DashboardContent session={mockSession} />;
}