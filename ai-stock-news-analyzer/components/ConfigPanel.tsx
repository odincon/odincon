
import React, { useState } from 'react';
import type { AnalysisConfig } from '../types';
import { Button } from './Button';
import { InputField, TextAreaField, NumberField } from './FormControls';

interface ConfigPanelProps {
  onAnalyze: (config: AnalysisConfig) => void;
  initialConfig: AnalysisConfig;
  isLoading: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onAnalyze, initialConfig, isLoading }) => {
  const [config, setConfig] = useState<AnalysisConfig>(initialConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setConfig(prevConfig => ({
      ...prevConfig,
      [name]: name === 'newsQuantity' || name === 'historyDays' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(config);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 shadow-2xl rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-primary-400 border-b border-gray-700 pb-3 mb-6">Configuration & News Input</h2>
      
      <InputField
        label="RSS Feed URL"
        name="rssFeedUrl"
        type="text"
        value={config.rssFeedUrl}
        onChange={handleChange}
        placeholder="e.g., http://feeds.reuters.com/reuters/businessNews"
        helpText="News will be fetched from this URL."
      />

      <TextAreaField
        label="News Text to Analyze (Optional)"
        name="newsText"
        value={config.newsText}
        onChange={handleChange}
        placeholder="Optionally paste additional news text here. If RSS feed is used, this will be combined or used as fallback."
        rows={6} 
      />

      <InputField
        label="Watchlist (comma-separated tickers)"
        name="watchlist"
        type="text"
        value={config.watchlist}
        onChange={handleChange}
        placeholder="e.g., AAPL, MSFT, TSLA"
        required
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberField
          label="News Items from RSS"
          name="newsQuantity"
          value={config.newsQuantity}
          onChange={handleChange}
          min={1}
          helpText="Max articles to fetch from RSS."
        />
        <NumberField
          label="History Days Context"
          name="historyDays"
          value={config.historyDays}
          onChange={handleChange}
          min={1}
          helpText="For AI's trend context."
        />
      </div>
      
      <InputField
        label="PushDeer Key (for your reference)"
        name="pushDeerKey"
        type="text"
        value={config.pushDeerKey}
        onChange={handleChange}
        placeholder="Your PushDeer Key (optional)"
      />

      <Button type="submit" disabled={isLoading} className="w-full text-lg">
        {isLoading ? 'Analyzing...' : 'Analyze with AI'}
      </Button>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Note: Each analysis consumes your Google Gemini API quota.
      </p>
    </form>
  );
};
