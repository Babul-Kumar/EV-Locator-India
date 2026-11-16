import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, PlusCircle, Edit2, Trash2, ExternalLink, 
  Download, Upload, ChevronLeft, ChevronRight, AlertTriangle, 
  CheckCircle2, X, RefreshCw, FileText 
} from 'lucide-react';
import { StationService } from '../../services/stationService';
import { ChargingStation } from '../../types/station';

const ITEMS_PER_PAGE = 10;

export const AdminStationsPage: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedConnector, setSelectedConnector] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Deletion modal state
  const [stationToDelete, setStationToDelete] = useState<ChargingStation | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ added: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Feedback notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await StationService.getStations();
      setStations(data);
    } catch (err) {
      console.error('Error fetching stations for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Extract filter options
  const availableStates = useMemo(() => {
    const set = new Set(stations.map(s => s.state).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [stations]);

  const availableCities = useMemo(() => {
    const filtered = selectedState === 'All' 
      ? stations 
      : stations.filter(s => s.state.toLowerCase() === selectedState.toLowerCase());
    const set = new Set(filtered.map(s => s.city).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [stations, selectedState]);

  // Filtered & Searched Stations
  const filteredStations = useMemo(() => {
    return stations.filter(s => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.pincode && s.pincode.includes(q));

      const matchesState = selectedState === 'All' || s.state.toLowerCase() === selectedState.toLowerCase();
      const matchesCity = selectedCity === 'All' || s.city.toLowerCase() === selectedCity.toLowerCase();
      const matchesConnector = selectedConnector === 'All' || s.connector_type === selectedConnector;

      return matchesSearch && matchesState && matchesCity && matchesConnector;
    });
  }, [stations, searchQuery, selectedState, selectedCity, selectedConnector]);

  // Pagination
  const totalPages = Math.ceil(filteredStations.length / ITEMS_PER_PAGE) || 1;
  const paginatedStations = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStations.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStations, currentPage]);

  const handleDeleteConfirm = async () => {
    if (!stationToDelete) return;
    setDeleting(true);
    try {
      await StationService.deleteStation(stationToDelete.id);
      showToast(`Charging station "${stationToDelete.name}" deleted successfully.`, 'success');
      setStationToDelete(null);
      await fetchStations();
    } catch (err: any) {
      console.error('Delete error:', err);
      showToast(err?.message || 'Failed to delete charging station.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    const csvContent = await StationService.exportStationsToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ev_stations_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTemplate = () => {
    const template = 'name,address,city,state,pincode,latitude,longitude,connector_type,charging_speed_kw\n' +
      '"[SAMPLE] Cyber Hub Fast Point","DLF Cyber City, Sector 24",Gurugram,Haryana,122002,28.4950,77.0895,CCS2,60\n';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ev_stations_import_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResults(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        if (lines.length <= 1) {
          setImportResults({ added: 0, errors: ['CSV file is empty or only contains header row.'] });
          setImporting(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
        const rows: Partial<ChargingStation>[] = [];

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          const matches = line.match(/("[^"]*"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g) || [];
          const values = matches.map(v => v.replace(/^"|"$/g, '').trim());

          const rowObj: any = {};
          headers.forEach((header, colIdx) => {
            rowObj[header] = values[colIdx] || '';
          });

          rows.push({
            name: rowObj['name'],
            address: rowObj['address'],
            city: rowObj['city'],
            state: rowObj['state'],
            pincode: rowObj['pincode'],
            latitude: rowObj['latitude'] ? parseFloat(rowObj['latitude']) : ('' as any),
            longitude: rowObj['longitude'] ? parseFloat(rowObj['longitude']) : ('' as any),
            connector_type: rowObj['connector_type'] || 'CCS2',
            charging_speed_kw: rowObj['charging_speed_kw'] ? parseFloat(rowObj['charging_speed_kw']) : null,
          });
        }

        const result = await StationService.importStations(rows);
        setImportResults(result);
        if (result.added > 0) {
          fetchStations();
          showToast(`Successfully imported ${result.added} charging station(s).`, 'success');
        }
      } catch (err: any) {
        setImportResults({ added: 0, errors: [err?.message || 'Error parsing CSV file.'] });
      } finally {
        setImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-soft-lg border flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom-2 ${
          toastMessage.type === 'success' 
            ? 'bg-green-50 text-brand-green border-green-200' 
            : 'bg-rose-50 text-rose-700 border-rose-200'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-text tracking-tight">
            Station Management
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Create, modify, verify and delete charging station infrastructure records
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-dark bg-white hover:bg-silver-light border border-brand-border shadow-soft-sm transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-brand-green" />
            Import CSV
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-brand-dark bg-white hover:bg-silver-light border border-brand-border shadow-soft-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export CSV
          </button>

          <Link
            to="/admin/stations/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-green hover:bg-brand-green-hover shadow-soft-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Station
          </Link>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-soft-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search station name, address, city, state, or PIN code..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-background-secondary border border-brand-border rounded-xl text-brand-text placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto text-xs">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity('All');
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-background-secondary border border-brand-border text-brand-text font-medium cursor-pointer focus:outline-none"
            >
              <option value="All">All States</option>
              {availableStates.filter(s => s !== 'All').map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-background-secondary border border-brand-border text-brand-text font-medium cursor-pointer focus:outline-none"
            >
              <option value="All">All Cities</option>
              {availableCities.filter(c => c !== 'All').map(ct => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>

            <select
              value={selectedConnector}
              onChange={(e) => {
                setSelectedConnector(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-background-secondary border border-brand-border text-brand-text font-medium cursor-pointer focus:outline-none"
            >
              <option value="All">All Connectors</option>
              <option value="CCS2">CCS2</option>
              <option value="Type 2">Type 2</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Bharat DC-001">Bharat DC-001</option>
            </select>

            {(searchQuery || selectedState !== 'All' || selectedCity !== 'All' || selectedConnector !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedState('All');
                  setSelectedCity('All');
                  setSelectedConnector('All');
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-silver-light hover:bg-silver text-brand-muted hover:text-brand-text font-medium transition-colors"
              >
                Clear
              </button>
            )}
          </div>

        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-brand-border shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-background-secondary border-b border-brand-border text-brand-muted uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Station Name</th>
                <th className="py-3.5 px-4">City</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Connector Type</th>
                <th className="py-3.5 px-4">Charging Speed</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border text-brand-text">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-brand-muted">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-brand-green" />
                      <span>Loading charging stations...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedStations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-brand-muted">
                    <p className="font-semibold text-brand-text">No charging stations match your criteria.</p>
                    <p className="text-[11px] mt-1">Try adjusting filters or add a new station.</p>
                  </td>
                </tr>
              ) : (
                paginatedStations.map((station) => (
                  <tr key={station.id} className="hover:bg-silver-light/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-brand-text max-w-[240px] truncate">
                      {station.name}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-brand-text">
                      {station.city}
                    </td>
                    <td className="py-3.5 px-4 text-brand-muted">
                      {station.state}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded bg-silver-light border border-silver text-brand-dark font-medium">
                        {station.connector_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-green">
                      {station.charging_speed_kw ? `${station.charging_speed_kw} kW` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {station.updated_at
                        ? new Date(station.updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/stations/${station.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-text hover:bg-silver-light inline-block transition-colors"
                        title="View on user website"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/stations/${station.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-brand-green hover:bg-green-50 inline-block transition-colors"
                        title="Edit station information"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setStationToDelete(station)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 inline-block transition-colors"
                        title="Delete station"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-brand-border bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-brand-muted">
          <span>
            Showing <strong className="text-brand-text font-semibold">{paginatedStations.length}</strong> of{' '}
            <strong className="text-brand-text font-semibold">{filteredStations.length}</strong> stations
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-brand-border hover:bg-silver-light disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-semibold text-brand-text">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-brand-border hover:bg-silver-light disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {stationToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-brand-border shadow-soft-lg max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-brand-text">Confirm Station Deletion</h3>
                <p className="text-xs text-brand-muted">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-brand-text font-bold">"{stationToDelete.name}"</strong> ({stationToDelete.city}, {stationToDelete.state})? 
              The station will be removed immediately from all public search results.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-brand-border">
              <button
                type="button"
                onClick={() => setStationToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-muted hover:text-brand-text bg-silver-light hover:bg-silver transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-soft-sm disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Station'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-brand-border shadow-soft-lg max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center text-brand-green">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-brand-text">Batch Import Charging Stations</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-brand-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-brand-muted leading-relaxed">
              Upload a verified CSV file to bulk import stations into your database. Use our standardized column headers.
            </p>

            <div className="p-3.5 rounded-xl bg-background-secondary border border-silver flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-brand-text">Download Sample Template</p>
                <p className="text-[11px] text-brand-muted">Columns: name, address, city, state, pincode, lat, lng, connector, speed</p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 rounded-lg bg-white border border-brand-border text-brand-dark font-semibold text-xs hover:bg-silver-light transition-colors shadow-soft-sm"
              >
                Template
              </button>
            </div>

            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-silver-dark rounded-xl p-6 text-center space-y-3">
              <FileText className="w-8 h-8 text-brand-green mx-auto" />
              <div>
                <label className="cursor-pointer text-xs font-semibold text-brand-green hover:underline">
                  <span>Select CSV File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    disabled={importing}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-brand-muted mt-1">or drag and drop here</p>
              </div>
              {importing && (
                <div className="flex items-center justify-center gap-2 text-xs text-brand-muted">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-green" />
                  <span>Validating and inserting records...</span>
                </div>
              )}
            </div>

            {/* Results Output */}
            {importResults && (
              <div className="space-y-2 text-xs max-h-40 overflow-y-auto p-3 rounded-xl bg-background-secondary border border-brand-border">
                <p className="font-bold text-brand-text flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  Added {importResults.added} station(s) successfully.
                </p>
                {importResults.errors.length > 0 && (
                  <div className="text-rose-600 space-y-1 pt-1">
                    <p className="font-semibold">Validation Errors ({importResults.errors.length}):</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {importResults.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end pt-3 border-t border-brand-border">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-dark bg-silver-light hover:bg-silver transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
