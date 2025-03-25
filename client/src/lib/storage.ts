// Local storage key for favorites
const FAVORITES_STORAGE_KEY = 'waffle-goblin-favorites';

/**
 * Save a lifehack ID to favorites
 */
export function saveFavorite(lifehackId: number): void {
  const favorites = getFavorites();
  
  if (!favorites.includes(lifehackId)) {
    favorites.push(lifehackId);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }
}

/**
 * Remove a lifehack ID from favorites
 */
export function removeFavorite(lifehackId: number): void {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(id => id !== lifehackId);
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updatedFavorites));
}

/**
 * Check if a lifehack ID is in favorites
 */
export function isFavorited(lifehackId: number): boolean {
  const favorites = getFavorites();
  return favorites.includes(lifehackId);
}

/**
 * Get all favorite lifehack IDs
 */
export function getFavorites(): number[] {
  const favoritesJson = localStorage.getItem(FAVORITES_STORAGE_KEY);
  
  if (!favoritesJson) {
    return [];
  }
  
  try {
    const favorites = JSON.parse(favoritesJson);
    if (Array.isArray(favorites)) {
      return favorites;
    }
  } catch (error) {
    console.error('Error parsing favorites from localStorage:', error);
  }
  
  return [];
}
