/**
 * Lightweight, polite HTTP crawler for extracting public contact metadata from official business websites.
 * Designed with strict timeouts and non-blocking safety.
 */

export interface CrawlResult {
  html: string;
  links: Array<{ href: string; text?: string }>;
  finalUrl: string;
}

/**
 * Fetches public HTML content from a given business URL within a strict timeout.
 */
export async function fetchPublicWebsite(
  rawUrl: string, 
  timeoutMs = 3500
): Promise<CrawlResult | null> {
  if (!rawUrl || typeof rawUrl !== "string") return null;

  let urlStr = rawUrl.trim();
  if (!urlStr.startsWith("http://") && !urlStr.startsWith("https://")) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(urlStr, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebHunt-LeadEnrichment/2.0; +https://webhunt.app)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html") && !contentType.toLowerCase().includes("xhtml")) {
      return null;
    }

    // Read response text (cap at 600KB for speed and memory efficiency)
    const text = await response.text();
    const cappedHtml = text.slice(0, 600000);

    // Extract all <a href="..."> links
    const links: Array<{ href: string; text?: string }> = [];
    const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match;

    while ((match = linkRegex.exec(cappedHtml)) !== null) {
      const href = match[1].trim();
      const rawText = match[2].replace(/<[^>]+>/g, "").trim();
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) {
        links.push({ href, text: rawText });
      }
    }

    return {
      html: cappedHtml,
      links,
      finalUrl: response.url || urlStr,
    };
  } catch (error) {
    // Network errors, timeouts, or DNS failures are non-fatal
    return null;
  }
}
