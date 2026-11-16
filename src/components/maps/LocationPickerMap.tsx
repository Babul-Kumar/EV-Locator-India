import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

interface LocationPickerMapProps {
  latitude?: number | '';
  longitude?: number | '';
  onCoordinatesSelected: (lat: number, lng: number) => void;
  className?: string;
}

const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // India Center

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onCoordinatesSelected,
  className = 'w-full h-72',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<'google' | 'leaflet'>('leaflet');

  const googleMapRef = useRef<google.maps.Map | null>(null);
  const googleMarkerRef = useRef<google.maps.Marker | null>(null);

  const leafletMapRef = useRef<L.Map | null>(null);
  const leafletMarkerRef = useRef<L.Marker | null>(null);

  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const currentLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : DEFAULT_CENTER.lat;
  const currentLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : DEFAULT_CENTER.lng;
  const hasCoords = typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude);

  useEffect(() => {
    let isMounted = true;

    if (googleApiKey && googleApiKey.trim() !== '') {
      const loader = new Loader({
        apiKey: googleApiKey,
        version: 'weekly',
      });

      loader.load()
        .then(() => {
          if (!isMounted || !containerRef.current) return;
          initGoogle();
          setEngine('google');
        })
        .catch(() => {
          if (!isMounted || !containerRef.current) return;
          initLeaflet();
          setEngine('leaflet');
        });
    } else {
      initLeaflet();
      setEngine('leaflet');
    }

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      googleMapRef.current = null;
    };
  }, [googleApiKey]);

  const initGoogle = () => {
    if (!containerRef.current) return;
    const map = new google.maps.Map(containerRef.current, {
      center: { lat: currentLat, lng: currentLng },
      zoom: hasCoords ? 14 : 5,
      mapTypeControl: false,
      streetViewControl: false,
    });

    googleMapRef.current = map;

    if (hasCoords) {
      googleMarkerRef.current = new google.maps.Marker({
        position: { lat: currentLat, lng: currentLng },
        map,
        draggable: true,
      });

      googleMarkerRef.current.addListener('dragend', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = parseFloat(e.latLng.lat().toFixed(6));
          const lng = parseFloat(e.latLng.lng().toFixed(6));
          onCoordinatesSelected(lat, lng);
        }
      });
    }

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = parseFloat(e.latLng.lat().toFixed(6));
        const lng = parseFloat(e.latLng.lng().toFixed(6));
        onCoordinatesSelected(lat, lng);

        if (!googleMarkerRef.current) {
          googleMarkerRef.current = new google.maps.Marker({
            position: { lat, lng },
            map,
            draggable: true,
          });
          googleMarkerRef.current.addListener('dragend', (dragEv: google.maps.MapMouseEvent) => {
            if (dragEv.latLng) {
              onCoordinatesSelected(
                parseFloat(dragEv.latLng.lat().toFixed(6)),
                parseFloat(dragEv.latLng.lng().toFixed(6))
              );
            }
          });
        } else {
          googleMarkerRef.current.setPosition({ lat, lng });
        }
      }
    });
  };

  const initLeaflet = () => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current).setView(
      [currentLat, currentLng],
      hasCoords ? 14 : 5
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    leafletMapRef.current = map;

    const icon = L.divIcon({
      className: 'custom-picker-marker',
      html: '<div style="cursor:pointer; display:flex; flex-direction:column; align-items:center;"><svg width="32" height="40" viewBox="0 0 34 44" fill="none"><path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 44 17 44C17 44 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="#16A34A"/><circle cx="17" cy="17" r="12" fill="white"/><circle cx="17" cy="17" r="6" fill="#16A34A"/></svg></div>',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
    });

    if (hasCoords) {
      const marker = L.marker([currentLat, currentLng], { icon, draggable: true }).addTo(map);
      leafletMarkerRef.current = marker;

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onCoordinatesSelected(
          parseFloat(pos.lat.toFixed(6)),
          parseFloat(pos.lng.toFixed(6))
        );
      });
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      onCoordinatesSelected(lat, lng);

      if (!leafletMarkerRef.current) {
        const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
        leafletMarkerRef.current = marker;
        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onCoordinatesSelected(
            parseFloat(pos.lat.toFixed(6)),
            parseFloat(pos.lng.toFixed(6))
          );
        });
      } else {
        leafletMarkerRef.current.setLatLng([lat, lng]);
      }
    });
  };

  // Sync external coordinate changes into map marker
  useEffect(() => {
    if (typeof latitude === 'number' && typeof longitude === 'number' && !isNaN(latitude) && !isNaN(longitude)) {
      if (engine === 'google' && googleMapRef.current) {
        if (!googleMarkerRef.current) {
          googleMarkerRef.current = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: googleMapRef.current,
            draggable: true,
          });
        } else {
          googleMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
        }
      } else if (engine === 'leaflet' && leafletMapRef.current) {
        if (leafletMarkerRef.current) {
          leafletMarkerRef.current.setLatLng([latitude, longitude]);
        }
      }
    }
  }, [latitude, longitude, engine]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <span className="flex items-center gap-1 font-medium text-brand-text">
          <MapPin className="w-3.5 h-3.5 text-brand-green" />
          Click map or drag pin to choose exact coordinates
        </span>
        <span>{engine === 'google' ? 'Google Maps' : 'OpenStreetMap'}</span>
      </div>
      <div className="relative rounded-lg overflow-hidden border border-brand-border">
        <div ref={containerRef} className={className} />
      </div>
    </div>
  );
};
