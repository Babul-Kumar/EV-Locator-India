import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Shield, Eye, EyeOff, Lock, Mail, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { AuthService } from '../../services/authService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLiveSupabase = AuthService.isConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await AuthService.login(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@evindia.org');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back to public website */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-muted hover:text-brand-text bg-white border border-brand-border px-3.5 py-2 rounded-xl shadow-soft-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Website
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-dark flex items-center justify-center text-white shadow-soft-md">
            <Shield className="w-6 h-6 text-brand-green" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-brand-text tracking-tight">
          Admin Portal Authentication
        </h2>
        <p className="mt-1 text-center text-xs text-brand-muted">
          EV Charging Station Locator – India Management Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-brand-border shadow-soft-lg space-y-6">
          
          {/* Environment Status Badge */}
          <div className="p-3 rounded-xl bg-background-secondary border border-silver flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-brand-muted">
              <p className="font-semibold text-brand-text">
                {isLiveSupabase ? 'Connected to Supabase Auth' : 'Local Verification Mode Active'}
              </p>
              <p className="text-[11px] leading-relaxed">
                {isLiveSupabase
                  ? 'Sign in using your authorized Supabase administrator account.'
                  : 'For initial testing without Supabase keys, use the demo credentials below.'}
              </p>
              {!isLiveSupabase && (
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-brand-green hover:underline font-semibold text-[11px] block pt-1"
                >
                  Click to auto-fill demo credentials (admin@evindia.org / admin123)
                </button>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Authentication Failed: </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-text">
                Admin Email Address
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@evindia.org"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-brand-text">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-brand-border text-xs text-brand-text bg-background-secondary focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-brand-text"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-semibold shadow-soft-sm transition-all disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Secure Admin Sign In</span>
                </>
              )}
            </button>

          </form>

        </div>
      </div>

    </div>
  );
};
