import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Zap, Navigation, ArrowLeft, Phone, Calendar, Clock, 
  Share2, Copy, Check, ShieldCheck, Compass, Info, AlertCircle 
} from 'lucide-react';
import { StationService } from '../services/stationService';
import { ChargingStation } from '../types/station';
import { getGoogleMapsDirectionsUrl } from '../utils/haversine';
import { StationMap } from '../components/maps/StationMap';

export const StationDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [station, setStation] = useState<ChargingStation | null>(null);
  const [nearbyStations, setNearbyStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoords, setCopiedCoords] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    setLoading(true);
    StationService.getStationById(id)
      .then((data) => {
        if (!isMounted) return;
        setStation(data);
        setLoading(false);

        if (data) {
          // Fetch nearby stations in same city
          StationService.getStations({ city: data.city }).then(res => {
            if (isMounted) {
              setNearbyStations(res.filter(s => s.id !== data.id).slice(0, 3));
            }
          });
        }
      })
      .catch((err) => {
        console.error('Error fetching station details:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  const copyCoordinates = () => {
    if (station) {
      navigator.clipboard.writeText(`${station.latitude}, ${station.longitude}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-brand-muted font-medium">Loading station specifications...</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-brand-border p-8 text-center space-y-4 shadow-soft-sm">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-brand-text">Station Not Found</h2>
          <p className="text-xs text-brand-muted">
            The charging station you requested could not be located in our database or may have been unlisted.
          </p>
          <Link
            to="/stations"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold shadow-soft-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Stations Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      
      {/* Top Breadcrumb & Navigation */}
      <div className="border-b border-brand-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link
            to="/stations"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Find Stations</span>
          </Link>
          <span className="text-xs text-slate-400">
            Station ID: <code className="font-mono text-slate-600">{station.id.slice(0, 8)}...</code>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-soft-sm space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-brand-green border border-green-200 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    {station.is_active ? 'Active & Listed' : 'Temporarily Inactive'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-silver-light text-brand-dark border border-silver">
                    {station.connector_type || 'Information not available'}
                  </span>
                </div>

                {station.charging_speed_kw && (
                  <span className="text-sm font-bold text-brand-green bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {station.charging_speed_kw} kW Fast Charger
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-text tracking-tight">
                {station.name}
              </h1>

              <div className="flex items-start gap-2 text-sm text-brand-muted">
                <MapPin className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {station.address}, {station.city}, {station.state} 
                  {station.pincode ? ` – ${station.pincode}` : ''}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-brand-border">
                <a
                  href={getGoogleMapsDirectionsUrl(station.latitude, station.longitude, station.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold transition-all shadow-soft-sm"
                >
                  <Navigation className="w-4 h-4" />
                  Get Google Maps Directions
                </a>

                <button
                  onClick={copyCoordinates}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-silver-light hover:bg-silver text-brand-text border border-silver text-xs font-semibold transition-colors"
                >
                  {copiedCoords ? <Check className="w-4 h-4 text-brand-green" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedCoords ? 'Coordinates Copied' : 'Copy GPS Coordinates'}</span>
                </button>
              </div>

            </div>

            {/* Specifications Grid */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-soft-sm space-y-4">
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                Station Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">City</span>
                  <p className="text-sm font-bold text-brand-text">{station.city || 'Information not available'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">State / Union Territory</span>
                  <p className="text-sm font-bold text-brand-text">{station.state || 'Information not available'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">Postal PIN Code</span>
                  <p className="text-sm font-bold text-brand-text">{station.pincode || 'Information not available'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">Connector Configuration</span>
                  <p className="text-sm font-bold text-brand-text">{station.connector_type || 'Information not available'}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">Max Charging Speed</span>
                  <p className="text-sm font-bold text-brand-text">
                    {station.charging_speed_kw ? `${station.charging_speed_kw} kW` : 'Information not available'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">GPS Coordinates</span>
                  <p className="text-sm font-mono font-bold text-brand-text">
                    {station.latitude.toFixed(6)}, {station.longitude.toFixed(6)}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">Helpline / Contact Phone</span>
                  <p className="text-sm font-bold text-brand-text">
                    {station.contact_phone ? (
                      <a href={`tel:${station.contact_phone}`} className="text-brand-green hover:underline">
                        {station.contact_phone}
                      </a>
                    ) : (
                      'Information not available'
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-background-secondary border border-silver space-y-1">
                  <span className="text-slate-400 font-medium">Last Updated Date</span>
                  <p className="text-sm font-bold text-brand-text">
                    {station.updated_at 
                      ? new Date(station.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'Information not available'}
                  </p>
                </div>

              </div>
            </div>

            {/* Description & Additional Info */}
            <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-soft-sm space-y-3">
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                Additional Station Information
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed whitespace-pre-line">
                {station.description || 'Information not available.'}
              </p>
            </div>

          </div>

          {/* Sidebar Column: Station Map Pin & Nearby Hubs */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Embedded Station Map */}
            <div className="bg-white rounded-2xl border border-brand-border p-4 shadow-soft-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-brand-text uppercase tracking-wider">
                  Location Map
                </span>
                <span className="text-brand-green font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Verified Pin
                </span>
              </div>

              <div className="h-64 rounded-xl overflow-hidden border border-brand-border">
                <StationMap
                  stations={[station]}
                  selectedStationId={station.id}
                  center={{ lat: station.latitude, lng: station.longitude }}
                  zoom={15}
                  className="w-full h-full"
                />
              </div>

              <a
                href={getGoogleMapsDirectionsUrl(station.latitude, station.longitude, station.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-silver-light hover:bg-silver text-brand-dark border border-silver text-xs font-semibold transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-brand-green" />
                Open In Google Maps App
              </a>
            </div>

            {/* Nearby Stations in Same City */}
            {nearbyStations.length > 0 && (
              <div className="bg-white rounded-2xl border border-brand-border p-5 shadow-soft-sm space-y-3">
                <h3 className="text-xs font-bold text-brand-text uppercase tracking-wider">
                  More Stations in {station.city}
                </h3>
                <div className="space-y-2.5">
                  {nearbyStations.map(ns => (
                    <Link
                      key={ns.id}
                      to={`/stations/${ns.id}`}
                      className="block p-3 rounded-xl border border-brand-border hover:border-silver-dark hover:bg-silver-light/40 transition-all text-xs space-y-1"
                    >
                      <h4 className="font-semibold text-brand-text line-clamp-1">{ns.name}</h4>
                      <p className="text-[11px] text-brand-muted line-clamp-1">{ns.address}</p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-silver px-1.5 py-0.5 rounded text-brand-text font-medium">
                          {ns.connector_type}
                        </span>
                        {ns.charging_speed_kw && (
                          <span className="text-[10px] text-brand-green font-semibold">
                            {ns.charging_speed_kw} kW
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
};
