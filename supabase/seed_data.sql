-- ==============================================================================
-- EV CHARGING STATION LOCATOR – INDIA
-- Sample Seed Data (For Development, Verification & Staging Testing Only)
-- Note: These records are explicitly labeled as SAMPLE records.
-- ==============================================================================

INSERT INTO public.charging_stations (
    name, address, city, state, pincode, latitude, longitude, connector_type, charging_speed_kw, description, contact_phone, is_active
) VALUES 
-- 1. Delhi NCR
(
    '[SAMPLE] Connaught Place Fast Hub',
    'Block B, Outer Circle, Connaught Place',
    'New Delhi',
    'Delhi',
    '110001',
    28.6328,
    77.2197,
    'CCS2',
    120.0,
    'High-speed DC fast charger located near metro station. 24/7 access, cafe nearby.',
    '+91 11 2345 6789',
    true
),
(
    '[SAMPLE] Cyber City Tech Park Charger',
    'DLF Cyber City, Phase 2, Sector 24',
    'Gurugram',
    'Haryana',
    '122002',
    28.4950,
    77.0895,
    'CCS2',
    60.0,
    'Dual gun DC charger inside commercial hub with parking amenities.',
    '+91 124 4567 890',
    true
),
(
    '[SAMPLE] Aerocity EV Terminal',
    'Hospitality District, Indira Gandhi International Airport',
    'New Delhi',
    'Delhi',
    '110037',
    28.5502,
    77.1205,
    'Type 2',
    22.0,
    'AC Level 2 charging point for travelers and airport taxi fleets.',
    '+91 11 9876 5432',
    true
),

-- 2. Maharashtra
(
    '[SAMPLE] Bandra Kurla Complex Supercharger',
    'G Block, Bandra Kurla Complex, Bandra East',
    'Mumbai',
    'Maharashtra',
    '400051',
    19.0657,
    72.8687,
    'CCS2',
    150.0,
    'Ultra-fast DC charging corridor near financial center. Multi-vehicle bays.',
    '+91 22 2654 3210',
    true
),
(
    '[SAMPLE] Marine Drive Public Charging Bay',
    'Netaji Subhash Chandra Bose Road, Churchgate',
    'Mumbai',
    'Maharashtra',
    '400020',
    18.9322,
    72.8264,
    'Bharat DC-001',
    30.0,
    'Standard municipal DC charging station overlooking promenade.',
    '+91 22 8765 4321',
    true
),
(
    '[SAMPLE] Hinjewadi IT Park Fast Hub',
    'Phase 1, Rajiv Gandhi Infotech Park, Hinjewadi',
    'Pune',
    'Maharashtra',
    '411057',
    18.5913,
    73.7389,
    'CCS2',
    60.0,
    'Located in corporate campus area. Compatible with most Indian 4W EVs.',
    '+91 20 2293 4000',
    true
),

-- 3. Karnataka
(
    '[SAMPLE] Indiranagar Metro EV Point',
    '100 Feet Road, HAL 2nd Stage, Indiranagar',
    'Bengaluru',
    'Karnataka',
    '560038',
    12.9784,
    77.6408,
    'CCS2',
    120.0,
    'Fast charging terminal near 100ft road shopping and dining strip.',
    '+91 80 2520 1122',
    true
),
(
    '[SAMPLE] Electronic City Phase 1 Highway Hub',
    'Hosur Road, Keonics Electronic City',
    'Bengaluru',
    'Karnataka',
    '560100',
    12.8452,
    77.6602,
    'CHAdeMO',
    50.0,
    'Highway commuter charging station equipped with dual CHAdeMO/CCS guns.',
    '+91 80 2852 3344',
    true
),
(
    '[SAMPLE] Whitefield IT Corridor Charger',
    'ITPL Main Road, Pattandur Agrahara, Whitefield',
    'Bengaluru',
    'Karnataka',
    '560066',
    12.9863,
    77.7380,
    'Type 2',
    22.0,
    'AC charging spots for office workers and park visitors.',
    '+91 80 4115 6789',
    true
),

-- 4. Telangana
(
    '[SAMPLE] HITEC City Cyber Towers EV Hub',
    'Hitech City Main Road, Madhapur',
    'Hyderabad',
    'Telangana',
    '500081',
    17.4504,
    78.3808,
    'CCS2',
    100.0,
    'Rapid charging station next to IT corridor with ample waiting lounge.',
    '+91 40 2311 0000',
    true
),
(
    '[SAMPLE] Gachibowli Stadium Corridor',
    'Old Mumbai Highway, Gachibowli',
    'Hyderabad',
    'Telangana',
    '500032',
    17.4435,
    78.3489,
    'CCS2',
    60.0,
    'Convenient expressway exit location with washrooms and quick service dining.',
    '+91 40 2980 5566',
    true
),

-- 5. Tamil Nadu
(
    '[SAMPLE] OMR IT Corridor Station',
    'Rajiv Gandhi Salai, Thoraipakkam, OMR',
    'Chennai',
    'Tamil Nadu',
    '600097',
    12.9348,
    80.2312,
    'CCS2',
    90.0,
    'Fast charging point on Old Mahabalipuram Road. Open 24x7.',
    '+91 44 2496 1122',
    true
),
(
    '[SAMPLE] Anna Salai Central Hub',
    'Mount Road, Thousand Lights',
    'Chennai',
    'Tamil Nadu',
    '600006',
    13.0569,
    80.2525,
    'Type 2',
    11.0,
    'Slow AC destination charger ideal for extended city stops.',
    '+91 44 2829 3344',
    true
),

-- 6. Gujarat
(
    '[SAMPLE] SG Highway Fast Charger',
    'Sarkhej - Gandhinagar Highway, Bodakdev',
    'Ahmedabad',
    'Gujarat',
    '380054',
    23.0451,
    72.5085,
    'CCS2',
    120.0,
    'Major highway junction charging station. Quick top-up for intercity trips.',
    '+91 79 2685 1010',
    true
),

-- 7. Rajasthan
(
    '[SAMPLE] MI Road Heritage Charger',
    'Mirza Ismail Road, Jayanti Market, Ashok Nagar',
    'Jaipur',
    'Rajasthan',
    '302001',
    26.9168,
    75.8034,
    'CCS2',
    50.0,
    'Central Jaipur charging point close to tourist hubs and commercial centers.',
    '+91 141 236 7890',
    true
),

-- 8. West Bengal
(
    '[SAMPLE] Salt Lake Sector V Tech Point',
    'Ring Road, Sector V, Bidhannagar',
    'Kolkata',
    'West Bengal',
    '700091',
    22.5804,
    88.4378,
    'CCS2',
    60.0,
    'East India tech hub DC fast charging terminal with digital payment kiosks.',
    '+91 33 2357 8899',
    true
),

-- 9. Kerala
(
    '[SAMPLE] Kochi MG Road Metro Point',
    'Mahatma Gandhi Road, Ernakulam South',
    'Kochi',
    'Kerala',
    '682016',
    9.9674,
    76.2842,
    'CCS2',
    60.0,
    'Convenient metro-linked fast charging station with dedicated bays.',
    '+91 484 237 1234',
    true
);
