
import React, { useState, useCallback } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { AnalysisResultDisplay } from './components/AnalysisResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { analyzeStockNewsWithGemini } from './services/geminiService';
import { fetchAndParseRss } from './services/rssService';
import type { AnalysisConfig, StockAnalysisReport } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<StockAnalysisReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const initialConfig: AnalysisConfig = {
    rssFeedUrl: 'http://feeds.reuters.com/reuters/businessNews',
    watchlist: 'AAPL, MSFT, GOOG, TSLA',
    pushDeerKey: '',
    newsQuantity: 5,
    historyDays: 7,
    newsText: '', // Initially empty, RSS or manual input will fill this.
  };

  const handleAnalyze = useCallback(async (config: AnalysisConfig) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let newsToAnalyze = config.newsText.trim();
      let RssFetchMessage = ""; // To inform user about RSS status

      if (config.rssFeedUrl) {
        const fetchedNews = await fetchAndParseRss(config.rssFeedUrl, config.newsQuantity);
        if (fetchedNews) {
          RssFetchMessage = `Successfully fetched news from ${config.rssFeedUrl}.\n\n`;
          if (newsToAnalyze) {
            newsToAnalyze = `Manually Entered News:\n${newsToAnalyze}\n\nNews from RSS Feed (${config.rssFeedUrl}):\n${fetchedNews}`;
          } else {
            newsToAnalyze = `News from RSS Feed (${config.rssFeedUrl}):\n${fetchedNews}`;
          }
        } else {
            RssFetchMessage = `Could not fetch news from RSS feed: ${config.rssFeedUrl}. `;
            if (!newsToAnalyze) {
                 setError(RssFetchMessage + "Please provide news text manually or ensure the RSS feed is valid and accessible.");
                 setIsLoading(false);
                 return;
            }
             RssFetchMessage += "Using manually entered news.\n\n"; // Inform that manual news is being used.
        }
      }


      if (!newsToAnalyze) {
        setError("No news content available. Please provide news text manually or a valid RSS feed URL.");
        setIsLoading(false);
        return;
      }
      
      // Prepend RSS fetch status message to the raw input if it exists, so it's part of the report.
      const newsInputForReport = RssFetchMessage + newsToAnalyze;


      const analysisConfigForGemini: AnalysisConfig = {
        ...config,
        newsText: newsToAnalyze, 
      };

      const result = await analyzeStockNewsWithGemini(analysisConfigForGemini);
      // Store the potentially combined input (with RSS status) in the report
      setAnalysisResult({ ...result, rawNewsInput: newsInputForReport });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during analysis.');
      }
      console.error("Analysis failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <ConfigPanel onAnalyze={handleAnalyze} initialConfig={initialConfig} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {analysisResult && !isLoading && <AnalysisResultDisplay report={analysisResult} />}
            {!isLoading && !error && !analysisResult && (
              <div className="bg-gray-800 shadow-xl rounded-lg p-6 text-center">
                <h2 className="text-2xl font-semibold text-primary-400 mb-4">Welcome to AI Stock News Analyzer</h2>
                <p className="text-gray-300 mb-2">
                  Configure your RSS feed and watchlist on the left. The app will fetch news from the RSS URL.
                </p>
                <p className="text-gray-300">
                  You can also paste news directly into the text area to supplement or override the RSS feed. Click "Analyze with AI" to get insights.
                </p>
                <img src="https://picsum.photos/seed/finance/600/300" alt="Financial Technology" className="mt-6 rounded-lg mx-auto shadow-lg" />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
