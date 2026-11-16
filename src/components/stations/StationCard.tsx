import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Zap, Navigation, ExternalLink } from 'lucide-react';
import { ChargingStation } from '../../types/station';
import { getGoogleMapsDirectionsUrl, formatDistance } from '../../utils/haversine';

interface StationCardProps {
  station: ChargingStation;
  isSelected?: boolean;
  onSelect?: (station: ChargingStation) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  station,
  isSelected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(station)}
      className={
        "p-4 rounded-xl border transition-all cursor-pointer bg-white " +
        (isSelected
          ? "border-brand-green ring-2 ring-brand-green/20 shadow-soft-md"
          : "border-brand-border hover:border-silver-dark hover:shadow-soft-sm")
      }
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-brand-green flex-shrink-0">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-text line-clamp-1">
              {station.name}
            </h3>
            <p className="text-xs text-brand-muted flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1">{station.city}, {station.state}</span>
              {station.pincode && <span className="text-slate-400">• {station.pincode}</span>}
            </p>
          </div>
        </div>

        {station.distance_km !== undefined && (
          <span className="text-[11px] font-semibold text-brand-green bg-green-50 border border-green-200 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
            {formatDistance(station.distance_km)}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-600 mt-2 mb-3 line-clamp-2 leading-relaxed">
        {station.address}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <span className="bg-silver-light border border-silver px-2 py-0.5 rounded text-brand-text font-medium">
          {station.connector_type}
        </span>
        {station.charging_speed_kw ? (
          <span className="bg-emerald-50 text-brand-green border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {station.charging_speed_kw} kW
          </span>
        ) : (
          <span className="text-slate-400 text-[11px]">Speed not specified</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-brand-border" onClick={(e) => e.stopPropagation()}>
        <Link
          to={`/stations/${station.id}`}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-brand-dark bg-silver-light hover:bg-silver rounded-lg transition-colors border border-silver"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-muted" />
          Details
        </Link>
        <a
          href={getGoogleMapsDirectionsUrl(station.latitude, station.longitude, station.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-brand-green hover:bg-brand-green-hover rounded-lg transition-colors shadow-soft-sm"
        >
          <Navigation className="w-3.5 h-3.5" />
          Directions
        </a>
      </div>
    </div>
  );
};
