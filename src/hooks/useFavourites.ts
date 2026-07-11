import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = 'favouriteEventIds';

export type EventId = number | string;

export interface UseFavouritesResult {
  favouriteIds: EventId[];
  isFavourite: (eventId: EventId) => boolean;
  toggleFavourite: (eventId: EventId) => Promise<void>;
  isLoading: boolean;
}

export function useFavourites(): UseFavouritesResult {
  const [favouriteIds, setFavouriteIds] = useState<EventId[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
        if (stored) setFavouriteIds(JSON.parse(stored));
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const toggleFavourite = useCallback(async (eventId: EventId) => {
    setFavouriteIds((prev) => {
      const next = prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId];
      AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (eventId: EventId) => favouriteIds.includes(eventId),
    [favouriteIds]
  );

  return { favouriteIds, isFavourite, toggleFavourite, isLoading };
}
