import { useState, useCallback } from 'react';

// Types pour l'API Pexels
export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number | string;
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
  next_page?: string;
  prev_page?: string;
}

export type PexelsMediaType = 'photos' | 'videos';

interface UsePexelsSearchOptions {
  query: string;
  type: PexelsMediaType;
  perPage?: number;
  page?: number; // Ajout du paramètre de page
}

interface UsePexelsSearchResult {
  data: PexelsSearchResponse | null;
  loading: boolean;
  error: string | null;
  search: (options: UsePexelsSearchOptions, append?: boolean) => Promise<void>; // Ajout du paramètre append
  loadNextPage: () => Promise<void>; // Nouvelle fonction pour charger la page suivante
  currentPage: number; // Ajout de l'état de la page actuelle
  hasMore: boolean; // Indique s'il y a plus de pages à charger
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
    throw new Error('Clé API Pexels manquante. Vérifiez votre fichier .env');
  }

  const { query, type, perPage = 15, page = 1 } = options; // Utilisation du paramètre page
  
  // URLs selon le type de recherche
  const baseUrl = type === 'photos'
    ? 'https://api.pexels.com/v1/search'
    : 'https://api.pexels.com/videos/search';
  
  const url = new URL(baseUrl);
  url.searchParams.append('query', query);
  url.searchParams.append('per_page', perPage.toString());
  url.searchParams.append('page', page.toString()); // Ajout du paramètre de page

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur API Pexels (${response.status}): ${errorText}`);
  }

  return response.json();
};

// Fonction pour tester le package pexels
const searchWithPackage = async (options: UsePexelsSearchOptions): Promise<PexelsSearchResponse> => {
  try {
    // Tentative d'import dynamique du package pexels
    const { createClient } = await import('pexels');
    const client = createClient(import.meta.env.VITE_PEXELS_API_KEY);
    
    const { query, type, perPage = 15, page = 1 } = options; // Utilisation du paramètre page
    
    if (type === 'photos') {
      return await client.photos.search({ query, per_page: perPage, page: page }); // Ajout du paramètre page
    } else {
      return await client.videos.search({ query, per_page: perPage, page: page }); // Ajout du paramètre page
    }
  } catch (error) {
    console.warn('Package pexels non disponible, utilisation de fetch:', error);
    // Fallback vers fetch
    return searchWithFetch(options);
  }
};

export const usePexelsSearch = (): UsePexelsSearchResult => {
  const [data, setData] = useState<PexelsSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Nouvel état pour la page actuelle
  const [currentQuery, setCurrentQuery] = useState(''); // Pour suivre la dernière requête
  const [currentType, setCurrentType] = useState<PexelsMediaType>('photos'); // Pour suivre le dernier type
  const [hasMore, setHasMore] = useState(true); // Pour savoir s'il y a plus de résultats

  const search = useCallback(async (options: UsePexelsSearchOptions, append: boolean = false) => {
    if (!options.query.trim()) {
      setError('Veuillez saisir un terme de recherche');
      return;
    }

    setLoading(true);
    setError(null);

    // Si ce n'est pas un append, réinitialiser la page et les données
    if (!append) {
      setCurrentPage(1);
      setData(null);
      setHasMore(true);
    }

    setCurrentQuery(options.query);
    setCurrentType(options.type);

    try {
      const pageToFetch = append ? currentPage + 1 : 1;
      console.log(`🔍 Recherche Pexels: "${options.query}" (${options.type}), Page: ${pageToFetch}`);
      
      const result = await searchWithPackage({ ...options, page: pageToFetch });
      
      console.log(`✅ Résultats trouvés (Page ${pageToFetch}):`, result);

      setData(prevData => {
        if (append && prevData) {
          const newPhotos = result.photos ? [...(prevData.photos || []), ...result.photos] : prevData.photos;
          const newVideos = result.videos ? [...(prevData.videos || []), ...result.videos] : prevData.videos;
          return {
            ...result,
            photos: newPhotos,
            videos: newVideos,
          };
        }
        return result;
      });

      setCurrentPage(result.page);
      setHasMore(!!result.next_page); // next_page indique s'il y a plus de résultats

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de recherche Pexels';
      console.error('❌ Erreur recherche Pexels:', errorMessage);
      setError(errorMessage);
      if (!append) { // Seulement effacer les données si c'est une nouvelle recherche qui échoue
        setData(null);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage]); // Dépendance à currentPage pour la fonction loadNextPage

  const loadNextPage = useCallback(async () => {
    if (loading || !hasMore || !currentQuery) {
      console.log('⏩ Impossible de charger la page suivante: chargement en cours, pas plus de résultats, ou pas de requête.');
      return;
    }
    console.log(`🔄 Chargement de la page suivante pour "${currentQuery}" (${currentType}). Page actuelle: ${currentPage}`);
    await search({ query: currentQuery, type: currentType, perPage: data?.per_page || 20 }, true);
  }, [loading, hasMore, currentQuery, currentType, currentPage, data, search]);

  return {
    data,
    loading,
    error,
    search,
    loadNextPage,
    currentPage,
    hasMore,
  };
};