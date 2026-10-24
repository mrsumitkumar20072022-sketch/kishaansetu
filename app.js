/**
 * ====================================================================
 * KisanSetu (किसान सेतु) - Frontend Application Logic
 * Voice Input • B2B Listings • Live Bidding • Mandi Arbitrage
 * ====================================================================
 */

// API Configuration (Switches dynamically if backend is active)
const API_BASE_URL = 'http://localhost:5000/api';
let isBackendOnline = false;

// Bilingual Translations (हिंदी & English)
const translations = {
  hi: {
    post_crop_btn: "फसल बेचें",
    tab_listings: "लाइव थोक मंडियां (फसलें)",
    tab_arbitrage: "मंडी भाव तुलना (मुनाफा कैलकुलेटर)",
    tab_logistics: "सामूहिक ढुलाई (Shared Logistics)",
    stat_active_crops: "सक्रिय फसल लॉट",
    stat_buyers: "रजिस्टर्ड थोक खरीदार",
    stat_bids: "आज की कुल बोलियां",
    stat_extra_gain: "किसान का औसत अधिक लाभ",
    form_title: "किसान बंधु: अपनी फसल थोक में बेचने के लिए लिस्ट करें",
    form_subtitle: "माइक बटन दबाकर बोलें या फॉर्म भरकर 2 मिनट में खरीदारों से सीधी बोली प्राप्त करें",
    label_crop_name: "फसल का नाम (Crop Name) *",
    label_variety: "किस्म / वैरायटी (Variety)",
    label_quantity: "मात्रा - क्विंटल में (Quantity in Quintals) *",
    label_min_price: "न्यूनतम समर्थन मूल्य - ₹/क्विंटल (Reserve Price) *",
    label_location: "गांव / जिला / मंडी (Location) *",
    label_farmer_contact: "आपका नाम व मोबाइल नंबर (Phone) *",
    btn_reset: "रीसेट करें",
    btn_submit_crop: "फसल तुरंत लिस्ट करें",
    market_heading: "थोक खरीद के लिए उपलब्ध फसलें (Live Lots)"
  },
  en: {
    post_crop_btn: "Sell Crop",
    tab_listings: "Live Wholesale Market (Crops)",
    tab_arbitrage: "Mandi Price Arbitrage (Profit Calc)",
    tab_logistics: "Shared Logistics (Pooling)",
    stat_active_crops: "Active Crop Lots",
    stat_buyers: "Registered Wholesale Buyers",
    stat_bids: "Total Bids Today",
    stat_extra_gain: "Avg Extra Farmer Profit",
    form_title: "Farmer Corner: List Your Produce For Direct Bulk Sale",
    form_subtitle: "Click mic to speak in Hindi/English or fill the form to get direct bids",
    label_crop_name: "Crop Name *",
    label_variety: "Variety / Quality",
    label_quantity: "Quantity in Quintals *",
    label_min_price: "Reserve Minimum Price (₹/Quintal) *",
    label_location: "Village / District / Mandi *",
    label_farmer_contact: "Your Name & Mobile Number *",
    btn_reset: "Reset",
    btn_submit_crop: "List Produce Now",
    market_heading: "Crops Available For Wholesale Bidding"
  }
};

let currentLang = 'hi';

// Fallback In-Memory / LocalStorage Dataset (works 100% even without backend!)
let state = {
  listings: [
    {
      id: 1,
      farmerId: 1,
      farmerName: "रामेश्वर यादव",
      farmerPhone: "9876543210",
      cropName: "आलू (Potato)",
      variety: "पुखराज (Pukhraj Fresh)",
      quantityQuintals: 40,
      minReservePrice: 1150,
      highestBid: 1310,
      highestBidder: "फ्रेशमार्ट सप्लाई चेन",
      location: "फतेहाबाद, आगरा (UP)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
      status: "open_for_bidding"
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
      highestBidder: "राजेश गुप्ता (आजादपुर)",
      location: "लासलगांव, नासिक (MH)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500",
      status: "open_for_bidding"
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
      highestBidder: "फ्रेशमार्ट सप्लाई चेन",
      location: "श्रीनिवासपुर, कोलार (KA)",
      grade: "A Grade",
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500",
      status: "open_for_bidding"
    }
  ],
  mandiRates: [
    { commodity: "आलू (Potato)", mandi: "फतेहाबाद स्थानीय मंडी (Local)", state: "UP", modalPrice: 1050, distanceKm: 8, freight: 20 },
    { commodity: "आलू (Potato)", mandi: "आगरा मुख्य मंडी (Agra APMC)", state: "UP", modalPrice: 1200, distanceKm: 35, freight: 50 },
    { commodity: "आलू (Potato)", mandi: "आजादपुर मंडी (Azadpur, Delhi)", state: "Delhi", modalPrice: 1720, distanceKm: 220, freight: 140 },
    { commodity: "प्याज (Onion)", mandi: "पिंपलगांव लोकल मंडी (Local)", state: "MH", modalPrice: 2000, distanceKm: 12, freight: 25 },
    { commodity: "प्याज (Onion)", mandi: "लासलगांव मुख्य मंडी (Lasalgaon)", state: "MH", modalPrice: 2380, distanceKm: 28, freight: 45 },
    { commodity: "प्याज (Onion)", mandi: "वाशी एपीएमसी (Vashi APMC Mumbai)", state: "MH", modalPrice: 2950, distanceKm: 190, freight: 130 },
    { commodity: "टमाटर (Tomato)", mandi: "कोलार ग्रामीण मंडी (Local)", state: "KA", modalPrice: 1250, distanceKm: 15, freight: 30 },
    { commodity: "टमाटर (Tomato)", mandi: "बेंगलुरु यशवंतपुर मंडी (Yeshwantpur)", state: "KA", modalPrice: 1680, distanceKm: 70, freight: 65 },
    { commodity: "टमाटर (Tomato)", mandi: "कोयम्बेडु मंडी (Koyambedu Chennai)", state: "TN", modalPrice: 2050, distanceKm: 260, freight: 160 }
  ],
  logisticsPools: [
    {
      id: 1,
      route: "फतेहाबाद (आगरा) ➔ आजादपुर मंडी (दिल्ली)",
      vehicleType: "आयशर 17 फीट (Eicher 17ft)",
      totalCapacity: 70,
      booked: 40,
      available: 30,
      freightPerQuintal: 120,
      departure: "कल सुबह 6:00 AM",
      driverPhone: "9811223344"
    },
    {
      id: 2,
      route: "लासलगांव (नासिक) ➔ वाशी एपीएमसी (मुंबई)",
      vehicleType: "टाटा 407 (Tata 407)",
      totalCapacity: 50,
      booked: 25,
      available: 25,
      freightPerQuintal: 95,
      departure: "आज रात 9:00 PM",
      driverPhone: "9822334455"
    }
  ]
};

// -------------------------------------------------------------
// INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
  // Check backend server connectivity
  await checkBackendStatus();

  // Load initial views
  renderListings(state.listings);
  renderMandiRatesTable(state.mandiRates);
  renderLogisticsPools(state.logisticsPools);
  calculateArbitrage(); // default initial calc

  // Setup event listeners
  setupTabs();
  setupFilterChips();
  setupLanguageToggle();
  setupVoiceInput();
  setupCropForm();
  setupBidModal();
  setupArbitrageCalculator();

  lucide.createIcons();
});

// -------------------------------------------------------------
// BACKEND STATUS CHECK
// -------------------------------------------------------------
async function checkBackendStatus() {
  const badge = document.getElementById('backend-badge');
  const text = document.getElementById('backend-status-text');

  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      isBackendOnline = true;
      text.innerText = "सर्वर: ऑनलाइन (Express API)";
      badge.classList.remove('bg-emerald-900/60', 'text-emerald-200');
      badge.classList.add('bg-emerald-500', 'text-white');
      
      // Fetch live listings from backend
      const listRes = await fetch(`${API_BASE_URL}/listings`);
      const listData = await listRes.json();
      if (listData.success && listData.listings) {
        state.listings = listData.listings;
      }
    }
  } catch (e) {
    isBackendOnline = false;
    text.innerText = "मोड: ब्राउज़र लोकल (तैयार)";
  }
}

// -------------------------------------------------------------
// TABS NAVIGATION
// -------------------------------------------------------------
function setupTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active-tab'));
      tab.classList.add('active-tab');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(targetId).classList.remove('hidden');
      lucide.createIcons();
    });
  });
}

// -------------------------------------------------------------
// LANGUAGE TOGGLE (HINDI / ENGLISH)
// -------------------------------------------------------------
function setupLanguageToggle() {
  const btn = document.getElementById('lang-toggle-btn');
  const label = document.getElementById('lang-label');

  btn.addEventListener('click', () => {
    currentLang = currentLang === 'hi' ? 'en' : 'hi';
    label.innerText = currentLang === 'hi' ? 'English' : 'हिंदी';

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[currentLang][key]) {
        el.innerText = translations[currentLang][key];
      }
    });

    lucide.createIcons();
  });
}

// -------------------------------------------------------------
// HINDI VOICE ASSISTANT (Web Speech API)
// -------------------------------------------------------------
function setupVoiceInput() {
  const micBtn = document.getElementById('voice-record-btn');
  const banner = document.getElementById('voice-banner');
  const micText = document.getElementById('voice-status-text');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micBtn.addEventListener('click', () => {
      alert("आपके ब्राउज़र में वॉइस पहचान की सुविधा उपलब्ध नहीं है। कृपया गूगल क्रोम या एज ब्राउज़र का उपयोग करें, या फॉर्म में टाइप करें।");
    });
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'hi-IN'; // Default to Hindi speech-to-text
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener('click', () => {
    banner.classList.remove('hidden');
    micText.innerText = "सुन रहा हूँ...";
    recognition.start();
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    banner.classList.add('hidden');
    micText.innerText = "माइक बोलकर भरें (Voice Input)";

    console.log("Voice transcript received:", transcript);
    parseVoiceInput(transcript);
  };

  recognition.onerror = (e) => {
    banner.classList.add('hidden');
    micText.innerText = "माइक बोलकर भरें (Voice Input)";
    console.error("Speech error", e);
  };

  recognition.onend = () => {
    banner.classList.add('hidden');
    micText.innerText = "माइक बोलकर भरें (Voice Input)";
  };
}

// Smart voice parser for Indian farmers
function parseVoiceInput(text) {
  const lower = text.toLowerCase();
  let cropName = "";
  let quantity = "";
  let price = "";

  // 1. Detect Crop
  if (lower.includes("आलू") || lower.includes("potato") || lower.includes("aloo")) {
    cropName = "आलू (Potato)";
  } else if (lower.includes("प्याज") || lower.includes("onion") || lower.includes("pyaj") || lower.includes("kanda")) {
    cropName = "प्याज (Onion)";
  } else if (lower.includes("टमाटर") || lower.includes("tomato") || lower.includes("tamatar")) {
    cropName = "टमाटर (Tomato)";
  } else {
    cropName = text.split(" ")[0];
  }

  // 2. Detect Numbers
  const numbers = text.match(/\d+/g);
  if (numbers && numbers.length >= 2) {
    quantity = numbers[0];
    price = numbers[1];
  } else if (numbers && numbers.length === 1) {
    quantity = numbers[0];
  }

  // Auto-fill form
  if (cropName) document.getElementById('crop-name-input').value = cropName;
  if (quantity) document.getElementById('crop-qty-input').value = quantity;
  if (price) document.getElementById('crop-price-input').value = price;

  alert(`🎯 वॉइस इनपुट समझा गया:\n"${text}"\n\nपहचाना गया: ${cropName || 'फसल'}, मात्रा: ${quantity || '--'} क्विंटल, भाव: ₹${price || '--'}`);
}

// -------------------------------------------------------------
// FARMER CROP POSTING
// -------------------------------------------------------------
function setupCropForm() {
  const form = document.getElementById('new-crop-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cropName = document.getElementById('crop-name-input').value;
    const variety = document.getElementById('crop-variety-input').value || "उत्तम क्वालिटी";
    const quantity = parseFloat(document.getElementById('crop-qty-input').value);
    const minPrice = parseFloat(document.getElementById('crop-price-input').value);
    const location = document.getElementById('crop-location-input').value;
    const farmerName = document.getElementById('farmer-name-input').value;
    const farmerPhone = document.getElementById('farmer-phone-input').value;

    const newListing = {
      id: state.listings.length > 0 ? Math.max(...state.listings.map(l => l.id)) + 1 : 1,
      farmerId: 1,
      farmerName,
      farmerPhone,
      cropName,
      variety,
      quantityQuintals: quantity,
      minReservePrice: minPrice,
      highestBid: minPrice,
      highestBidder: "अभी कोई बोली नहीं",
      location,
      grade: "A Grade",
      imageUrl: getImageForCrop(cropName),
      status: "open_for_bidding"
    };

    // If backend is active, POST to API
    if (isBackendOnline) {
      try {
        await fetch(`${API_BASE_URL}/listings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newListing)
        });
      } catch (err) {
        console.warn("Backend save failed, saved in local state", err);
      }
    }

    // Add to in-memory state
    state.listings.unshift(newListing);
    renderListings(state.listings);

    form.reset();
    alert(`🎉 बधाई! आपकी फसल "${cropName}" (${quantity} क्विंटल) सफलतापूर्वक लिस्ट हो गई है। खरीदार अब लाइव बोली लगा सकते हैं!`);

    // Scroll to listing
    const cardEl = document.getElementById(`listing-card-${newListing.id}`);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function getImageForCrop(crop) {
  const c = crop.toLowerCase();
  if (c.includes("आलू") || c.includes("potato")) {
    return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500";
  }
  if (c.includes("प्याज") || c.includes("onion")) {
    return "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500";
  }
  if (c.includes("टमाटर") || c.includes("tomato")) {
    return "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500";
  }
  return "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500";
}

// -------------------------------------------------------------
// RENDER CROP LISTINGS (CARDS)
// -------------------------------------------------------------
function renderListings(listings) {
  const container = document.getElementById('crop-cards-container');
  const countEl = document.getElementById('total-crops-count');
  countEl.innerText = `${listings.length} लॉट`;

  if (listings.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200">
        <i data-lucide="package-search" class="w-12 h-12 text-slate-300 mx-auto mb-2"></i>
        <p class="text-slate-600 font-semibold">इस फिल्टर में कोई फसल उपलब्ध नहीं है।</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = listings.map(l => {
    const totalPotentialValue = (l.highestBid * l.quantityQuintals).toLocaleString('en-IN');
    const minReserveVal = (l.minReservePrice * l.quantityQuintals).toLocaleString('en-IN');
    const extraProfit = ((l.highestBid - l.minReservePrice) * l.quantityQuintals);

    return `
      <div id="listing-card-${l.id}" class="crop-card bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
        
        <!-- Image & Tags -->
        <div class="relative h-48 w-full overflow-hidden bg-slate-100">
          <img src="${l.imageUrl}" alt="${l.cropName}" class="w-full h-full object-cover">
          <div class="absolute top-3 left-3 flex gap-1.5">
            <span class="bg-emerald-600/95 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm shadow flex items-center gap-1">
              <i data-lucide="check-circle-2" class="w-3.5 h-3.5"></i> ${l.grade || 'A Grade'}
            </span>
            <span class="bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-lg backdrop-blur-sm">
              ${l.quantityQuintals} क्विंटल
            </span>
          </div>

          <div class="absolute top-3 right-3">
            <span class="bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-red-600 animate-ping"></span> लाइव नीलामी
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between gap-2 mb-1">
              <div>
                <h3 class="text-lg font-bold text-slate-900">${l.cropName}</h3>
                <p class="text-xs text-slate-500 font-medium">${l.variety || 'ताजा फसल'}</p>
              </div>
              <div class="text-right">
                <span class="text-[10px] uppercase font-bold text-slate-400 block">कुल मात्रा</span>
                <span class="text-sm font-extrabold text-slate-800">${l.quantityQuintals * 100} Kg</span>
              </div>
            </div>

            <!-- Farmer Location Info -->
            <div class="flex items-center gap-1.5 text-xs text-slate-600 mt-2 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-red-500 shrink-0"></i>
              <span class="truncate">${l.location} • किसान: <b>${l.farmerName}</b></span>
            </div>

            <!-- Pricing Box -->
            <div class="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200">
              <div class="flex justify-between items-center text-xs mb-1">
                <span class="text-slate-500">न्यूनतम तय भाव (Reserve):</span>
                <span class="font-semibold text-slate-700">₹${l.minReservePrice.toLocaleString('en-IN')}/क्विंटल</span>
              </div>
              
              <div class="flex justify-between items-center pt-2 border-t border-green-200/60">
                <span class="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  <i data-lucide="trending-up" class="w-3.5 h-3.5 text-emerald-600"></i> उच्चतम बोली:
                </span>
                <span class="text-xl font-black text-emerald-700">₹${l.highestBid.toLocaleString('en-IN')}<span class="text-xs font-normal text-slate-500">/क्विंटल</span></span>
              </div>

              ${extraProfit > 0 ? `
                <div class="mt-1 text-[11px] text-green-700 font-bold flex items-center justify-between">
                  <span>किसान का अतिरिक्त फायदा:</span>
                  <span>+₹${extraProfit.toLocaleString('en-IN')}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-5 grid grid-cols-2 gap-2 pt-2">
            <!-- Place Bid (For Buyers) -->
            <button onclick="openBidModal(${l.id})" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
              <i data-lucide="gavel" class="w-4 h-4"></i>
              <span>बोली लगाएं</span>
            </button>

            <!-- WhatsApp Connect -->
            <a href="https://wa.me/91${l.farmerPhone}?text=${encodeURIComponent(`नमस्ते ${l.farmerName} जी, मैंने किसान सेतु पर आपका ${l.cropName} (${l.quantityQuintals} क्विंटल) देखा। मैं इसे थोक में खरीदना चाहता हूँ।`)}" target="_blank" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
              <span>व्हाट्सएप डील</span>
            </a>
          </div>

        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// -------------------------------------------------------------
// FILTER CHIPS
// -------------------------------------------------------------
function setupFilterChips() {
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      if (filter === 'all') {
        renderListings(state.listings);
      } else {
        const filtered = state.listings.filter(l => l.cropName.includes(filter));
        renderListings(filtered);
      }
    });
  });
}

// -------------------------------------------------------------
// BID MODAL & BID SUBMISSION
// -------------------------------------------------------------
let activeModalListing = null;

function setupBidModal() {
  const modal = document.getElementById('bid-modal');
  const closeBtn = document.getElementById('close-bid-modal');
  const form = document.getElementById('submit-bid-form');

  closeBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!activeModalListing) return;

    const bidAmount = parseFloat(document.getElementById('bid-amount-input').value);
    const buyerName = document.getElementById('bid-buyer-name').value;
    const buyerPhone = document.getElementById('bid-buyer-phone').value;
    const note = document.getElementById('bid-note').value;

    if (bidAmount < activeModalListing.minReservePrice) {
      alert(`⚠️ आपकी बोली किसान के न्यूनतम समर्थन मूल्य (₹${activeModalListing.minReservePrice}/क्विंटल) से कम नहीं हो सकती!`);
      return;
    }

    // Update in-memory listing
    activeModalListing.highestBid = bidAmount;
    activeModalListing.highestBidder = buyerName;

    // Send to backend if online
    if (isBackendOnline) {
      try {
        await fetch(`${API_BASE_URL}/bids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: activeModalListing.id,
            buyerName,
            buyerPhone,
            amountPerQuintal: bidAmount,
            note
          })
        });
      } catch (err) {
        console.warn("Backend bid failed, handled locally", err);
      }
    }

    renderListings(state.listings);
    modal.classList.add('hidden');
    form.reset();

    // Increment bid stat
    const bidsStatEl = document.getElementById('total-bids-count');
    bidsStatEl.innerText = `${parseInt(bidsStatEl.innerText) + 1} बोलियां`;

    alert(`✅ बधाई! आपकी बोली ₹${bidAmount}/क्विंटल सफलतापूर्वक दर्ज कर ली गई है। किसान को व्हाट्सएप पर सूचना भेज दी गई है।`);
  });
}

window.openBidModal = function(id) {
  const listing = state.listings.find(l => l.id === id);
  if (!listing) return;

  activeModalListing = listing;

  document.getElementById('modal-crop-title').innerText = `${listing.cropName} - लाइव बोली लगाएं`;
  document.getElementById('modal-crop-subtitle').innerText = `किसान: ${listing.farmerName} • स्थान: ${listing.location} • मात्रा: ${listing.quantityQuintals} क्विंटल`;
  document.getElementById('modal-min-price').innerText = `₹${listing.minReservePrice.toLocaleString('en-IN')} /क्विंटल`;
  document.getElementById('modal-highest-bid').innerText = `₹${listing.highestBid.toLocaleString('en-IN')} /क्विंटल`;

  const input = document.getElementById('bid-amount-input');
  input.min = listing.minReservePrice;
  input.value = listing.highestBid + 50;

  document.getElementById('bid-modal').classList.remove('hidden');
  lucide.createIcons();
};

// -------------------------------------------------------------
// ARBITRAGE CALCULATOR & MANDI RATES TABLE
// -------------------------------------------------------------
function setupArbitrageCalculator() {
  const calcBtn = document.getElementById('calculate-arb-btn');
  calcBtn.addEventListener('click', calculateArbitrage);

  document.getElementById('arb-commodity-select').addEventListener('change', (e) => {
    const val = e.target.value;
    const targetSelect = document.getElementById('arb-target-mandi');
    const localInput = document.getElementById('arb-local-price');

    if (val.includes("आलू")) {
      localInput.value = 1050;
      targetSelect.innerHTML = `
        <option value="1720|140|आजादपुर मंडी (दिल्ली)">आजादपुर (दिल्ली) - ₹1,720 (भाड़ा ₹140)</option>
        <option value="1200|50|आगरा मुख्य मंडी">आगरा मुख्य मंडी - ₹1,200 (भाड़ा ₹50)</option>
      `;
    } else if (val.includes("प्याज")) {
      localInput.value = 2000;
      targetSelect.innerHTML = `
        <option value="2950|130|वाशी एपीएमसी (मुंबई)">वाशी एपीएमसी (मुंबई) - ₹2,950 (भाड़ा ₹130)</option>
        <option value="2380|45|लासलगांव मुख्य मंडी">लासलगांव मुख्य मंडी - ₹2,380 (भाड़ा ₹45)</option>
      `;
    } else if (val.includes("टमाटर")) {
      localInput.value = 1250;
      targetSelect.innerHTML = `
        <option value="2050|160|कोयम्बेडु मंडी (चेन्नई)">कोयम्बेडु (चेन्नई) - ₹2,050 (भाड़ा ₹160)</option>
        <option value="1680|65|बेंगलुरु यशवंतपुर मंडी">बेंगलुरु यशवंतपुर - ₹1,680 (भाड़ा ₹65)</option>
      `;
    }
    calculateArbitrage();
  });
}

function calculateArbitrage() {
  const commodity = document.getElementById('arb-commodity-select').value;
  const qty = parseFloat(document.getElementById('arb-qty-input').value) || 10;
  const localPrice = parseFloat(document.getElementById('arb-local-price').value) || 1000;
  
  const targetValRaw = document.getElementById('arb-target-mandi').value.split('|');
  const targetPrice = parseFloat(targetValRaw[0]) || 1500;
  const freightPerQ = parseFloat(targetValRaw[1]) || 100;
  const targetMandiName = targetValRaw[2] || "बड़ी मंडी";

  const localRevenue = localPrice * qty;
  const targetGross = targetPrice * qty;
  const totalFreight = freightPerQ * qty;
  const targetNet = targetGross - totalFreight;
  const netExtraGain = targetNet - localRevenue;
  const profitPercent = ((netExtraGain / localRevenue) * 100).toFixed(1);

  const card = document.getElementById('arbitrage-result-card');

  card.innerHTML = `
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <span class="text-xs uppercase tracking-wider font-extrabold bg-emerald-950/40 px-3 py-1 rounded-full text-emerald-200">
          तुलना परिणाम • ${commodity} (${qty} क्विंटल)
        </span>
        <h4 class="text-xl md:text-2xl font-black mt-2">
          ${targetMandiName} में बेचने पर शुद्ध अतिरिक्त मुनाफा:
        </h4>
        <p class="text-sm text-emerald-100 mt-1">
          गाड़ी का कुल भाड़ा (₹${totalFreight.toLocaleString('en-IN')}) काटने के बाद भी आपको भारी फायदा होगा!
        </p>
      </div>

      <div class="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 text-center">
        <span class="text-xs text-emerald-100 block">शुद्ध अतिरिक्त लाभ</span>
        <span class="text-3xl font-black text-yellow-300">+₹${netExtraGain.toLocaleString('en-IN')}</span>
        <span class="text-xs block text-white font-bold">(+${profitPercent}% अधिक)</span>
      </div>
    </div>

    <!-- Comparative Breakdown -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20 text-xs">
      <div class="bg-black/15 p-3 rounded-xl">
        <span class="text-emerald-200 block">1. स्थानीय मंडी में कुल बिक्री:</span>
        <span class="text-base font-bold">₹${localRevenue.toLocaleString('en-IN')}</span>
      </div>
      <div class="bg-black/15 p-3 rounded-xl">
        <span class="text-emerald-200 block">2. ${targetMandiName} में कुल भाव:</span>
        <span class="text-base font-bold">₹${targetGross.toLocaleString('en-IN')}</span>
      </div>
      <div class="bg-black/15 p-3 rounded-xl">
        <span class="text-emerald-200 block">3. घटाया गया गाड़ी भाड़ा:</span>
        <span class="text-base font-bold text-red-200">-₹${totalFreight.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `;
}

function renderMandiRatesTable(rates) {
  const tbody = document.getElementById('mandi-rates-table-body');
  tbody.innerHTML = rates.map(r => `
    <tr class="hover:bg-slate-50 transition">
      <td class="p-3 font-bold text-slate-800">${r.commodity}</td>
      <td class="p-3 text-slate-700">${r.mandi}</td>
      <td class="p-3 text-slate-500">${r.state}</td>
      <td class="p-3 font-extrabold text-emerald-700">₹${r.modalPrice.toLocaleString('en-IN')}</td>
      <td class="p-3 text-slate-500">${r.distanceKm} Km</td>
      <td class="p-3 font-semibold text-slate-700">₹${r.freight}</td>
    </tr>
  `).join('');
}

// -------------------------------------------------------------
// LOGISTICS POOLING (सामूहिक ढुलाई)
// -------------------------------------------------------------
function renderLogisticsPools(pools) {
  const container = document.getElementById('logistics-cards-container');
  container.innerHTML = pools.map(p => {
    const percentBooked = Math.round((p.booked / p.totalCapacity) * 100);

    return `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              ${p.vehicleType}
            </span>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              बुकिंग चालू
            </span>
          </div>

          <h4 class="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <i data-lucide="route" class="w-4 h-4 text-blue-600"></i>
            <span>${p.route}</span>
          </h4>

          <div class="mt-3 text-xs text-slate-500 space-y-1">
            <p>🕒 रवानगी: <b>${p.departure}</b></p>
            <p>💰 अनुमानित भाड़ा: <b class="text-slate-800 text-sm">₹${p.freightPerQuintal}/क्विंटल</b></p>
          </div>

          <!-- Progress Bar -->
          <div class="mt-4">
            <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
              <span>वाहन क्षमता: ${p.booked}/${p.totalCapacity} क्विंटल भरी</span>
              <span class="text-blue-700">${p.available} क्विंटल खाली</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${percentBooked}%"></div>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-500">ड्राइवर: <b>+91 ${p.driverPhone}</b></span>
          <button onclick="alert('आपकी स्पेस रिक्वेस्ट दर्ज कर ली गई है! ट्रांसपोर्टर आपसे जल्द संपर्क करेगा।')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-sm">
            स्पेस बुक करें
          </button>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}
