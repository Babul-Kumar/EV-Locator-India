import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, MapPin, PlusCircle, LogOut, Database, 
  Menu, X, ExternalLink, Zap, ChevronRight 
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { StationService } from '../../services/stationService';
import { AdminUser } from '../../types/station';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLiveDb = StationService.isUsingLiveDatabase();

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((user) => {
        if (!user) {
          navigate('/admin/login');
        } else {
          setAdminUser(user);
        }
        setLoading(false);
      })
      .catch(() => {
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    await AuthService.logout();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-secondary flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-brand-muted font-medium">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Stations', path: '/admin/stations', icon: MapPin },
    { label: 'Add Station', path: '/admin/stations/new', icon: PlusCircle },
  ];

  const isCurrent = (path: string) => {
    if (path === '/admin/stations' && location.pathname === '/admin/stations') return true;
    if (path !== '/admin/stations' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col md:flex-row text-brand-text font-sans">
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-brand-dark text-white p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-green flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-sm tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className={
        "fixed inset-y-0 left-0 z-40 w-64 bg-brand-dark text-white flex flex-col transition-transform md:translate-x-0 md:static " +
        (sidebarOpen ? "translate-x-0" : "-translate-x-full")
      }>
        
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-green to-emerald-700 flex items-center justify-center text-white shadow-soft-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">EV LOCATOR</h2>
              <p className="text-[10px] text-brand-green font-semibold uppercase tracking-wider">Admin Operations</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Connection Status Banner */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              Storage Engine
            </span>
            <span className={"w-2 h-2 rounded-full " + (isLiveDb ? "bg-brand-green" : "bg-amber-400")}></span>
          </div>
          <p className="text-xs font-semibold text-white">
            {isLiveDb ? 'Supabase PostgreSQL' : 'Local Mock Persistence'}
          </p>
          <p className="text-[10px] text-slate-400 leading-tight">
            {isLiveDb 
              ? 'Connected to live cloud schema with RLS enforcement.'
              : 'Add Supabase keys in .env for production cloud sync.'}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all " +
                  (active
                    ? "bg-brand-green text-white font-semibold shadow-soft-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white")
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: User details & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
              {adminUser.email.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{adminUser.email}</p>
              <p className="text-[10px] text-brand-green uppercase font-bold tracking-wider">{adminUser.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Open public website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Site
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Desktop Topbar */}
        <header className="hidden md:flex bg-white border-b border-brand-border px-8 py-3.5 items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-brand-text capitalize">
              {location.pathname.replace('/admin/', '').replace('/', ' ') || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-brand-muted">
              Signed in as <strong className="text-brand-text font-semibold">{adminUser.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
