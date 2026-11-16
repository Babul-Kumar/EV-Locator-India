# EV CHARGING STATION LOCATOR – INDIA
## Comprehensive Project Implementation Plan

**Tagline:** Find. Locate. Charge. Move Forward.

---

### 1. Project Overview
The **EV Charging Station Locator – India** is a modern full-stack web application designed to connect electric vehicle drivers across India with charging infrastructure. It combines an intuitive, responsive public discovery experience with an administrative dashboard for charging network operators and system admins.

---

### 2. Application Architecture

`
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +-------------------------------------+   +------------------------------------+  |
|  |           PUBLIC PORTAL             |   |          ADMIN PORTAL              |  |
|  | - Home & Analytics Highlights       |   | - Supabase Secure Auth & RLS       |  |
|  | - Interactive Map & List Explorer   |   | - Real-time Network Metrics        |  |
|  | - Geolocation & Haversine Distance  |   | - Stations Data Grid (CRUD)        |  |
|  | - Detailed Station Specs & Nav      |   | - Interactive Coordinate Picker    |  |
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
|  | - Local mock fallback  |  | - Session persistence |  | - Interactive Fallback|  |
|  | - Haversine calculations|  | - Role verification   |  | - Directions URLs    |  |
|  +-----------+------------+  +-----------+-----------+  +----------+-----------+  |
+--------------|---------------------------|-------------------------|--------------+
               |                           |                         |
               v                           v                         v
+-----------------------------------------------------------------------------------+
|                            DATA & EXTERNAL APIS                                   |
|                                                                                   |
|  +------------------------------------+   +------------------------------------+  |
|  |          SUPABASE CLOUD            |   |          GOOGLE MAPS API           |  |
|  | - PostgreSQL charging_stations   |   | - Maps JavaScript API              |  |
|  | - PostgreSQL dmin_users         |   | - Geocoding & Marker Placement     |  |
|  | - Row Level Security (RLS)         |   | - Direction Navigation URIs        |  |
|  +------------------------------------+   +------------------------------------+  |
+-----------------------------------------------------------------------------------+
`

---

### 3. Technology Stack

- **Frontend Core:** React 18 / 19, Vite, TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS with a custom White & Silver design system
  - Primary Background: #FFFFFF
  - Secondary Background: #F5F6F8
  - Silver Tone: #E2E5E9
  - Border: #E5E7EB
  - Primary Typography: #172033
  - Secondary Typography: #64748B
  - EV Emerald Accent: #16A34A
  - Slate Accent: #1E293B
- **Icons:** Lucide React
- **Maps:** Google Maps JavaScript API (with robust Leaflet/OSM interactive fallback when API key is pending)
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **State & Utilities:** Modular service layer with seamless mock/local storage persistence when external credentials are unconfigured

---

### 4. Database Schema Design

#### charging_stations
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique station ID |
| 
ame | TEXT | NOT NULL | Commercial/Operational station name |
| ddress | TEXT | NOT NULL | Complete street address |
| city | TEXT | NOT NULL | City in India (e.g., New Delhi, Bengaluru) |
| state | TEXT | NOT NULL | State / UT (e.g., Karnataka, Maharashtra) |
| pincode | TEXT | CHECK (pincode ~ '^[0-9]{6}$') | 6-digit Indian PIN code |
| latitude | DOUBLE PRECISION | NOT NULL, CHECK (-90 <= lat <= 90) | GPS Latitude |
| longitude | DOUBLE PRECISION | NOT NULL, CHECK (-180 <= lng <= 180)| GPS Longitude |
| connector_type | TEXT | NOT NULL | CCS2, Type 2, CHAdeMO, Bharat DC-001, etc. |
| charging_speed_kw | NUMERIC | CHECK (charging_speed_kw > 0) | Power rating in kW (e.g., 60, 120, 240) |
| description | TEXT | | Operational details, amenities, pricing notes |
| contact_phone | TEXT | | Support/helpdesk contact number |
| is_active | BOOLEAN | DEFAULT TRUE | Visibility flag |
| created_at | TIMESTAMPTZ | DEFAULT now() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Record last updated timestamp |

#### dmin_users
| Column | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | PRIMARY KEY, REFERENCES auth.users(id) | Auth UID |
| email | TEXT | NOT NULL, UNIQUE | Admin email address |
| ole | TEXT | NOT NULL DEFAULT 'admin' | Role level ('admin', 'superadmin') |
| created_at | TIMESTAMPTZ | DEFAULT now() | Timestamp |

---

### 5. Main Features & User Flows

1. **Public Portal:**
   - **Home Page:** Hero with quick search, dynamic live statistics (stations, cities, states count), 3-step guide, platform benefits, CTA.
   - **Station Explorer (Find Stations):**
     - Side-by-side split screen (Desktop) & responsive view toggle (Mobile).
     - Live debounced search by name, city, state, or PIN code.
     - Multi-dimension filters: State, City, Connector Type, Speed (Fast/Rapid/Ultra-fast).
     - Use My Location Geolocation with Haversine distance ranking and distance indicators.
     - Interactive map pins with interactive cards & Get Directions Google Maps navigation launcher.
   - **Station Detail View:**
     - Comprehensive specifications, connector badge, power speed in kW, exact coordinates, amenities description, contact helpline, direct navigation.
   - **About & Contact:** Informational pages explaining the platform and allowing feedback.

2. **Smart Admin Portal:**
   - **Authentication:** Protected routes via Supabase Auth session & role validation.
   - **Dashboard Overview:** Live metric cards, state-wise station distribution, connector type breakdown, recent updates log.
   - **Station Management Data Grid:**
     - Search, filter by city/state, pagination, view, edit, and deletion with safety confirmations.
   - **Add & Edit Stations:**
     - Complete input validation (lat/lng ranges, PIN format, required fields).
     - Interactive map coordinate picker to click on the map and populate coordinates.
   - **Data Import & Export:**
     - CSV download template and batch import with validation.
     - JSON/CSV export of stations database.

---

### 6. Development Phases

- **Phase 1: Project Initialization & Tooling** (Vite + React + TypeScript + Tailwind CSS setup)
- **Phase 2: Database & Supabase Integration Layer** (Migration files, seed data, client & fallback mock store)
- **Phase 3: Design System & Shared Layout** (White & silver theme, Navbar, Footer, UI components)
- **Phase 4: Public User Pages** (Home, Find Stations with Map, Station Details, About, Contact)
- **Phase 5: Map Engine Integration** (Google Maps JavaScript API + interactive fallback)
- **Phase 6: Admin Dashboard & Authentication** (Login, Overview stats, Station CRUD, Map coordinate picker)
- **Phase 7: Testing, Build Verification & Quality Audit** (TypeScript check, responsive tests, production build)
- **Phase 8: Documentation & Completion Report** (README.md, .env.example, SQL migrations, PROJECT_COMPLETION_REPORT.md)

---

### 7. Testing & Quality Strategy
- Strict TypeScript compile checks (	sc --noEmit).
- Production build validation (
pm run build).
- End-to-end functionality verification:
  - Filtering and searching accuracy
  - Haversine distance computations
  - CRUD operations persistence
  - Map marker clicks and info window popup
  - Form validation error triggers
  - Route navigation and error boundaries
