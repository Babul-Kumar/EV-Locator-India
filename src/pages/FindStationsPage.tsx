import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, X, RotateCcw, List, Map as MapIcon, LocateFixed } from 'lucide-react';
import { StationService } from '../services/stationService';
import { ChargingStation, StationFilter } from '../types/station';
import { StationMap } from '../components/maps/StationMap';
import { StationCard } from '../components/stations/StationCard';

export const FindStationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [connectorType, setConnectorType] = useState('All');
  const [speedCategory, setSpeedCategory] = useState<'all' | 'standard' | 'fast' | 'rapid'>('all');
  
  // Geolocation state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Mobile view toggle ('list' or 'map')
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // Fetch initial stations
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filter: StationFilter = {
      searchQuery,
      state: selectedState,
      city: selectedCity,
      connectorType,
      speedCategory,
      userLocation: userLocation || undefined,
      sortBy: userLocation ? 'distance' : 'name',
    };

    StationService.getStations(filter)
      .then((data) => {
        if (isMounted) {
          setStations(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error querying stations:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, selectedState, selectedCity, connectorType, speedCategory, userLocation]);

  // Extract unique states and cities from all stations for filter options
  const [allStations, setAllStations] = useState<ChargingStation[]>([]);
  useEffect(() => {
    StationService.getStations().then(res => setAllStations(res));
  }, []);

  const availableStates = useMemo(() => {
    const set = new Set(allStations.map(s => s.state).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [allStations]);

  const availableCities = useMemo(() => {
    const filtered = selectedState === 'All' 
      ? allStations 
      : allStations.filter(s => s.state.toLowerCase() === selectedState.toLowerCase());
    const set = new Set(filtered.map(s => s.city).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [allStations, selectedState]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationLoading(false);
      },
      (err) => {
        console.warn('Geolocation permission denied or timed out:', err);
        setLocationError('Location permission denied or unavailable. You can still search by city or PIN code.');
        setLocationLoading(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedState('All');
    setSelectedCity('All');
    setConnectorType('All');
    setSpeedCategory('all');
    setUserLocation(null);
    setLocationError(null);
    setSelectedStationId(null);
    setSearchParams({});
  };

  const activeFilterCount = (selectedState !== 'All' ? 1 : 0) +
    (selectedCity !== 'All' ? 1 : 0) +
    (connectorType !== 'All' ? 1 : 0) +
    (speedCategory !== 'all' ? 1 : 0) +
    (userLocation ? 1 : 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      
      {/* Top Search & Filter Bar */}
      <section className="border-b border-brand-border bg-white p-4 shadow-soft-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Search Input Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, state, location name, or 6-digit PIN code..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-background-secondary border border-brand-border rounded-xl text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            
            {/* Use My Location Button */}
            <button
              onClick={handleUseMyLocation}
              disabled={locationLoading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                userLocation
                  ? 'bg-green-50 text-brand-green border-green-200'
                  : 'bg-white text-brand-dark border-brand-border hover:bg-silver-light'
              }`}
              title="Locate nearby stations based on your current coordinates"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${locationLoading ? 'animate-spin text-brand-green' : userLocation ? 'text-brand-green' : 'text-slate-500'}`} />
              <span>{userLocation ? 'Location Active' : 'Use My Location'}</span>
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFiltersModal(!showFiltersModal)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-silver-light hover:bg-silver text-brand-dark border border-silver transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-brand-green" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-brand-green text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Mobile View Switcher (Map vs List) */}
            <div className="flex md:hidden items-center bg-silver-light border border-silver rounded-xl p-0.5">
              <button
                onClick={() => setMobileView('list')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  mobileView === 'list'
                    ? 'bg-white text-brand-text shadow-soft-sm font-semibold'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileView('map')}
                className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                  mobileView === 'map'
                    ? 'bg-white text-brand-text shadow-soft-sm font-semibold'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Filter Controls Row */}
        <div className="max-w-7xl mx-auto pt-3 mt-3 border-t border-brand-border flex flex-wrap items-center gap-2 text-xs">
          
          {/* State Select */}
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">State:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('All');
              }}
              className="bg-transparent text-brand-text font-medium focus:outline-none cursor-pointer pr-1"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-brand-text font-medium focus:outline-none cursor-pointer pr-1"
            >
              {availableCities.map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Connector Type */}
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Connector:</span>
            <select
              value={connectorType}
              onChange={(e) => setConnectorType(e.target.value)}
              className="bg-transparent text-brand-text font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="All">All Connectors</option>
              <option value="CCS2">CCS2 (Fast DC)</option>
              <option value="Type 2">Type 2 (AC)</option>
              <option value="CHAdeMO">CHAdeMO (DC)</option>
              <option value="Bharat DC-001">Bharat DC-001</option>
            </select>
          </div>

          {/* Speed Category */}
          <div className="flex items-center gap-1 bg-white border border-brand-border rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Speed:</span>
            <select
              value={speedCategory}
              onChange={(e) => setSpeedCategory(e.target.value as any)}
              className="bg-transparent text-brand-text font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">All Speeds</option>
              <option value="standard">Standard (&le; 22 kW)</option>
              <option value="fast">Fast (23 - 60 kW)</option>
              <option value="rapid">Rapid (&gt; 60 kW)</option>
            </select>
          </div>

          {/* Clear Filters Action */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 rounded-lg font-medium transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Filters ({activeFilterCount})
            </button>
          )}

        </div>

        {/* Location Notice Banner if error occurred */}
        {locationError && (
          <div className="max-w-7xl mx-auto mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
            <span>{locationError}</span>
            <button onClick={() => setLocationError(null)} className="font-bold ml-2">×</button>
          </div>
        )}
      </section>

      {/* Main Split Layout: Station List & Interactive Map */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* LEFT PANEL: Stations List */}
        <aside className={`w-full md:w-[480px] lg:w-[520px] flex-shrink-0 flex flex-col border-r border-brand-border bg-background-secondary ${
          mobileView === 'map' ? 'hidden md:flex' : 'flex'
        }`}>
          
          {/* List Header: Results Count */}
          <div className="px-4 py-3 bg-white border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-text uppercase tracking-wider">
                Charging Stations
              </span>
              <span className="px-2 py-0.5 rounded-full bg-silver-light border border-silver text-xs font-semibold text-brand-dark">
                {stations.length}
              </span>
            </div>
            {userLocation && (
              <span className="text-[11px] text-brand-green font-medium flex items-center gap-1">
                <LocateFixed className="w-3 h-3" /> Sorted by nearest distance
              </span>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="p-4 rounded-xl border border-brand-border bg-white animate-pulse space-y-3">
                    <div className="h-4 bg-silver rounded w-3/4"></div>
                    <div className="h-3 bg-silver-light rounded w-1/2"></div>
                    <div className="h-8 bg-silver-light rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : stations.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-brand-border shadow-soft-sm my-6 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-silver-light flex items-center justify-center text-slate-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-brand-text">
                  No charging stations found in this location.
                </h3>
                <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                  Try clearing your filters, broadening your search term, or searching for a different city.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-dark bg-silver-light hover:bg-silver border border-silver rounded-xl transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Search & Filters
                </button>
              </div>
            ) : (
              stations.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  isSelected={station.id === selectedStationId}
                  onSelect={(st) => {
                    setSelectedStationId(st.id);
                    if (window.innerWidth < 768) {
                      setMobileView('map');
                    }
                  }}
                />
              ))
            )}
          </div>

        </aside>

        {/* RIGHT PANEL: Interactive Map View */}
        <main className={`flex-1 relative ${
          mobileView === 'list' ? 'hidden md:block' : 'block h-[calc(100vh-10rem)] md:h-auto'
        }`}>
          <StationMap
            stations={stations}
            selectedStationId={selectedStationId}
            onSelectStation={(st) => setSelectedStationId(st.id)}
            userLocation={userLocation}
            className="w-full h-full min-h-[500px]"
          />
        </main>

      </div>

    </div>
  );
};
