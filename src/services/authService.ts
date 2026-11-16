import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types/station';

const LOCAL_ADMIN_SESSION_KEY = 'ev_admin_session_india';

// Default mock admin credentials when testing offline without Supabase keys
const MOCK_ADMIN_EMAIL = 'admin@evindia.org';
const MOCK_ADMIN_PASS = 'admin123';

export const AuthService = {
  isConfigured(): boolean {
    return isSupabaseConfigured;
  },

  async login(email: string, password: string): Promise<AdminUser> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        throw new Error(error?.message || 'Invalid email or password.');
      }

      // Verify the user is registered in public.admin_users
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminErr || !adminRecord) {
        // Sign out if authenticated in Auth but not authorized in admin_users
        await supabase.auth.signOut();
        throw new Error('Access denied: You do not have administrator privileges.');
      }

      const adminUser: AdminUser = {
        id: data.user.id,
        email: data.user.email || email,
        role: adminRecord.role || 'admin',
        created_at: adminRecord.created_at,
      };

      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    // Local / Development Offline Mode
    if (email.trim().toLowerCase() === MOCK_ADMIN_EMAIL && password === MOCK_ADMIN_PASS) {
      const mockAdmin: AdminUser = {
        id: 'mock-admin-uuid-001',
        email: MOCK_ADMIN_EMAIL,
        role: 'admin',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(mockAdmin));
      return mockAdmin;
    } else {
      throw new Error('Invalid credentials. (For demo offline mode: use admin@evindia.org / admin123)');
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
        return null;
      }

      // Verify role in admin_users
      const { data: adminRecord } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (!adminRecord) {
        return null;
      }

      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        role: adminRecord.role || 'admin',
        created_at: adminRecord.created_at,
      };
    }

    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Error reading local admin session', err);
    }
    return null;
  }
};
