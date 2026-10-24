-- ==============================================================
-- KisanSetu Seed Data - Realistic Indian Agri-Market Data
-- ==============================================================

-- Sample Users
INSERT INTO users (id, name, phone, role, state, district, village, language_pref, verified_badge) VALUES
(1, 'रामेश्वर यादव (Rameshwar Yadav)', '9876543210', 'farmer', 'Uttar Pradesh', 'Agra', 'Fatehabad', 'hi', 1),
(2, 'दत्तात्रेय पाटिल (Dattatray Patil)', '9876543211', 'farmer', 'Maharashtra', 'Nashik', 'Lasalgaon', 'hi', 1),
(3, 'मंजूनाथ रेड्डी (Manjunath Reddy)', '9876543212', 'farmer', 'Karnataka', 'Kolar', 'Srinivaspur', 'hi', 1),
(4, 'राजेश गुप्ता (Rajesh Gupta Wholesale)', '9876543213', 'buyer', 'Delhi', 'North Delhi', 'Azadpur Market', 'hi', 1),
(5, 'फ्रेशमार्ट सुपरमार्केट (FreshMart Supply)', '9876543214', 'buyer', 'Maharashtra', 'Mumbai', 'Vashi APMC', 'hi', 1);

-- Sample Crop Listings (फसल की लिस्टिंग)
INSERT INTO crop_listings (id, farmer_id, crop_name, variety, quantity_quintals, min_reserve_price, harvest_location, quality_grade, image_url, status) VALUES
(1, 1, 'आलू (Potato)', 'पुखराज / Pukhraj Fresh', 40.0, 1150.0, 'फतेहाबाद, आगरा (UP)', 'A', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500', 'open_for_bidding'),
(2, 2, 'लाल प्याज (Red Onion)', 'नासिक गरवा / Nashik Garva', 25.0, 2200.0, 'लासलगांव, नासिक (MH)', 'A', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500', 'open_for_bidding'),
(3, 3, 'टमाटर (Tomato)', 'हाइब्रिड लाल / Hybrid Solid', 30.0, 1400.0, 'कोलार मंडी, कर्नाटक', 'A', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', 'open_for_bidding');

-- Sample Live Bids (सक्रिय खरीदारों की बोलियां)
INSERT INTO bids (id, listing_id, buyer_id, bid_amount_per_quintal, note, status) VALUES
(1, 1, 4, 1250.0, 'नगद भुगतान और आगरा से सीधी डिलीवरी', 'placed'),
(2, 1, 5, 1310.0, 'क्वालिटी A ग्रेड के लिए सबसे ऊंची बोली', 'placed'),
(3, 2, 4, 2350.0, 'दिल्ली आजादपुर के लिए 25 क्विंटल पूरा लाट', 'placed'),
(4, 3, 5, 1520.0, 'सुपरमार्केट डायरेक्ट डिलीवरी', 'placed');

-- Real-time Mandi Rates for Price Arbitrage Comparison (मंडी भाव तुलना)
INSERT INTO mandi_rates (state, district, mandi_name, commodity, variety, min_price, max_price, modal_price, updated_date) VALUES
-- Potato (आलू) Rates across mandis
('Uttar Pradesh', 'Agra', 'फतेहाबाद स्थानीय मंडी (Local Mandi)', 'आलू (Potato)', 'Local', 950.0, 1100.0, 1050.0, '2026-10-24'),
('Uttar Pradesh', 'Agra', 'आगरा मुख्य मंडी (Agra Main)', 'आलू (Potato)', 'Pukhraj', 1100.0, 1280.0, 1200.0, '2026-10-24'),
('Delhi', 'North Delhi', 'आजादपुर मंडी (Azadpur Mandi, Delhi)', 'आलू (Potato)', 'Pukhraj High', 1500.0, 1850.0, 1720.0, '2026-10-24'),

-- Onion (प्याज) Rates across mandis
('Maharashtra', 'Nashik', 'पिंपलगांव लोकल मंडी (Local)', 'प्याज (Onion)', 'Red Onion', 1800.0, 2100.0, 2000.0, '2026-10-24'),
('Maharashtra', 'Nashik', 'लासलगांव मुख्य मंडी (Lasalgaon)', 'प्याज (Onion)', 'Garva Grade A', 2150.0, 2450.0, 2380.0, '2026-10-24'),
('Maharashtra', 'Mumbai', 'वाशी एपीएमसी (Vashi APMC Navi Mumbai)', 'प्याज (Onion)', 'Garva Grade A', 2700.0, 3100.0, 2950.0, '2026-10-24'),

-- Tomato (टमाटर) Rates across mandis
('Karnataka', 'Kolar', 'कोलार ग्रामीण मंडी (Kolar Rural)', 'टमाटर (Tomato)', 'Hybrid', 1100.0, 1350.0, 1250.0, '2026-10-24'),
('Karnataka', 'Bengaluru', 'बेंगलुरु यशवंतपुर मंडी (Yeshwantpur)', 'टमाटर (Tomato)', 'Hybrid Top', 1450.0, 1800.0, 1680.0, '2026-10-24'),
('Tamil Nadu', 'Chennai', 'कोयम्बेडु मंडी (Koyambedu, Chennai)', 'टमाटर (Tomato)', 'Grade A', 1800.0, 2200.0, 2050.0, '2026-10-24');

-- Sample Shared Logistics Pooling
INSERT INTO logistics_pools (origin_village, destination_mandi, vehicle_capacity_quintals, current_booked_quintals, departure_date, estimated_freight_per_quintal, status) VALUES
('फतेहाबाद (Fatehabad, Agra)', 'आजादपुर मंडी, दिल्ली (Azadpur)', 60.0, 40.0, '2026-10-25', 120.0, 'open'),
('लासलगांव (Lasalgaon, Nashik)', 'वाशी एपीएमसी, मुंबई (Vashi)', 80.0, 50.0, '2026-10-26', 95.0, 'open');
