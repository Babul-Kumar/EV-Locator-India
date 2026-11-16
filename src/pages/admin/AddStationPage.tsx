import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Save, AlertCircle 
} from 'lucide-react';
import { StationService } from '../../services/stationService';
import { StationFormData } from '../../types/station';
import { LocationPickerMap } from '../../components/maps/LocationPickerMap';

export const AddStationPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<StationFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    connector_type: 'CCS2',
    charging_speed_kw: '',
    description: '',
    contact_phone: '',
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = 'Station name is required.';
    if (!formData.address.trim()) errors.address = 'Street address is required.';
    if (!formData.city.trim()) errors.city = 'City is required.';
    if (!formData.state.trim()) errors.state = 'State / UT is required.';

    if (formData.latitude === '' || isNaN(Number(formData.latitude))) {
      errors.latitude = 'Latitude is required.';
    } else {
      const lat = Number(formData.latitude);
      if (lat < -90 || lat > 90) errors.latitude = 'Latitude must be between -90 and 90.';
    }

    if (formData.longitude === '' || isNaN(Number(formData.longitude))) {
      errors.longitude = 'Longitude is required.';
    } else {
      const lng = Number(formData.longitude);
      if (lng < -180 || lng > 180) errors.longitude = 'Longitude must be between -180 and 180.';
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode.trim())) {
      errors.pincode = 'PIN Code must be exactly 6 digits.';
    }

    if (formData.charging_speed_kw !== '' && Number(formData.charging_speed_kw) <= 0) {
      errors.charging_speed_kw = 'Charging speed must be a positive number in kW.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) return;

    setSaving(true);
    try {
      await StationService.createStation({
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim() || null,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        connector_type: formData.connector_type,
        charging_speed_kw: formData.charging_speed_kw ? Number(formData.charging_speed_kw) : null,
        description: formData.description.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        is_active: formData.is_active,
      });

      navigate('/admin/stations');
    } catch (err: any) {
      console.error('Failed to create station:', err);
      setErrorMessage(err?.message || 'Database operation failed. Could not save charging station.');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/stations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Station List
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-soft-sm space-y-6">
        
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-brand-text tracking-tight">
            Add New Charging Station
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Register a verified EV charging location into the public national database
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Submission Error</p>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Station Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-text uppercase tracking-wider border-b border-brand-border pb-2">
              1. Basic Identification
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Station Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Connaught Place Fast Hub or Indiranagar EV Station"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                  validationErrors.name ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                }`}
              />
              {validationErrors.name && (
                <p className="text-[11px] text-rose-600 font-medium">{validationErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Complete Street Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Physical landmark, street, building or highway kilometer marker..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                  validationErrors.address ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                }`}
              />
              {validationErrors.address && (
                <p className="text-[11px] text-rose-600 font-medium">{validationErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Bengaluru"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.city ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.city && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.city}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  State / UT <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Karnataka"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.state ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.state && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.state}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  PIN Code (6 Digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g. 560038"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.pincode ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.pincode && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.pincode}</p>
                )}
              </div>
            </div>

          </div>

          {/* Section 2: Coordinates with Map Picker */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-text uppercase tracking-wider border-b border-brand-border pb-2">
              2. Geographic Coordinates & Map Pin
            </h3>

            <LocationPickerMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onCoordinatesSelected={(lat, lng) => {
                setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
                setValidationErrors(prev => ({ ...prev, latitude: '', longitude: '' }));
              }}
              className="w-full h-64"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  Latitude (-90 to 90) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  placeholder="e.g. 12.9784"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.latitude ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.latitude && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.latitude}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  Longitude (-180 to 180) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  placeholder="e.g. 77.6408"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.longitude ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.longitude && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.longitude}</p>
                )}
              </div>
            </div>

          </div>

          {/* Section 3: Technical Specs */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-text uppercase tracking-wider border-b border-brand-border pb-2">
              3. Charging Specifications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  Connector Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.connector_type}
                  onChange={(e) => setFormData({ ...formData, connector_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                >
                  <option value="CCS2">CCS2 (Combined Charging System - Type 2 DC)</option>
                  <option value="Type 2">Type 2 (AC Slow/Fast Mennekes)</option>
                  <option value="CHAdeMO">CHAdeMO (DC Quick Charge)</option>
                  <option value="Bharat DC-001">Bharat DC-001 (15-30 kW DC)</option>
                  <option value="Bharat AC-001">Bharat AC-001 (3.3 kW AC)</option>
                  <option value="GB/T">GB/T (China Standard)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-brand-text">
                  Charging Output (kW)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={formData.charging_speed_kw}
                  onChange={(e) => setFormData({ ...formData, charging_speed_kw: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                  placeholder="e.g. 60 or 120"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 ${
                    validationErrors.charging_speed_kw ? 'border-rose-400' : 'border-brand-border focus:border-brand-green'
                  }`}
                />
                {validationErrors.charging_speed_kw && (
                  <p className="text-[11px] text-rose-600 font-medium">{validationErrors.charging_speed_kw}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Helpline / Operator Contact Phone (Optional)
              </label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                placeholder="e.g. +91 80 2520 1122"
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-brand-text">
                Description & Operator Amenities (Optional)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add amenities (cafe, restrooms, parking availability, operational hours, tariff)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-xs bg-background-secondary text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-brand-green border-brand-border rounded focus:ring-brand-green"
                />
                <span className="text-xs font-semibold text-brand-text">
                  List as Active & Discoverable on User Website
                </span>
              </label>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-border">
            <Link
              to="/admin/stations"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-brand-dark bg-silver-light hover:bg-silver transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold shadow-soft-sm transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Record...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Station to Database</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
