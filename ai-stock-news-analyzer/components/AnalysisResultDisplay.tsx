
import React from 'react';
import type { StockAnalysisReport, IdentifiedStock, OtherRelevantStock } from '../types';
import { StockCard } from './StockCard';
import { InfoIcon, AlertTriangleIcon, MessageSquareIcon, ListIcon, FileTextIcon, CalendarIcon } from './icons';


const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-gray-800 shadow-lg rounded-lg p-6">
    <h3 className="text-xl font-semibold text-primary-400 mb-4 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    {children}
  </div>
);

export const AnalysisResultDisplay: React.FC<{ report: StockAnalysisReport }> = ({ report }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-800 shadow-xl rounded-lg p-6">
        <h2 className="text-3xl font-bold text-primary-300 mb-2">AI Analysis Report</h2>
        <p className="text-gray-400 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary-400"/>
            Analysis Date: {report.analysisDate}
        </p>
      </div>

      {report.rawNewsInput && (
        <Section title="Original News Input Snippet" icon={<FileTextIcon className="w-5 h-5 text-primary-400"/>}>
          <p className="text-gray-300 text-sm max-h-32 overflow-y-auto bg-gray-700 p-3 rounded-md">
            {report.rawNewsInput.length > 300 ? report.rawNewsInput.substring(0, 300) + "..." : report.rawNewsInput}
          </p>
        </Section>
      )}
      
      {report.watchlistUsed && report.watchlistUsed.length > 0 && (
         <Section title="Watchlist Used for Analysis" icon={<ListIcon className="w-5 h-5 text-primary-400"/>}>
          <div className="flex flex-wrap gap-2">
            {report.watchlistUsed.map(ticker => (
              <span key={ticker} className="bg-primary-700 text-primary-100 px-3 py-1 rounded-full text-sm shadow">
                {ticker}
              </span>
            ))}
          </div>
        </Section>
      )}


      <Section title="Identified Stocks from Watchlist" icon={<InfoIcon className="w-5 h-5 text-primary-400"/>}>
        {report.identifiedStocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.identifiedStocks.map((stock, index) => (
              <StockCard key={index} stock={stock} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No relevant stocks identified from your watchlist in the provided news.</p>
        )}
      </Section>

      {report.otherRelevantStocks.length > 0 && (
        <Section title="Other Potentially Relevant Stocks" icon={<AlertTriangleIcon className="w-5 h-5 text-yellow-400"/>}>
          <ul className="space-y-3">
            {report.otherRelevantStocks.map((stock, index) => (
              <li key={index} className="bg-gray-700 p-4 rounded-md shadow">
                <p className="text-lg font-semibold text-yellow-300">{stock.ticker}</p>
                <p className="text-gray-300 text-sm">{stock.reason}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Generated Notification Draft" icon={<MessageSquareIcon className="w-5 h-5 text-primary-400"/>}>
        <div className="bg-gray-700 p-4 rounded-md shadow">
          <p className="text-gray-200 whitespace-pre-wrap">{report.notificationDraft}</p>
        </div>
      </Section>
    </div>
  );
};
