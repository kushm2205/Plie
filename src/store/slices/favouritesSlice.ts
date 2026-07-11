import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState } from '../index';

const FAVOURITES_KEY = 'favouriteEventIds';

export type EventId = number | string;

export interface FavouritesState {
  ids: EventId[];
  isLoading: boolean;
}

const initialState: FavouritesState = {
  ids: [],
  isLoading: true,
};

/** Loads the persisted favourite event ids. Dispatch once on app start. */
export const loadFavourites = createAsyncThunk('favourites/load', async () => {
  const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
  return stored ? (JSON.parse(stored) as EventId[]) : [];
});

/** Adds/removes an event id from favourites and persists the new list. */
export const toggleFavourite = createAsyncThunk(
  'favourites/toggle',
  async (eventId: EventId, { getState }) => {
    const { favourites } = getState() as RootState;
    const next = favourites.ids.includes(eventId)
      ? favourites.ids.filter((id) => id !== eventId)
      : [...favourites.ids, eventId];

    await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(next));
    return next;
  }
);

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadFavourites.fulfilled, (state, action) => {
        state.ids = action.payload;
        state.isLoading = false;
      })
      .addCase(loadFavourites.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(toggleFavourite.fulfilled, (state, action) => {
        state.ids = action.payload;
      });
  },
});

export default favouritesSlice.reducer;

// Convenience selectors
export const selectFavouriteIds = (state: RootState) => state.favourites.ids;
export const selectIsFavourite = (eventId: EventId) => (state: RootState) =>
  state.favourites.ids.includes(eventId);
