import { Series } from '../types';

export interface VectorizeSearchResult {
  id: string;
  score: number;
  metadata: {
    name: string;
    brand: string;
    price_per_box: number;
    remaining_boxes: number;
  };
}

export interface SearchResponse {
  results: VectorizeSearchResult[];
}

/**
 * Semantic search for series using Cloudflare Vectorize
 * This calls the backend API which uses Vectorize for similarity search
 */
export async function searchSeries(query: string, topK = 5): Promise<VectorizeSearchResult[]> {
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Search failed');
    }
    const data: SearchResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.warn('Vectorize search failed:', error);
    return [];
  }
}

/**
 * Trigger reindexing of all series data into Vectorize
 * Admin only endpoint
 */
export async function reindexVectorize(): Promise<boolean> {
  try {
    const response = await fetch('/api/vectorize/reindex', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.ok;
  } catch (error) {
    console.warn('Vectorize reindex failed:', error);
    return false;
  }
}

/**
 * Local fuzzy search fallback when Vectorize is unavailable
 * Uses simple text matching for offline/local development
 */
export function localSearchSeries(query: string, seriesList: Series[], topK = 5): VectorizeSearchResult[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(k => k.length > 1);

  const scored = seriesList.map(series => {
    let score = 0;
    const searchableText = `${series.name} ${series.brand} ${series.description}`.toLowerCase();

    for (const keyword of keywords) {
      if (searchableText.includes(keyword)) {
        score += 1;
        // Bonus for exact matches in name or brand
        if (series.name.toLowerCase().includes(keyword)) score += 2;
        if (series.brand.toLowerCase().includes(keyword)) score += 1.5;
      }
    }

    // Boost series with more remaining stock
    score += (series.remaining_boxes / series.total_boxes) * 0.5;

    return {
      id: series.id,
      score,
      metadata: {
        name: series.name,
        brand: series.brand,
        price_per_box: series.price_per_box,
        remaining_boxes: series.remaining_boxes,
      }
    };
  });

  return scored
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}