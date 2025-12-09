import { useEffect, useState } from 'react';
import { preloadImage } from '@/utils/imageCache';

/**
 * Hook to cache a single image
 * Returns cached image URL or original if caching fails
 */
export function useCachedImage(imageUrl: string) {
  const [cachedUrl, setCachedUrl] = useState<string>(imageUrl);

  useEffect(() => {
    if (!imageUrl) {
      setCachedUrl('');
      return;
    }

    preloadImage(imageUrl)
      .then((url) => {
        setCachedUrl(url);
      })
      .catch(() => {
        setCachedUrl(imageUrl);
      });
  }, [imageUrl]);

  return cachedUrl;
}

/**
 * Hook to cache multiple images in parallel
 * Returns object mapping original URLs to cached URLs
 */
export function useCachedImages(imageUrls: string[]) {
  const [cachedUrls, setCachedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setCachedUrls({});
      return;
    }

    // Cache all images in parallel
    Promise.all(imageUrls.map((url) => preloadImage(url)))
      .then((results) => {
        const urlMap: Record<string, string> = {};
        imageUrls.forEach((url, index) => {
          urlMap[url] = results[index];
        });
        setCachedUrls(urlMap);
      })
      .catch(() => {
        // Fallback: use original URLs
        const urlMap: Record<string, string> = {};
        imageUrls.forEach((url) => {
          urlMap[url] = url;
        });
        setCachedUrls(urlMap);
      });
  }, [imageUrls]);

  return cachedUrls;
}
