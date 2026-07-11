import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  ImageErrorEventData,
} from 'react-native';
import { MappedEvent } from '../types';
import { scaleWidth, scaleHeight, scaleFont } from '../utils/responsive';

interface EventCardProps {
  event: MappedEvent;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  onPress: () => void;
}

export default function EventCard({
  event,
  isFavourite,
  onToggleFavourite,
  onPress,
}: EventCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: event.image }} style={styles.image} />
      <View style={styles.info}>
        <View style={styles.tagRow}>
          {(event.tags || []).map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={styles.location}>{event.location}</Text>
        <Text style={styles.date}>{event.dateRange}</Text>
        <Text style={styles.price}>{event.priceRange}</Text>
      </View>
      <TouchableOpacity
        style={styles.heartButton}
        onPress={onToggleFavourite}
        hitSlop={10}
      >
        <Text style={[styles.heart, isFavourite && styles.heartActive]}>
          {isFavourite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: scaleWidth(10),
    marginHorizontal: scaleWidth(16),
    marginBottom: scaleHeight(12),
    borderRadius: scaleWidth(12),
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
  },
  image: {
    width: scaleWidth(64),
    height: scaleWidth(64),
    borderRadius: scaleWidth(8),
    backgroundColor: '#ddd',
  },
  info: { flex: 1, marginLeft: scaleWidth(12) },
  tagRow: { flexDirection: 'row', marginBottom: scaleHeight(4) },
  tag: {
    backgroundColor: '#111',
    borderRadius: scaleWidth(4),
    paddingHorizontal: scaleWidth(6),
    paddingVertical: scaleHeight(2),
    marginRight: scaleWidth(6),
  },
  tagText: {
    color: '#fff',
    fontSize: scaleFont(9),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: { fontSize: scaleFont(14), fontWeight: '700' },
  location: {
    fontSize: scaleFont(12),
    color: '#777',
    marginTop: scaleHeight(2),
  },
  date: { fontSize: scaleFont(11), color: '#999', marginTop: scaleHeight(2) },
  price: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    marginTop: scaleHeight(2),
  },
  heartButton: { paddingHorizontal: scaleWidth(8), alignSelf: 'flex-start' },
  heart: { fontSize: scaleFont(20), color: '#bbb' },
  heartActive: { color: '#C1272D' },
});
