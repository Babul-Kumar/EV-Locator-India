import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Zap, Navigation, ShieldCheck, Clock, ArrowRight, Gauge, CheckCircle2, ChevronRight } from 'lucide-react';
import { StationService } from '../services/stationService';
import { DashboardStats } from '../types/station';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    StationService.getDashboardStats()
      .then((data) => {
        if (isMounted) {
          setStats(data);
          setLoadingStats(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load stats', err);
        if (isMounted) setLoadingStats(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/stations?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/stations');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-brand-border bg-gradient-to-b from-background-secondary via-white to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading, Subheading & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-silver-light border border-silver text-xs font-semibold text-brand-dark shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>
                <span>EV CHARGING STATION LOCATOR – INDIA</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-brand-text tracking-tight leading-tight">
                Find EV Charging Stations <span className="text-brand-green">Across India</span>
              </h1>

              <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Discover nearby electric vehicle charging stations, explore locations and find your next charging point with ease.
              </p>

              {/* Prominent Search Component */}
              <div className="max-w-xl mx-auto lg:mx-0 pt-2">
                <form 
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl border border-brand-border shadow-soft-lg"
                >
                  <div className="relative flex-1 w-full flex items-center pl-3">
                    <Search className="w-5 h-5 text-brand-muted flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter city, location or PIN code..."
                      className="w-full px-3 py-2.5 text-sm bg-transparent border-0 text-brand-text placeholder-brand-muted focus:outline-none focus:ring-0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-sm font-semibold transition-all shadow-soft-sm flex-shrink-0"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Find Stations
                  </button>
                </form>
                
                {/* Popular Quick Searches */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 mt-3 text-xs text-brand-muted">
                  <span className="font-medium text-slate-400">Popular Hubs:</span>
                  {['New Delhi', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'].map((city) => (
                    <button
                      key={city}
                      onClick={() => navigate(`/stations?city=${encodeURIComponent(city)}`)}
                      className="px-2.5 py-1 rounded-md bg-silver-light hover:bg-silver text-brand-text border border-silver transition-colors text-xs font-medium"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/stations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-dark hover:bg-slate-900 text-white text-sm font-semibold transition-colors shadow-soft-sm"
                >
                  <Navigation className="w-4 h-4 text-brand-green" />
                  Explore Interactive Map
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-silver-light hover:bg-silver text-brand-text border border-silver text-sm font-semibold transition-colors"
                >
                  Learn How It Works
                  <ChevronRight className="w-4 h-4 text-brand-muted" />
                </Link>
              </div>

            </div>

            {/* Right Column: Premium EV Visual Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl border border-brand-border p-6 shadow-soft-lg space-y-6">
                
                {/* Station Card Preview */}
                <div className="flex items-center justify-between border-b border-brand-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand-green-light flex items-center justify-center text-brand-green">
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-text">Fast Charging Bay</h4>
                      <p className="text-xs text-brand-muted flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-green" />
                        Connaught Place, New Delhi
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-brand-green text-xs font-semibold">
                    Active 24/7
                  </span>
                </div>

                {/* Battery Status Visual */}
                <div className="bg-background-secondary rounded-2xl p-4 border border-silver space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-brand-muted">Charging Output</span>
                    <span className="font-bold text-brand-green flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 120 kW Super DC
                    </span>
                  </div>
                  <div className="w-full bg-silver rounded-full h-2.5 overflow-hidden">
                    <div className="bg-brand-green h-2.5 rounded-full w-4/5 animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-brand-muted pt-1">
                    <span>Standard CCS2 Dual Gun</span>
                    <span>30 Mins to 80%</span>
                  </div>
                </div>

                {/* Feature Pills */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-brand-border bg-white flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span className="font-medium text-brand-text">Verified Coordinates</span>
                  </div>
                  <div className="p-3 rounded-xl border border-brand-border bg-white flex items-center gap-2.5">
                    <Navigation className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span className="font-medium text-brand-text">Google Navigation</span>
                  </div>
                  <div className="p-3 rounded-xl border border-brand-border bg-white flex items-center gap-2.5">
                    <Gauge className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span className="font-medium text-brand-text">Power Specs in kW</span>
                  </div>
                  <div className="p-3 rounded-xl border border-brand-border bg-white flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
                    <span className="font-medium text-brand-text">Multi-Connector</span>
                  </div>
                </div>

                {/* CTA inside preview */}
                <Link
                  to="/stations"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-silver-light hover:bg-silver text-brand-dark font-semibold text-xs border border-silver transition-colors"
                >
                  <span>Browse All Verified Stations</span>
                  <ArrowRight className="w-4 h-4 text-brand-green" />
                </Link>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DATABASE-DRIVEN STATISTICS SECTION */}
      <section className="py-12 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            {/* Stat 1: Total Listed Stations */}
            <div className="p-6 rounded-2xl bg-background-secondary border border-brand-border shadow-soft-sm">
              <div className="w-10 h-10 mx-auto rounded-xl bg-green-100/80 flex items-center justify-center text-brand-green mb-3">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <p className="text-3xl font-extrabold text-brand-text tracking-tight">
                {loadingStats ? '...' : (stats?.totalStations ?? 0)}
              </p>
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mt-1">
                Total Listed Charging Stations
              </h3>
            </div>

            {/* Stat 2: Cities Covered */}
            <div className="p-6 rounded-2xl bg-background-secondary border border-brand-border shadow-soft-sm">
              <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100/80 flex items-center justify-center text-blue-600 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-brand-text tracking-tight">
                {loadingStats ? '...' : (stats?.totalCities ?? 0)}
              </p>
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mt-1">
                Cities Covered
              </h3>
            </div>

            {/* Stat 3: States Covered */}
            <div className="p-6 rounded-2xl bg-background-secondary border border-brand-border shadow-soft-sm">
              <div className="w-10 h-10 mx-auto rounded-xl bg-slate-200/80 flex items-center justify-center text-brand-dark mb-3">
                <Navigation className="w-5 h-5" />
              </div>
              <p className="text-3xl font-extrabold text-brand-text tracking-tight">
                {loadingStats ? '...' : (stats?.totalStates ?? 0)}
              </p>
              <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mt-1">
                States Covered
              </h3>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 md:py-20 bg-background-secondary border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              Effortless Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
              How It Works
            </h2>
            <p className="text-sm text-brand-muted">
              Find your next charge in three simple, streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-soft-sm space-y-4 hover:border-silver-dark transition-all">
              <div className="w-12 h-12 rounded-2xl bg-silver-light border border-silver flex items-center justify-center text-brand-dark font-bold text-lg">
                1
              </div>
              <h3 className="text-base font-bold text-brand-text">
                Search your location
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Type your city, state or PIN code, or tap "Use My Location" to instantly scan nearby stations sorted by real-world distance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-soft-sm space-y-4 hover:border-silver-dark transition-all">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-brand-green font-bold text-lg">
                2
              </div>
              <h3 className="text-base font-bold text-brand-text">
                Explore charging stations
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Browse interactive markers across Google Maps. Filter by connector type (CCS2, Type 2, CHAdeMO) and minimum kW speed ratings.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-soft-sm space-y-4 hover:border-silver-dark transition-all">
              <div className="w-12 h-12 rounded-2xl bg-silver-light border border-silver flex items-center justify-center text-brand-dark font-bold text-lg">
                3
              </div>
              <h3 className="text-base font-bold text-brand-text">
                View details and navigate
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                Inspect full station address, charging speed specifications, and launch turn-by-turn Google Maps navigation with a single tap.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 md:py-20 bg-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              Built for Electric Mobility
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text tracking-tight">
              Why Choose EV Locator India
            </h2>
            <p className="text-sm text-brand-muted">
              A clean, focused discovery platform without unnecessary clutter or bloated features.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl border border-brand-border bg-background-secondary/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-silver flex items-center justify-center text-brand-green shadow-soft-sm">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-brand-text">Easy station discovery</h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Quick search with instant auto-complete and multi-level filtering tailored to Indian geography.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-background-secondary/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-silver flex items-center justify-center text-brand-green shadow-soft-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-brand-text">Interactive maps</h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Accurate coordinate plotting, custom EV pins, dynamic bounds fitting, and interactive station cards.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-background-secondary/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-silver flex items-center justify-center text-brand-green shadow-soft-sm">
                <Gauge className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-brand-text">Useful station information</h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Accurate kW output figures, connector configurations, physical address details and operator contact.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-background-secondary/50 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-silver flex items-center justify-center text-brand-green shadow-soft-sm">
                <Navigation className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-brand-text">Convenient navigation</h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Direct deep integration with Google Maps driving directions to get you charged without wrong turns.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-brand-dark via-slate-900 to-brand-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Start Finding Your Charging Station
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of EV drivers navigating India's highways and cities with confidence.
          </p>
          <div className="pt-2">
            <Link
              to="/stations"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-semibold text-sm transition-all shadow-soft-lg"
            >
              <Zap className="w-4 h-4 fill-current" />
              Explore Stations Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
