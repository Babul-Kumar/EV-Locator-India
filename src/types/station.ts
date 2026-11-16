export type ConnectorType = 
  | 'CCS2'
  | 'Type 2'
  | 'CHAdeMO'
  | 'Bharat DC-001'
  | 'Bharat AC-001'
  | 'GB/T'
  | 'Tesla Supercharger'
  | 'Other';

export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode?: string | null;
  latitude: number;
  longitude: number;
  connector_type: string;
  charging_speed_kw?: number | null;
  description?: string | null;
  contact_phone?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  // Computed distance in kilometers when user location is provided
  distance_km?: number;
}

export interface StationFilter {
  searchQuery?: string;
  state?: string;
  city?: string;
  connectorType?: string;
  minSpeed?: number;
  speedCategory?: 'all' | 'standard' | 'fast' | 'rapid';
  sortBy?: 'distance' | 'speed' | 'name';
  userLocation?: { lat: number; lng: number };
}

export interface StationFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | '';
  longitude: number | '';
  connector_type: string;
  charging_speed_kw: number | '';
  description: string;
  contact_phone: string;
  is_active: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at?: string;
}

export interface DashboardStats {
  totalStations: number;
  totalCities: number;
  totalStates: number;
  recentStations: ChargingStation[];
  stationsByState: { name: string; count: number }[];
  connectorDistribution: { name: string; count: number }[];
}
