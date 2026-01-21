# AINET Money Section Backup
# Removed from dashboard-pro on 2026-01-20
# This section can be restored in the future if needed

## Sidebar Navigation Section (Lines 366-423)

```tsx
{/* AINET Money Section */}
<div>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        AINET Money
    </div>
    <div className="space-y-1">
        <button
            onClick={() => setActiveSection('manage-wallets')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'manage-wallets'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Wallet className="w-4 h-4 mr-3" />
            Manage Wallets
        </button>
        <button
            onClick={() => setActiveSection('agents')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'agents'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <User className="w-4 h-4 mr-3" />
            Agents
        </button>
        <button
            onClick={() => setActiveSection('deploy-agent')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'deploy-agent'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Rocket className="w-4 h-4 mr-3" />
            Deploy Agent
        </button>
        <button
            onClick={() => setActiveSection('track-activity')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'track-activity'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Activity className="w-4 h-4 mr-3" />
            Track Activity
        </button>
        <button
            onClick={() => setActiveSection('manage-agents-money')}
            className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeSection === 'manage-agents-money'
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Users className="w-4 h-4 mr-3" />
            Manage Agents
        </button>
    </div>
</div>
```

## Header Title Section (Line 556)

```tsx
{activeSection === 'manage-agents-money' && 'Manage Agents'}
```

## Main Content Section (Lines 1970-2107 approximately)

```tsx
{/* Manage Agents Section */}
{
    activeSection === 'manage-agents-money' && (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Agents</h3>
                <select className="px-4 py-2 border rounded-lg text-sm">
                    <option>All Agents</option>
                    <option>Running</option>
                    <option>Paused</option>
                    <option>Stopped</option>
                </select>
            </div>

            {/* Agent Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Agent 1 - Narrative Trader */}
                {/* Agent 2 - Contrarian Whale */}
                {/* Agent 3 - Airdrop Hunter */}
                {/* Agent 4 - Yield Optimizer */}
                {/* ... full agent cards with profit/loss data ... */}
            </div>
        </div>
    )
}
```

## Notes
- This section included wallet management, agent deployment, activity tracking, and agent management features
- All related to AINET Money functionality
- Can be restored by copying the code back into the appropriate sections of dashboard-pro/page.tsx
