/**
 * Image Cache Utility - For caching Cloudinary images from Firestore
 * Stores images in sessionStorage to avoid repeated fetches while browsing
 * Data persists during the session but clears on page close
 */

const CACHE_PREFIX = 'austrc_img_';

/**
 * Get cached image URL
 */
export function getCachedImage(url: string): string | null {
  if (!url) return null;
  
  try {
    const cached = sessionStorage.getItem(CACHE_PREFIX + url);
    return cached || null;
  } catch (error) {
    console.warn('Error accessing cache:', error);
    return null;
  }
}

/**
 * Cache an image URL
 */
export function setCachedImage(url: string, cachedUrl: string): void {
  if (!url) return;
  
  try {
    sessionStorage.setItem(CACHE_PREFIX + url, cachedUrl);
  } catch (error) {
    console.warn('Error caching image:', error);
  }
}

/**
 * Preload image and return data URL
 */
export async function preloadImage(url: string): Promise<string> {
  if (!url) return url;
  
  // Check cache first
  const cached = getCachedImage(url);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return url; // Return original URL if fetch fails
    }
    
    const blob = await response.blob();
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setCachedImage(url, dataUrl); // Cache it
        resolve(dataUrl);
      };
      reader.onerror = () => {
        resolve(url); // Fallback to original URL
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Error preloading image:', error);
    return url;
  }
}

/**
 * Clear all cached images
 */
export function clearImageCache(): void {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
}
