import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, Shield, Compass } from 'lucide-react';
import { AuthService } from '../../services/authService';
import { AdminUser } from '../../types/station';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const location = useLocation();

  useEffect(() => {
    AuthService.getCurrentUser().then(user => setAdminUser(user));
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Find Stations', path: '/stations' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-green to-emerald-700 flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-brand-text flex items-center gap-1.5">
                EV LOCATOR <span className="text-xs font-semibold px-1.5 py-0.2 rounded bg-silver-light border border-silver text-brand-dark">INDIA</span>
              </span>
              <span className="text-[10px] text-brand-muted tracking-wide font-medium">
                Find. Locate. Charge.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors " +
                  (isActive(link.path)
                    ? "text-brand-green bg-green-50/80 font-semibold"
                    : "text-brand-muted hover:text-brand-text hover:bg-silver-light")
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/stations"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-brand-dark bg-silver-light hover:bg-silver border border-silver transition-colors shadow-soft-sm"
            >
              <Compass className="w-3.5 h-3.5 text-brand-green" />
              Explore Map
            </Link>

            {adminUser ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-brand-dark hover:bg-slate-900 shadow-soft-sm transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-brand-green" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-brand-muted hover:text-brand-text hover:bg-silver-light transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-silver-light"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-brand-border bg-white px-4 pt-2 pb-5 space-y-2 shadow-soft-lg animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={
                "block px-3 py-2 rounded-lg text-sm font-medium " +
                (isActive(link.path)
                  ? "text-brand-green bg-green-50 font-semibold"
                  : "text-brand-muted hover:text-brand-text hover:bg-silver-light")
              }
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-brand-border flex flex-col gap-2">
            <Link
              to="/stations"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-brand-dark bg-silver-light border border-silver"
            >
              <Compass className="w-4 h-4 text-brand-green" />
              Explore Map
            </Link>

            {adminUser ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-brand-dark"
              >
                <Shield className="w-4 h-4 text-brand-green" />
                Admin Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium text-brand-text bg-silver-light"
              >
                <Shield className="w-4 h-4" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
