import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getEventsListing } from '../api/eventService';
import { useAuth } from '../context/AuthContext';
import { useFavourites } from '../hooks/useFavourites';
import EventCard from '../components/EventCard';
import { MainTabParamList, MappedEvent, RootStackParamList } from '../types';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

const CACHE_KEY = 'cachedEvents';

type EventListingScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Events'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function EventListingScreen({ navigation }: EventListingScreenProps) {
  const { user } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const [events, setEvents] = useState<MappedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCachedEvents = async () => {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) setEvents(JSON.parse(cached));
  };

  const fetchEvents = useCallback(async () => {
    try {
      const list = await getEventsListing();
      setEvents(list);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(list));
    } catch (error) {
      await loadCachedEvents();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCachedEvents().finally(fetchEvents);
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Plié</Text>
      </View>

      <Text style={styles.greeting}>Hello {user?.usr_fname || 'there'}!</Text>
      <Text style={styles.subGreeting}>Are you ready to dance? Explore today's movements.</Text>

      <TextInput
        style={styles.search}
        placeholder="Search events..."
        placeholderTextColor="#999"
        onFocus={() => navigation.navigate('Search')}
      />

      <FlatList
        data={events}
        keyExtractor={(item, index) => String(item.id ?? index)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: scaleHeight(8), paddingBottom: scaleHeight(24) }}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavourite={isFavourite(item.id)}
            onToggleFavourite={() => toggleFavourite(item.id)}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No events found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingTop: scaleHeight(12), paddingBottom: scaleHeight(8) },
  brand: { fontSize: scaleFont(20), fontWeight: '700' },
  greeting: { fontSize: scaleFont(20), fontWeight: '700', paddingHorizontal: scaleWidth(16), marginTop: scaleHeight(8) },
  subGreeting: {
    fontSize: scaleFont(13),
    color: '#777',
    paddingHorizontal: scaleWidth(16),
    marginTop: scaleHeight(4),
    marginBottom: scaleHeight(12),
  },
  search: {
    marginHorizontal: scaleWidth(16),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(10),
    padding: scaleWidth(12),
    marginBottom: scaleHeight(8),
    fontSize: scaleFont(14),
    backgroundColor: '#fafafa',
  },
  empty: { textAlign: 'center', marginTop: scaleHeight(40), color: '#999' },
});
