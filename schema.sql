-- ==============================================================
-- KisanSetu (किसान सेतु) - Database Schema
-- Open-Source Agri-Trade & Mandi Arbitrage Platform
-- ==============================================================

-- 1. USERS TABLE (Farmers, Wholesale Buyers, Transporters)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    role TEXT CHECK(role IN ('farmer', 'buyer', 'transporter')) NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT,
    language_pref TEXT DEFAULT 'hi',
    verified_badge INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CROP LISTINGS TABLE (फसल लिस्टिंग)
CREATE TABLE IF NOT EXISTS crop_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    farmer_id INTEGER NOT NULL,
    crop_name TEXT NOT NULL,           -- e.g., Tomato (टमाटर), Potato (आलू), Onion (प्याज)
    variety TEXT,                      -- e.g., Hybrid, Desi, Pukhraj
    quantity_quintals REAL NOT NULL,   -- e.g., 25.5 quintals (1 quintal = 100 kg)
    min_reserve_price REAL NOT NULL,   -- e.g., ₹1200 per quintal (न्यूनतम भाव)
    expected_harvest_date DATE,
    harvest_location TEXT NOT NULL,    -- Mandi/Village
    quality_grade TEXT CHECK(quality_grade IN ('A', 'B', 'C', 'Organic')) DEFAULT 'A',
    image_url TEXT,
    status TEXT CHECK(status IN ('open_for_bidding', 'deal_closed', 'expired')) DEFAULT 'open_for_bidding',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id)
);

-- 3. BIDS TABLE (लाइव बोली)
CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    bid_amount_per_quintal REAL NOT NULL, -- e.g., ₹1450 per quintal
    total_value REAL GENERATED ALWAYS AS (bid_amount_per_quintal * 1) STORED,
    note TEXT,
    status TEXT CHECK(status IN ('placed', 'accepted', 'rejected', 'outbid')) DEFAULT 'placed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES crop_listings(id),
    FOREIGN KEY (buyer_id) REFERENCES users(id)
);

-- 4. MANDI RATES INTELLIGENCE (मंडी भाव और तुलना डेटा)
CREATE TABLE IF NOT EXISTS mandi_rates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    mandi_name TEXT NOT NULL,
    commodity TEXT NOT NULL,
    variety TEXT,
    min_price REAL NOT NULL,
    max_price REAL NOT NULL,
    modal_price REAL NOT NULL,        -- औसत थोक भाव
    updated_date DATE NOT NULL
);

-- 5. LOGISTICS POOLING TABLE (सामूहिक ढुलाई / Shared Transport)
CREATE TABLE IF NOT EXISTS logistics_pools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin_village TEXT NOT NULL,
    destination_mandi TEXT NOT NULL,
    vehicle_capacity_quintals REAL NOT NULL,
    current_booked_quintals REAL DEFAULT 0,
    departure_date DATE NOT NULL,
    estimated_freight_per_quintal REAL NOT NULL,
    status TEXT CHECK(status IN ('open', 'full', 'in_transit', 'delivered')) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_listings_crop ON crop_listings(crop_name, status);
CREATE INDEX IF NOT EXISTS idx_bids_listing ON bids(listing_id, bid_amount_per_quintal);
CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON mandi_rates(commodity, mandi_name);
