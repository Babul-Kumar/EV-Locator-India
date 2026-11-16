import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Mail, Phone, ExternalLink, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary border-t border-brand-border text-brand-text pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-white shadow-soft-sm">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold text-base tracking-tight text-brand-text">
                EV LOCATOR <span className="text-xs text-brand-green font-semibold">INDIA</span>
              </span>
            </div>
            <p className="text-xs font-semibold text-brand-green tracking-wide">
              Find. Locate. Charge. Move Forward.
            </p>
            <p className="text-xs text-brand-muted leading-relaxed">
              India\'s trusted electric vehicle charging discovery platform. Connecting EV drivers with verified charging points across highways and urban corridors.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link to="/" className="hover:text-brand-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/stations" className="hover:text-brand-green transition-colors">
                  Find Stations Map
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-green transition-colors">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-green transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-green transition-colors flex items-center gap-1">
                  <Shield className="w-3 h-3 text-slate-400" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Indian Cities Covered */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Major Hubs
            </h4>
            <ul className="space-y-2 text-xs text-brand-muted">
              <li>
                <Link to="/stations?city=New%20Delhi" className="hover:text-brand-green transition-colors">
                  Delhi NCR Corridor
                </Link>
              </li>
              <li>
                <Link to="/stations?city=Mumbai" className="hover:text-brand-green transition-colors">
                  Mumbai & Pune Expressway
                </Link>
              </li>
              <li>
                <Link to="/stations?city=Bengaluru" className="hover:text-brand-green transition-colors">
                  Bengaluru Tech Corridors
                </Link>
              </li>
              <li>
                <Link to="/stations?city=Hyderabad" className="hover:text-brand-green transition-colors">
                  Hyderabad HITEC City
                </Link>
              </li>
              <li>
                <Link to="/stations?city=Chennai" className="hover:text-brand-green transition-colors">
                  Chennai OMR Fast Points
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
              Operations & Support
            </h4>
            <div className="space-y-2 text-xs text-brand-muted">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>New Delhi / Bengaluru, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>support@evlocatorindia.org</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>+91 1800-EV-INDIA (Toll Free)</span>
              </p>
            </div>
            <div className="pt-2 text-[11px] text-slate-400 leading-normal">
              *Station availability and speeds are based on registered operator metadata and database records.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <p>© {new Date().getFullYear()} EV Charging Station Locator – India. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>National Electric Mobility Mission</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
