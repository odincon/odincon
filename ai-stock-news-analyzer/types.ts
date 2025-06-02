
export interface AnalysisConfig {
  rssFeedUrl: string;
  watchlist: string; // Comma-separated stock tickers
  pushDeerKey: string;
  newsQuantity: number;
  historyDays: number;
  newsText: string;
}

export interface IdentifiedStock {
  ticker: string;
  relevanceExplanation: string;
  supportingSnippet: string;
  hypotheticalPrice: string;
  hypotheticalTrend: string;
}

export interface OtherRelevantStock {
  ticker: string;
  reason: string;
}

export interface StockAnalysisReport {
  analysisDate: string;
  identifiedStocks: IdentifiedStock[];
  otherRelevantStocks: OtherRelevantStock[];
  notificationDraft: string;
  rawNewsInput?: string; // Optional: store the news text that was analyzed
  watchlistUsed?: string[]; // Optional: store the watchlist used
}

// Gemini API related types, if specific structures are expected from its raw response
// For now, we assume the service layer transforms it into StockAnalysisReport
