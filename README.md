<div align="center">

# ⚡ EV CHARGING STATION LOCATOR – INDIA
### *Find. Locate. Charge. Move Forward.*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Maps](https://img.shields.io/badge/Google_Maps-Platform-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<p align="center">
  A full-stack, responsive web application connecting electric vehicle drivers across India with verified charging infrastructure, paired with a secure Smart Admin Dashboard for network operators.
</p>

[Live Demo](#) • [Report Issue](https://github.com/Babul-Kumar/EV-Locator-India/issues) • [Setup Guide](#-quick-start) • [Database Architecture](#-database-schema--security)

</div>

---

## 📖 Table of Contents

- [Key Highlights](#-key-highlights)
- [Application Architecture](#-application-architecture)
- [UI/UX Design System](#-uiux-design-system-white--silver-theme)
- [Technology Stack](#-technology-stack)
- [Quick Start & Installation](#-quick-start)
- [Database Schema & Security](#-database-schema--security)
- [Google Maps Integration](#-google-maps-integration)
- [CSV Batch Import & Export](#-csv-batch-import--export)
- [Deployment (Vercel)](#-deployment-to-vercel)
- [Automated Testing](#-automated-testing--quality-audit)

---

## ⚡ Key Highlights

### 🚗 Public User Discovery Portal
- **High-Impact Landing Page (`/`):**
  - Instant location search with quick auto-filters for major Indian metro hubs (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai).
  - Database-driven statistics counters (*Total Listed Stations*, *Cities Covered*, *States Covered*).
  - 3-step walkthrough (*Search location*, *Explore charging stations*, *View details and navigate*) and core benefits overview.
  - EV visual showcase with charging speed indicators and battery status displays.
- **Interactive Find Stations Explorer (`/stations`):**
  - **Split-Screen Interface:** Desktop side-by-side view (Search, filters, scrollable station list on the left; full-height interactive map on the right).
  - **Mobile-Optimized:** Responsive layout with quick toggle between List and Map views.
  - **Live Search:** Instant search across City, State, Location Name, and 6-digit Indian PIN codes.
  - **Filters:** State, City, Connector Type (CCS2, Type 2, CHAdeMO, Bharat DC-001), and Charging Speed categories (Standard $\le 22$ kW, Fast $23 - 60$ kW, Rapid $> 60$ kW) with a "Clear Filters" action.
  - **Geolocation & Haversine Distance:** "Use My Location" GPS integration that calculates geodesic distance in kilometers/meters and sorts nearest-to-farthest.
  - **Turn-by-Turn Navigation:** One-tap navigation opening Google Maps directly with destination coordinates (`https://www.google.com/maps/dir/?api=1&destination=lat,lng`).
  - **Dual Mapping Engine:** Uses Google Maps JavaScript API when `VITE_GOOGLE_MAPS_API_KEY` is present, with an interactive Leaflet/OpenStreetMap fallback so the map never renders blank.
- **Station Details Page (`/stations/:id`):**
  - Complete specifications: Power rating (kW), connector configuration, full address, PIN code, GPS coordinates, helpline phone link, and description.
  - Embedded location map centered on the station pin.
  - "Copy GPS Coordinates" quick action.
  - Recommendations for other nearby charging hubs in the same city.
- **Informational Pages:**
  - About (`/about`): Dedicated background supporting India's National Electric Mobility Mission.
  - Contact (`/contact`): Community support desk and operator correction inquiries.

### 🛡️ Smart Admin Dashboard (`/admin`)
- **Admin Authentication (`/admin/login`):**
  - Protected Supabase Auth login with `admin_users` role check.
  - Password visibility toggle and error handling.
  - Includes local developer fallback credentials (`admin@evindia.org` / `admin123`) for offline test convenience.
- **Admin Dashboard Overview (`/admin/dashboard`):**
  - Real-time KPI summary cards (*Total Stations*, *Cities*, *States*, *Recently Listed*).
  - Dynamic SVG distribution charts (Stations by State, Connector Hardware Breakdown).
  - Recent activity log with direct edit links and instant CSV backup export.
- **Station Management Data Table (`/admin/stations`):**
  - Searchable, filterable, and paginated data table.
  - Actions per station: View details, Edit, and Delete.
  - Safety confirmation modal for station deletions.
  - Bulk CSV Import with header validation and line-item error feedback; includes a downloadable sample template.
  - Complete CSV Export capability.
- **Add Station (`/admin/stations/new`):**
  - Input validation: Required fields, PIN regex (`^\d{6}$`), latitude bounds (`-90` to `90`), longitude bounds (`-180` to `180`), positive kW output.
  - **Interactive Map Location Picker:** Click or drag a pin on the map to automatically populate latitude and longitude.
- **Edit Station (`/admin/stations/:id/edit`):**
  - Pre-populates existing database fields and pins for modification.

---

## 🏛️ Application Architecture

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+  |
|  |           PUBLIC PORTAL             |   |          ADMIN PORTAL              |  |
|  | - Home & Live Network Counters      |   | - Supabase Secure Auth & RBAC      |  |
|  | - Interactive Map & List Explorer   |   | - Real-time Network Analytics      |  |
|  | - GPS Geolocation & Haversine Sort  |   | - Stations Data Grid (CRUD)        |  |
|  | - Technical Specifications & Nav    |   | - Interactive Coordinate Picker    |  |
|  | - City/State/Connector Filtering    |   | - CSV Batch Import / Export        |  |
|  +------------------+------------------+   +-----------------+------------------+  |
|                     |                                        |                    |
+---------------------|----------------------------------------|--------------------+
                      |                                        |
                      v                                        v
+-----------------------------------------------------------------------------------+
|                                 SERVICES LAYER                                    |
|                                                                                   |
|  +------------------------+  +-----------------------+  +----------------------+  |
|  |     StationService     |  |      AuthService      |  |      MapsService     |  |
|  | - Query stations & RLS |  | - Supabase Auth/Admin |  | - Google Maps JS API |  |
|  | - Local mock fallback  |  | - Session persistence |  | - Interactive OSM    |  |
|  | - Haversine calculations|  | - Role verification   |  | - Directions URIs    |  |
|  +-----------+------------+  +-----------+-----------+  +----------+-----------+  |
+--------------|---------------------------|-------------------------|--------------+
               |                           |                         |
               v                           v                         v
+-----------------------------------------------------------------------------------+
|                            DATA & EXTERNAL APIS                                   |
|                                                                                   |
|  +------------------------------------+   +------------------------------------+  |
|  |          SUPABASE CLOUD            |   |          GOOGLE MAPS API           |  |
|  | - PostgreSQL `charging_stations`   |   | - Maps JavaScript API              |  |
|  | - PostgreSQL `admin_users`         |   | - Geocoding & Marker Placement     |  |
|  | - Row Level Security (RLS)         |   | - Direction Navigation URIs        |  |
|  +------------------------------------+   +------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 🎨 UI/UX Design System (White & Silver Theme)

The application implements a SaaS design system engineered for clarity and visual hierarchy:

| Token | Hex Value | Usage |
|---|---|---|
| **Primary Background** | `#FFFFFF` | Core container & card backgrounds |
| **Secondary Background**| `#F5F6F8` | Page body & section contrast background |
| **Silver Tone** | `#E2E5E9` | Subtle borders, badges & divider lines |
| **Border Default** | `#E5E7EB` | Structural cards & table separators |
| **Primary Text** | `#172033` | Headings & dominant typography |
| **Secondary Text** | `#64748B` | Subheadings, metadata & descriptions |
| **Primary Accent (EV)**| `#16A34A` | Charging pins, buttons, badges & active states |
| **Dark Accent** | `#1E293B` | Admin layout header & sidebar surfaces |

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 5, TypeScript 5.6
- **Routing:** React Router v6 (SPA with full history and refresh support)
- **Styling:** Tailwind CSS 3.4
- **Icons:** Lucide React
- **Mapping:** Google Maps JavaScript API (`@googlemaps/js-api-loader`) with Leaflet 1.9 fallback
- **Database & Auth:** Supabase (`@supabase/supabase-js`, PostgreSQL 15+, Row Level Security)
- **Hosting & Deployment:** Vercel (Configured with `vercel.json` SPA rewrite rules)

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Babul-Kumar/EV-Locator-India.git
cd EV-Locator-India
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root (refer to `.env.example`):
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Maps API Key (Optional: Leaflet/OSM active if empty)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 4. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🗄️ Database Schema & Security

### 1. Database Schema
The database migration script is located at [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).

#### Table: `charging_stations`
```sql
CREATE TABLE public.charging_stations (
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
```

#### Table: `admin_users`
```sql
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 2. Row Level Security (RLS) Policies
- **Public Read Access:**
  ```sql
  CREATE POLICY "Public can view active charging stations" 
  ON public.charging_stations FOR SELECT 
  USING (is_active = true OR public.is_admin());
  ```
- **Admin-Only Modifications:**
  ```sql
  CREATE POLICY "Admins can insert charging stations" ON public.charging_stations FOR INSERT WITH CHECK (public.is_admin());
  CREATE POLICY "Admins can update charging stations" ON public.charging_stations FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());
  CREATE POLICY "Admins can delete charging stations" ON public.charging_stations FOR DELETE USING (public.is_admin());
  ```

### 3. Creating the First Administrator
1. In the Supabase Dashboard, create a user in **Authentication -> Users** (e.g. `admin@evindia.org`).
2. Copy the generated UID and execute the following in the **SQL Editor**:
   ```sql
   INSERT INTO public.admin_users (id, email, role)
   VALUES ('<USER-UID-FROM-AUTH.USERS>', 'admin@evindia.org', 'admin');
   ```

---

## 🗺️ Google Maps Integration

1. Enable the **Maps JavaScript API** on the [Google Cloud Console](https://console.cloud.google.com/).
2. Generate an API Key under **Credentials**.
3. Restrict your key to HTTP referrers:
   - `http://localhost:*`
   - `https://your-deployment-domain.vercel.app/*`
4. Assign the key to `VITE_GOOGLE_MAPS_API_KEY` in `.env`.

---

## 📊 CSV Batch Import & Export

The platform supports bulk data population for charging network operators via CSV format:

### Standard CSV Column Headers
```csv
name,address,city,state,pincode,latitude,longitude,connector_type,charging_speed_kw
"[SAMPLE] Cyber City Tech Park Charger","DLF Cyber City, Sector 24",Gurugram,Haryana,122002,28.4950,77.0895,CCS2,60
```
- A sample template is available at [`sample_stations_india.csv`](sample_stations_india.csv).
- The admin dashboard provides both a template download button and a full database CSV export.

---

## ☁️ Deployment to Vercel

1. Push your code to GitHub:
   ```bash
   git push origin main
   ```
2. Import the project into [Vercel](https://vercel.com).
3. Set Framework Preset: **Vite**.
4. Configure Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GOOGLE_MAPS_API_KEY`
5. Deploy. Routing rewrites are pre-configured via [`vercel.json`](vercel.json):
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 🧪 Automated Testing & Quality Audit

Run the test suite:
```bash
node scripts/test_suite.cjs
```

The test runner verifies:
- Database schema structure, triggers, and RLS policies
- Coordinate validation constraints
- Haversine distance computations and navigation URL formats
- Sample seed data integrity and CSV header compliance
- Production build artifact verification

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.