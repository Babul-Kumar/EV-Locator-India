import React from 'react';
import { Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { FindStationsPage } from './pages/FindStationsPage';
import { StationDetailsPage } from './pages/StationDetailsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStationsPage } from './pages/admin/AdminStationsPage';
import { AddStationPage } from './pages/admin/AddStationPage';
import { EditStationPage } from './pages/admin/EditStationPage';

import { Zap, ArrowLeft } from 'lucide-react';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-green selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border p-8 shadow-soft-lg space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-silver-light flex items-center justify-center text-brand-dark font-bold text-xl">
          404
        </div>
        <h2 className="text-xl font-bold text-brand-text">Page Not Found</h2>
        <p className="text-xs text-brand-muted leading-relaxed">
          The page or route you are attempting to access does not exist on the EV Charging Station Locator platform.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold shadow-soft-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes with Navbar and Footer */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/stations" element={<FindStationsPage />} />
        <Route path="/stations/:id" element={<StationDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Console Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="stations" element={<AdminStationsPage />} />
        <Route path="stations/new" element={<AddStationPage />} />
        <Route path="stations/:id/edit" element={<EditStationPage />} />
      </Route>

      {/* Catch-all Not Found Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
