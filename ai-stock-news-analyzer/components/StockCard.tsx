
import React from 'react';
import type { IdentifiedStock } from '../types';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon, TagIcon, InfoIcon, BookOpenIcon, DollarSignIcon, ActivityIcon } from './icons'; // Assuming you have these icons

const getTrendIcon = (trend: string) => {
  const lowerTrend = trend.toLowerCase();
  if (lowerTrend.includes('up') || lowerTrend.includes('rise') || lowerTrend.includes('recover')) {
    return <TrendingUpIcon className="w-5 h-5 text-green-400" />;
  }
  if (lowerTrend.includes('down') || lowerTrend.includes('dip') || lowerTrend.includes('drop')) {
    return <TrendingDownIcon className="w-5 h-5 text-red-400" />;
  }
  return <MinusIcon className="w-5 h-5 text-gray-400" />;
};

export const StockCard: React.FC<{ stock: IdentifiedStock }> = ({ stock }) => {
  return (
    <div className="bg-gray-700 shadow-lg rounded-lg p-5 transition-all hover:shadow-primary-500/30 hover:scale-[1.02]">
      <div className="flex items-center mb-3">
        <TagIcon className="w-7 h-7 text-primary-400 mr-3"/>
        <h4 className="text-2xl font-bold text-primary-300">{stock.ticker}</h4>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex items-start">
          <DollarSignIcon className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0"/>
          <p><span className="font-semibold text-gray-300">Price (Hypothetical):</span> <span className="text-primary-400 font-bold">{stock.hypotheticalPrice}</span></p>
        </div>
        <div className="flex items-start">
          <ActivityIcon className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0"/>
          <p className="flex items-center"><span className="font-semibold text-gray-300">Trend (Hypothetical):</span> <span className="ml-2">{getTrendIcon(stock.hypotheticalTrend)}</span> <span className="ml-1 text-gray-200">{stock.hypotheticalTrend}</span></p>
        </div>
        <div className="flex items-start">
          <InfoIcon className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0"/>
          <p><span className="font-semibold text-gray-300">Relevance:</span> <span className="text-gray-200">{stock.relevanceExplanation}</span></p>
        </div>
        <div className="flex items-start">
          <BookOpenIcon className="w-5 h-5 text-gray-400 mr-2 mt-1 flex-shrink-0"/>
          <p><span className="font-semibold text-gray-300">Supporting Snippet:</span> <em className="text-gray-300 bg-gray-600 px-2 py-1 rounded text-xs">"{stock.supportingSnippet}"</em></p>
        </div>
      </div>
    </div>
  );
};
