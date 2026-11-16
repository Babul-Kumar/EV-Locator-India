import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, MapPin, Navigation, PlusCircle, Edit2, 
  FileSpreadsheet, ArrowRight, Clock, ShieldCheck 
} from 'lucide-react';
import { StationService } from '../../services/stationService';
import { DashboardStats } from '../../types/station';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    StationService.getDashboardStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load dashboard stats:', err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleExportCsv = async () => {
    const csvContent = await StationService.exportStationsToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ev_stations_india_backup.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-silver rounded w-1/4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white rounded-2xl border border-brand-border"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Live infrastructure metrics and operational status across India
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-dark bg-white hover:bg-silver-light border border-brand-border shadow-soft-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-brand-green" />
            Export CSV
          </button>

          <Link
            to="/admin/stations/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-green hover:bg-brand-green-hover shadow-soft-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Charging Station
          </Link>
        </div>
      </div>

      {/* SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Charging Stations */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-brand-muted">Total Stations</p>
            <h3 className="text-2xl font-extrabold text-brand-text mt-1">
              {stats?.totalStations ?? 0}
            </h3>
            <span className="text-[11px] text-brand-green font-medium flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> Active in Directory
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-brand-green">
            <Zap className="w-6 h-6 fill-current" />
          </div>
        </div>

        {/* Card 2: Total Cities */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-brand-muted">Total Cities</p>
            <h3 className="text-2xl font-extrabold text-brand-text mt-1">
              {stats?.totalCities ?? 0}
            </h3>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1 mt-1">
              Urban & Highway Hubs
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Total States */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-brand-muted">States & UTs</p>
            <h3 className="text-2xl font-extrabold text-brand-text mt-1">
              {stats?.totalStates ?? 0}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1">
              National Coverage
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-silver flex items-center justify-center text-brand-dark">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Recently Added */}
        <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-soft-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-brand-muted">Recently Listed</p>
            <h3 className="text-2xl font-extrabold text-brand-text mt-1">
              {stats?.recentStations.length ?? 0}
            </h3>
            <span className="text-[11px] text-purple-600 font-medium flex items-center gap-1 mt-1">
              Latest Updates
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* CHARTS & DISTRIBUTION BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* State Distribution Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-brand-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
                Stations by State
              </h3>
              <p className="text-xs text-brand-muted">Breakdown of recorded charging stations across regions</p>
            </div>
            <span className="text-xs text-brand-green font-semibold">
              {stats?.stationsByState.length} States
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {stats?.stationsByState.slice(0, 6).map((item) => {
              const maxCount = stats.totalStations || 1;
              const percent = Math.round((item.count / maxCount) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-brand-text">{item.name}</span>
                    <span className="text-brand-muted font-mono font-semibold">
                      {item.count} ({percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-silver-light rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-brand-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percent, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Connector Type Distribution */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-brand-border shadow-soft-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
              Connector Distribution
            </h3>
            <p className="text-xs text-brand-muted">Hardware compatibility across network</p>
          </div>

          <div className="space-y-2.5 pt-2">
            {stats?.connectorDistribution.map((conn) => (
              <div 
                key={conn.name}
                className="flex items-center justify-between p-3 rounded-xl border border-brand-border bg-background-secondary text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-green"></div>
                  <span className="font-semibold text-brand-text">{conn.name}</span>
                </div>
                <span className="font-mono font-bold text-brand-green bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                  {conn.count} stations
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RECENT ACTIVITY & STATIONS TABLE */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-soft-sm overflow-hidden">
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider">
              Recently Added & Updated Stations
            </h3>
            <p className="text-xs text-brand-muted mt-0.5">Latest infrastructure records added to database</p>
          </div>
          <Link
            to="/admin/stations"
            className="text-xs font-semibold text-brand-green hover:underline flex items-center gap-1"
          >
            <span>View All Stations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-secondary border-b border-brand-border text-brand-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Station Name</th>
                <th className="py-3.5 px-4">City & State</th>
                <th className="py-3.5 px-4">Connector</th>
                <th className="py-3.5 px-4">Speed (kW)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-text">
              {stats?.recentStations.map((station) => (
                <tr key={station.id} className="hover:bg-silver-light/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-brand-text">
                    {station.name}
                  </td>
                  <td className="py-3.5 px-4 text-brand-muted">
                    {station.city}, {station.state}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-silver-light border border-silver text-brand-dark font-medium">
                      {station.connector_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-brand-green">
                    {station.charging_speed_kw ? `${station.charging_speed_kw} kW` : '—'}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/stations/${station.id}/edit`}
                      className="inline-flex items-center gap-1 text-slate-600 hover:text-brand-text font-medium"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
