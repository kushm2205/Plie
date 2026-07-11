import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchEvents } from '../store/slices/eventsSlice';
import { toggleFavourite } from '../store/slices/favouritesSlice';
import EventCard from '../components/EventCard';
import { MainTabParamList, RootStackParamList } from '../types';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

type FavouriteScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Favourites'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function FavouriteScreen({ navigation }: FavouriteScreenProps) {
  const dispatch = useAppDispatch();
  const { ids: favouriteIds, isLoading } = useAppSelector((state) => state.favourites);
  const { events: allEvents, loading } = useAppSelector((state) => state.events);

  useEffect(() => {
    // The Events tab already dispatches this on mount, but this screen can
    // also be opened first, so make sure the shared list gets populated.
    if (allEvents.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, allEvents.length]);

  const favouriteEvents = allEvents.filter((e) => favouriteIds.includes(e.id));

  if (loading || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Plié</Text>
      <Text style={styles.heading}>Your Favorite Events!</Text>
      <Text style={styles.sub}>Find your favourite events here</Text>

      <FlatList
        data={favouriteEvents}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={{ paddingTop: scaleHeight(8), paddingBottom: scaleHeight(24) }}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavourite={favouriteIds.includes(item.id)}
            onToggleFavourite={() => dispatch(toggleFavourite(item.id))}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No favourites yet — tap ♡ on an event</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: scaleFont(20), fontWeight: '700', textAlign: 'center', paddingTop: scaleHeight(12) },
  heading: { fontSize: scaleFont(20), fontWeight: '700', paddingHorizontal: scaleWidth(16), marginTop: scaleHeight(8) },
  sub: { fontSize: scaleFont(13), color: '#777', paddingHorizontal: scaleWidth(16), marginTop: scaleHeight(4), marginBottom: scaleHeight(12) },
  empty: { textAlign: 'center', marginTop: scaleHeight(40), color: '#999', paddingHorizontal: scaleWidth(24) },
});
