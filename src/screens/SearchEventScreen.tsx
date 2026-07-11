import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getEventsListing } from '../api/eventService';
import { useFavourites } from '../hooks/useFavourites';
import EventCard from '../components/EventCard';
import { MainTabParamList, MappedEvent, RootStackParamList } from '../types';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

type SearchEventScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SearchEventScreen({ navigation }: SearchEventScreenProps) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MappedEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const list = await getEventsListing({ search: text });
      setResults(list);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Plié</Text>
      <Text style={styles.greeting}>Hello Renzo!</Text>
      <Text style={styles.subGreeting}>Are you ready to dance? Explore today's movements.</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Search events..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={runSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => runSearch('')}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={{ paddingTop: scaleHeight(8), paddingBottom: scaleHeight(24) }}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isFavourite={isFavourite(item.id)}
            onToggleFavourite={() => toggleFavourite(item.id)}
            onPress={() => navigation.navigate('EventDetails', { event: item })}
          />
        )}
        ListEmptyComponent={
          !loading && query ? <Text style={styles.empty}>No results for "{query}"</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  brand: { fontSize: scaleFont(20), fontWeight: '700', textAlign: 'center', paddingTop: scaleHeight(12) },
  greeting: { fontSize: scaleFont(20), fontWeight: '700', paddingHorizontal: scaleWidth(16), marginTop: scaleHeight(8) },
  subGreeting: {
    fontSize: scaleFont(13),
    color: '#777',
    paddingHorizontal: scaleWidth(16),
    marginTop: scaleHeight(4),
    marginBottom: scaleHeight(12),
  },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: scaleWidth(16) },
  search: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: scaleWidth(10),
    padding: scaleWidth(12),
    fontSize: scaleFont(14),
    backgroundColor: '#fafafa',
  },
  clearButton: { position: 'absolute', right: scaleWidth(12) },
  clearText: { fontSize: scaleFont(20), color: '#999' },
  empty: { textAlign: 'center', marginTop: scaleHeight(40), color: '#999' },
});
