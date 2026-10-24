/**
 * ====================================================================
 * KisanSetu (किसान सेतु) - Backend API Server
 * Open-Source Fair Agri-Trade, Live Bidding & Mandi Price Arbitrage
 * ====================================================================
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

// Middlewares
app.use(cors());
app.use(express.json());

// Initial Seed Database
const initialData = {
  users: [
    {
      id: 1,
      name: "रामेश्वर यादव",
      phone: "9876543210",
      role: "farmer",
      state: "Uttar Pradesh",
      district: "Agra",
      village: "Fatehabad",
      verified: true
    },
    {
      id: 2,
      name: "दत्तात्रेय पाटिल",
      phone: "9876543211",
      role: "farmer",
      state: "Maharashtra",
      district: "Nashik",
      village: "Lasalgaon",
      verified: true
    },
    {
      id: 3,
      name: "मंजूनाथ रेड्डी",
      phone: "9876543212",
      role: "farmer",
      state: "Karnataka",
      district: "Kolar",
      village: "Srinivaspur",
      verified: true
    },
    {
      id: 4,
      name: "राजेश गुप्ता (आजादपुर थोक आढ़ती)",
      phone: "9876543213",
      role: "buyer",
      state: "Delhi",
      district: "North Delhi",
      company: "Gupta Agri Foods, Azadpur Mandi",
      verified: true
    },
    {
      id: 5,
      name: "फ्रेशमार्ट सप्लाई चेन (FreshMart B2B)",
      phone: "9876543214",
      role: "buyer",
      state: "Maharashtra",
      district: "Mumbai",
      company: "FreshMart Supply Chain Vashi",
      verified: true
    }
  ],
  listings: [
    {
      id: 1,
      farmerId: 1,
      farmerName: "रामेश्वर यादव",
      farmerPhone: "9876543210",
      cropName: "आलू (Potato)",
      variety: "पुखराज (Pukhraj Fresh)",
      quantityQuintals: 40,
      minReservePrice: 1150, // ₹ per quintal
      highestBid: 1310,
      location: "फतेहाबाद, आगरा (UP)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
      status: "open_for_bidding",
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      farmerId: 2,
      farmerName: "दत्तात्रेय पाटिल",
      farmerPhone: "9876543211",
      cropName: "प्याज (Onion)",
      variety: "नासिक लाल गरवा (Garva Grade A)",
      quantityQuintals: 25,
      minReservePrice: 2200,
      highestBid: 2350,
      location: "लासलगांव, नासिक (MH)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500",
      status: "open_for_bidding",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      farmerId: 3,
      farmerName: "मंजूनाथ रेड्डी",
      farmerPhone: "9876543212",
      cropName: "टमाटर (Tomato)",
      variety: "हाइब्रिड लाल (Solid Red)",
      quantityQuintals: 30,
      minReservePrice: 1400,
      highestBid: 1520,
      location: "श्रीनिवासपुर, कोलार (KA)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500",
      status: "open_for_bidding",
      createdAt: new Date().toISOString()
    }
  ],
  bids: [
    {
      id: 1,
      listingId: 1,
      buyerId: 4,
      buyerName: "राजेश गुप्ता (आजादपुर)",
      buyerPhone: "9876543213",
      amountPerQuintal: 1250,
      note: "नगद भुगतान और फार्म से सीधी उठाई",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 2,
      listingId: 1,
      buyerId: 5,
      buyerName: "फ्रेशमार्ट सप्लाई चेन",
      buyerPhone: "9876543214",
      amountPerQuintal: 1310,
      note: "सुपरमार्केट के लिए उच्चतम बोली",
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      listingId: 2,
      buyerId: 4,
      buyerName: "राजेश गुप्ता (आजादपुर)",
      buyerPhone: "9876543213",
      amountPerQuintal: 2350,
      note: "दिल्ली के लिए 25 क्विंटल पूरा लाट",
      createdAt: new Date().toISOString()
    },
    {
      id: 4,
      listingId: 3,
      buyerId: 5,
      buyerName: "फ्रेशमार्ट सप्लाई चेन",
      buyerPhone: "9876543214",
      amountPerQuintal: 1520,
      note: "सीधी खरीद - बेंगलुरु वेयरहाउस डिलीवरी",
      createdAt: new Date().toISOString()
    }
  ],
  mandiRates: [
    // Potato
    {
      commodity: "आलू (Potato)",
      mandi: "फतेहाबाद स्थानीय मंडी (Local)",
      district: "Agra",
      state: "UP",
      modalPrice: 1050,
      distanceKm: 8,
      freightCostPerQuintal: 20
    },
    {
      commodity: "आलू (Potato)",
      mandi: "आगरा मुख्य मंडी (Agra APMC)",
      district: "Agra",
      state: "UP",
      modalPrice: 1200,
      distanceKm: 35,
      freightCostPerQuintal: 50
    },
    {
      commodity: "आलू (Potato)",
      mandi: "आजादपुर मंडी (Azadpur, Delhi)",
      district: "North Delhi",
      state: "Delhi",
      modalPrice: 1720,
      distanceKm: 220,
      freightCostPerQuintal: 140
    },
    // Onion
    {
      commodity: "प्याज (Onion)",
      mandi: "पिंपलगांव लोकल मंडी (Local)",
      district: "Nashik",
      state: "MH",
      modalPrice: 2000,
      distanceKm: 12,
      freightCostPerQuintal: 25
    },
    {
      commodity: "प्याज (Onion)",
      mandi: "लासलगांव मुख्य मंडी (Lasalgaon)",
      district: "Nashik",
      state: "MH",
      modalPrice: 2380,
      distanceKm: 28,
      freightCostPerQuintal: 45
    },
    {
      commodity: "प्याज (Onion)",
      mandi: "वाशी एपीएमसी (Vashi APMC, Mumbai)",
      district: "Navi Mumbai",
      state: "MH",
      modalPrice: 2950,
      distanceKm: 190,
      freightCostPerQuintal: 130
    },
    // Tomato
    {
      commodity: "टमाटर (Tomato)",
      mandi: "कोलार ग्रामीण मंडी (Local)",
      district: "Kolar",
      state: "KA",
      modalPrice: 1250,
      distanceKm: 15,
      freightCostPerQuintal: 30
    },
    {
      commodity: "टमाटर (Tomato)",
      mandi: "बेंगलुरु यशवंतपुर मंडी (Yeshwantpur)",
      district: "Bengaluru",
      state: "KA",
      modalPrice: 1680,
      distanceKm: 70,
      freightCostPerQuintal: 65
    },
    {
      commodity: "टमाटर (Tomato)",
      mandi: "कोयम्बेडु मंडी (Koyambedu, Chennai)",
      district: "Chennai",
      state: "TN",
      modalPrice: 2050,
      distanceKm: 260,
      freightCostPerQuintal: 160
    }
  ],
  logisticsPools: [
    {
      id: 1,
      route: "फतेहाबाद (आगरा) ➔ आजादपुर मंडी (दिल्ली)",
      vehicleType: "आयशर 17 फीट (Eicher 17ft)",
      totalCapacityQuintals: 70,
      bookedQuintals: 40,
      availableQuintals: 30,
      freightPerQuintal: 120,
      departureDate: "कल सुबह 6:00 AM",
      driverPhone: "9811223344",
      status: "booking_open"
    },
    {
      id: 2,
      route: "लासलगांव (नासिक) ➔ वाशी एपीएमसी (मुंबई)",
      vehicleType: "टाटा 407 (Tata 407)",
      totalCapacityQuintals: 50,
      bookedQuintals: 25,
      availableQuintals: 25,
      freightPerQuintal: 95,
      departureDate: "आज रात 9:00 PM",
      driverPhone: "9822334455",
      status: "booking_open"
    }
  ]
};

// Database Initialization helper
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading DB file, re-seeding default data", err);
    return initialData;
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'KisanSetu Backend API',
    version: '1.0.0',
    description: 'Empowering Farmers with Direct B2B Trade & Fair Prices'
  });
});

// 2. GET all crop listings
app.get('/api/listings', (req, res) => {
  const db = loadDB();
  const { crop, grade } = req.query;
  let results = db.listings;

  if (crop) {
    results = results.filter(l => l.cropName.toLowerCase().includes(crop.toLowerCase()));
  }
  if (grade) {
    results = results.filter(l => l.grade === grade);
  }

  res.json({
    success: true,
    total: results.length,
    listings: results
  });
});

// 3. POST new crop listing (Farmer creates listing)
app.post('/api/listings', (req, res) => {
  const { farmerName, farmerPhone, cropName, variety, quantityQuintals, minReservePrice, location, grade, imageUrl } = req.body;

  if (!cropName || !quantityQuintals || !minReservePrice) {
    return res.status(400).json({
      success: false,
      message: "कृपया फसल का नाम, मात्रा (क्विंटल) और न्यूनतम मूल्य अवश्य भरें।"
    });
  }

  const db = loadDB();
  const newListing = {
    id: db.listings.length > 0 ? Math.max(...db.listings.map(l => l.id)) + 1 : 1,
    farmerId: req.body.farmerId || 1,
    farmerName: farmerName || "किसान बंधु",
    farmerPhone: farmerPhone || "9876543210",
    cropName,
    variety: variety || "देसी / उत्तम",
    quantityQuintals: parseFloat(quantityQuintals),
    minReservePrice: parseFloat(minReservePrice),
    highestBid: parseFloat(minReservePrice),
    location: location || "स्थानीय फार्म",
    grade: grade || "A Grade",
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
    status: "open_for_bidding",
    createdAt: new Date().toISOString()
  };

  db.listings.unshift(newListing);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: "आपकी फसल सफलतापूर्वक लिस्ट कर दी गई है! खरीदार अब लाइव बोली लगा सकते हैं।",
    listing: newListing
  });
});

// 4. GET bids for a specific listing
app.get('/api/listings/:id/bids', (req, res) => {
  const db = loadDB();
  const listingId = parseInt(req.params.id);
  const listingBids = db.bids.filter(b => b.listingId === listingId).sort((a, b) => b.amountPerQuintal - a.amountPerQuintal);

  res.json({
    success: true,
    listingId,
    bids: listingBids
  });
});

// 5. POST a bid on a listing (Buyer places bid)
app.post('/api/bids', (req, res) => {
  const { listingId, buyerName, buyerPhone, amountPerQuintal, note } = req.body;

  const db = loadDB();
  const listing = db.listings.find(l => l.id === parseInt(listingId));

  if (!listing) {
    return res.status(404).json({ success: false, message: "फसल लिस्टिंग नहीं मिली!" });
  }

  const bidAmount = parseFloat(amountPerQuintal);
  if (bidAmount < listing.minReservePrice) {
    return res.status(400).json({
      success: false,
      message: `बोली किसान के न्यूनतम समर्थन मूल्य (₹${listing.minReservePrice}/क्विंटल) से कम नहीं हो सकती!`
    });
  }

  const newBid = {
    id: db.bids.length > 0 ? Math.max(...db.bids.map(b => b.id)) + 1 : 1,
    listingId: parseInt(listingId),
    buyerId: req.body.buyerId || 4,
    buyerName: buyerName || "थोक खरीदार",
    buyerPhone: buyerPhone || "9876543213",
    amountPerQuintal: bidAmount,
    note: note || "तुरंत डिलीवरी के लिए बोली",
    createdAt: new Date().toISOString()
  };

  db.bids.push(newBid);

  // Update highest bid if higher
  if (bidAmount > listing.highestBid) {
    listing.highestBid = bidAmount;
  }

  saveDB(db);

  res.status(201).json({
    success: true,
    message: "आपकी बोली सफलतापूर्वक दर्ज हो गई है!",
    bid: newBid,
    updatedListing: listing
  });
});

// 6. GET Mandi Rates Intelligence & Arbitrage
app.get('/api/mandi-rates', (req, res) => {
  const db = loadDB();
  const { commodity } = req.query;
  let rates = db.mandiRates;

  if (commodity) {
    rates = rates.filter(r => r.commodity.toLowerCase().includes(commodity.toLowerCase()));
  }

  res.json({
    success: true,
    total: rates.length,
    rates
  });
});

// 7. POST Calculate Mandi Arbitrage (स्मार्ट मुनाफा कैलकुलेटर)
app.post('/api/calculate-arbitrage', (req, res) => {
  const { commodity, quantityQuintals, localMandiPrice, targetMandiPrice, freightCostPerQuintal } = req.body;

  const qty = parseFloat(quantityQuintals) || 10;
  const localPrice = parseFloat(localMandiPrice) || 1000;
  const targetPrice = parseFloat(targetMandiPrice) || 1600;
  const freight = parseFloat(freightCostPerQuintal) || 120;

  const localRevenue = localPrice * qty;
  const targetRevenue = targetPrice * qty;
  const totalFreight = freight * qty;
  const targetNetProfit = targetRevenue - totalFreight;
  const extraGain = targetNetProfit - localRevenue;
  const profitPercentage = ((extraGain / localRevenue) * 100).toFixed(1);

  res.json({
    success: true,
    commodity: commodity || "फसल",
    quantityQuintals: qty,
    localMandiTotal: localRevenue,
    targetMandiGross: targetRevenue,
    freightDeduction: totalFreight,
    targetMandiNet: targetNetProfit,
    netExtraGain: extraGain,
    isProfitable: extraGain > 0,
    profitPercentage: `${profitPercentage}%`,
    recommendationHindi: extraGain > 0
      ? `बधाई! इस मंडी में माल बेचने पर आपको गाड़ी भाड़ा काटकर भी ₹${extraGain.toLocaleString('en-IN')} का शुद्ध अतिरिक्त मुनाफा होगा (+${profitPercentage}%)!`
      : `सलाह: गाड़ी भाड़ा अधिक होने के कारण लोकल मंडी में ही बेचना बेहतर रहेगा।`
  });
});

// 8. Logistics Pools (सामूहिक ढुलाई)
app.get('/api/logistics-pools', (req, res) => {
  const db = loadDB();
  res.json({
    success: true,
    pools: db.logisticsPools
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 KisanSetu (किसान सेतु) Backend Server Running!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/listings`);
  console.log(`   - POST /api/listings`);
  console.log(`   - GET  /api/listings/:id/bids`);
  console.log(`   - POST /api/bids`);
  console.log(`   - GET  /api/mandi-rates`);
  console.log(`   - POST /api/calculate-arbitrage`);
  console.log(`   - GET  /api/logistics-pools`);
  console.log(`=======================================================`);
});
