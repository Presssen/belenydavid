
export interface Hotel {
  id: string;
  name: string;
  address: string;
  stars?: number; // 0 if not specified/hostel
  priceRange: string;
  walkingDistanceMinutes: number;
  distanceText?: string; // Optional override for distance text (e.g. "15 min en coche")
  description: string;
  amenities: {
    parking: boolean;
    breakfast: boolean;
    pool: boolean;
    wifi: boolean; // Assuming wifi is generally available, but strictly mapping provided text
  };
  contactEmail?: string;
  discountCode?: string;
  discountNote?: string;
  bookingUrl?: string; // Real booking link
  imageUrl: string;
  specialNote?: string;
  recommended?: boolean; // New flag for "Recomendado" badge
}

export interface Ride {
  id: string;
  driverName: string;
  contact: string; // Phone or Email
  origin: string; // Where are they coming from
  destination: string; // Usually Sanlúcar, but could be return trip
  date: string;
  time: string;
  seatsAvailable: number;
  type: 'offer' | 'request'; // Offer ride or Request ride
  note?: string;
  timestamp: number;
}

export enum SectionId {
  HERO = 'inicio',
  DETAILS = 'detalles',
  HOTELS = 'alojamiento',
  ACTIVITIES = 'planes',
  GIFT = 'regalo',
}

export type ViewState = 'home' | 'carpool';