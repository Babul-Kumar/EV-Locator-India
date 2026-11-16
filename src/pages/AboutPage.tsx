import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, MapPin, Gauge, Leaf, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      
      {/* Header Banner */}
      <section className="border-b border-brand-border bg-gradient-to-b from-background-secondary to-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
            Empowering Electric Mobility Across India
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-text tracking-tight">
            About EV Charging Station Locator
          </h1>
          <p className="text-sm sm:text-base text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Our mission is to eliminate range anxiety and accelerate sustainable transportation in India by organizing reliable, accessible charging data.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        
        {/* Core Mission */}
        <div className="bg-white rounded-2xl border border-brand-border p-8 shadow-soft-sm space-y-4">
          <h2 className="text-xl font-bold text-brand-text">Our Vision for India\'s EV Growth</h2>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            With India\'s ambitious Faster Adoption and Manufacturing of Electric Vehicles (FAME) initiatives and state-specific EV roadmaps, electric vehicles are growing rapidly on urban roads and national highways. However, drivers frequently struggle with fragmented data, broken pins, and uncertain charging speeds.
          </p>
          <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
            <strong>EV Charging Station Locator – India</strong> was engineered to bridge this gap: providing clean, database-backed information, verified coordinates, power ratings in kilowatts, and immediate turn-by-turn navigation without ad clutter or subscription paywalls.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-soft-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center text-brand-green">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-text">Verified Data</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Every station record is vetted with actual latitude/longitude coordinates and operator details.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-soft-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-text">Standardized Speeds</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Understand whether a station offers AC slow destination charging (11-22 kW) or DC rapid charging (60-150+ kW).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-brand-border shadow-soft-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-silver flex items-center justify-center text-brand-dark">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-brand-text">Zero Friction Nav</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              One-click Google Maps integration opens native navigation on any smartphone or vehicle dashboard.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-6">
          <Link
            to="/stations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold shadow-soft-sm transition-colors"
          >
            <Zap className="w-4 h-4 fill-current" />
            Explore Charging Stations
          </Link>
        </div>

      </div>

    </div>
  );
};
