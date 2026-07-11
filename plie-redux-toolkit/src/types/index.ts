export interface Organizer {
  name: string;
}

export interface MappedEvent {
  id: number | string;
  eventId: number | string;
  title: string;
  description: string;
  image: string;
  location: string;
  dateRange: string;
  dateTime: string;
  priceRange: string;
  tags: string[];
  isFavorite: boolean;
  eventUrl: string;
  organizer: Organizer | null;
}

export interface RawDanceStyle {
  ds_name: string;
}

export interface RawEvent {
  event_id: number | string;
  event_date_id?: number | string;
  event_name: string;
  description: string;
  event_profile_img: string;
  event_url: string;
  event_price_from: number | string;
  event_price_to: number | string;
  readable_from_date: string;
  readable_to_date: string;
  isFavorite?: boolean;
  city?: string;
  country?: string;
  keywords?: string;
  danceStyles?: RawDanceStyle[];
}

export interface EventsListingResponse {
  success: boolean;
  message: string;
  data: {
    events: RawEvent[];
    total: number;
  };
}

export interface AuthUser {
  usr_fname: string;
  usr_lname: string;
  usr_email: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  data?: {
    token?: string;
    user?: AuthUser;
  };
  token?: string;
  user?: AuthUser;
  message?: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  EventDetails: { event: MappedEvent };
  Login: undefined;
};

export type MainTabParamList = {
  Search: undefined;
  Events: undefined;
  Favourites: undefined;
  Profile: undefined;
};
