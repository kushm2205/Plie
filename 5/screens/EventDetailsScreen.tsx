import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFavourites } from '../hooks/useFavourites';
import { RootStackParamList } from '../types';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

type EventDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'EventDetails'
>;

export default function EventDetailsScreen({ route, navigation }: EventDetailsScreenProps) {
  const { event } = route.params;
  const { isFavourite, toggleFavourite } = useFavourites();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: scaleHeight(32) }}>
      <View style={styles.heroWrap}>
        <Image source={{ uri: event.image }} style={styles.hero} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={styles.heroIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>⤴</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => toggleFavourite(event.id)}>
            <Text style={[styles.iconText, isFavourite(event.id) && styles.heartActive]}>
              {isFavourite(event.id) ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.tagRow}>
          {(event.tags || []).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.price}>{event.priceRange}</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>DATE & TIME</Text>
          <Text style={styles.rowValue}>{event.dateTime || event.dateRange}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>LOCATION</Text>
          <Text style={styles.rowValue}>{event.location}</Text>
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map preview</Text>
        </View>

        <Text style={styles.sectionTitle}>About the Event</Text>
        <Text style={styles.about}>{event.description}</Text>

        {event.organizer && (
          <View style={styles.organizerCard}>
            <View style={styles.organizerAvatar}>
              <Text style={styles.organizerInitial}>{event.organizer.name?.[0]}</Text>
            </View>
            <View>
              <Text style={styles.organizerLabel}>ORGANIZED BY</Text>
              <Text style={styles.organizerName}>{event.organizer.name}</Text>
              <Text style={styles.organizerLink}>View Profile</Text>
            </View>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareText}>Share tickets</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroWrap: { position: 'relative' },
  hero: { width: '100%', height: scaleHeight(260), backgroundColor: '#111' },
  backButton: {
    position: 'absolute',
    top: scaleHeight(16),
    left: scaleWidth(16),
    width: scaleWidth(36),
    height: scaleWidth(36),
    borderRadius: scaleWidth(18),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: { fontSize: scaleFont(18) },
  heroIcons: { position: 'absolute', top: scaleHeight(16), right: scaleWidth(16), flexDirection: 'row' },
  iconButton: {
    width: scaleWidth(36),
    height: scaleWidth(36),
    borderRadius: scaleWidth(18),
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleWidth(8),
  },
  iconText: { fontSize: scaleFont(16) },
  heartActive: { color: '#C1272D' },
  body: { padding: scaleWidth(16) },
  tagRow: { flexDirection: 'row', marginBottom: scaleHeight(8) },
  tag: {
    backgroundColor: '#111',
    borderRadius: scaleWidth(4),
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleHeight(3),
    marginRight: scaleWidth(8),
  },
  tagText: { color: '#fff', fontSize: scaleFont(10), fontWeight: '600', textTransform: 'uppercase' },
  title: { fontSize: scaleFont(22), fontWeight: '700', marginBottom: scaleHeight(4) },
  price: { fontSize: scaleFont(16), fontWeight: '600', color: '#333', marginBottom: scaleHeight(16) },
  row: { marginBottom: scaleHeight(12) },
  rowLabel: { fontSize: scaleFont(11), color: '#999', letterSpacing: 0.5, marginBottom: scaleHeight(2) },
  rowValue: { fontSize: scaleFont(14), color: '#111', fontWeight: '500' },
  mapPlaceholder: {
    height: scaleHeight(140),
    borderRadius: scaleWidth(12),
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: scaleHeight(12),
  },
  mapText: { color: '#999' },
  sectionTitle: { fontSize: scaleFont(16), fontWeight: '700', marginTop: scaleHeight(16), marginBottom: scaleHeight(8) },
  about: { fontSize: scaleFont(14), color: '#555', lineHeight: scaleFont(21) },
  organizerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleHeight(20),
    padding: scaleWidth(12),
    borderRadius: scaleWidth(12),
    backgroundColor: '#f7f7f7',
  },
  organizerAvatar: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleWidth(12),
  },
  organizerInitial: { color: '#fff', fontWeight: '700' },
  organizerLabel: { fontSize: scaleFont(10), color: '#999' },
  organizerName: { fontSize: scaleFont(14), fontWeight: '700' },
  organizerLink: { fontSize: scaleFont(12), color: '#666', marginTop: scaleHeight(2) },
  shareButton: {
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(8),
    backgroundColor: '#111',
    borderRadius: scaleWidth(10),
    padding: scaleWidth(16),
    alignItems: 'center',
  },
  shareText: { color: '#fff', fontWeight: '700', fontSize: scaleFont(15) },
});
