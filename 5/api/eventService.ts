import apiClient from './apiClient';
import { EventsListingResponse, MappedEvent, RawEvent } from '../types';

const formatPrice = (from: number | string, to: number | string): string => {
  const f = Number(from) || 0;
  const t = Number(to) || 0;
  if (!f && !t) return 'Free';
  if (f === t) return `€${f}`;
  return `€${f} - €${t}`;
};

const formatDateRange = (from?: string, to?: string): string => {
  if (from && to && from !== to) return `${from} - ${to}`;
  return from || to || '';
};

export const mapEvent = (raw: RawEvent): MappedEvent => ({
  id: raw.event_date_id ?? raw.event_id,
  eventId: raw.event_id,
  title: raw.event_name,
  description: raw.description,
  image: raw.event_profile_img,
  location: [raw.city, raw.country].filter(Boolean).join(', '),
  dateRange: formatDateRange(raw.readable_from_date, raw.readable_to_date),
  dateTime: formatDateRange(raw.readable_from_date, raw.readable_to_date),
  priceRange: formatPrice(raw.event_price_from, raw.event_price_to),
  tags: (raw.danceStyles || []).map((d) => d.ds_name).filter(Boolean),
  isFavorite: Boolean(raw.isFavorite),
  eventUrl: raw.event_url,
  organizer: null,
});

export const getEventsListing = async (
  payload: Record<string, unknown> = {}
): Promise<MappedEvent[]> => {
  const response = await apiClient.post<EventsListingResponse>(
    '/events-listing',
    payload
  );
  const events = response?.data?.data?.events || [];
  return events.map(mapEvent);
};
