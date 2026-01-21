import React from 'react';
import { Globe, Loader2 } from 'lucide-react';

interface UrlInputSectionProps {
  url: string;
  urlValid: boolean | null;
  loading: boolean;
  analyzing: boolean;
  onUrlChange: (url: string) => void;
  onSubmit: () => void;
}

export function UrlInputSection({
  url,
  urlValid,
  loading,
  analyzing,
  onUrlChange,
  onSubmit
}: UrlInputSectionProps) {
  return (
    <div className="animate-panel-in">
      <div className="w-full">
        <div className="bg-white rounded-lg border p-4">
          <div className="relative">
            <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className={`w-full pl-12 pr-16 h-12 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${urlValid === false
                  ? 'border-red-300 focus:ring-red-500 focus:border-transparent'
                  : urlValid === true
                    ? 'border-emerald-300 focus:ring-emerald-500 focus:border-transparent'
                    : 'border-gray-200 focus:ring-emerald-500 focus:border-transparent'
                }`}
              placeholder="Enter your website URL (e.g., example.com)"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading && !analyzing && url) {
                  onSubmit();
                }
              }}
              onFocus={(e) => {
                if (!url) {
                  e.target.placeholder = "example.com";
                }
              }}
              onBlur={(e) => {
                e.target.placeholder = "Enter your website URL (e.g., example.com)";
              }}
              disabled={loading || analyzing}
            />

            {/* Arrow button inside input */}
            <button
              onClick={onSubmit}
              disabled={loading || analyzing || !url || urlValid === false}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white"
              aria-label="Analyze website"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}