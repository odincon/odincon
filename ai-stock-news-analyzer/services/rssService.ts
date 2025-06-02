
// services/rssService.ts

/**
 * Fetches and parses an RSS feed.
 * @param rssUrl The URL of the RSS feed.
 * @param newsQuantity The maximum number of news items to retrieve.
 * @returns A string containing formatted news items, or an empty string if fetching/parsing fails.
 */
export async function fetchAndParseRss(rssUrl: string, newsQuantity: number): Promise<string> {
  if (!rssUrl) return "";

  // Using a public CORS proxy. For production, a dedicated backend/proxy is recommended.
  // https://allorigins.so/
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
  
  let xmlText: string | null = null;
  let fetchSource = `RSS feed ${rssUrl} via proxy`;

  try {
    const response = await fetch(proxyUrl, { mode: 'cors' });
    if (!response.ok) {
      console.warn(`Failed to fetch ${fetchSource}: ${response.status} ${response.statusText}`);
      // Try direct fetch as a fallback
      fetchSource = `RSS feed ${rssUrl} directly`;
      console.log(`Attempting direct fetch for ${rssUrl}...`);
      const directResponse = await fetch(rssUrl, { mode: 'cors' });
       if (!directResponse.ok) {
         console.warn(`Direct fetch for ${rssUrl} also failed: ${directResponse.status} ${directResponse.statusText}`);
         return "";
       }
       xmlText = await directResponse.text();
    } else {
        xmlText = await response.text();
    }
  } catch (error) {
    console.error(`Error fetching ${fetchSource}:`, error);
     // Try direct fetch if proxy fetch had a network error etc.
    if (!xmlText) { // Only try direct if proxy attempt failed completely
        fetchSource = `RSS feed ${rssUrl} directly (after initial error)`;
        try {
            console.log(`Attempting direct fetch for ${rssUrl} after earlier error...`);
            const directResponse = await fetch(rssUrl, { mode: 'cors' });
            if (!directResponse.ok) {
                console.warn(`Direct fetch for ${rssUrl} also failed: ${directResponse.status} ${directResponse.statusText}`);
                return "";
            }
            xmlText = await directResponse.text();
        } catch (directError) {
            console.error(`Direct fetch error for ${rssUrl} after initial error:`, directError);
            return "";
        }
    } else {
        return ""; // If proxy fetched but resulted in an error that wasn't !response.ok (unlikely here)
    }
  }

  if (!xmlText) {
      console.warn(`No XML content fetched for ${rssUrl}`);
      return "";
  }

  return parseRssXml(xmlText, newsQuantity, rssUrl);
}

function parseRssXml(xmlText: string, newsQuantity: number, sourceUrl: string): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      console.warn(`Failed to parse XML from ${sourceUrl}. Error:`, parserError.textContent);
      // Sometimes parsererror is present but content is still partially usable,
      // but for robustness, we'll treat it as an error.
      // You might get HTML error pages from proxy/server returned as text/xml.
      return "";
    }

    const items = Array.from(xmlDoc.querySelectorAll("item, entry")); // Common tags for RSS/Atom
    
    if (items.length === 0) {
        console.warn(`No news items ( <item> or <entry> tags) found in RSS feed from ${sourceUrl}.`);
        return "";
    }
    
    let newsContent = "";
    for (let i = 0; i < Math.min(items.length, newsQuantity); i++) {
      const item = items[i];
      const title = item.querySelector("title")?.textContent?.trim() || "No Title";
      
      let description = "";
      const descElement = item.querySelector("description");
      const summaryElement = item.querySelector("summary");
      const contentElement = item.querySelector("content"); // Atom often uses <content>
      // Specific check for <content:encoded> which might be namespaced
      const contentEncodedElements = item.getElementsByTagNameNS("*", "encoded");
      let contentEncodedText = "";
      if (contentEncodedElements && contentEncodedElements.length > 0) {
        contentEncodedText = contentEncodedElements[0].textContent || "";
      }


      if (descElement) description = descElement.textContent || "";
      else if (summaryElement) description = summaryElement.textContent || "";
      else if (contentElement) description = contentElement.textContent || "";
      else if (contentEncodedText) description = contentEncodedText; // Prioritize content:encoded if found and others are empty
      
      // Basic HTML tag stripping and truncation
      const tempDiv = document.createElement("div"); // Use browser's engine to help with entities
      tempDiv.innerHTML = description;
      const plainDescription = (tempDiv.textContent || tempDiv.innerText || "").replace(/\s+/g, ' ').trim().substring(0, 350);
      
      const linkTag = item.querySelector("link");
      let link = "";
      if (linkTag) {
        link = linkTag.getAttribute("href") || linkTag.textContent?.trim() || "";
      }
      if (!link && item.querySelector("guid") && !item.querySelector("guid")?.getAttribute("isPermaLink")?.toLowerCase().includes("false")){
        link = item.querySelector("guid")?.textContent?.trim() || ""; // Use GUID if it's a permalink
      }


      newsContent += `Title: ${title}\nSummary: ${plainDescription}...\nLink: ${link}\n---\n`;
    }
    return newsContent.trim();
  } catch (parseError) {
    console.error(`Error parsing XML content from ${sourceUrl}:`, parseError);
    return "";
  }
}
