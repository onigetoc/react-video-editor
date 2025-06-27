import { useState, useCallback } from 'react';

// Types pour l'API Pexels
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    fps?: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos?: PexelsPhoto[];
  videos?: PexelsVideo[];
  next_page?: string | number;
  prev_page?: string | number;
}

export type PexelsMediaType = 'photos' | 'videos';

interface UsePexelsSearchOptions {
  query: string;
  type: PexelsMediaType;
  perPage?: number;
  page?: number;
}

interface UsePexelsSearchResult {
  data: PexelsSearchResponse | null;
  allPexelsItems: (PexelsPhoto | PexelsVideo)[];
  loading: boolean;
  error: string | null;
  search: (options: UsePexelsSearchOptions, append?: boolean) => Promise<void>;
  currentPage: number;
  totalResults: number;
}

// Utilitaire pour générer les URLs de thumbnails personnalisées
export const getPexelsThumbnailUrl = (photo: PexelsPhoto, format: '16:9' | '9:16' = '16:9'): string => {
  // Utiliser les URLs fournies par l'API Pexels au lieu de construire une URL personnalisée
  if (format === '16:9') {
    return photo.src.landscape || photo.src.medium;
  } else {
    return photo.src.portrait || photo.src.medium;
  }
};

// Utilitaire pour obtenir l'URL full HD selon le format
export const getFullHDUrl = (item: PexelsPhoto | PexelsVideo, format: '16:9' | '9:16' = '16:9'): string => {
  if ('src' in item) {
    // Photo
    return format === '16:9' ? item.src.landscape : item.src.portrait;
  } else {
    // Video - utiliser l'image de prévisualisation
    return item.image;
  }
};

// Fonction pour faire les appels API directement avec fetch
const searchWithFetch = async (options: UsePexelsSearchOptions): Promise<PexelsSearchResponse> => {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  
  if (!apiKey) {
    throw new Error('Pexels API key missing. Check your .env file');
  }

  const { query, type, perPage = 15, page = 1 } = options;
  
  // URLs selon le type de recherche
  const baseUrl = type === 'photos' 
    ? 'https://api.pexels.com/v1/search'
    : 'https://api.pexels.com/videos/search';
  
  const url = new URL(baseUrl);
  url.searchParams.append('query', query);
  url.searchParams.append('per_page', perPage.toString());
  url.searchParams.append('page', page.toString());

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pexels API Error (${response.status}): ${errorText}`);
  }

  return response.json();
};

// Fonction pour tester le package pexels
const searchWithPackage = async (options: UsePexelsSearchOptions): Promise<PexelsSearchResponse> => {
  try {
    // Tentative d'import dynamique du package pexels
    const { createClient } = await import('pexels');
    const client = createClient(import.meta.env.VITE_PEXELS_API_KEY);
    
    const { query, type, perPage = 15, page = 1 } = options;
    
    let result;
    if (type === 'photos') {
      result = await client.photos.search({ query, per_page: perPage, page });
    } else {
      result = await client.videos.search({ query, per_page: perPage, page });
    }

    // Vérifier si le résultat est une erreur
    if ('error' in result) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.warn('Pexels package not available, falling back to fetch:', error);
    // Fallback vers fetch
    return searchWithFetch(options);
  }
};

export const usePexelsSearch = (): UsePexelsSearchResult => {
  const [data, setData] = useState<PexelsSearchResponse | null>(null);
  const [allPexelsItems, setAllPexelsItems] = useState<(PexelsPhoto | PexelsVideo)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const search = useCallback(async (options: UsePexelsSearchOptions, append: boolean = false) => {
    if (!options.query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Pexels Search: "${options.query}" (Type: ${options.type}, Page: ${options.page || 1})`);
      
      const result = await searchWithPackage(options);
      
      console.log(`✅ Results found:`, result);
      setData(result);
      setCurrentPage(result.page);
      setTotalResults(result.total_results);

      if (append) {
        setAllPexelsItems(prevItems => {
          const newItems = options.type === 'photos' ? result.photos || [] : result.videos || [];
          return [...prevItems, ...newItems];
        });
      } else {
        setAllPexelsItems(options.type === 'photos' ? result.photos || [] : result.videos || []);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Pexels search error';
      console.error('❌ Pexels search error:', errorMessage);
      setError(errorMessage);
      setData(null);
      if (!append) { // Clear items only if it's a new search, not an append failure
        setAllPexelsItems([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    allPexelsItems,
    loading,
    error,
    search,
    currentPage,
    totalResults,
  };
};