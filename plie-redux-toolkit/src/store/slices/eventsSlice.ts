import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEventsListing } from '../../api/eventService';
import { MappedEvent } from '../../types';

const CACHE_KEY = 'cachedEvents';

export interface EventsState {
  events: MappedEvent[];
  loading: boolean;
  refreshing: boolean;
  searchResults: MappedEvent[];
  searchLoading: boolean;
}

const initialState: EventsState = {
  events: [],
  loading: true,
  refreshing: false,
  searchResults: [],
  searchLoading: false,
};

/** Hydrates the list from AsyncStorage immediately, before the network responds. */
export const loadCachedEvents = createAsyncThunk('events/loadCached', async () => {
  const cached = await AsyncStorage.getItem(CACHE_KEY);
  return cached ? (JSON.parse(cached) as MappedEvent[]) : null;
});

/** Fetches the live event listing and refreshes the cache; falls back to cache on failure. */
export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (_: void | undefined, { rejectWithValue }) => {
    try {
      const list = await getEventsListing();
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list));
      return list;
    } catch (error) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) return JSON.parse(cached) as MappedEvent[];
      return rejectWithValue('Unable to load events');
    }
  }
);

export const searchEvents = createAsyncThunk('events/search', async (query: string) => {
  if (!query) return [];
  return getEventsListing({ search: query });
});

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setRefreshing(state, action: { payload: boolean }) {
      state.refreshing = action.payload;
    },
    clearSearchResults(state) {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCachedEvents.fulfilled, (state, action) => {
        if (action.payload) state.events = action.payload;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
        state.refreshing = false;
      })
      .addCase(fetchEvents.rejected, (state) => {
        state.loading = false;
        state.refreshing = false;
      })
      .addCase(searchEvents.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchEvents.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.searchLoading = false;
      })
      .addCase(searchEvents.rejected, (state) => {
        state.searchLoading = false;
      });
  },
});

export const { setRefreshing, clearSearchResults } = eventsSlice.actions;
export default eventsSlice.reducer;
