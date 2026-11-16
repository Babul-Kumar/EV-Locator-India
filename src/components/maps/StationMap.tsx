import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { ChargingStation } from '../../types/station';
import { getGoogleMapsDirectionsUrl, formatDistance } from '../../utils/haversine';
import { MapPin, Navigation, Zap, ExternalLink, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import L from 'leaflet';

interface StationMapProps {
  stations: ChargingStation[];
  selectedStationId?: string | null;
  onSelectStation?: (station: ChargingStation) => void;
  userLocation?: { lat: number; lng: number } | null;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const DEFAULT_INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const DEFAULT_ZOOM = 5;

export const StationMap: React.FC<StationMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  userLocation,
  center = DEFAULT_INDIA_CENTER,
  zoom = DEFAULT_ZOOM,
  className = 'w-full h-full min-h-[450px]',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [activeStation, setActiveStation] = useState<ChargingStation | null>(null);
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('leaflet');
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleMarkersRef = useRef<google.maps.Marker[]>([]);
  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkersRef = useRef<L.Marker[]>([]);

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Initialize Map Engine
  useEffect(() => {
    let isMounted = true;

    if (googleApiKey && googleApiKey.trim() !== '') {
      const loader = new Loader({
        apiKey: googleApiKey,
        version: 'weekly',
        libraries: ['places']
      });

      loader.load()
        .then(() => {
          if (!isMounted || !mapContainerRef.current) return;
          initGoogleMap();
          setMapEngine('google');
          setIsMapLoading(false);
        })
        .catch((err) => {
          console.warn('Google Maps API failed to load, falling back to Leaflet/OSM:', err);
          if (!isMounted || !mapContainerRef.current) return;
          setMapError('Google Maps API key invalid or network error. Using interactive OpenStreetMap fallback.');
          initLeafletMap();
          setMapEngine('leaflet');
          setIsMapLoading(false);
        });
    } else {
      initLeafletMap();
      setMapEngine('leaflet');
      setIsMapLoading(false);
    }

    return () => {
      isMounted = false;
      cleanupMaps();
    };
  }, [googleApiKey]);

  const cleanupMaps = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }
    googleMapRef.current = null;
  };

  const initGoogleMap = () => {
    if (!mapContainerRef.current) return;
    cleanupMaps();

    const map = new google.maps.Map(mapContainerRef.current, {
      center: userLocation || center,
      zoom: userLocation ? 12 : zoom,
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    googleMapRef.current = map;
    updateGoogleMarkers(stations);
  };

  const initLeafletMap = () => {
    if (!mapContainerRef.current) return;
    cleanupMaps();

    const map = L.map(mapContainerRef.current).setView(
      [userLocation?.lat || center.lat, userLocation?.lng || center.lng],
      userLocation ? 12 : zoom
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    leafletMapRef.current = map;
    updateLeafletMarkers(stations);
  };

  // Update Markers whenever stations list changes
  useEffect(() => {
    if (mapEngine === 'google' && googleMapRef.current) {
      updateGoogleMarkers(stations);
    } else if (mapEngine === 'leaflet' && leafletMapRef.current) {
      updateLeafletMarkers(stations);
    }
  }, [stations, mapEngine]);

  // Sync selectedStationId
  useEffect(() => {
    if (selectedStationId) {
      const match = stations.find(s => s.id === selectedStationId);
      if (match) {
        setActiveStation(match);
        panToLocation(match.latitude, match.longitude);
      }
    }
  }, [selectedStationId, stations]);

  const panToLocation = (lat: number, lng: number) => {
    if (mapEngine === 'google' && googleMapRef.current) {
      googleMapRef.current.panTo({ lat, lng });
      googleMapRef.current.setZoom(14);
    } else if (mapEngine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.setView([lat, lng], 14, { animate: true });
    }
  };

  const updateGoogleMarkers = (stationList: ChargingStation[]) => {
    const map = googleMapRef.current;
    if (!map) return;

    // Clear previous markers
    googleMarkersRef.current.forEach(m => m.setMap(null));
    googleMarkersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    // User location marker
    if (userLocation) {
      const userMarker = new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563EB',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });
      googleMarkersRef.current.push(userMarker);
      bounds.extend(userLocation);
    }

    stationList.forEach(station => {
      const pos = { lat: station.latitude, lng: station.longitude };
      bounds.extend(pos);

      const marker = new google.maps.Marker({
        position: pos,
        map,
        title: station.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44" fill="none">
              <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#16A34A"/>
              <circle cx="17" cy="17" r="13" fill="white"/>
              <path d="M17 7L11 18H17L16 26L23 15H17L17 7Z" fill="#16A34A"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(34, 44),
          anchor: new google.maps.Point(17, 44)
        }
      });

      marker.addListener('click', () => {
        setActiveStation(station);
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      googleMarkersRef.current.push(marker);
    });

    if (stationList.length > 0 && !selectedStationId) {
      map.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
      if (stationList.length === 1) {
        map.setZoom(14);
      }
    }
  };

  const updateLeafletMarkers = (stationList: ChargingStation[]) => {
    const map = leafletMapRef.current;
    if (!map) return;

    // Clear existing
    leafletMarkersRef.current.forEach(m => m.remove());
    leafletMarkersRef.current = [];

    const evIcon = L.divIcon({
      className: 'custom-ev-marker',
      html: `
        <div style="cursor:pointer; display:flex; flex-direction:column; align-items:center;">
          <svg width="34" height="44" viewBox="0 0 34 44" fill="none">
            <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#16A34A"/>
            <circle cx="17" cy="17" r="13" fill="white"/>
            <path d="M17 7L11 18H17L16 26L23 15H17L17 7Z" fill="#16A34A"/>
          </svg>
        </div>
      `,
      iconSize: [34, 44],
      iconAnchor: [17, 44]
    });

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="width:16px; height:16px; background:#2563EB; border:2px solid #FFFFFF; border-radius:50%; box-shadow:0 0 8px rgba(37,99,235,0.6);"></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const latLngs: L.LatLngTuple[] = [];

    if (userLocation) {
      const uMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
      leafletMarkersRef.current.push(uMarker);
      latLngs.push([userLocation.lat, userLocation.lng]);
    }

    stationList.forEach(station => {
      const marker = L.marker([station.latitude, station.longitude], { icon: evIcon }).addTo(map);

      marker.on('click', () => {
        setActiveStation(station);
        if (onSelectStation) {
          onSelectStation(station);
        }
      });

      leafletMarkersRef.current.push(marker);
      latLngs.push([station.latitude, station.longitude]);
    });

    if (latLngs.length > 0 && !selectedStationId) {
      try {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } catch (e) {
        console.warn('Error fitting leaflet bounds', e);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden rounded-xl border border-brand-border bg-white shadow-soft-sm">
      {/* Engine Status Badge */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-silver shadow-soft-sm text-xs text-brand-muted font-medium pointer-events-none">
        <span className={"w-2 h-2 rounded-full " + (mapEngine === 'google' ? 'bg-brand-green' : 'bg-blue-500 animate-pulse')}></span>
        <span>{mapEngine === 'google' ? 'Google Maps' : 'Interactive Map (OSM)'}</span>
      </div>

      {/* Map Error Banner */}
      {mapError && (
        <div className="absolute top-12 right-3 left-3 z-[1000] bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg flex items-center justify-between shadow-soft-sm">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>{mapError}</span>
          </div>
          <button 
            onClick={() => setMapError(null)} 
            className="text-amber-700 hover:text-amber-900 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Map DOM Container */}
      <div ref={mapContainerRef} className={className} />

      {/* Active Marker Info Card */}
      {activeStation && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] max-w-md mx-auto bg-white rounded-xl border border-brand-border shadow-soft-lg p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-green-light flex items-center justify-center text-brand-green flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-brand-text line-clamp-1">
                  {activeStation.name}
                </h4>
                <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{activeStation.city}, {activeStation.state}</span>
                  {activeStation.distance_km !== undefined && (
                    <span className="ml-1 font-medium text-brand-green bg-green-50 px-1.5 py-0.2 rounded">
                      • {formatDistance(activeStation.distance_km)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveStation(null)}
              className="text-slate-400 hover:text-brand-text p-1 text-sm leading-none rounded"
              aria-label="Close details">
              ×
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-3 line-clamp-1">
            {activeStation.address}
          </p>

          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="bg-silver-light border border-silver px-2 py-0.5 rounded text-brand-text font-medium">
              {activeStation.connector_type}
            </span>
            {activeStation.charging_speed_kw && (
              <span className="bg-green-50 text-brand-green border border-green-200 px-2 py-0.5 rounded font-medium">
                {activeStation.charging_speed_kw} kW Fast
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-brand-border">
            <Link
              to={`/stations/${activeStation.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-dark bg-silver-light hover:bg-silver rounded-lg transition-colors border border-silver"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Details
            </Link>
            <a
              href={getGoogleMapsDirectionsUrl(activeStation.latitude, activeStation.longitude, activeStation.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-brand-green hover:bg-brand-green-hover rounded-lg transition-colors shadow-soft-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              Get Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
