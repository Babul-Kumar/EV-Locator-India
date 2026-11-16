import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ChargingStation, StationFilter, DashboardStats } from '../types/station';
import { calculateDistanceKm } from '../utils/haversine';
import { INITIAL_SAMPLE_STATIONS } from './sampleData';

const LOCAL_STORAGE_KEY = 'ev_charging_stations_india_v1';

function getLocalStations(): ChargingStation[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_STATIONS));
      return [...INITIAL_SAMPLE_STATIONS];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not read from localStorage, using in-memory sample stations', err);
    return [...INITIAL_SAMPLE_STATIONS];
  }
}

function saveLocalStations(stations: ChargingStation[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stations));
  } catch (err) {
    console.error('Failed to save stations to localStorage', err);
  }
}

export const StationService = {
  isUsingLiveDatabase(): boolean {
    return isSupabaseConfigured;
  },

  async getStations(filter?: StationFilter): Promise<ChargingStation[]> {
    let stations: ChargingStation[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('charging_stations')
          .select('*')
          .eq('is_active', true);

        if (filter?.state && filter.state !== 'All') {
          query = query.ilike('state', filter.state);
        }
        if (filter?.city && filter.city !== 'All') {
          query = query.ilike('city', filter.city);
        }
        if (filter?.connectorType && filter.connectorType !== 'All') {
          query = query.eq('connector_type', filter.connectorType);
        }
        if (filter?.minSpeed && filter.minSpeed > 0) {
          query = query.gte('charging_speed_kw', filter.minSpeed);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase query error, falling back to local dataset:', error);
          stations = getLocalStations();
        } else {
          stations = data || [];
        }
      } catch (err) {
        console.error('Network error during Supabase query:', err);
        stations = getLocalStations();
      }
    } else {
      stations = getLocalStations();
    }

    // Apply client-side filters (text search across city, state, name, pincode, address)
    if (filter?.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase().trim();
      stations = stations.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.pincode && s.pincode.includes(q))
      );
    }

    // Local filter pass for fallback or additional criteria
    if (!isSupabaseConfigured) {
      if (filter?.state && filter.state !== 'All') {
        stations = stations.filter(s => s.state.toLowerCase() === filter.state?.toLowerCase());
      }
      if (filter?.city && filter.city !== 'All') {
        stations = stations.filter(s => s.city.toLowerCase() === filter.city?.toLowerCase());
      }
      if (filter?.connectorType && filter.connectorType !== 'All') {
        stations = stations.filter(s => s.connector_type.toLowerCase() === filter.connectorType?.toLowerCase());
      }
      if (filter?.minSpeed && filter.minSpeed > 0) {
        stations = stations.filter(s => (s.charging_speed_kw || 0) >= (filter.minSpeed || 0));
      }
    }

    // Speed Category filter
    if (filter?.speedCategory && filter.speedCategory !== 'all') {
      if (filter.speedCategory === 'standard') {
        stations = stations.filter(s => (s.charging_speed_kw || 0) <= 22);
      } else if (filter.speedCategory === 'fast') {
        stations = stations.filter(s => (s.charging_speed_kw || 0) > 22 && (s.charging_speed_kw || 0) <= 60);
      } else if (filter.speedCategory === 'rapid') {
        stations = stations.filter(s => (s.charging_speed_kw || 0) > 60);
      }
    }

    // Compute distance if user location is provided
    if (filter?.userLocation) {
      const { lat, lng } = filter.userLocation;
      stations = stations.map(s => ({
        ...s,
        distance_km: calculateDistanceKm(lat, lng, s.latitude, s.longitude)
      }));

      // Sort by distance if specified or default when userLocation is active
      if (filter.sortBy === 'distance' || !filter.sortBy) {
        stations.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
      }
    } else if (filter?.sortBy === 'speed') {
      stations.sort((a, b) => (b.charging_speed_kw || 0) - (a.charging_speed_kw || 0));
    } else if (filter?.sortBy === 'name') {
      stations.sort((a, b) => a.name.localeCompare(b.name));
    }

    return stations;
  },

  async getStationById(id: string): Promise<ChargingStation | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('charging_stations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Supabase fetch by ID error, checking local:', error);
          const local = getLocalStations().find(s => s.id === id);
          return local || null;
        }
        return data;
      } catch (err) {
        console.error('Error fetching station by ID:', err);
      }
    }

    const found = getLocalStations().find(s => s.id === id);
    return found || null;
  },

  async createStation(station: Omit<ChargingStation, 'id' | 'created_at' | 'updated_at'>): Promise<ChargingStation> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('charging_stations')
        .insert([{
          ...station,
          created_at: timestamp,
          updated_at: timestamp,
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to create charging station in Supabase');
      }
      return data;
    }

    // Local storage fallback
    const newStation: ChargingStation = {
      ...station,
      id: crypto.randomUUID ? crypto.randomUUID() : 'station-' + Date.now(),
      created_at: timestamp,
      updated_at: timestamp,
    };
    const list = getLocalStations();
    list.unshift(newStation);
    saveLocalStations(list);
    return newStation;
  },

  async updateStation(id: string, updates: Partial<ChargingStation>): Promise<ChargingStation> {
    const timestamp = new Date().toISOString();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('charging_stations')
        .update({
          ...updates,
          updated_at: timestamp,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message || 'Failed to update charging station in Supabase');
      }
      return data;
    }

    // Local storage fallback
    const list = getLocalStations();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Charging station not found');
    }
    list[index] = {
      ...list[index],
      ...updates,
      updated_at: timestamp,
    };
    saveLocalStations(list);
    return list[index];
  },

  async deleteStation(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('charging_stations')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message || 'Failed to delete charging station from Supabase');
      }
      return true;
    }

    // Local storage fallback
    const list = getLocalStations();
    const filtered = list.filter(s => s.id !== id);
    saveLocalStations(filtered);
    return true;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const stations = await this.getStations();

    const uniqueCities = new Set(stations.map(s => s.city.trim().toLowerCase())).size;
    const uniqueStates = new Set(stations.map(s => s.state.trim().toLowerCase())).size;

    // State distribution
    const stateCounts: Record<string, number> = {};
    const connectorCounts: Record<string, number> = {};

    stations.forEach(s => {
      stateCounts[s.state] = (stateCounts[s.state] || 0) + 1;
      const conn = s.connector_type || 'Other';
      connectorCounts[conn] = (connectorCounts[conn] || 0) + 1;
    });

    const stationsByState = Object.entries(stateCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const connectorDistribution = Object.entries(connectorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalStations: stations.length,
      totalCities: uniqueCities,
      totalStates: uniqueStates,
      recentStations: stations.slice(0, 5),
      stationsByState,
      connectorDistribution,
    };
  },

  async importStations(rows: Partial<ChargingStation>[]): Promise<{ added: number; errors: string[] }> {
    const errors: string[] = [];
    const validRows: Omit<ChargingStation, 'id' | 'created_at' | 'updated_at'>[] = [];

    rows.forEach((row, idx) => {
      const rowNum = idx + 1;
      if (!row.name || !row.name.trim()) {
        errors.push(`Row ${rowNum}: Station Name is required.`);
        return;
      }
      if (!row.address || !row.address.trim()) {
        errors.push(`Row ${rowNum}: Address is required.`);
        return;
      }
      if (!row.city || !row.city.trim()) {
        errors.push(`Row ${rowNum}: City is required.`);
        return;
      }
      if (!row.state || !row.state.trim()) {
        errors.push(`Row ${rowNum}: State is required.`);
        return;
      }
      const lat = Number(row.latitude);
      const lng = Number(row.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push(`Row ${rowNum}: Invalid Latitude (${row.latitude}). Must be between -90 and 90.`);
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push(`Row ${rowNum}: Invalid Longitude (${row.longitude}). Must be between -180 and 180.`);
        return;
      }

      validRows.push({
        name: row.name.trim(),
        address: row.address.trim(),
        city: row.city.trim(),
        state: row.state.trim(),
        pincode: row.pincode?.trim() || null,
        latitude: lat,
        longitude: lng,
        connector_type: row.connector_type?.trim() || 'CCS2',
        charging_speed_kw: row.charging_speed_kw ? Number(row.charging_speed_kw) : null,
        description: row.description?.trim() || null,
        contact_phone: row.contact_phone?.trim() || null,
        is_active: true,
      });
    });

    let added = 0;
    for (const valid of validRows) {
      try {
        await this.createStation(valid);
        added++;
      } catch (err: any) {
        errors.push(`Failed to save station "${valid.name}": ${err?.message || 'Database error'}`);
      }
    }

    return { added, errors };
  },

  async exportStationsToCsv(): Promise<string> {
    const stations = await this.getStations();
    const headers = ['name', 'address', 'city', 'state', 'pincode', 'latitude', 'longitude', 'connector_type', 'charging_speed_kw'];
    
    const rows = stations.map(s => [
      `"${(s.name || '').replace(/"/g, '""')}"`,
      `"${(s.address || '').replace(/"/g, '""')}"`,
      `"${(s.city || '').replace(/"/g, '""')}"`,
      `"${(s.state || '').replace(/"/g, '""')}"`,
      `"${(s.pincode || '')}"`,
      s.latitude,
      s.longitude,
      `"${(s.connector_type || '')}"`,
      s.charging_speed_kw || ''
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  }
};
