'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
    TrendingUp,
    FileText,
    Zap,
    Eye,
    MessageSquare,
    ArrowUp,
    ArrowDown,
    Minus,
    Lock,
    CheckCircle,
    AlertCircle,
    Loader2,
    User,
    Mail,
    Phone,
    Edit2,
    Save,
    X,
    BarChart3,
    Lightbulb,
    FileSearch,
    Settings,
    HelpCircle,
    Sparkles,
    Target,
    Workflow,
    Send,
    Paperclip,
    List,
    RefreshCw,
    Globe,
    Wallet,
    Rocket,
    Activity,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// import ProductChangeDialog from '@/components/autumn/product-change-dialog';
import { useProfile, useUpdateProfile, useSettings, useUpdateSettings } from '@/hooks/useProfile';
import { useConversations, useConversation } from '@/hooks/useConversations';
import { useSendMessage } from '@/hooks/useMessages';
import { format } from 'date-fns';
// import PricingTable from '@/components/autumn/pricing-table';
import { BrandMonitor } from '@/components/brand-monitor/brand-monitor';
import { useBrandAnalyses, useBrandAnalysis, useDeleteBrandAnalysis } from '@/hooks/useBrandAnalyses';
import { Plus, Trash2 } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import GeoEventCard from '@/components/geo-event-card';
import GeoSentimentGrid from '@/components/geo-sentiment-grid';
import GeoDataTable from '@/components/geo-data-table';

// Mock data for topic performance
const mockTopics = [
    { name: 'Solana Ecosystem', visibility: 2.2, citationShare: 0.3, trend: 'up', rank: '#81' },
    { name: 'Solana development', visibility: 0, citationShare: 0, trend: 'neutral', rank: '#0' },
    { name: 'Blockchain development', visibility: 0, citationShare: 0, trend: 'neutral', rank: '#0' },
    { name: 'NFT Marketplaces', visibility: 1.5, citationShare: 0.2, trend: 'down', rank: '#95' },
    { name: 'Web3 Infrastructure', visibility: 0.8, citationShare: 0.1, trend: 'up', rank: '#120' },
];

// Mock data for prompt mining
const marketEvents = [
    {
        region: 'Bitcoin',
        regionFlag: '₿',
        project: 'ChatGPT',
        description: 'Top prompt: "How does Bitcoin halving affect price?" - 2.4M queries this week',
        sentiment: 'positive' as const,
        timestamp: '2 hrs ago',
    },
    {
        region: 'Ethereum',
        regionFlag: '⟠',
        project: 'Claude',
        description: 'Trending: "Ethereum gas fees optimization strategies" - 1.8M searches',
        sentiment: 'positive' as const,
        timestamp: '5 hrs ago',
    },
    {
        region: 'Solana',
        regionFlag: '◎',
        project: 'Perplexity',
        description: 'Rising query: "Is Solana network stable now?" - sentiment shift detected',
        sentiment: 'negative' as const,
        timestamp: '8 hrs ago',
    },
    {
        region: 'Cardano',
        regionFlag: '₳',
        project: 'Gemini',
        description: 'Popular: "Cardano smart contracts vs Ethereum" - 950K queries',
        sentiment: 'neutral' as const,
        timestamp: '12 hrs ago',
    },
    {
        region: 'Polygon',
        regionFlag: '⬡',
        project: 'ChatGPT',
        description: 'Trending: "Best DeFi protocols on Polygon" - 1.2M searches',
        sentiment: 'positive' as const,
        timestamp: '1 day ago',
    },
];

const positivePrompts = [
    { name: 'Bitcoin', percentage: 89, trend: '▲', code: '₿' },
    { name: 'Ethereum', percentage: 85, trend: '▲', code: '⟠' },
    { name: 'BNB', percentage: 82, trend: '▲', code: 'BNB' },
    { name: 'Solana', percentage: 78, trend: '▲', code: '◎' },
    { name: 'XRP', percentage: 75, trend: '▲', code: 'XRP' },
    { name: 'Cardano', percentage: 72, trend: '▲', code: '₳' },
    { name: 'Avalanche', percentage: 70, trend: '▲', code: 'AVAX' },
    { name: 'Polygon', percentage: 68, trend: '▲', code: '⬡' },
];

const negativePrompts = [
    { name: 'Terra', percentage: 85, trend: '▼', code: 'LUNA' },
    { name: 'FTX Token', percentage: 72, trend: '▼', code: 'FTT' },
    { name: 'Celsius', percentage: 68, trend: '▼', code: 'CEL' },
    { name: 'Voyager', percentage: 65, trend: '▼', code: 'VGX' },
    { name: 'BitConnect', percentage: 58, trend: '▼', code: 'BCC' },
    { name: 'OneCoin', percentage: 55, trend: '▼', code: 'ONE' },
    { name: 'SafeMoon', percentage: 52, trend: '▼', code: 'SAFEMOON' },
    { name: 'Squid Game', percentage: 48, trend: '▼', code: 'SQUID' },
];

// Separate component that uses Autumn hooks
function DashboardProContent({ session }: { session: any }) {
    const router = useRouter();
    // Removed Autumn hooks for invite-only access
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('agent');

    // Chat state
    const [input, setInput] = useState('');
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Chat queries and mutations
    const { data: conversations } = useConversations();
    const { data: currentConversation } = useConversation(selectedConversationId);
    const sendMessage = useSendMessage();

    // Brand Monitor state
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);

    // Brand Monitor queries and mutations
    const { data: analyses } = useBrandAnalyses();
    const { data: currentAnalysis } = useBrandAnalysis(selectedAnalysisId);
    const deleteAnalysis = useDeleteBrandAnalysis();

    // Profile and settings hooks
    const { data: profileData } = useProfile();
    const updateProfile = useUpdateProfile();
    const { data: settings } = useSettings();
    const updateSettings = useUpdateSettings();

    // Profile edit state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileForm, setProfileForm] = useState({
        displayName: '',
        bio: '',
        phone: '',
    });

    useEffect(() => {
        if (profileData?.profile) {
            setProfileForm({
                displayName: profileData.profile.displayName || '',
                bio: profileData.profile.bio || '',
                phone: profileData.profile.phone || '',
            });
        }
    }, [profileData]);

    const handleSaveProfile = async () => {
        await updateProfile.mutateAsync(profileForm);
        setIsEditingProfile(false);
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
        if (profileData?.profile) {
            setProfileForm({
                displayName: profileData.profile.displayName || '',
                bio: profileData.profile.bio || '',
                phone: profileData.profile.phone || '',
            });
        }
    };

    const handleSettingToggle = async (key: string, value: boolean) => {
        await updateSettings.mutateAsync({ [key]: value });
    };

    // Mock data for invite-only access (no Autumn)
    const userProducts: any[] = [];
    const userFeatures: any = {};
    const activeProduct = null;
    const scheduledProduct = null;

    const handleUpgrade = async (productId: string) => {
        // Disabled for invite-only access
        console.log('Upgrade feature disabled in invite-only mode');
    };

    const handleSendMessage = async () => {
        if (!input.trim() || sendMessage.isPending) return;

        try {
            const response = await sendMessage.mutateAsync({
                conversationId: selectedConversationId || undefined,
                message: input,
            });

            setInput('');

            // If this created a new conversation, select it
            if (!selectedConversationId && response.conversationId) {
                setSelectedConversationId(response.conversationId);
            }

            // Scroll to bottom
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error: any) {
            console.error('Failed to send message:', error);
        }
    };

    const handleDeleteAnalysis = async (analysisId: string) => {
        setAnalysisToDelete(analysisId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (analysisToDelete) {
            await deleteAnalysis.mutateAsync(analysisToDelete);
            if (selectedAnalysisId === analysisToDelete) {
                setSelectedAnalysisId(null);
            }
            setAnalysisToDelete(null);
        }
    };

    const handleNewAnalysis = () => {
        setSelectedAnalysisId(null);
    };

    return (
        <div className="flex h-screen bg-gray-50 pt-16">
            {/* Left Sidebar */}
            <div className="w-64 bg-white border-r flex flex-col">
                {/* Logo/Branding Area */}
                <div className="p-4 border-b">
                    {/* Empty space for logo or branding */}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-6">

                        {/* Analytics Section */}
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Analytics
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveSection('agent')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'agent'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 mr-3" />
                                    Agent Analytics
                                </button>
                                <button
                                    onClick={() => setActiveSection('overview')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'overview'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <BarChart3 className="w-4 h-4 mr-3" />
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveSection('brand-monitor')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'brand-monitor'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Eye className="w-4 h-4 mr-3" />
                                    Brand Monitor
                                </button>
                                <button
                                    onClick={() => setActiveSection('prompts')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'prompts'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <MessageSquare className="w-4 h-4 mr-3" />
                                    Prompt Volumes
                                </button>
                                <button
                                    onClick={() => setActiveSection('insights')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'insights'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Lightbulb className="w-4 h-4 mr-3" />
                                    Answer Engine Insights
                                </button>
                            </div>
                        </div>


                        {/* Action Section */}
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Action
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveSection('opportunities')}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'opportunities'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Target className="w-4 h-4 mr-3" />
                                        Opportunities
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Beta</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection('content')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'content'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <FileText className="w-4 h-4 mr-3" />
                                    Content
                                </button>
                                <button
                                    onClick={() => setActiveSection('workflows')}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'workflows'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Workflow className="w-4 h-4 mr-3" />
                                        Workflows
                                    </div>
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">Beta</span>
                                </button>
                                <button
                                    onClick={() => setActiveSection('brand')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'brand'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Eye className="w-4 h-4 mr-3" />
                                    Brand Hub
                                </button>
                            </div>
                        </div>

                        {/* Support Section */}
                        <div>
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                Support
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveSection('settings')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'settings'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Settings className="w-4 h-4 mr-3" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => setActiveSection('pricing')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'pricing'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Target className="w-4 h-4 mr-3" />
                                    Pricing
                                </button>
                                <button
                                    onClick={() => setActiveSection('help')}
                                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'help'
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <HelpCircle className="w-4 h-4 mr-3" />
                                    What's New?
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t">
                    <div className="flex items-center justify-center px-3 py-2 bg-[#AEEBD1]/20 rounded-lg">
                        <span className="text-sm font-medium" style={{ color: '#AEEBD1' }}>AINET AEO V0.1</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {activeSection === 'about' && 'About'}
                        {activeSection === 'agents' && 'Agents'}
                        {activeSection === 'agent-v2' && 'Agent v2'}
                        {activeSection === 'arena' && 'Arena'}
                        {activeSection === 'agent' && 'Agent'}
                        {activeSection === 'overview' && 'Overview'}
                        {activeSection === 'brand-monitor' && 'Brand Monitor'}
                        {activeSection === 'insights' && 'Answer Engine Insights'}
                        {activeSection === 'prompts' && 'Prompt Volumes'}
                        {activeSection === 'opportunities' && 'Opportunities'}
                        {activeSection === 'content' && 'Content'}
                        {activeSection === 'workflows' && 'Workflows'}
                        {activeSection === 'brand' && 'Brand Hub'}
                        {activeSection === 'pricing' && 'Pricing'}
                        {activeSection === 'settings' && 'Settings'}
                        {activeSection === 'help' && "What's New?"}
                        {activeSection === 'manage-wallets' && 'Manage Wallets'}
                        {activeSection === 'deploy-agent' && 'Deploy Agent'}
                        {activeSection === 'track-activity' && 'Track Activity'}
                    </h1>
                    {activeSection !== 'agent' && activeSection !== 'about' && activeSection !== 'about-v2' && activeSection !== 'agents' && activeSection !== 'arena' && (
                        <select className="px-3 py-1.5 border rounded-lg text-sm">
                            <option>Last 2 Days</option>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    )}
                </div>

                {/* Content */}
                <div className="p-8">
                    {activeSection === 'about' && (
                        <div className="max-w-7xl mx-auto -mt-8">
                            {/* Hero Section */}
                            <section className="relative overflow-hidden bg-white pt-8 pb-16">
                                <div className="relative">
                                    <div className="text-center">
                                        <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                                            <span className="block text-zinc-900">FireGEO Monitor</span>
                                            <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                                AI Brand Visibility Platform
                                            </span>
                                        </h1>
                                        <p className="text-lg lg:text-xl text-zinc-600 max-w-3xl mx-auto mb-6">
                                            Track how AI models rank your brand against competitors
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <Link
                                                href="/brand-monitor"
                                                className="btn-ainet-mint inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                                            >
                                                Start Brand Analysis
                                            </Link>
                                            <Link
                                                href="/plans"
                                                className="btn-ainet-default inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                                            >
                                                View Pricing
                                            </Link>
                                        </div>
                                        <p className="mt-6 text-sm text-zinc-500">
                                            Powered by AI • Real-time Analysis • Competitor Tracking • SEO Insights
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="mt-16 bg-zinc-900 rounded-[20px] p-8">
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">ChatGPT</div>
                                                <div className="text-sm text-zinc-400 mt-1">Claude, Perplexity & More</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">Real-time</div>
                                                <div className="text-sm text-zinc-400 mt-1">Analysis</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">Competitor</div>
                                                <div className="text-sm text-zinc-400 mt-1">Tracking</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-white">Actionable</div>
                                                <div className="text-sm text-zinc-400 mt-1">Insights</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Pricing Section */}
                            <section className="py-16 bg-white">
                                <div className="bg-gray-50 rounded-[30px] p-12">
                                    <div className="text-center mb-12">
                                        <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                                            Monitor Your Brand Visibility
                                        </h2>
                                        <p className="text-lg text-zinc-600">
                                            Choose the plan that fits your monitoring needs
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                                        {/* Starter */}
                                        <div className="bg-white p-6 rounded-[20px] border border-zinc-200 hover:scale-105 transition-all duration-200">
                                            <h3 className="text-xl font-bold mb-2">Starter</h3>
                                            <p className="text-zinc-600 mb-4">Perfect for personal brands</p>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">$0</span>
                                                <span className="text-zinc-600">/month</span>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    10 brand analyses/month
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Basic AI providers
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Email reports
                                                </li>
                                            </ul>
                                            <Link
                                                href="/login"
                                                className="btn-ainet-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
                                            >
                                                Start free
                                            </Link>
                                        </div>

                                        {/* Pro - Featured */}
                                        <div className="bg-white p-6 rounded-[20px] border-2 border-emerald-500 relative hover:scale-105 transition-all duration-200">
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                                Most Popular
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">Pro</h3>
                                            <p className="text-zinc-600 mb-4">For growing businesses</p>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">$49</span>
                                                <span className="text-zinc-600">/month</span>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Unlimited brand analyses
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    All AI providers
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Real-time alerts
                                                </li>
                                            </ul>
                                            <Link
                                                href="/login"
                                                className="btn-ainet-mint w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
                                            >
                                                Start free trial
                                            </Link>
                                        </div>

                                        {/* Enterprise */}
                                        <div className="bg-white p-6 rounded-[20px] border border-zinc-200 hover:scale-105 transition-all duration-200">
                                            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                                            <p className="text-zinc-600 mb-4">For agencies & large brands</p>
                                            <div className="mb-4">
                                                <span className="text-3xl font-bold">Custom</span>
                                            </div>
                                            <ul className="space-y-2 mb-6">
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Multiple brands
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    API access
                                                </li>
                                                <li className="flex items-center">
                                                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    White-label options
                                                </li>
                                            </ul>
                                            <Link
                                                href="/contact"
                                                className="btn-ainet-outline w-full inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-sm font-medium transition-all duration-200 h-10 px-4"
                                            >
                                                Contact sales
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="text-center mt-8">
                                        <Link href="/plans" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            View detailed pricing →
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* CTA Section */}
                            <section className="py-12 bg-white">
                                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[30px] p-12 text-center">
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        See How AI Models Rank Your Brand
                                    </h2>
                                    <p className="text-lg text-emerald-100 mb-6">
                                        Monitor your brand visibility across ChatGPT, Claude, Perplexity and more
                                    </p>
                                    <Link
                                        href="/brand-monitor"
                                        className="btn-ainet-default inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                                    >
                                        Start Free Analysis
                                    </Link>
                                </div>
                            </section>

                            {/* FAQs */}
                            <section className="py-16 bg-white">
                                <div className="max-w-4xl mx-auto">
                                    <div className="text-center mb-12">
                                        <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                                            Frequently asked questions
                                        </h2>
                                        <p className="text-lg text-zinc-600">
                                            Everything you need to know about FireGEO Monitor
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* FAQ Items */}
                                        <div className="bg-gray-50 rounded-[15px] p-6">
                                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                                                How does FireGEO Monitor work?
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed">
                                                FireGEO Monitor analyzes your brand's visibility across major AI platforms like ChatGPT, Claude, and Perplexity. Simply enter your website URL, and we'll show you how AI models rank your brand against competitors, what prompts trigger your appearance, and provide actionable insights to improve your AI visibility.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-[15px] p-6">
                                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                                                Which AI providers do you monitor?
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed">
                                                We monitor all major AI platforms including OpenAI's ChatGPT, Anthropic's Claude, Perplexity, Google's Gemini, and more. Our system continuously updates as new AI providers emerge, ensuring you always have comprehensive visibility across the AI landscape.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-[15px] p-6">
                                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                                                How often is the data updated?
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed">
                                                Our monitoring runs in real-time. When you request an analysis, we query all AI providers simultaneously to get the most current results. You can run new analyses anytime to track changes in your brand visibility and see how your optimization efforts are performing.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-[15px] p-6">
                                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                                                What insights will I get?
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed">
                                                You'll see your brand's visibility score, competitor rankings, which prompts trigger your appearance, response quality analysis, and specific recommendations to improve your AI presence. The platform also tracks trends over time and alerts you to significant changes.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-[15px] p-6">
                                            <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                                                How many credits do I need?
                                            </h3>
                                            <p className="text-zinc-600 leading-relaxed">
                                                Each brand analysis uses 10 credits (1 credit for initial URL analysis, 9 credits for the full AI provider scan). The free tier includes 100 credits monthly, enough for 10 complete analyses. Pro plans include unlimited analyses for comprehensive monitoring.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Final CTA */}
                            <section className="py-16 bg-zinc-900 rounded-[30px]">
                                <div className="max-w-4xl mx-auto text-center px-4">
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        Start Monitoring Your AI Brand Visibility
                                    </h2>
                                    <p className="text-lg text-zinc-400 mb-6">
                                        Take control of how AI models present your brand
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Link
                                            href="/brand-monitor"
                                            className="btn-ainet-mint inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8"
                                        >
                                            Analyze Your Brand
                                        </Link>
                                        <Link
                                            href="/plans"
                                            className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-base font-medium transition-all duration-200 h-12 px-8 bg-zinc-800 text-white hover:bg-zinc-700"
                                        >
                                            View Pricing
                                        </Link>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeSection === 'agents' && (
                        <div className="max-w-5xl mx-auto -mt-8">
                            {/* Balance Section */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-6 text-center">
                                <div className="inline-block bg-gray-800/50 border border-gray-700 rounded-full px-4 py-1.5 mb-4">
                                    <span className="text-sm text-gray-300">All agents</span>
                                </div>
                                <div className="text-5xl font-bold text-white mb-6">
                                    $1,604<span className="text-gray-400">.57</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-center mb-8">
                                    <button className="flex flex-col items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-300">Deploy</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-300">Transfer</span>
                                    </button>
                                    <button className="flex flex-col items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm text-gray-300">Swap</span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Agents Section */}
                            <div className="bg-white rounded-2xl border p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Active agents</h3>
                                    <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                                        View all →
                                    </button>
                                </div>

                                {/* Agent Cards Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* Agent 1 */}
                                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                                                🤖
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">Trading Bot</div>
                                                <div className="text-xs opacity-80">Auto mode</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold">$342.18</div>
                                        <div className="text-sm opacity-80">↗ 24.5%</div>
                                    </div>

                                    {/* Agent 2 */}
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                                                🎯
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">Analytics</div>
                                                <div className="text-xs opacity-80">Running</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold">$89.42</div>
                                        <div className="text-sm opacity-80">↗ 12.3%</div>
                                    </div>

                                    {/* Agent 3 */}
                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                                                📊
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium">Monitor</div>
                                                <div className="text-xs opacity-80">Active</div>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-bold">$156.90</div>
                                        <div className="text-sm opacity-80">↗ 8.7%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="bg-white rounded-2xl border p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent activity</h3>
                                    <button className="text-sm text-gray-500 hover:text-gray-700">
                                        View all
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {/* Activity Item 1 */}
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">Swap — SOL Yield Agent</div>
                                            <div className="text-sm text-gray-500">2h • Polymarket</div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-emerald-600">+0.57 wSOL</div>
                                            <div className="text-sm text-red-500">-0.43 mSOL</div>
                                        </div>
                                    </div>

                                    {/* Activity Item 2 */}
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">Buy — Thunder Vs. Hawks</div>
                                            <div className="text-sm text-gray-500">6h • NBA - Polymarket</div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-emerald-600">+7.04 Thunder</div>
                                            <div className="text-sm text-gray-500">-5 USDC.e</div>
                                        </div>
                                    </div>

                                    {/* Activity Item 3 */}
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">Redeem — Suns Vs. Clippers</div>
                                            <div className="text-sm text-gray-500">14h • NBA - Polymarket</div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-emerald-600">+6.33 USDC.e</div>
                                            <div className="text-sm text-red-500">-6.33 Clippers</div>
                                        </div>
                                    </div>

                                    {/* Activity Item 4 */}
                                    <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900">Redeem — Heat Vs. Grizzlies</div>
                                            <div className="text-sm text-gray-500">1d • NBA - Polymarket</div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="font-semibold text-gray-500">+0.00 USDC</div>
                                            <div className="text-sm text-red-500">-8.47 Grizzlies</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Agent Detail View - Dark Theme */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 mt-6">
                                {/* Agent Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-4xl">
                                            🏀
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">NBA - Polymarket</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-sm">EVM Imported</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white mb-1">$65.91</div>
                                        <div className="text-emerald-400 text-lg font-semibold">+1.40%</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mb-8">
                                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Top up
                                    </button>
                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h12v12H6z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-700 mb-6">
                                    <div className="flex gap-8">
                                        <button className="pb-3 px-1 border-b-2 border-white text-white font-semibold">
                                            Activity
                                        </button>
                                        <button className="pb-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                                            Transactions
                                        </button>
                                        <button className="pb-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 flex items-center gap-2">
                                            Positions
                                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">5</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">4h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Starting NBA Polymarket Trader...</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Done. All capital has been allocated efficiently.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">I have $4.79 USDC remaining to allocate to existing positions.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Placed bet of Magic for market: Magic vs. 76ers<br />Entered at price: $0.61</span>
                                    </div>
                                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">Buy — Magic Vs. 76ers</div>
                                                <div className="text-gray-400 text-sm flex items-center gap-2">
                                                    5h
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-400 font-semibold">+8.06 Magic</div>
                                            <div className="text-red-400 text-sm">-5 USDC</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Sourcing, aggregating, computing consensus U.S. bookmaker odds...</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Found 136 NBA events.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Individual trade size capped at $26.42 (scales with allocation) to ensure we aren't overly exposed to any one market.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">I have $9.79 USDC and 5 positions to work with.</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Starting NBA Polymarket Trader...</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Topped up agent assets from $63.46 to $68.46</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'agent-v2' && (
                        <div className="max-w-7xl mx-auto">
                            {/* Agent Selection Cards */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select an Agent</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* NBA Polymarket Agent */}
                                    <button className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                                                🏀
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium opacity-90">Trading Bot</div>
                                                <div className="text-lg font-bold">NBA Polymarket</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$65.91</div>
                                        <div className="text-sm opacity-90">↗ +1.40%</div>
                                    </button>

                                    {/* Trading Bot */}
                                    <button className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                                                🤖
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium opacity-90">Auto mode</div>
                                                <div className="text-lg font-bold">Trading Bot</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$342.18</div>
                                        <div className="text-sm opacity-90">↗ +24.5%</div>
                                    </button>

                                    {/* Analytics Agent */}
                                    <button className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                                                🎯
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium opacity-90">Running</div>
                                                <div className="text-lg font-bold">Analytics</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$89.42</div>
                                        <div className="text-sm opacity-90">↗ +12.3%</div>
                                    </button>

                                    {/* Monitor Agent */}
                                    <button className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white text-left hover:shadow-lg transition-all">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                                                📊
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium opacity-90">Active</div>
                                                <div className="text-lg font-bold">Monitor</div>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-bold mb-1">$156.90</div>
                                        <div className="text-sm opacity-90">↗ +8.7%</div>
                                    </button>
                                </div>
                            </div>

                            {/* Agent Detail View - Dark Theme */}
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700">
                                {/* Agent Header */}
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-4xl">
                                            🏀
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">NBA - Polymarket</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400 text-sm">EVM Imported</span>
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-white mb-1">$65.91</div>
                                        <div className="text-emerald-400 text-lg font-semibold">+1.40%</div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mb-8">
                                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <Plus className="w-5 h-5" />
                                        Top up
                                    </button>
                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    </button>
                                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 6h12v12H6z" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Tabs */}
                                <div className="border-b border-gray-700 mb-6">
                                    <div className="flex gap-8">
                                        <button className="pb-3 px-1 border-b-2 border-white text-white font-semibold">
                                            Activity
                                        </button>
                                        <button className="pb-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300">
                                            Transactions
                                        </button>
                                        <button className="pb-3 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 flex items-center gap-2">
                                            Positions
                                            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">5</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Activity Timeline */}
                                <div className="space-y-4">
                                    {/* Timeline Item 1 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">4h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Starting NBA Polymarket Trader...</span>
                                    </div>

                                    {/* Timeline Item 2 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Done. All capital has been allocated efficiently.</span>
                                    </div>

                                    {/* Timeline Item 3 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">I have $4.79 USDC remaining to allocate to existing positions.</span>
                                    </div>

                                    {/* Timeline Item 4 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Placed bet of Magic for market: Magic vs. 76ers<br />Entered at price: $0.61</span>
                                    </div>

                                    {/* Transaction Card */}
                                    <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between border border-gray-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">Buy — Magic Vs. 76ers</div>
                                                <div className="text-gray-400 text-sm flex items-center gap-2">
                                                    5h
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-emerald-400 font-semibold">+8.06 Magic</div>
                                            <div className="text-red-400 text-sm">-5 USDC</div>
                                        </div>
                                    </div>

                                    {/* Timeline Item 5 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Sourcing, aggregating, computing consensus U.S. bookmaker odds...</span>
                                    </div>

                                    {/* Timeline Item 6 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Found 136 NBA events.</span>
                                    </div>

                                    {/* Timeline Item 7 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Individual trade size capped at $26.42 (scales with allocation) to ensure we aren't overly exposed to any one market.</span>
                                    </div>

                                    {/* Timeline Item 8 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">I have $9.79 USDC and 5 positions to work with.</span>
                                    </div>

                                    {/* Timeline Item 9 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Starting NBA Polymarket Trader...</span>
                                    </div>

                                    {/* Timeline Item 10 */}
                                    <div className="flex items-start gap-3 text-gray-300">
                                        <span className="text-gray-500 text-sm w-8">5h</span>
                                        <span className="text-gray-500 mt-1">•</span>
                                        <span className="flex-1 text-sm">Topped up agent assets from $63.46 to $68.46</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {
                        activeSection === 'arena' && (
                            <div className="max-w-full">
                                {/* Top Navigation */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Top20</button>
                                        <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">Top21-Top50</button>
                                        <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700">Top51-Top100</button>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <select className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm border border-gray-700">
                                            <option>All Languages</option>
                                        </select>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700">24H</button>
                                            <button className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700">7D</button>
                                            <button className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium">30D</button>
                                            <button className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700">3M</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Layout: Sidebar + Heatmap */}
                                <div className="flex gap-6 mb-6">
                                    {/* Left Sidebar - Top Gainer/Loser */}
                                    <div className="w-64 flex-shrink-0 space-y-6">
                                        {/* Top Gainer */}
                                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                                            <h3 className="text-white font-semibold mb-2">Top Gainer</h3>
                                            <div className="text-xs text-emerald-400 mb-3">△ Absolute (bps) △ Relative (%)</div>
                                            <div className="space-y-2">
                                                {[
                                                    { name: 'FARCASTER', current: '5.65%', d1: '+544bps', d7: '+313bps', d30: '+395bps' },
                                                    { name: 'POLYMARKET', current: '24.41%', d1: '+459bps', d7: '+825bps', d30: '+674bps' },
                                                    { name: 'KALSHI', current: '9.86%', d1: '+439bps', d7: '+359bps', d30: '+227bps' }
                                                ].map((item, i) => (
                                                    <div key={i} className="text-xs">
                                                        <div className="text-white font-medium">{item.name}</div>
                                                        <div className="text-gray-400 mt-0.5">{item.current}</div>
                                                        <div className="text-emerald-400 text-[10px] mt-0.5">{item.d1} {item.d7} {item.d30}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Top Loser */}
                                        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                                            <h3 className="text-white font-semibold mb-2">Top Loser</h3>
                                            <div className="text-xs text-red-400 mb-3">△ Absolute (bps) △ Relative (%)</div>
                                            <div className="space-y-2">
                                                {[
                                                    { name: 'MASK', current: '2.54%', d1: '-622bps', d7: '-208bps', d30: '-135bps' },
                                                    { name: 'OPENSEA', current: '2.23%', d1: '-566bps', d7: '-210bps', d30: '-76bps' },
                                                    { name: 'BASE', current: '3.43%', d1: '-346bps', d7: '-319bps', d30: '-279bps' }
                                                ].map((item, i) => (
                                                    <div key={i} className="text-xs">
                                                        <div className="text-white font-medium">{item.name}</div>
                                                        <div className="text-gray-400 mt-0.5">{item.current}</div>
                                                        <div className="text-red-400 text-[10px] mt-0.5">{item.d1} {item.d7} {item.d30}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-3">Data updates every hour</div>
                                        </div>
                                    </div>

                                    {/* Mindshare Heatmap */}
                                    <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                                        <div className="grid grid-cols-4 gap-4">
                                            {/* POLYMARKET - Large */}
                                            <div className="col-span-2 row-span-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 relative overflow-hidden">
                                                <div className="text-white font-bold text-2xl mb-2">POLYMARKET</div>
                                                <div className="text-emerald-50 text-4xl font-bold">24.28%</div>
                                                <div className="absolute top-4 right-4 text-2xl">⭐</div>
                                                <div className="absolute bottom-4 right-4 flex items-end gap-1 h-16">
                                                    {[45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 92, 95].map((h, i) => (
                                                        <div key={i} className="w-2 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* FARCASTER */}
                                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 relative overflow-hidden">
                                                <div className="text-white font-bold text-lg mb-1">FARCA...</div>
                                                <div className="text-teal-50 text-2xl font-bold">5.86%</div>
                                                <div className="absolute top-2 right-2">⭐</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-8">
                                                    {[50, 55, 60, 65, 70, 75, 80, 85].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* DIME */}
                                            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 relative overflow-hidden">
                                                <div className="text-white font-bold text-lg mb-1">DIME</div>
                                                <div className="text-emerald-50 text-2xl font-bold">3.68%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-8">
                                                    {[60, 62, 65, 67, 70, 72, 75, 78].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* BASE - Red */}
                                            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 relative overflow-hidden">
                                                <div className="text-white font-bold text-lg mb-1">BASE</div>
                                                <div className="text-red-50 text-2xl font-bold">3.44%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-8">
                                                    {[80, 75, 70, 65, 60, 55, 50, 45].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* KALSHI - Large Green */}
                                            <div className="col-span-2 row-span-2 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-6 relative overflow-hidden">
                                                <div className="text-white font-bold text-2xl mb-2">KALSHI</div>
                                                <div className="text-emerald-50 text-4xl font-bold">9.84%</div>
                                                <div className="absolute top-4 right-4 text-2xl">⭐</div>
                                                <div className="absolute bottom-4 right-4 flex items-end gap-1 h-16">
                                                    {[40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 88, 90].map((h, i) => (
                                                        <div key={i} className="w-2 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* More cells */}
                                            <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-xl p-4 relative">
                                                <div className="text-white font-bold mb-1">BILLIO...</div>
                                                <div className="text-emerald-50 text-xl font-bold">2.34%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-6">
                                                    {[50, 55, 60, 65, 70, 75].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-4 relative">
                                                <div className="text-white font-bold mb-1">INFIN...</div>
                                                <div className="text-gray-200 text-xl font-bold">2.21%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-6">
                                                    {[60, 58, 60, 59, 61, 60].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/20 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-xl p-4 relative">
                                                <div className="text-white font-bold mb-1">VARI...</div>
                                                <div className="text-red-50 text-xl font-bold">2.18%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-6">
                                                    {[70, 65, 60, 55, 50, 45].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl p-4 relative">
                                                <div className="text-white font-bold mb-1">ABST...</div>
                                                <div className="text-teal-50 text-xl font-bold">1.95%</div>
                                                <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-6">
                                                    {[55, 60, 65, 70, 75, 80].map((h, i) => (
                                                        <div key={i} className="w-1 bg-white/30 rounded-t" style={{ height: `${h}%` }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Others cell */}
                                            <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl p-4 flex items-center justify-center">
                                                <div className="text-gray-400 font-semibold">Others</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Creator Leaderboard */}
                                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white">Creator Leaderboard</h3>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">7D</button>
                                            <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">30D</button>
                                            <button className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-sm font-medium">3M</button>
                                            <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">6M</button>
                                            <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">12M</button>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-800">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Rank</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Name</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Mindshare</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Smart Followers ↑</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Followers ↑</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 min-w-[200px]">Casual Vs Hardcore ↓ ⓘ</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400 min-w-[200px]">Shitposter Vs Curator ↓ ⓘ</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Copy Pasta ↑</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { rank: 1, name: 'jesse.base.eth', mindshare: '1.44%', smart: '7,244', followers: '338,587' },
                                                    { rank: 2, name: 'namik // mega-chef Σ', mindshare: '0.63%', smart: '1,519', followers: '15,777' },
                                                    { rank: 3, name: 'Cryptking.eth 🦇', mindshare: '0.58%', smart: '1,403', followers: '45,526' }
                                                ].map((creator, i) => (
                                                    <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                                                        <td className="py-4 px-4 text-sm text-white">{creator.rank}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full" />
                                                                <span className="text-sm text-white">{creator.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-white">{creator.mindshare}</td>
                                                        <td className="py-4 px-4 text-sm text-white">{creator.smart}</td>
                                                        <td className="py-4 px-4 text-sm text-white">{creator.followers}</td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex gap-0.5 h-4 rounded-full overflow-hidden">
                                                                <div className="bg-teal-400" style={{ width: '40%' }} />
                                                                <div className="bg-blue-500" style={{ width: '35%' }} />
                                                                <div className="bg-purple-500" style={{ width: '25%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="flex gap-0.5 h-4 rounded-full overflow-hidden">
                                                                <div className="bg-orange-400" style={{ width: '30%' }} />
                                                                <div className="bg-yellow-400" style={{ width: '50%' }} />
                                                                <div className="bg-purple-500" style={{ width: '20%' }} />
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <div className="bg-cyan-400 h-4 rounded-full" style={{ width: '60%' }} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }



                    {/* Manage Wallets Section */}
                    {
                        activeSection === 'manage-wallets' && (
                            <div className="max-w-6xl mx-auto">
                                {/* Total Balance Card */}
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 mb-6 text-center">
                                    <div className="text-sm text-gray-400 mb-2">Total Balance</div>
                                    <div className="text-5xl font-bold text-white mb-6">
                                        $530,247<span className="text-gray-400">.82</span>
                                    </div>
                                    <div className="flex gap-3 justify-center">
                                        <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                                            Import Wallet
                                        </button>
                                        <button className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                                            Copy Address
                                        </button>
                                    </div>
                                </div>

                                {/* Wallet Cards */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wallets</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Wallet 1 */}
                                        <div className="bg-white rounded-2xl border p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">Main Wallet</div>
                                                    <div className="text-sm text-gray-500 font-mono">0x789...08d</div>
                                                </div>
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <Wallet className="w-5 h-5 text-emerald-600" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">$342,180.50</div>
                                        </div>

                                        {/* Wallet 2 */}
                                        <div className="bg-white rounded-2xl border p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">Trading Wallet</div>
                                                    <div className="text-sm text-gray-500 font-mono">0xd63...a1d</div>
                                                </div>
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Wallet className="w-5 h-5 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900">$188,067.32</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Asset Breakdown */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Breakdown</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* ETH */}
                                        <div className="bg-white rounded-xl border p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
                                                    Ξ
                                                </div>
                                                <div className="font-semibold text-gray-900">ETH</div>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">12.45</div>
                                            <div className="text-xs text-gray-500">Ethereum</div>
                                        </div>

                                        {/* USDC */}
                                        <div className="bg-white rounded-xl border p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                                                    $
                                                </div>
                                                <div className="font-semibold text-gray-900">USDC</div>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">45,230</div>
                                            <div className="text-xs text-gray-500">Base</div>
                                        </div>

                                        {/* SOL */}
                                        <div className="bg-white rounded-xl border p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-sm text-white">
                                                    ◎
                                                </div>
                                                <div className="font-semibold text-gray-900">SOL</div>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">234.8</div>
                                            <div className="text-xs text-gray-500">Solana</div>
                                        </div>

                                        {/* BTC */}
                                        <div className="bg-white rounded-xl border p-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-sm">
                                                    ₿
                                                </div>
                                                <div className="font-semibold text-gray-900">BTC</div>
                                            </div>
                                            <div className="text-lg font-bold text-gray-900">0.89</div>
                                            <div className="text-xs text-gray-500">Bitcoin</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {/* Deploy Agent Section */}
                    {
                        activeSection === 'deploy-agent' && (
                            <div className="max-w-4xl mx-auto">
                                {/* Agent Profile */}
                                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-8 mb-6 text-white">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl">
                                            🤖
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-2">Narrative Trader</h2>
                                            <p className="text-emerald-100">AI-powered momentum trading based on market narratives</p>
                                        </div>
                                    </div>

                                    {/* Performance Chart Placeholder */}
                                    <div className="bg-white/10 rounded-xl p-6 mb-4">
                                        <div className="text-sm text-emerald-100 mb-2">Historical Performance</div>
                                        <div className="h-32 flex items-end gap-2">
                                            {[40, 65, 45, 80, 70, 85, 75, 90, 95, 88, 92, 100].map((height, i) => (
                                                <div key={i} className="flex-1 bg-white/30 rounded-t" style={{ height: `${height}%` }} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Risk Gauge */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-emerald-100">Risk Level:</div>
                                        <div className="flex gap-1">
                                            <div className="w-8 h-2 bg-emerald-300 rounded"></div>
                                            <div className="w-8 h-2 bg-yellow-300 rounded"></div>
                                            <div className="w-8 h-2 bg-white/20 rounded"></div>
                                        </div>
                                        <div className="text-sm font-medium">Medium</div>
                                    </div>
                                </div>

                                {/* Configuration Form */}
                                <div className="bg-white rounded-2xl border p-6 mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h3>

                                    <div className="space-y-4">
                                        {/* Allocation Amount */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Allocation Amount
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <input
                                                    type="number"
                                                    placeholder="10,000"
                                                    className="w-full pl-8 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>

                                        {/* Risk Tolerance */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Risk Tolerance
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="10"
                                                defaultValue="5"
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>Conservative</span>
                                                <span>Aggressive</span>
                                            </div>
                                        </div>

                                        {/* Strategy Selection */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Trading Strategy
                                            </label>
                                            <select className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                                <option>Momentum Trading</option>
                                                <option>Mean Reversion</option>
                                                <option>Arbitrage</option>
                                                <option>Yield Optimization</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Deploy Button */}
                                <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-lg transition-colors shadow-lg shadow-emerald-500/30">
                                    Deploy Agent
                                </button>
                            </div>
                        )
                    }

                    {/* Track Activity Section */}
                    {
                        activeSection === 'track-activity' && (
                            <div className="max-w-6xl mx-auto">
                                {/* Stats Overview */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="text-sm text-gray-500 mb-1">Total Profit</div>
                                        <div className="text-2xl font-bold text-emerald-600">+$12,450</div>
                                    </div>
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="text-sm text-gray-500 mb-1">Win Rate</div>
                                        <div className="text-2xl font-bold text-gray-900">68.5%</div>
                                    </div>
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="text-sm text-gray-500 mb-1">Total Trades</div>
                                        <div className="text-2xl font-bold text-gray-900">247</div>
                                    </div>
                                    <div className="bg-white rounded-xl border p-4">
                                        <div className="text-sm text-gray-500 mb-1">Active Agents</div>
                                        <div className="text-2xl font-bold text-gray-900">5</div>
                                    </div>
                                </div>

                                {/* Activity Feed */}
                                <div className="bg-white rounded-2xl border p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

                                    <div className="space-y-4">
                                        {/* Activity Item 1 */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                                                🤖
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900">Narrative Trader</div>
                                                <div className="text-sm text-gray-600">Bought 3 shares in Polymarket momentum trading</div>
                                                <div className="text-xs text-gray-500 mt-1">2 hours ago • Polymarket</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    Success
                                                </span>
                                            </div>
                                        </div>

                                        {/* Activity Item 2 */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                                                🐋
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900">Contrarian Whale</div>
                                                <div className="text-sm text-gray-600">Longed 10 ETH in Hyperliquid mean reversion</div>
                                                <div className="text-xs text-gray-500 mt-1">5 hours ago • Hyperliquid</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    Success
                                                </span>
                                            </div>
                                        </div>

                                        {/* Activity Item 3 */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                                                🎯
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900">Airdrop Hunter</div>
                                                <div className="text-sm text-gray-600">Deposited into MegaETH EuphoriaFi</div>
                                                <div className="text-xs text-gray-500 mt-1">1 day ago • MegaETH</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    Pending
                                                </span>
                                            </div>
                                        </div>

                                        {/* Activity Item 4 */}
                                        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                                                📈
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900">Yield Optimizer</div>
                                                <div className="text-sm text-gray-600">Swapped 1000 USDC for wstETH on Uniswap</div>
                                                <div className="text-xs text-gray-500 mt-1">2 days ago • Ethereum</div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                    Success
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }



                    {
                        activeSection === 'agent' && (
                            <div className="max-w-4xl mx-auto">
                                {/* Greeting */}
                                <div className="text-center mb-8">
                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome to AINET Chat</h2>
                                    <p className="text-gray-600">Want an update or have a question? Just chat below.</p>
                                </div>

                                {/* Messages Area */}
                                {currentConversation && currentConversation.messages.length > 0 && (
                                    <div className="bg-white rounded-lg border p-6 mb-6 max-h-96 overflow-y-auto">
                                        <div className="space-y-4">
                                            {currentConversation.messages.map((message: any) => (
                                                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.role === 'user'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                        }`}>
                                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                        <p className="text-xs mt-1 opacity-70">
                                                            {format(new Date(message.createdAt), 'h:mm a')}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={messagesEndRef} />
                                        </div>
                                    </div>
                                )}

                                {/* Chat Input */}
                                <div className="bg-white rounded-lg border p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Paperclip className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <List className="w-5 h-5 text-gray-400" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Sparkles className="w-5 h-5 text-gray-400" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage();
                                                }
                                            }}
                                            placeholder="What"
                                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            disabled={sendMessage.isPending}
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!input.trim() || sendMessage.isPending}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <RefreshCw className="w-5 h-5 text-gray-600" />
                                        </button>
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!input.trim() || sendMessage.isPending}
                                            className="p-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send className="w-5 h-5 text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Get Started Cards */}
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-900">Get started</h3>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <button
                                            onClick={() => setInput('Find keyword opportunities for my website')}
                                            className="bg-white border rounded-lg p-4 hover:border-emerald-500 transition-colors text-left"
                                        >
                                            <Globe className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Find keyword opportunities</p>
                                        </button>
                                        <button
                                            onClick={() => setInput('Analyze my competitors')}
                                            className="bg-white border rounded-lg p-4 hover:border-emerald-500 transition-colors text-left"
                                        >
                                            <BarChart3 className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Analyze competitors</p>
                                        </button>
                                        <button
                                            onClick={() => setInput('Review my technical SEO')}
                                            className="bg-white border rounded-lg p-4 hover:border-emerald-500 transition-colors text-left"
                                        >
                                            <Settings className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Review technical SEO</p>
                                        </button>
                                        <button
                                            onClick={() => setInput('Audit my homepage')}
                                            className="bg-white border rounded-lg p-4 hover:border-emerald-500 transition-colors text-left"
                                        >
                                            <FileSearch className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900">Audit my homepage</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeSection === 'overview' && (
                            <div className="space-y-6">
                                {/* Visibility Score and Improve Visibility */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Visibility Score Card */}
                                    <div className="lg:col-span-2 bg-white rounded-lg border p-6">
                                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Visibility Score</h2>

                                        <div className="flex items-baseline gap-4 mb-6">
                                            <div className="text-5xl font-bold text-gray-900">0.4%</div>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <TrendingUp className="w-4 h-4 mr-1" />
                                                <span>18.6%</span>
                                            </div>
                                        </div>

                                        {/* Mini chart */}
                                        <div className="h-32 flex items-end justify-around space-x-1">
                                            {[40, 55, 45, 70, 60, 80, 75, 65, 85, 90, 95, 88].map((height, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-gray-200 rounded-t hover:bg-emerald-500 transition-colors cursor-pointer"
                                                    style={{ height: `${height}%` }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>Jan 15</span>
                                            <span>Today</span>
                                        </div>
                                    </div>

                                    {/* Improve Visibility Card */}
                                    <div className="bg-white rounded-lg border p-6">
                                        <h2 className="text-sm font-semibold text-gray-900 mb-4">Improve Visibility</h2>
                                        <div className="space-y-3">
                                            <button className="w-full flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                <FileText className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Create Content</p>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                <Zap className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">Optimize Content</p>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                <Eye className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">View Opportunities</p>
                                                </div>
                                            </button>
                                            <button className="w-full flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                                <MessageSquare className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                                                <div className="flex items-center justify-between w-full">
                                                    <p className="text-sm font-medium text-gray-900">Manage Prompts</p>
                                                    <span className="text-xs text-gray-500">30/100 used</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Topic Performance Table */}
                                <div className="bg-white rounded-lg border">
                                    <div className="p-6 border-b">
                                        <h2 className="text-lg font-semibold text-gray-900">Topic Performance Breakdown</h2>
                                        <p className="text-sm text-gray-600 mt-1">Top brands and citation sources by topic</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 border-b">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Topic
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Visibility
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Citation Share
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {mockTopics.map((topic, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-500 mr-3">{topic.rank}</span>
                                                                <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-900">{topic.visibility}%</span>
                                                                {topic.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500 ml-2" />}
                                                                {topic.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500 ml-2" />}
                                                                {topic.trend === 'neutral' && <Minus className="w-3 h-3 text-gray-400 ml-2" />}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <span className="text-sm text-gray-900">{topic.citationShare}%</span>
                                                                {topic.trend === 'up' && <ArrowUp className="w-3 h-3 text-green-500 ml-2" />}
                                                                {topic.trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500 ml-2" />}
                                                                {topic.trend === 'neutral' && <Minus className="w-3 h-3 text-gray-400 ml-2" />}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeSection === 'settings' && (
                            <div className="space-y-6 max-w-4xl">
                                {/* Profile Section */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Profile Information</h2>
                                        {!isEditingProfile ? (
                                            <Button
                                                onClick={() => setIsEditingProfile(true)}
                                                size="sm"
                                                className="bg-black text-white hover:bg-gray-800"
                                            >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleSaveProfile}
                                                    size="sm"
                                                    variant="default"
                                                    disabled={updateProfile.isPending}
                                                >
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleCancelEdit}
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={updateProfile.isPending}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Mail className="inline-block h-4 w-4 mr-1" />
                                                Email
                                            </label>
                                            <p className="text-gray-900">{session.user?.email}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <User className="inline-block h-4 w-4 mr-1" />
                                                Display Name
                                            </label>
                                            {isEditingProfile ? (
                                                <input
                                                    type="text"
                                                    value={profileForm.displayName}
                                                    onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Enter your display name"
                                                />
                                            ) : (
                                                <p className="text-gray-900">
                                                    {profileData?.profile?.displayName || 'Not set'}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                <Phone className="inline-block h-4 w-4 mr-1" />
                                                Phone
                                            </label>
                                            {isEditingProfile ? (
                                                <input
                                                    type="tel"
                                                    value={profileForm.phone}
                                                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="Enter your phone number"
                                                />
                                            ) : (
                                                <p className="text-gray-900">
                                                    {profileData?.profile?.phone || 'Not set'}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Bio
                                            </label>
                                            {isEditingProfile ? (
                                                <textarea
                                                    value={profileForm.bio}
                                                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    rows={3}
                                                    placeholder="Tell us about yourself"
                                                />
                                            ) : (
                                                <p className="text-gray-900">
                                                    {profileData?.profile?.bio || 'Not set'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Settings Toggles */}
                                <div className="bg-white rounded-lg border p-6">
                                    <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
                                            </div>
                                            <button
                                                onClick={() => handleSettingToggle('emailNotifications', !settings?.emailNotifications)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.emailNotifications ? 'bg-emerald-500' : 'bg-gray-200'
                                                    }`}
                                                disabled={updateSettings.isPending}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Marketing Emails</p>
                                                <p className="text-sm text-gray-600">Receive emails about new features and offers</p>
                                            </div>
                                            <button
                                                onClick={() => handleSettingToggle('marketingEmails', !settings?.marketingEmails)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings?.marketingEmails ? 'bg-emerald-500' : 'bg-gray-200'
                                                    }`}
                                                disabled={updateSettings.isPending}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings?.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Stats */}
                                <div className="bg-white rounded-lg border p-6">
                                    <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
                                    {Object.keys(userFeatures).length > 0 ? (
                                        <div className="space-y-4">
                                            {Object.entries(userFeatures).map(([featureId, feature]) => (
                                                <div key={featureId}>
                                                    <div className="mb-4">
                                                        <h3 className="font-medium mb-2 capitalize">{featureId.replace(/_/g, ' ')}</h3>
                                                        <div className="flex justify-between text-sm mb-1">
                                                            <span>Used</span>
                                                            <span>{feature.usage || 0} / {feature.included_usage || ((feature.balance || 0) + (feature.usage || 0))}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                                                style={{
                                                                    width: `${Math.min(((feature.usage || 0) / (feature.included_usage || ((feature.balance || 0) + (feature.usage || 0) || 1))) * 100, 100)}%`
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {feature.next_reset_at && (
                                                        <p className="text-sm text-gray-600">
                                                            Resets on: {new Date(feature.next_reset_at).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No usage data available</p>
                                    )}
                                </div>

                                {/* Pricing moved to Pricing tab */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold mb-2">Simple Pricing Plans</h2>
                                        <p className="text-gray-600">We've designed our pricing to maximize your ROI.</p>
                                    </div>
                                    <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                        <p className="text-emerald-800 text-sm font-medium">✓ You have Early Access via invite code</p>
                                    </div>

                                    <div className="grid md:grid-cols-4 gap-4">
                                        {/* Free Plan */}
                                        <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors bg-white">
                                            <h3 className="text-sm font-semibold text-gray-600 mb-2">FREE</h3>
                                            <div className="mb-4">
                                                <p className="text-5xl font-bold text-emerald-700">$0</p>
                                                <p className="text-sm text-gray-500 mt-1">one-time report</p>
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li>One free GEO report</li>
                                                <li>Brand visibility snapshot</li>
                                                <li>AI platform overview</li>
                                            </ul>
                                        </div>

                                        {/* Starter Plan */}
                                        <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors bg-white">
                                            <h3 className="text-sm font-semibold text-gray-600 mb-2">STARTER</h3>
                                            <div className="mb-4">
                                                <p className="text-5xl font-bold text-emerald-700">$499</p>
                                                <p className="text-sm text-gray-500 mt-1">/month</p>
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-700">
                                                <li>Monthly analytics</li>
                                                <li>Performance tracking</li>
                                                <li>Content suggestions</li>
                                                <li>Email support</li>
                                            </ul>
                                        </div>

                                        {/* Growth Plan - Popular */}
                                        <div className="border-2 border-emerald-500 rounded-lg p-6 relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                                            </div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-2">GROWTH</h3>
                                            <div className="mb-4">
                                                <p className="text-5xl font-bold text-emerald-700">$1,499</p>
                                                <p className="text-sm text-gray-600 mt-1">/month</p>
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-800">
                                                <li>Weekly analytics</li>
                                                <li>Performance tracking</li>
                                                <li>Content suggestions</li>
                                                <li>Priority support</li>
                                            </ul>
                                        </div>

                                        {/* Enterprise Plan */}
                                        <div className="border rounded-lg p-6 bg-black text-white">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-2">ENTERPRISE</h3>
                                            <div className="mb-4">
                                                <p className="text-5xl font-bold">$3,999</p>
                                                <p className="text-sm text-gray-400 mt-1">/month</p>
                                            </div>
                                            <ul className="space-y-2 text-sm text-gray-200">
                                                <li>Hands-on support</li>
                                                <li>GEO strategy & execution</li>
                                                <li>Keyword optimization</li>
                                                <li>Content materials</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <p className="text-center text-sm text-gray-500 mt-6">
                                        Billing will be enabled soon. Early access users will receive special pricing.
                                    </p>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeSection === 'prompts' && (
                            <div className="space-y-8">
                                {/* Stats Bar */}
                                <div className="bg-white rounded-lg border p-6">
                                    <div className="flex items-center gap-8 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Prompt sentiment:</span>
                                            <span className="font-semibold">72/100</span>
                                            <span className="text-emerald-500">▲ 5.2%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Prompts tracked:</span>
                                            <span className="font-semibold">50M+</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Crypto projects:</span>
                                            <span className="font-semibold">2,400+</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hero Section */}
                                <div className="text-center space-y-4">
                                    <h2 className="text-4xl font-bold">
                                        AINET <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">PROMPT MINING</span>
                                    </h2>
                                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                        Discover what people are asking AI about crypto - Track trending prompts, sentiment, and query patterns across 50M+ searches
                                    </p>
                                </div>

                                {/* Trending Prompts */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bold">Trending Prompts</h3>
                                        <div className="flex gap-2">
                                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                                <span>←</span>
                                            </button>
                                            <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                                <span>→</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 overflow-x-auto pb-4">
                                        {marketEvents.map((event, index) => (
                                            <GeoEventCard key={index} {...event} />
                                        ))}
                                    </div>
                                </div>

                                {/* Sentiment Heatmap */}
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <GeoSentimentGrid type="positive" regions={positivePrompts} />
                                    <GeoSentimentGrid type="negative" regions={negativePrompts} />
                                </div>

                                {/* Data Table */}
                                <div>
                                    <GeoDataTable />
                                </div>
                            </div>
                        )
                    }

                    {
                        activeSection === 'brand-monitor' && (
                            <div className="max-w-4xl mx-auto">
                                {/* Greeting */}
                                <div className="text-center mb-8">
                                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Track Your Brand's AI Visibility</h2>
                                    <p className="text-gray-600">Analyze how AI models rank your brand against competitors across different prompts.</p>
                                </div>

                                {/* Brand Monitor Component */}
                                <div className="mb-6">
                                    <BrandMonitor
                                        creditsAvailable={0}
                                        onCreditsUpdate={async () => {
                                            // Refresh customer data
                                        }}
                                        selectedAnalysis={selectedAnalysisId ? currentAnalysis : null}
                                        onSaveAnalysis={(analysis) => {
                                            // Analysis saved
                                        }}
                                    />
                                </div>

                                {/* Get Started Steps */}
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-semibold text-gray-900">How It Works</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="bg-white border rounded-lg p-4 text-left">
                                            <Globe className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900 mb-1">1. Enter Brand URL</p>
                                            <p className="text-xs text-gray-600">We'll scrape your website to understand your brand</p>
                                        </div>
                                        <div className="bg-white border rounded-lg p-4 text-left">
                                            <Eye className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900 mb-1">2. Identify Competitors</p>
                                            <p className="text-xs text-gray-600">Add or remove competitors to compare against</p>
                                        </div>
                                        <div className="bg-white border rounded-lg p-4 text-left">
                                            <MessageSquare className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900 mb-1">3. Choose Prompts</p>
                                            <p className="text-xs text-gray-600">Select or customize prompts to test with AI models</p>
                                        </div>
                                        <div className="bg-white border rounded-lg p-4 text-left">
                                            <BarChart3 className="w-6 h-6 text-gray-400 mb-2" />
                                            <p className="text-sm font-medium text-gray-900 mb-1">4. View Results</p>
                                            <p className="text-xs text-gray-600">See your visibility scores and rankings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    {
                        activeSection === 'pricing' && (
                            <div className="max-w-6xl mx-auto">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold mb-4">
                                        <span className="bg-gradient-to-tr from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                                            Simple, transparent pricing
                                        </span>
                                    </h2>
                                    <p className="text-xl text-gray-600">
                                        Choose the perfect plan for your needs. Always flexible to scale up or down.
                                    </p>
                                </div>

                                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 max-w-4xl mx-auto">
                                    <p className="text-emerald-800 text-sm font-medium text-center">✓ You have Early Access via invite code</p>
                                </div>

                                <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                                    {/* Free Plan */}
                                    <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors bg-white">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">FREE</h3>
                                        <div className="mb-4">
                                            <p className="text-5xl font-bold text-emerald-700">$0</p>
                                            <p className="text-sm text-gray-500 mt-1">one-time report</p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li>One free GEO report</li>
                                            <li>Brand visibility snapshot</li>
                                            <li>AI platform overview</li>
                                        </ul>
                                    </div>

                                    {/* Starter Plan */}
                                    <div className="border rounded-lg p-6 hover:border-gray-300 transition-colors bg-white">
                                        <h3 className="text-sm font-semibold text-gray-600 mb-2">STARTER</h3>
                                        <div className="mb-4">
                                            <p className="text-5xl font-bold text-emerald-700">$499</p>
                                            <p className="text-sm text-gray-500 mt-1">/month</p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li>Monthly analytics</li>
                                            <li>Performance tracking</li>
                                            <li>Content suggestions</li>
                                            <li>Email support</li>
                                        </ul>
                                    </div>

                                    {/* Growth Plan - Popular */}
                                    <div className="border-2 border-emerald-500 rounded-lg p-6 relative bg-gradient-to-br from-emerald-50 to-emerald-100">
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">GROWTH</h3>
                                        <div className="mb-4">
                                            <p className="text-5xl font-bold text-emerald-700">$1,499</p>
                                            <p className="text-sm text-gray-600 mt-1">/month</p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-800">
                                            <li>Weekly analytics</li>
                                            <li>Performance tracking</li>
                                            <li>Content suggestions</li>
                                            <li>Priority support</li>
                                        </ul>
                                    </div>

                                    {/* Enterprise Plan */}
                                    <div className="border rounded-lg p-6 bg-black text-white">
                                        <h3 className="text-sm font-semibold text-gray-300 mb-2">ENTERPRISE</h3>
                                        <div className="mb-4">
                                            <p className="text-5xl font-bold">$3,999</p>
                                            <p className="text-sm text-gray-400 mt-1">/month</p>
                                        </div>
                                        <ul className="space-y-2 text-sm text-gray-200">
                                            <li>Hands-on support</li>
                                            <li>GEO strategy & execution</li>
                                            <li>Keyword optimization</li>
                                            <li>Content materials</li>
                                        </ul>
                                    </div>
                                </div>

                                <p className="text-center text-sm text-gray-500 mt-8">
                                    Billing will be enabled soon. Early access users will receive special pricing.
                                </p>
                            </div>
                        )
                    }

                    {/* Placeholder for other sections */}
                    {
                        activeSection !== 'overview' && activeSection !== 'settings' && activeSection !== 'pricing' && activeSection !== 'brand-monitor' && activeSection !== 'agent' && activeSection !== 'prompts' && (
                            <div className="bg-white rounded-lg border p-12 text-center">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileSearch className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                                    <p className="text-gray-600">
                                        This section is under development. Check back soon for updates!
                                    </p>
                                </div>
                            </div>
                        )
                    }
                </div >
            </div >

            <ConfirmationDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Analysis"
                description="Are you sure you want to delete this analysis? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                isLoading={deleteAnalysis.isPending}
            />
        </div >
    );
}

export default function DashboardProPage() {
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

    return <DashboardProContent session={mockSession} />;
}
