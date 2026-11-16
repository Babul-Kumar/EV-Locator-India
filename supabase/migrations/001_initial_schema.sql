-- ==============================================================================
-- EV CHARGING STATION LOCATOR – INDIA
-- Database Migration: 001_initial_schema.sql
-- ==============================================================================

-- 1. Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create updated_at automated trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS 
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
 LANGUAGE plpgsql;

-- 3. Create charging_stations table
CREATE TABLE IF NOT EXISTS public.charging_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$'),
    latitude DOUBLE PRECISION NOT NULL CHECK (latitude >= -90.0 AND latitude <= 90.0),
    longitude DOUBLE PRECISION NOT NULL CHECK (longitude >= -180.0 AND longitude <= 180.0),
    connector_type TEXT NOT NULL,
    charging_speed_kw NUMERIC CHECK (charging_speed_kw IS NULL OR charging_speed_kw > 0),
    description TEXT,
    contact_phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for auto-updating updated_at timestamp
DROP TRIGGER IF EXISTS set_charging_stations_updated_at ON public.charging_stations;
CREATE TRIGGER set_charging_stations_updated_at
BEFORE UPDATE ON public.charging_stations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for lightning-fast queries across India
CREATE INDEX IF NOT EXISTS idx_charging_stations_city_state ON public.charging_stations(city, state);
CREATE INDEX IF NOT EXISTS idx_charging_stations_coords ON public.charging_stations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_charging_stations_connector ON public.charging_stations(connector_type);
CREATE INDEX IF NOT EXISTS idx_charging_stations_active ON public.charging_stations(is_active);

-- 4. Create admin_users table for secure role-based access control
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Helper function to check if current authenticated user is an administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS 
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.admin_users 
        WHERE id = auth.uid()
    );
END;
 LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.charging_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for charging_stations

-- Public users can read all active charging stations
DROP POLICY IF EXISTS Public can view active charging stations ON public.charging_stations;
CREATE POLICY Public can view active charging stations 
ON public.charging_stations 
FOR SELECT 
USING (is_active = true OR public.is_admin());

-- Only authorized administrators can insert new charging stations
DROP POLICY IF EXISTS Admins can insert charging stations ON public.charging_stations;
CREATE POLICY Admins can insert charging stations 
ON public.charging_stations 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Only authorized administrators can update charging stations
DROP POLICY IF EXISTS Admins can update charging stations ON public.charging_stations;
CREATE POLICY Admins can update charging stations 
ON public.charging_stations 
FOR UPDATE 
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Only authorized administrators can delete charging stations
DROP POLICY IF EXISTS Admins can delete charging stations ON public.charging_stations;
CREATE POLICY Admins can delete charging stations 
ON public.charging_stations 
FOR DELETE 
USING (public.is_admin());

-- 8. RLS Policies for admin_users
DROP POLICY IF EXISTS Admins can view admin users list ON public.admin_users;
CREATE POLICY Admins can view admin users list 
ON public.admin_users 
FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

-- Only service role or direct database superusers can manage admin_users
-- Clients cannot insert, update or delete admin_users directly.

-- ==============================================================================
-- INSTRUCTIONS TO CREATE FIRST ADMIN:
-- 1. Create a user in Supabase Dashboard -> Authentication -> Users -> Add User (email + password).
-- 2. Run the following SQL query in the Supabase SQL Editor replacing the UID and Email:
--    INSERT INTO public.admin_users (id, email, role)
--    VALUES ('<USER-UID-FROM-AUTH.USERS>', 'admin@evindia.org', 'admin');
-- ==============================================================================
