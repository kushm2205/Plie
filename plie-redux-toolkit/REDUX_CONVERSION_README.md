# Redux Toolkit conversion — what changed & how to wire it up

## 1. Install the new dependencies

```bash
npm install @reduxjs/toolkit react-redux
```

(`@react-native-async-storage/async-storage` and `axios` you already have.)

## 2. New files added

```
src/store/index.ts                  -> configureStore() + RootState/AppDispatch types
src/store/hooks.ts                  -> useAppDispatch / useAppSelector (typed)
src/store/slices/authSlice.ts       -> replaces src/context/AuthContext.tsx
src/store/slices/favouritesSlice.ts -> replaces src/hooks/useFavourites.ts
src/store/slices/eventsSlice.ts     -> new: centralizes the event listing/cache/search
                                        state that used to live separately in
                                        EventListingScreen, FavouriteScreen and
                                        SearchEventScreen
App.tsx                             -> root component wrapping everything in <Provider store={store}>
```

## 3. Files removed

```
src/context/AuthContext.tsx
src/hooks/useFavourites.ts
```

Their logic (AsyncStorage read/writes, login/logout, favourite persistence) was ported
1:1 into the slices above — no behavior was intentionally changed, just where the
state lives.

## 4. Files updated to read from Redux instead of Context/local state

- `src/navigation/AppNavigator.tsx` — dispatches `restoreSession()` and `loadFavourites()`
  once on mount, reads `token/isGuest/isLoading` from `state.auth`.
- `src/screens/LoginScreen.tsx` — dispatches `login()` / `continueAsGuest()`.
- `src/screens/ProfileScreen.tsx` — reads `state.auth.user`, dispatches `logout()`.
- `src/screens/EventListingScreen.tsx` — reads `state.events` / `state.favourites`,
  dispatches `fetchEvents()` / `toggleFavourite()`.
- `src/screens/FavouriteScreen.tsx` — same events/favourites slices (no more separate
  API call — it reuses the shared `state.events.events` list and filters by favourite id).
- `src/screens/SearchEventScreen.tsx` — dispatches `searchEvents()` / `clearSearchResults()`.
- `src/screens/EventDetailsScreen.tsx` — reads/toggles favourite from the favourites slice.
- `src/types/index.ts` — removed the now-unused `AuthContextValue` type.

## 5. Drop `App.tsx` at your project root

If your RN CLI project already has an `App.tsx`, replace its contents with the one
included here (or just add the `<Provider store={store}>` wrapper around your
existing `<AppNavigator />`).

## 6. What's still on you

- The Figma screens (Splash, Login, Event Listing, Search, Event Details, Favourites,
  Profile) were already built in the file you uploaded — I didn't touch their JSX/UI,
  only how they read state.
- The Postman collection's login (`/login`) and events-listing (`/events-listing`)
  endpoints are already wired in `src/api/authService.ts` / `src/api/eventService.ts`
  — untouched, since your task only asked to move *favourites* (and the surrounding
  state) into Redux.
- Double check `BASE_URL` in `src/api/apiClient.ts` still matches the Postman
  environment you were given, in case it differs from what's currently hardcoded.
