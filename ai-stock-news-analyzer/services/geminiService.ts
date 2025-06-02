
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AnalysisConfig, StockAnalysisReport, IdentifiedStock, OtherRelevantStock } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("API_KEY for Gemini is not set in environment variables.");
  // To allow the app to run in environments where API_KEY might not be immediately available (e.g. browser preview)
  // we don't throw an error here, but API calls will fail.
  // throw new Error("API_KEY for Gemini is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });
const model = 'gemini-2.5-flash-preview-04-17';

export async function analyzeStockNewsWithGemini(config: AnalysisConfig): Promise<StockAnalysisReport> {
  if (!API_KEY) {
    return Promise.reject(new Error("Gemini API Key is not configured. Please set the API_KEY environment variable."));
  }
  
  const watchlistArray = config.watchlist.split(',').map(s => s.trim()).filter(s => s);

  const prompt = `
You are an expert AI financial news analyst.
Given the following news text, watchlist, and parameters:
---
News Text:
${config.newsText}
---
Watchlist Stock Tickers: ${watchlistArray.join(', ')}
Approximate Number of News Items Context: ${config.newsQuantity}
Historical Trend Period to Consider (days): ${config.historyDays}
---

Please perform the following tasks and provide the output STRICTLY in the JSON format specified below:
1. Identify which stocks from the watchlist are directly mentioned or strongly implied by the news.
2. For each identified stock, provide:
    a. The stock ticker (string).
    b. A brief explanation of its relevance to the news (string).
    c. A key quote or snippet from the news supporting this (string).
    d. A plausible hypothetical current market price, formatted like "$XXX.XX" (string).
    e. A brief qualitative description of its hypothetical recent price trend (e.g., "steady upward trend", "volatile with downward pressure", "showing signs of recovery", "sideways trading") (string).
3. Suggest up to 2 other stock tickers (not on the watchlist) that might also be relevant due to the news, with brief reasons (string for ticker, string for reason).
4. Generate a concise notification message (suitable for a push alert) summarizing the key findings for the most relevant stock(s) from the watchlist. Include a disclaimer: "AI-generated. For informational purposes only. Not investment advice." (string).
5. Provide the current date for the analysis in "YYYY-MM-DD" format.

JSON Output Structure:
{
  "analysisDate": "YYYY-MM-DD",
  "identifiedStocks": [
    {
      "ticker": "string",
      "relevanceExplanation": "string",
      "supportingSnippet": "string",
      "hypotheticalPrice": "string",
      "hypotheticalTrend": "string"
    }
  ],
  "otherRelevantStocks": [
    {
      "ticker": "string",
      "reason": "string"
    }
  ],
  "notificationDraft": "string"
}

If no stocks from the watchlist are deemed relevant, "identifiedStocks" should be an empty array.
If the news text is too short or irrelevant, reflect this in the notificationDraft.
Ensure all string values are properly escaped for JSON.
Do not include any commentary or text outside of the JSON structure itself.
The entire response must be only the JSON object.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3, // Lower temperature for more factual, less creative responses
      }
    });

    let jsonStr = response.text.trim();
    
    // It's good practice to ensure the response is clean JSON, sometimes models wrap it in markdown
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    const parsedData = JSON.parse(jsonStr) as Partial<StockAnalysisReport>;

    // Basic validation and providing default values for potentially missing fields
    const validatedReport: StockAnalysisReport = {
      analysisDate: parsedData.analysisDate || new Date().toISOString().split('T')[0],
      identifiedStocks: (parsedData.identifiedStocks || []).map(stock => ({
        ticker: stock.ticker || "N/A",
        relevanceExplanation: stock.relevanceExplanation || "No explanation provided.",
        supportingSnippet: stock.supportingSnippet || "No snippet provided.",
        hypotheticalPrice: stock.hypotheticalPrice || "$0.00",
        hypotheticalTrend: stock.hypotheticalTrend || "Trend not analyzed.",
      }) as IdentifiedStock),
      otherRelevantStocks: (parsedData.otherRelevantStocks || []).map(stock => ({
        ticker: stock.ticker || "N/A",
        reason: stock.reason || "No reason provided.",
      }) as OtherRelevantStock),
      notificationDraft: parsedData.notificationDraft || "No notification generated.",
      rawNewsInput: config.newsText,
      watchlistUsed: watchlistArray,
    };
    
    return validatedReport;

  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during AI analysis.";
    // Try to get more details if it's a GoogleGenAI error
    if (error && typeof error === 'object' && 'message' in error) {
         throw new Error(`AI Analysis Error: ${error.message}`);
    }
    throw new Error(`Failed to analyze stock news: ${errorMessage}`);
  }
}
