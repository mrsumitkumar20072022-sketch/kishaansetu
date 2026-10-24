# 🌾 किसान सेतु (KisanSetu) - Open Agri-Trade & Mandi Arbitrage

[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2024%20%7C%202025%20%7C%202026-brightgreen.svg)](https://hacktoberfest.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

> **"किसान का पसीना, सही दाम और बिचौलियों से आजादी।"**  
> An open-source, community-driven platform connecting wholesale farmers directly with bulk buyers (HoReCa, supermarkets, caterers) via live digital bidding, transparent mandi price arbitrage, and shared logistics pooling.

---

## 🚜 वास्तविक समस्या और समाधान (Problem & Solution)

### समस्या (The Ground Reality):
1. **मंडी में बिचौलिये (Middlemen Cartels):** आढ़ती और दलाल 10% से 20% तक कमीशन और हिडन चार्ज काटते हैं।
2. **लाचारी व औने-पौने दाम (Distress Selling):** फल-सब्जियाँ 1-2 दिन में खराब हो जाती हैं, जिससे किसान स्थानीय मंडी में जैसा भी भाव मिले, बेचने पर मजबूर हो जाता है।
3. **जानकारी का अभाव (Information Asymmetry):** किसान को नहीं पता होता कि 50 या 100 किमी दूर की मंडी में उसी फसल का 30-40% अधिक भाव मिल रहा है।

### किसान सेतु का समाधान (Our Solution):
- 🎙️ **वॉइस इनपुट (Hindi Speech-to-Text):** किसान फोन के माइक में सिर्फ बोलकर फसल, मात्रा और न्यूनतम भाव लिस्ट कर सकता है।
- ⚖️ **लाइव रिवर्स ऑक्शन (Live Bidding):** खरीदार आपस में पारदर्शी बोली लगाते हैं। न्यूनतम रिजर्व मूल्य से कम में फसल नहीं बिकेगी।
- 📈 **मंडी आर्बिट्राज कैलकुलेटर (Price Arbitrage):** स्थानीय मंडी बनाम बड़ी मंडियों (आजादपुर, वाशी, बेंगलुरु) के भाव और गाड़ी भाड़े की तुलना करके शुद्ध अतिरिक्त लाभ दिखाता है।
- 🚚 **सामूहिक ढुलाई (Logistics Pooling):** छोटे किसान मिलकर पिकअप या ट्रक शेयर करते हैं, जिससे ट्रांसपोर्ट खर्च 40% तक घट जाता है।
- 💬 **1-क्लिक व्हाट्सएप डील:** बिना किसी जटिल प्रक्रिया के किसान और थोक खरीदार सीधे व्हाट्सएप पर जुड़ सकते हैं।

---

## 📁 प्रोजेक्ट संरचना (Project Architecture)

```
kisansetu/
├── frontend/                     # यूजर-फ्रेंडली रिस्पॉन्सिव वेब ऐप (जीरो-इंस्टॉल)
│   ├── index.html                # मुख्य पेज (Tailwind CSS, द्वैभाषिक हिंदी/English)
│   ├── app.js                    # वॉइस इनपुट (Web Speech), लाइव बोली और कैलकुलेटर
│   └── style.css                 # मोबाइल-ऑप्टिमाइज़्ड सीएसएस
├── backend/                      # Node.js + Express REST API सर्वर
│   ├── package.json              # डिपेंडेंसीज़ (Express, CORS)
│   ├── server.js                 # सभी REST एंडपॉइंट्स और डेटाबेस लॉजिक
│   └── database.json             # ऑटो-सीडेड फाइल आधारित डेटाबेस
├── database/                     # डेटाबेस स्कीमा और बीज डेटा (SQLite / SQL)
│   ├── schema.sql                # टेबल्स (Users, Listings, Bids, MandiRates, Logistics)
│   └── seed_data.sql             # भारत की प्रमुख मंडियों का वास्तविक डेटा
└── README.md                     # दस्तावेज़ व हैकटोबरफेस्ट गाइड
```

---

## ⚡ त्वरित शुरुआत (Quick Start Guide)

### 1. सीधे ब्राउज़र में चलाएं (बिना कुछ इंस्टॉल किए):
आपको कोई सॉफ्टवेयर इंस्टॉल करने की ज़रूरत नहीं है!
1. अपने कंप्यूटर या लैपटॉप में `frontend/index.html` फाइल पर डबल-क्लिक करें या उसे Google Chrome / Microsoft Edge में खोलें।
2. ऐप तुरंत सक्रिय हो जाएगा। इसमें वॉइस इनपुट, फसल लिस्टिंग, लाइव नीलामी और मुनाफा कैलकुलेटर पूरी तरह काम करेगा।

---

### 2. बैकएंड सर्वर शुरू करें (Node.js):
यदि आपके सिस्टम पर [Node.js](https://nodejs.org/) उपलब्ध है:

```bash
# 1. बैकएंड फोल्डर में जाएं
cd backend

# 2. डिपेंडेंसी इंस्टॉल करें
npm install

# 3. सर्वर स्टार्ट करें
npm start
```
सर्वर **`http://localhost:5000`** पर सक्रिय हो जाएगा और फ्रंटएंड अपने आप इसके साथ लाइव सिंक हो जाएगा!

---

## 📡 REST API Endpoints

| Method | Endpoint | विवरण (Description) |
|---|---|---|
| `GET` | `/api/health` | सर्वर स्टेटस व हेल्थ चेक |
| `GET` | `/api/listings` | सभी सक्रिय फसलों की सूची |
| `POST` | `/api/listings` | किसान द्वारा नई फसल जोड़ना |
| `GET` | `/api/listings/:id/bids` | किसी फसल पर लगी बोलियां |
| `POST` | `/api/bids` | थोक खरीदार द्वारा नई बोली लगाना |
| `GET` | `/api/mandi-rates` | प्रमुख मंडियों के ताज़ा भाव |
| `POST` | `/api/calculate-arbitrage` | शुद्ध अतिरिक्त मुनाफा कैलकुलेशन |
| `GET` | `/api/logistics-pools` | सामूहिक ढुलाई (शेयर्ड व्हीकल) सूची |

---

## 🎃 Hacktoberfest कॉन्ट्रिब्यूशन गाइड (Good First Issues)

हैकटोबरफेस्ट में भाग लेने वाले डेवलपर्स इन फीचर्स पर PRs भेज सकते हैं:

- [ ] **Issue #1: WhatsApp Bot Webhook (Twilio / Meta API)**  
  किसान द्वारा भेजे गए व्हाट्सएप वॉइस नोट को पार्स करके ऑटो-लिस्टिंग बनाना।
- [ ] **Issue #2: Agmarknet Live Scraper / Government API Integration**  
  भारत सरकार के डाटा पोर्टल (data.gov.in) से दैनिक मंडी भाव रियल-टाइम में फेच करना।
- [ ] **Issue #3: More Regional Languages (मराठी, पंजाबी, तमिल, तेलुगु)**  
  `app.js` में अनुवाद डिक्शनरी का विस्तार करना।
- [ ] **Issue #4: PWA Support & Offline Mode**  
  गांवों में कमजोर इंटरनेट के लिए Service Worker और IndexedDB ऑफलाइन सिंकिंग जोड़ना।
- [ ] **Issue #5: Escrow / UPI Payment Integration**  
  किसान की सुरक्षा के लिए सुरक्षित टोकन पेमेंट गेटवे।

---

## 📜 लाइसेंस (License)
यह प्रोजेक्ट **MIT License** के अंतर्गत ओपन-सोर्स है। इसे कोई भी किसान, डेवलपर या संस्था स्वतंत्र रूप से उपयोग और विकसित कर सकती है।
