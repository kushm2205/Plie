import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

// Place this file at the project root (it replaces the old App.tsx that
// wrapped everything in <AuthProvider>). The Redux store now owns auth,
// favourites, and event-listing state, so AppNavigator just reads from it.
export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
