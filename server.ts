import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";
import { User, CropLog, DiseaseLog, VoiceLog, SmsLog } from "./src/types";

// Setup Gemini API Client (Server-side only)
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("🌱 Gemini API successfully initialized server-side.");
  } catch (error) {
    console.error("❌ Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.warn("⚠️ GEMINI_API_KEY not found or is default. Server will run in Simulated/Hybrid AI mode.");
}

// Database setup (Mock Firestore via local JSON)
const LOCAL_DB_FILE = path.join(process.cwd(), "db.json");
const DB_FILE = (process.env.VERCEL || process.env.NODE_ENV === "production" || fs.existsSync("/tmp"))
  ? path.join("/tmp", "db.json")
  : LOCAL_DB_FILE;

interface DatabaseSchema {
  users: User[];
  cropLogs: CropLog[];
  diseaseLogs: DiseaseLog[];
  voiceLogs: VoiceLog[];
  smsLogs: SmsLog[];
}

const defaultDb: DatabaseSchema = {
  users: [
    {
      id: "user-1",
      name: "Ramesh Gowda",
      phone: "9845012345",
      language: "te",
      village: "Kuppam",
      district: "Chittoor"
    },
    {
      id: "user-2",
      name: "Sita Devi",
      phone: "9123456789",
      language: "hi",
      village: "Bichia",
      district: "Gorakhpur"
    }
  ],
  cropLogs: [
    {
      id: "crop-1",
      userId: "user-1",
      userName: "Ramesh Gowda",
      village: "Kuppam",
      crop: "Paddy",
      date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36h ago
      soil: { type: "Clayey", ph: "6.5", n: 60, p: 40, k: 40 },
      weather: { temp: "28°C", humidity: "78%", rainfall: "1200mm" },
      recommendation: {
        crop: "Paddy (Rice)",
        confidence: "93%",
        alternatives: ["Groundnut", "Maize"],
        yield: "4.5 tons/hectare",
        water: "High",
        fertilizer: "Apply Urea (100kg/ha) at tillering, followed by NPK booster.",
        profit: "₹85,000 / hectare"
      }
    }
  ],
  diseaseLogs: [
    {
      id: "disease-1",
      userId: "user-1",
      userName: "Ramesh Gowda",
      village: "Kuppam",
      phone: "9845012345",
      photo: "rice_blast", // Sample crop image identifier
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24h ago
      diagnosis: {
        disease: "Rice Blast (Pyricularia oryzae)",
        confidence: "74%",
        treatment: "Spray Tricyclazole 75 WP @ 0.6 g/liter of water. Maintain proper spacing and avoid excessive Nitrogen.",
        symptoms: "Spindle-shaped spots on leaves with grey centers and reddish-brown margins.",
        needExpert: true
      },
      status: "pending"
    },
    {
      id: "disease-2",
      userId: "user-2",
      userName: "Sita Devi",
      village: "Bichia",
      phone: "9123456789",
      photo: "tomato_early_blight",
      date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
      diagnosis: {
        disease: "Tomato Early Blight",
        confidence: "95%",
        treatment: "Apply Mancozeb 75 WP @ 2 g/liter. Prune lower leaves to enhance airflow and rotate crops annually.",
        symptoms: "Dark, concentric target-like spots on older foliage.",
        needExpert: false
      },
      status: "resolved",
      expertReply: "Perfect diagnosis Sita ji. The Mancozeb application is correct. Also, try to keep the water from splashing on the leaves during irrigation.",
      expertName: "Dr. K. Swaminathan (Agronomist)",
      repliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ],
  voiceLogs: [],
  smsLogs: [
    {
      id: "sms-1",
      userId: "user-1",
      phone: "9845012345",
      date: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      message: "WEATHER KUPPAM",
      reply: "రేపు కుప్పంలో వర్షం పడే అవకాశం ఉంది. ఈ రోజు యూరియా చల్లవద్దు. గాలి వేగం: 12 km/h.",
      language: "te"
    }
  ]
};

function readDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    } else if (DB_FILE !== LOCAL_DB_FILE && fs.existsSync(LOCAL_DB_FILE)) {
      // Seed /tmp/db.json from project db.json if running in read-only environment
      const data = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      try {
        fs.writeFileSync(DB_FILE, data, "utf-8");
        console.log("🌱 Database seeded successfully to /tmp/db.json");
      } catch (writeErr) {
        console.warn("⚠️ Could not write seed to /tmp/db.json:", writeErr);
      }
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file, using fallback database:", err);
  }
  return defaultDb;
}

function writeDb(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// Initial seeding if empty
if (!fs.existsSync(DB_FILE)) {
  writeDb(defaultDb);
}

// Initialize Express app and PORT at top-level
export const app = express();
const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Helper function to call Gemini safely
  async function queryGemini(prompt: string, systemInstruction?: string, isJson: boolean = false): Promise<string> {
    if (!ai) {
      throw new Error("Gemini client not initialized");
    }
    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (isJson) {
      config.responseMimeType = "application/json";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: config
    });

    return response.text || "";
  }

  // --- API Endpoints ---

  // User Login / OTP Simulation
  app.post("/api/login", (req, res) => {
    const { phone, name, language, village, district } = req.body;
    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const db = readDb();
    let user = db.users.find(u => u.phone === phone);

    if (!user) {
      user = {
        id: "user-" + Date.now(),
        name: name || `Farmer (${phone.slice(-4)})`,
        phone,
        language: language || "en",
        village: village || "Unknown Village",
        district: district || "Unknown District"
      };
      db.users.push(user);
      writeDb(db);
    } else {
      // Update details if supplied
      if (name) user.name = name;
      if (language) user.language = language;
      if (village) user.village = village;
      if (district) user.district = district;
      writeDb(db);
    }

    res.json(user);
  });

  // GET User details by Phone
  app.get("/api/users/:phone", (req, res) => {
    const db = readDb();
    const user = db.users.find(u => u.phone === req.params.phone);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  });

  // GET Weather & Irrigation Advisory
  app.get("/api/weather", async (req, res) => {
    const { location, lang } = req.query;
    const loc = (location as string) || "Kuppam, AP";
    const language = (lang as string) || "en";

    // Simulate high-fidelity weather details for visual appeal
    const temp = "29°C";
    const humidity = "82%";
    const condition = "Partly Cloudy";
    const windSpeed = "14 km/h";
    const rainfall = "Light showers expected late evening";

    const prompt = `Based on weather data:
Location: ${loc}
Temperature: ${temp}
Humidity: ${humidity}
Condition: ${condition}
Wind Speed: ${windSpeed}
Forecast: ${rainfall}

Generate today's advice for a small-scale farmer. 
Answer in short, easy-to-understand direct sentences in language code: "${language}".
List strictly 3 action items:
1. Should irrigation be done?
2. Should fertilizer be applied?
3. Should pesticide spraying be avoided or proceeded?

Format your response strictly as a JSON object with this shape:
{
  "temp": "${temp}",
  "humidity": "${humidity}",
  "condition": "${condition}",
  "windSpeed": "${windSpeed}",
  "rainfall": "${rainfall}",
  "advice": ["Sentence 1", "Sentence 2", "Sentence 3"]
}`;

    try {
      if (ai) {
        const text = await queryGemini(prompt, "You are a professional agricultural irrigation & weather advisor. Be concise and reply only in the selected language.", true);
        const parsed = JSON.parse(text);
        return res.json(parsed);
      }
    } catch (e) {
      console.error("Gemini weather advisory failed, serving robust fallback:", e);
    }

    // High quality fallbacks if Gemini is not available
    const fallbackAdvice: Record<string, string[]> = {
      te: [
        "రేపు వర్షం వచ్చే అవకాశం ఉంది. కాబట్టి ఈరోజు ఎక్కువ నీరు పెట్టవద్దు.",
        "వర్షానికి ముందే ఎరువులు చల్లడం మంచిది కాదు, పోషకాలు కొట్టుకుపోతాయి.",
        "ఈ రోజు పురుగుమందుల పిచికారీని నిలిపివేయండి."
      ],
      hi: [
        "कल बारिश होने की संभावना है। आज सिंचाई न करें।",
        "बारिश के तुरंत पहले खाद न डालें, पोषक तत्व बह जाएंगे।",
        "आज कीटनाशकों के छिड़काव से बचें।"
      ],
      ta: [
        "நாளை மழை பெய்ய வாய்ப்புள்ளது. எனவே இன்று பயிர்களுக்கு அதிக தண்ணீர் பாய்ச்ச வேண்டாம்.",
        "மழைக்கு முன் உரம் போடுவதைத் தவிர்க்கவும், சத்துக்கள் அடித்துச் செல்லப்படலாம்.",
        "இன்றைய பூச்சிக்கொல்லி தெளிப்பை ஒத்திவைக்கவும்."
      ],
      kn: [
        "ನಾಳೆ ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ. ಆದ್ದರಿಂದ ಇಂದು ಬೆಳೆಗೆ ಹೆಚ್ಚು ನೀರು ಹರಿಸಬೇಡಿ.",
        "ಮಳೆಗಿಂತ ಮೊದಲು ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ, ಪೋಷಕಾಂಶಗಳು ಕೊಚ್ಚಿಹೋಗಬಹುದು.",
        "ಇಂದಿನ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆಯನ್ನು ಮುಂದೂಡಿ."
      ],
      ml: [
        "നാളെ മഴയ്ക്ക് സാധ്യതയുണ്ട്. അതിനാൽ ഇന്ന് കൂടുതൽ നനയ്ക്കരുത്.",
        "മഴയ്ക്ക് തൊട്ടുമുമ്പ് വളപ്രയോഗം ഒഴിവാക്കുക, പോഷകങ്ങൾ ഒലിച്ചുപോകാം.",
        "ഇന്നത്തെ കീടനാശിനി പ്രയോഗം മാറ്റിവെക്കുക."
      ],
      mr: [
        "उद्या पावसाची शक्यता आहे. त्यामुळे आज पिकांना जास्त पाणी देऊ नका.",
        "पावसापूर्वी खत घालणे टाळा, पोषक तत्वे वाहून जाऊ शकतात.",
        "आज कीटकनाशक फवारणी पुढे ढकला."
      ],
      bn: [
        "আগামীকাল বৃষ্টির সম্ভাবনা রয়েছে। তাই আজ ফসলে বেশি জল দেবেন না।",
        "বৃষ্টির ঠিক আগে সার প্রয়োগ এড়িয়ে চলুন, পুষ্টি উপাদান ভেসে যেতে পারে।",
        "আজকের কীটনাশক ছেটানো স্থগিত রাখুন।"
      ],
      gu: [
        "આવતીકાલે વરસાદની શક્યતા છે. તેથી આજે પાકને વધુ પાણી આપશો નહીં.",
        "વરસાદ પહેલા ખાતર નાખવાનું ટાળો, પોષક તત્વો ધોવાઈ શકે છે.",
        "આજની જંતુનાશક દવાઓનો છંટકાવ મુલતવી રાખો."
      ],
      pa: [
        "ਕੱਲ੍ਹ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ। ਇਸ ਲਈ ਅੱਜ ਫਸਲਾਂ ਨੂੰ ਜ਼ਿਆดา ਪਾਣੀ ਨਾ ਦਿਓ।",
        "ਮੀਂਹ ਤੋਂ ਠੀਕ ਪਹਿਲਾਂ ਖਾਦ ਪਾਉਣ ਤੋਂ ਬਚੋ, ਪੌਸ਼ਟਿਕ ਤੱਤ ਵਹਿ ਸਕਦੇ ਹਨ।",
        "ਅੱਜ ਕੀਟਨਾਸ਼ਕਾਂ ਦਾ छिੜਕਾਅ ਮੁਲਤਵੀ ਕਰੋ।"
      ],
      or: [
        "ଆସନ୍ତାକାଲି ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି | ତେଣୁ ଆଜି ଫସଲରେ ଅଧିକ ଜଳସେଚନ କରନ୍ତୁ ନାହିଁ |",
        "ବର୍ଷା ପୂର୍ବରୁ ସାର ପ୍ରୟୋଗ କରନ୍ତୁ ନାହିଁ, ପୋଷକ ତତ୍ତ୍ୱ ନଷ୍ଟ ହୋଇପାରେ |",
        "ଆଜି କୀଟନାଶକ ପ୍ରୟୋଗକୁ ସ୍ଥଗିତ ରଖନ୍ତୁ |"
      ],
      en: [
        "Rain expected tomorrow. Do not irrigate fields heavily today.",
        "Avoid applying fertilizers right before rainfall to prevent run-off.",
        "Postpone pesticide spraying due to high humidity and shower forecast."
      ]
    };

    res.json({
      temp,
      humidity,
      condition,
      windSpeed,
      rainfall,
      advice: fallbackAdvice[language] || fallbackAdvice["en"]
    });
  });

  // GET Daily Market Prices
  app.get("/api/market-prices", async (req, res) => {
    const { location, lang } = req.query;
    const loc = (location as string) || "Kuppam";
    const language = (lang as string) || "en";

    const prompt = `Generate a realistic daily market rate report for farmers in ${loc} in India.
Crops: Paddy (Rice), Cotton, Tomato, Wheat, Maize, Groundnut, Onion, Chilli.
Return a JSON array containing exactly 6 crops relevant to the season or region.
For each crop, return:
1. "localName": String (Localized crop name in language "${language}" e.g., "వరి (Paddy)" or "टमाटर (Tomato)")
2. "englishName": String (Standard english name, e.g., "Paddy (Rice)" or "Tomato")
3. "currentPrice": Number (Current market price in ₹ per Quintal or per Ton for sugarcane. E.g. 2250)
4. "yesterdayPrice": Number (Yesterday's market price in ₹ per Quintal. E.g. 2200)
5. "volume": String (Arrival volume in market today, e.g., "120 Tons" or "320 Bags")
6. "mandiName": String (Name of the active local APMC or Mandi, e.g. "${loc} Mandi" or nearby major wholesale hub)
7. "trend": String (Value must be "UP", "DOWN", or "STABLE")
8. "recommendation": String (Actionable sale/hold advice for the farmer in language "${language}")

Return strictly a JSON array without any markdown wrappers or additional text, matching this structure:
[
  {
    "localName": "Local Name",
    "englishName": "English Name",
    "currentPrice": 2250,
    "yesterdayPrice": 2200,
    "volume": "150 Tons",
    "mandiName": "Mandi Name",
    "trend": "UP/DOWN/STABLE",
    "recommendation": "Advice in local language"
  }
]`;

    try {
      if (ai) {
        const text = await queryGemini(prompt, "You are an expert Indian agri-market analyst and APMC pricing assistant. Reply with raw JSON strictly matching the requested format.", true);
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return res.json(parsed);
        }
      }
    } catch (e) {
      console.error("Gemini market rates generation failed, using fallback:", e);
    }

    // Comprehensive Fallbacks
    const fallbackCrops: Record<string, any[]> = {
      te: [
        { localName: "వరి (Paddy)", englishName: "Paddy (Rice)", currentPrice: 2280, yesterdayPrice: 2240, volume: "180 టన్నులు", mandiName: "కుప్పం APMC", trend: "UP", recommendation: "ధరలు పెరుగుతున్నాయి. ఈరోజు విక్రయించడం మంచిది." },
        { localName: "పత్తి (Cotton)", englishName: "Cotton", currentPrice: 6900, yesterdayPrice: 7050, volume: "95 టన్నులు", mandiName: "ఆదోని యార్డ్", trend: "DOWN", recommendation: "ధర స్వల్పంగా తగ్గింది. నాణ్యత బాగుంటే కొద్ది రోజులు నిల్వ ఉంచండి." },
        { localName: "టమోటా (Tomato)", englishName: "Tomato", currentPrice: 1950, yesterdayPrice: 1600, volume: "45 టన్నులు", mandiName: "మదనపల్లె మార్కెట్", trend: "UP", recommendation: "భారీ డిమాండ్ ఉంది. త్వరగా కోత కోసి మార్కెట్ కి తరలించండి." },
        { localName: "వేరుశనగ (Groundnut)", englishName: "Groundnut", currentPrice: 6200, yesterdayPrice: 6200, volume: "60 టన్నులు", mandiName: "చిత్తూరు మండి", trend: "STABLE", recommendation: "ధర స్థిరంగా ఉంది. సాధారణ విక్రయాలు కొనసాగించండి." },
        { localName: "మొక్కజొన్న (Maize)", englishName: "Maize", currentPrice: 1980, yesterdayPrice: 2020, volume: "120 టన్నులు", mandiName: "కుప్పం మార్కెట్", trend: "DOWN", recommendation: "మార్కెట్ లో నిల్వలు ఎక్కువ ఉన్నాయి. కొన్ని రోజులు వేచి ఉండండి." },
        { localName: "ఉల్లిపాయ (Onion)", englishName: "Onion", currentPrice: 2450, yesterdayPrice: 2300, volume: "220 టన్నులు", mandiName: "యశవంతపూర్ మండి", trend: "UP", recommendation: "డిమాండ్ బాగుంది. ఈ రోజు అమ్మకం లాభదాయకం." }
      ],
      hi: [
        { localName: "धान (Paddy)", englishName: "Paddy (Rice)", currentPrice: 2180, yesterdayPrice: 2150, volume: "150 टन", mandiName: "गोरखपुर मंडी", trend: "UP", recommendation: "कीमतों में तेजी है। बेचने का सही समय है।" },
        { localName: "कपास (Cotton)", englishName: "Cotton", currentPrice: 6800, yesterdayPrice: 6950, volume: "80 टन", mandiName: "अमरावती यार्ड", trend: "DOWN", recommendation: "कीमतों में गिरावट है। यदि संभव हो तो स्टॉक रोके रखें।" },
        { localName: "टमाटर (Tomato)", englishName: "Tomato", currentPrice: 1800, yesterdayPrice: 1550, volume: "35 टन", mandiName: "गोरखपुर थोक बाजार", trend: "UP", recommendation: "मांग अधिक है। अच्छी गुणवत्ता वाली फसल आज ही बेचें।" },
        { localName: "मूंगफली (Groundnut)", englishName: "Groundnut", currentPrice: 6100, yesterdayPrice: 6100, volume: "55 टन", mandiName: "झांसी मंडी", trend: "STABLE", recommendation: "बाजार स्थिर है। सामान्य रूप से बिक्री जारी रखें।" },
        { localName: "मक्का (Maize)", englishName: "Maize", currentPrice: 1950, yesterdayPrice: 1980, volume: "110 टन", mandiName: "बस्ती मंडी", trend: "DOWN", recommendation: "आवक बढ़ने से दाम घटे हैं। कुछ दिन इंतजार कर सकते हैं।" },
        { localName: "प्याज़ (Onion)", englishName: "Onion", currentPrice: 2350, yesterdayPrice: 2200, volume: "200 टन", mandiName: "आजादपुर मंडी", trend: "UP", recommendation: "मांग बढ़ रही है। बेचने पर अच्छा मुनाफा मिलेगा।" }
      ],
      en: [
        { localName: "Paddy (Rice)", englishName: "Paddy (Rice)", currentPrice: 2250, yesterdayPrice: 2200, volume: "180 Tons", mandiName: "Kuppam APMC", trend: "UP", recommendation: "Prices are rising. Good time to liquidate portion of stock." },
        { localName: "Cotton", englishName: "Cotton", currentPrice: 6950, yesterdayPrice: 7100, volume: "95 Tons", mandiName: "Adoni APMC", trend: "DOWN", recommendation: "Slight dip in market. Hold high grade stock if storage allows." },
        { localName: "Tomato", englishName: "Tomato", currentPrice: 1900, yesterdayPrice: 1600, volume: "45 Tons", mandiName: "Madanapalle Market", trend: "UP", recommendation: "High demand observed. Harvest and transport premium grade today." },
        { localName: "Groundnut", englishName: "Groundnut", currentPrice: 6200, yesterdayPrice: 6200, volume: "60 Tons", mandiName: "Chittoor Mandi", trend: "STABLE", recommendation: "Steady prices. Maintain regular selling schedule." },
        { localName: "Maize (Corn)", englishName: "Maize", currentPrice: 1980, yesterdayPrice: 2020, volume: "120 Tons", mandiName: "Kuppam Market", trend: "DOWN", recommendation: "Heavy arrivals. Wait for 3-5 days for better bargaining power." },
        { localName: "Onion", englishName: "Onion", currentPrice: 2400, yesterdayPrice: 2300, volume: "210 Tons", mandiName: "Yeshwanthpur APMC", trend: "UP", recommendation: "Active wholesale buying. High grade lots command solid premiums." }
      ]
    };

    const result = fallbackCrops[language] || fallbackCrops["en"];
    // For other language codes, translate or adapt from english
    if (!fallbackCrops[language]) {
      const langSuffix: Record<string, string> = {
        ta: " (தமிழ்)", kn: " (ಕನ್ನಡ)", ml: " (മലയാളം)", mr: " (मराठी)",
        bn: " (বাংলা)", gu: " (ગુજરાતી)", pa: " (ਪੰਜਾਬੀ)", or: " (ଓଡ଼ିଆ)"
      };
      const localizedResult = fallbackCrops["en"].map(crop => ({
        ...crop,
        localName: crop.localName + (langSuffix[language] || "")
      }));
      return res.json(localizedResult);
    }

    res.json(result);
  });

  // POST Crop Recommendation
  app.post("/api/recommend", async (req, res) => {
    const { userId, location, soilType, ph, nitrogen, phosphorus, potassium, groundwater, season } = req.body;
    
    const db = readDb();
    const user = db.users.find(u => u.id === userId) || db.users[0];

    const temp = "28°C";
    const humidity = "75%";
    const rainfall = "1200mm";

    const prompt = `You are India's best agricultural scientist.
Analyze the following environmental information and recommend optimal crops:
Location: ${location || user.village}
Soil Type: ${soilType}
pH: ${ph}
Nitrogen (N): ${nitrogen} ppm
Phosphorus (P): ${phosphorus} ppm
Potassium (K): ${potassium} ppm
Groundwater Level: ${groundwater}
Current Season: ${season}
Weather Reference: Temperature: ${temp}, Humidity: ${humidity}, Rainfall: ${rainfall}

Recommend:
1. Best primary crop (name of crop)
2. Confidence score of this match (e.g. "93%")
3. Two alternate crops to consider
4. Expected yield (e.g., "4 tons/hectare")
5. Water requirement level (High/Medium/Low)
6. Fertilizer advice (custom for the NPK levels)
7. Profit estimate per hectare in Rupees (e.g. "₹80,000")

Your output MUST be strictly a single JSON object with these exact keys:
{
  "crop": "Crop Name",
  "confidence": "93%",
  "alternatives": ["Alt Crop 1", "Alt Crop 2"],
  "yield": "Expected Yield",
  "water": "High/Medium/Low",
  "fertilizer": "NPK tailored Advice",
  "profit": "₹Estimated Profit"
}`;

    let recommendation;

    try {
      if (ai) {
        const text = await queryGemini(prompt, "You are India's best agricultural scientist. Tailor your fertilizer recommendation based on N, P, K levels supplied. Low N means add organic nitrogen or urea. Return ONLY JSON.", true);
        recommendation = JSON.parse(text);
      }
    } catch (e) {
      console.error("Gemini crop recommendation failed, serving robust fallback:", e);
    }

    // High fidelity default fallback
    if (!recommendation) {
      let mainCrop = "Paddy (Rice)";
      let confidence = "92%";
      let alternatives = ["Maize", "Groundnut"];
      let fertilizerAdvice = "Nitrogen level is moderate. Apply 80kg/ha of Urea in split doses, and add organic compost.";
      let profit = "₹80,000";

      if (soilType === "Sandy" || soilType === "Black") {
        mainCrop = "Cotton";
        confidence = "89%";
        alternatives = ["Sorghum", "Pigeon Pea"];
        fertilizerAdvice = "Potassium is sufficient. Apply Nitrogen-based booster and organic manure to enrich Sandy soil.";
        profit = "₹95,000";
      } else if (soilType === "Red" || soilType === "Loamy") {
        mainCrop = "Groundnut";
        confidence = "91%";
        alternatives = ["Maize", "Ragi"];
        fertilizerAdvice = "Phosphorus is moderate. Supplement with Single Superphosphate (SSP) and zinc sulphate.";
        profit = "₹70,000";
      }

      recommendation = {
        crop: mainCrop,
        confidence,
        alternatives,
        yield: mainCrop === "Cotton" ? "2.5 tons/hectare" : "4.0 tons/hectare",
        water: mainCrop === "Paddy (Rice)" ? "High" : "Medium",
        fertilizer: fertilizerAdvice,
        profit: profit
      };
    }

    // Record the crop log
    const cropLog: CropLog = {
      id: "crop-" + Date.now(),
      userId: user.id,
      userName: user.name,
      village: user.village,
      crop: recommendation.crop,
      date: new Date().toISOString(),
      soil: {
        type: soilType,
        ph: ph,
        n: Number(nitrogen),
        p: Number(phosphorus),
        k: Number(potassium)
      },
      weather: { temp, humidity, rainfall },
      recommendation
    };

    db.cropLogs.push(cropLog);
    writeDb(db);

    res.json(cropLog);
  });

  // POST Leaf Disease Detection (Vision & Voice symptoms)
  app.post("/api/disease", async (req, res) => {
    const { userId, photoBase64, sampleId, voiceSymptoms } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.id === userId) || db.users[0];

    let diagnosis;

    // If voice symptoms are provided
    if (voiceSymptoms && ai) {
      try {
        const promptText = `A farmer described their crop disease symptoms verbally in their local language or English: "${voiceSymptoms}".
Based on this verbal symptom description, identify:
1. Most likely Crop Disease (be specific, e.g. "Tomato Leaf Curl Virus" or "Wheat Rust" or similar)
2. Confidence level of detection (e.g. "82%")
3. Symptoms they described and typical secondary signs
4. Customized Treatment advice and immediate spray/soil suggestions
5. Whether expert consultation is needed (boolean)

Return strictly a JSON object with this shape:
{
  "disease": "Disease Name",
  "confidence": "82%",
  "symptoms": "Description of typical symptoms and those reported",
  "treatment": "Treatment steps, fungicides, or organic remedies to apply",
  "needExpert": true/false
}`;

        const response = await queryGemini(promptText, "You are a professional agricultural scientist who can diagnose plant diseases from text-based symptom descriptions. Be concise and accurate. Return strictly JSON.", true);
        diagnosis = JSON.parse(response);
      } catch (err) {
        console.error("Gemini text-based disease diagnosis failed:", err);
      }
    }

    // If real image was uploaded
    if (!diagnosis && photoBase64 && ai) {
      try {
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
        const imagePart = {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data
          }
        };

        const promptText = `Analyze this crop leaf image.
Identify:
1. Disease Name (or "Healthy Leaf" if no disease)
2. Confidence level of detection (e.g. "94%")
3. Symptoms displayed in the image
4. Custom Treatment advice
5. Whether expert consultation is needed (boolean)

Return strictly a JSON object with this shape:
{
  "disease": "Disease Name or Healthy Leaf",
  "confidence": "94%",
  "symptoms": "Description of symptoms",
  "treatment": "Treatment steps, fungicides, or fertilizers to apply",
  "needExpert": true/false
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: [imagePart, promptText],
          config: {
            responseMimeType: "application/json"
          }
        });

        if (response.text) {
          diagnosis = JSON.parse(response.text);
        }
      } catch (err) {
        console.error("Gemini Vision disease diagnosis failed:", err);
      }
    }

    // Fallbacks or sample leaves
    if (!diagnosis) {
      if (voiceSymptoms) {
        diagnosis = {
          disease: "Symptom-based Fungal Spot / Wilt Infection",
          confidence: "78%",
          symptoms: `Reported symptoms: "${voiceSymptoms}". Typical signs include chlorosis, leaf spots, wilt, or necrosis.`,
          treatment: "Spray organic Neem oil formulation (5ml/L) or Carbendazim 50 WP fungicide @ 2g/L. Ensure adequate drainage.",
          needExpert: true
        };
      } else {
        const presets: Record<string, any> = {
          rice_blast: {
            disease: "Rice Blast (Pyricularia oryzae)",
            confidence: "88%",
            symptoms: "Spindle-shaped spots on leaves, greyish centers with brown borders.",
            treatment: "Spray Tricyclazole 75 WP @ 0.6g/L or Isoprothiolane 40 EC @ 1.5ml/L. Avoid high N fertilizer.",
            needExpert: true
          },
          cotton_blight: {
            disease: "Bacterial Leaf Blight of Cotton",
            confidence: "78%",
            symptoms: "Water-soaked angular spots on leaves turning brown/black. Reddish margins on veins.",
            treatment: "Spray Copper Oxychloride (3g) + Streptocycline (100mg) per liter of water. Prune infected stems.",
            needExpert: true
          },
          tomato_early_blight: {
            disease: "Tomato Early Blight (Alternaria solani)",
            confidence: "94%",
            symptoms: "Concentric rings (target spots) appearing on older leaves first.",
            treatment: "Apply Mancozeb or Chlorothalonil fungicide. Improve soil drainage and keep water off leaves.",
            needExpert: false
          },
          healthy_wheat: {
            disease: "No Disease Detected (Healthy Leaf)",
            confidence: "98%",
            symptoms: "Lush green color, normal vein architecture, no lesions or rust spots present.",
            treatment: "Maintain standard irrigation and nutrient cycles. No chemical fungicides required.",
            needExpert: false
          }
        };

        diagnosis = presets[sampleId] || presets["rice_blast"];
      }
    }

    // Determine if auto-escalation to expert dashboard is needed (if confidence < 80% or diagnosis says needExpert)
    const confValue = parseInt(diagnosis.confidence) || 100;
    if (confValue < 80) {
      diagnosis.needExpert = true;
    }

    const diseaseLog: DiseaseLog = {
      id: "disease-" + Date.now(),
      userId: user.id,
      userName: user.name,
      village: user.village,
      phone: user.phone,
      photo: voiceSymptoms ? "voice_description" : (sampleId || "uploaded_image"),
      date: new Date().toISOString(),
      diagnosis,
      status: diagnosis.needExpert ? "pending" : "resolved"
    };

    db.diseaseLogs.push(diseaseLog);
    writeDb(db);

    res.json(diseaseLog);
  });

  // POST Voice Assistant API
  app.post("/api/voice", async (req, res) => {
    const { userId, queryText, language } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.id === userId) || db.users[0];
    const lang = language || user.language || "en";

    const languageNames: Record<string, string> = {
      en: "English",
      te: "Telugu",
      hi: "Hindi",
      ta: "Tamil",
      kn: "Kannada",
      ml: "Malayalam",
      mr: "Marathi",
      bn: "Bengali",
      gu: "Gujarati",
      pa: "Punjabi",
      or: "Odia"
    };

    const targetLanguageName = languageNames[lang] || "English";

    const prompt = `You are a friendly, warm agricultural assistant.
Answer the farmer's question: "${queryText}".
Rules:
1. Answer strictly in the language: ${targetLanguageName}.
2. Keep the answer extremely brief (strictly under 40 words).
3. Be highly encouraging and practical. Avoid overly technical jargon.
4. Reply only with the answered text.`;

    let replyText = "";

    try {
      if (ai) {
        replyText = await queryGemini(prompt, "You are a friendly agricultural assistant speaking to a simple farmer. Speak clearly and simply.");
      }
    } catch (e) {
      console.error("Gemini voice assistant failed, serving fallback:", e);
    }

    if (!replyText) {
      const fallbacks: Record<string, string> = {
        te: "మీ పంటకు వారానికి రెండు సార్లు తగినంత నీరు పెట్టండి. పగటిపూట ఉష్ణోగ్రతలను బట్టి సాయంత్రం వేళల్లో నీరు పెట్టడం మంచిది.",
        hi: "अपनी फसल को सप्ताह में दो बार पानी दें। दोपहर की तेज धूप में सिंचाई करने से बचें, शाम का समय सबसे अच्छा रहेगा।",
        ta: "உங்கள் பயிர்களுக்கு வாரத்திற்கு இரண்டு முறை தகுந்த அளவு நீர் பாய்ச்சவும். மாலையில் நீர் பாய்ச்சுவது சிறந்தது.",
        kn: "ನಿಮ್ಮ ಬೆಳೆಗೆ ವಾರಕ್ಕೆ ಎರಡು ಬಾರಿ ನೀರುಣಿಸಿ. ಸಂಜೆ ಸಮಯದಲ್ಲಿ ನೀರು ಹರಿಸುವುದು ಉತ್ತಮ.",
        ml: "നിങ്ങളുടെ വിളകൾക്ക് ആഴ്ചയിൽ രണ്ടുതവണ നനയ്ക്കുക. വൈകുന്നേരം നനയ്ക്കുന്നതാണ് ഏറ്റവും ഉചിതം.",
        mr: "तुमच्या पिकाला आठवड्यातून दोनदा पाणी द्या. संध्याकाळच्या वेळी पाणी देणे सर्वात चांगले राहील.",
        bn: "আপনার ফসলে সপ্তাহে দুবার পর্যাপ্ত জল দিন। বিকেল বা সন্ধ্যার সময় জল দেওয়া সবচেয়ে ভালো হবে।",
        gu: "તમારા પાકને અઠવાડિયામાં બે વાર યોગ્ય પાણી આપો. સાંજના સમયે પાણી આપવું સૌથી ઉત્તમ રહેશે.",
        pa: "ਆਪਣੀ ਫਸਲ ਨੂੰ ਹਫ਼ਤੇ ਵਿੱਚ ਦੋ ਵਾਰ ਪਾਣੀ ਦਿਓ। ਸ਼ਾਮ ਦੇ ਸਮੇਂ ਪਾਣੀ ਦੇਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਰਹੇਗਾ।",
        or: "ଆପଣଙ୍କ ଫସଲକୁ ସପ୍ତାହରେ ଦୁଇଥର ଜଳସେଚନ କରନ୍ତು | ସନ୍ଧ୍ୟା ସମୟରେ ପାଣି ଦେବା ସବୁଠାରು ଭଲ |",
        en: "Irrigate your crop twice a week. It is best to water during the evening to reduce evaporation and protect roots."
      };
      replyText = fallbacks[lang] || fallbacks["en"];
    }

    // Save to logs
    const voiceLog: VoiceLog = {
      id: "voice-" + Date.now(),
      userId: user.id,
      userName: user.name,
      village: user.village,
      date: new Date().toISOString(),
      query: queryText,
      reply: replyText,
      language: lang
    };

    db.voiceLogs.push(voiceLog);
    writeDb(db);

    res.json(voiceLog);
  });

  // POST SMS Support Simulator
  app.post("/api/sms", async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({ error: "Phone and Message are required" });
    }

    const db = readDb();
    const user = db.users.find(u => u.phone === phone) || db.users[0];
    const lang = user.language || "en";

    const prompt = `A farmer sent an SMS with message: "${message}".
Generate a professional, ultra-brief SMS reply.
Rules:
1. Keep the reply under 140 characters.
2. Respond in the language code: "${lang}".
3. Offer concrete agricultural advice or action item.
4. If they send 'HELP', describe briefly that they can request 'WEATHER' or 'CROP' updates.`;

    let replyText = "";

    try {
      if (ai) {
        replyText = await queryGemini(prompt, "You are an automated SMS advisory node for farmers. Keep replies under 140 characters, clear, and direct.", false);
      }
    } catch (e) {
      console.error("Gemini SMS assistant failed:", e);
    }

    if (!replyText) {
      const msgLower = message.toLowerCase().trim();
      if (msgLower.includes("help")) {
        const helpText: Record<string, string> = {
          te: "సహాయం: వాతావరణం కోసం 'WEATHER', పంటల సలహాల కోసం 'CROP' అని టైప్ చేసి పంపండి.",
          hi: "मदद: मौसम के लिए 'WEATHER', फसल सलाह के लिए 'CROP' टाइप करें।",
          ta: "உதவி: வானிலைக்கு 'WEATHER', பயிர் ஆலோசனைக்கு 'CROP' என டைப் செய்யவும்.",
          kn: "ಸಹಾಯ: ಹವಾಮಾನಕ್ಕಾಗಿ 'WEATHER', ಬೆಳೆ ಸಲಹೆಗಾಗಿ 'CROP' ಎಂದು ಟೈಪ್ ಮಾಡಿ.",
          ml: "സഹായം: കാലാവസ്ഥയ്ക്ക് 'WEATHER', വിള ഉപദേശത്തിന് 'CROP' എന്ന് ടൈപ്പ് ചെയ്യുക.",
          mr: "मदत: हवामानासाठी 'WEATHER', पीक सल्ल्यासाठी 'CROP' टाइप करा.",
          bn: "সাহায্য: আবহাওয়ার জন্য 'WEATHER', ফসলের পরামর্শের জন্য 'CROP' লিখুন।",
          gu: "મદદ: હવામાન માટે 'WEATHER', પાક સલાહ માટે 'CROP' ટાઇપ કરો.",
          pa: "ਮਦਦ: ਮੌਸਮ ਲਈ 'WEATHER', ਫਸਲ ਦੀ ਸਲਾਹ ਲਈ 'CROP' ਲਿਖੋ।",
          or: "ସହାୟତା: ପାଣିପାଗ ପାଇଁ 'WEATHER', ଫସଲ ପରାମର୍ଶ ପାଇଁ 'CROP' ଟାଇପ୍ କରନ୍ତୁ |",
          en: "HELP: Type 'WEATHER' for forecast, 'CROP' for advice, or type your query."
        };
        replyText = helpText[lang] || helpText["en"];
      } else if (msgLower.includes("weather")) {
        const weatherText: Record<string, string> = {
          te: "వాతావరణం: నేడు పాక్షికంగా మేఘావృతం. ఉష్ణోగ్రత: 29°C. తేలికపాటి జల్లులు పడే అవకాశం ఉంది.",
          hi: "मौसम: आज आंशिक रूप से बादल छाए रहेंगे। तापमान: 29°C। हल्की वर्षा की संभावना है।",
          ta: "வானிலை: இன்று ஓரளவு மேகமூட்டத்துடன் காணப்படும். வெப்பநிலை: 29°C. லேசான மழைக்கு வாய்ப்பு.",
          kn: "ಹವಾಮಾನ: ಇಂದು ಭಾಗಶಃ ಮೋಡ ಕವಿದ ವಾತಾವರಣ. ತಾಪಮಾನ: 29°C. ಹಗುರ ಮಳೆಯ ಸಾಧ್ಯತೆ.",
          ml: "കാലാവസ്ഥ: ഇന്ന് ഭാഗികമായി മേഘാവൃതം. താവനില: 29°C. നേരിയ മഴയ്ക്ക് സാധ്യത.",
          mr: "हवामान: आज ढगाळ वातावरण असेल. तापमान: 29°C. हलक्या पावसाची शक्यता.",
          bn: "আবহাওয়া: আজ আংশিক মেঘলা থাকবে। তাপমাত্রা: ২৯°C। হালকা বৃষ্টির সম্ভাবনা রয়েছে।",
          gu: "હવામાન: આજે આંશિક વાદળછાયું વાતાવરણ રહેશે. તાપમાન: 29°C. હળવા વરસાદની શક્યતા.",
          pa: "ਮੌਸਮ: ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲ ਛਾਏ ਰਹਿਣਗੇ। ਤਾਪਮਾਨ: 29°C। ਹਲਕੀ ਵਰਖਾ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
          or: "ପାଣିପାଗ: ଆଜି ଆଂଶିକ ମେଘୁଆ ରହିବ | ତ୍ରପମାତ୍ରା: 29°C | ହାଲୁକା ବର୍ଷାର ସମ୍ଭାବନା ଅଛି |",
          en: "Weather: Partly cloudy today, 29°C. Light showers expected. Perfect for organic weeding."
        };
        replyText = weatherText[lang] || weatherText["en"];
      } else {
        const defaultText: Record<string, string> = {
          te: "కృషిమిత్ర: మీ అభ్యర్థన అందింది. వాతావరణం కోసం 'WEATHER' లేదా సహాయం కోసం 'HELP' అని పంపండి.",
          hi: "कृषिमित्र: आपका अनुरोध प्राप्त हुआ। मौसम के लिए 'WEATHER' या मदद के लिए 'HELP' भेजें।",
          ta: "கிருஷ்மித்ரா: கோரிக்கை பெறப்பட்டது. வானிலைக்கு 'WEATHER' அல்லது உதவிக்கு 'HELP' என அனுப்பவும்.",
          kn: "ಕೃಷಿಮಿತ್ರ: ನಿಮ್ಮ ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಹವಾಮಾನಕ್ಕೆ 'WEATHER' ಅಥವಾ ಸಹಾಯಕ್ಕೆ 'HELP' ಎಂದು ಕಳುಹಿಸಿ.",
          ml: "കൃഷിമിത്ര: നിങ്ങളുടെ അഭ്യർത്ഥന ലഭിച്ചു. കാലാവസ്ഥയ്ക്ക് 'WEATHER' അല്ലെങ്കിൽ സഹായത്തിന് 'HELP' എന്ന് അയക്കുക.",
          mr: "कृषिमित्र: तुमची विनंती प्राप्त झाली. हवामानासाठी 'WEATHER' किंवा मदतीसाठी 'HELP' पाठवा.",
          bn: "कृষিমিত্র: আপনার অনুরোধ পাওয়া গেছে। আবহাওয়ার জন্য 'WEATHER' বা সাহায্যের জন্য 'HELP' পাঠান।",
          gu: "કૃષિમિત્ર: તમારી વિનંતી મળી છે. હવામાન માટે 'WEATHER' અથવા મદદ માટે 'HELP' મોકલો.",
          pa: "ਕ੍ਰਿਸ਼ੀਮਿੱਤਰ: ਤੁਹਾਡੀ ਬੇਨਤੀ ਪ੍ਰਾਪਤ ਹੋਈ ਹੈ। ਮੌਸਮ ਲਈ 'WEATHER' ਜਾਂ ਮਦਦ ਲਈ 'HELP' ਭੇਜੋ।",
          or: "କୃଷିମିତ୍ର: ଆପଣଙ୍କ ଅନୁରୋଧ ଗ୍ରહڻ କରାଗଲା | ପାଣିପାଗ ପାଇଁ 'WEATHER' କିମ୍ବା ସହାୟତା ପାଇଁ 'HELP' ପଠାନ୍ତୁ |",
          en: "KrishiMitra: Request received. Send 'WEATHER' for alerts or 'HELP' for commands."
        };
        replyText = defaultText[lang] || defaultText["en"];
      }
    }

    const smsLog: SmsLog = {
      id: "sms-" + Date.now(),
      userId: user.id,
      phone,
      date: new Date().toISOString(),
      message,
      reply: replyText,
      language: lang
    };

    db.smsLogs.push(smsLog);
    writeDb(db);

    res.json(smsLog);
  });

  // POST Real-time Weather Advisory
  app.post("/api/weather-advisory", async (req, res) => {
    let { lat, lon, locationName, language } = req.body;
    const db = readDb();
    const user = db.users[0]; // fallback
    const lang = language || user?.language || "en";

    let latitude = lat ? parseFloat(lat) : 12.7480;
    let longitude = lon ? parseFloat(lon) : 78.3643;
    let locName = locationName || "Kuppam";

    if (locationName && (!lat || !lon)) {
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(locationName)}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results.length > 0) {
            latitude = geoData.results[0].latitude;
            longitude = geoData.results[0].longitude;
            locName = geoData.results[0].name + ", " + (geoData.results[0].admin1 || geoData.results[0].country || "");
          }
        }
      } catch (e) {
        console.error("Geocoding failed, using fallbacks:", e);
      }
    }

    let weatherData: any = null;
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=auto`;
      const response = await fetch(weatherUrl);
      if (response.ok) {
        weatherData = await response.json();
      }
    } catch (err) {
      console.error("Failed to fetch weather from Open-Meteo:", err);
    }

    if (!weatherData) {
      weatherData = {
        current: {
          temperature_2m: 29.5,
          relative_humidity_2m: 72,
          apparent_temperature: 32.1,
          precipitation: 0.5,
          wind_speed_10m: 12.4,
          weather_code: 3,
        },
        daily: {
          temperature_2m_max: [33.2],
          temperature_2m_min: [24.1],
          precipitation_sum: [2.5],
          precipitation_probability_max: [45],
        }
      };
    }

    const temp = weatherData.current?.temperature_2m || 28;
    const humidity = weatherData.current?.relative_humidity_2m || 70;
    const windSpeed = weatherData.current?.wind_speed_10m || 10;
    const precipProb = weatherData.daily?.precipitation_probability_max?.[0] || 20;
    const precipSum = weatherData.daily?.precipitation_sum?.[0] || 0;

    let advisory: any = null;

    const systemPrompt = "You are KrishiMitra, an expert AI agricultural advisory system. Analyze current weather and produce professional agricultural advisories.";
    const userPrompt = `Generate a structured agricultural weather advisory in JSON format.
Weather details for ${locName}:
- Temperature: ${temp}°C
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} km/h
- Rain Probability: ${precipProb}%
- Forecasted Precipitation: ${precipSum} mm
- Target Language: ${lang}

Analyze these parameters and determine:
1. Moisture Alert: E.g., alert about high evaporation risk, water logging, or ideal soil dampness.
2. Planting/Sowing Recommendation: Is it a good time to plant/sow? What precautions to take?
3. Fertilizer/Spraying Guidance: Can they spray pesticides or spread fertilizer today? (Rule: Avoid spraying if wind > 15 km/h or rain probability > 40%).
4. Harvest Advisory: Safe to harvest? Or should they protect harvested grains?

Provide responses strictly in the specified language: "${lang}". Keep each advisory section concise (under 25 words) and practical for farmers.

Return strictly a JSON object with this shape (keys in English, values in the requested language):
{
  "moistureAlert": "alert text",
  "plantingRecommendation": "recommendation text",
  "fertilizerGuidance": "spraying text",
  "harvestAdvisory": "harvest text",
  "suitabilityScore": 85
}`;

    if (ai) {
      try {
        const gResult = await queryGemini(userPrompt, systemPrompt, true);
        advisory = JSON.parse(gResult);
      } catch (e) {
        console.error("Gemini failed to generate weather advisory:", e);
      }
    }

    if (!advisory) {
      let moistureAlert = "Soil moisture is stable. High evapotranspiration rate expected during midday.";
      let plantingRecommendation = "Suitable for sowing of heat-resistant crops. Maintain adequate pre-sowing soil moisture.";
      let fertilizerGuidance = "Favorable conditions for pesticide spraying and urea spreading. Light winds.";
      let harvestAdvisory = "Excellent weather for harvesting. Store produce in dry, elevated areas.";
      let suitabilityScore = 80;

      if (precipProb > 40 || precipSum > 2) {
        moistureAlert = "Precipitation alert. High soil moisture expected. Pause supplementary irrigation cycles.";
        plantingRecommendation = "Delay seed sowing to avoid water logging. Transplanting hardy saplings is acceptable.";
        fertilizerGuidance = "DO NOT spray chemicals or spread fertilizers. Imminent rain will wash away treatments.";
        harvestAdvisory = "Suspend harvesting. Shield cut crops with waterproof tarpaulins immediately.";
        suitabilityScore = 45;
      } else if (temp > 35) {
        moistureAlert = "Heat/Moisture Alert: Severe dehydration threat. Increase micro-irrigation/drip intervals.";
        plantingRecommendation = "Avoid direct sowing under intense heat. Protect nursery seedlings with green shade nets.";
        fertilizerGuidance = "Apply liquid fertilizers in early mornings only. Midday applications can burn roots.";
        harvestAdvisory = "Harvest early in the morning to prevent crop shattering and dry-cracking.";
        suitabilityScore = 60;
      } else if (windSpeed > 15) {
        moistureAlert = "High winds causing faster topsoil drying. Moderate watering is recommended.";
        plantingRecommendation = "Safe to plant, but ensure taller crops are adequately staked or supported.";
        fertilizerGuidance = "Chemical spraying warning: High wind drift risk. Refrain from spraying to avoid crop damage.";
        harvestAdvisory = "Safe to harvest, but handle delicate crops carefully to minimize wind-induced bruising.";
        suitabilityScore = 65;
      }

      if (lang === "te") {
        if (precipProb > 40 || precipSum > 2) {
          moistureAlert = "వర్ష సూచన. అధిక మట్టి తేమ ఉంటుంది. కృత్రిమ తడులు ఇవ్వడం తాత్కాలికంగా ఆపండి.";
          plantingRecommendation = "మట్టిలో నీరు నిల్వ ఉండకుండా విత్తనాలు నాటడం వాయిదా వేయండి. మొలకలు నాటవచ్చు.";
          fertilizerGuidance = "మందులు చల్లవద్దు. వర్షం కారణంగా మందులు కొట్టుకుపోయే ప్రమాదం ఉంది.";
          harvestAdvisory = "కోతలను తాత్కాలికంగా ఆపివేయండి. కోసిన పంటపై తార్పాలిన్ కప్పండి.";
          suitabilityScore = 45;
        } else {
          moistureAlert = "నేల తేమ స్థిరంగా ఉంది. మధ్యాహ్న సమయంలో నీటి ఆవిరి రేటు ఎక్కువగా ఉంటుంది.";
          plantingRecommendation = "వేడిని తట్టుకునే పంటలు నాటడానికి అనుకూలమైన సమయం. తేమను నిర్వహించండి.";
          fertilizerGuidance = "రసాయనాలు పిచికారీ చేయడానికి మరియు ఎరువులు చల్లడానికి అనుకూలమైన వాతావరణం ఉంది.";
          harvestAdvisory = "పంట కోతకు అనుకూలమైన వాతావరణం. కోసిన పంటను పొడి ప్రదేశాలలో భద్రపరచండి.";
          suitabilityScore = 85;
        }
      } else if (lang === "hi") {
        if (precipProb > 40 || precipSum > 2) {
          moistureAlert = "बारिश की चेतावनी। मिट्टी में अत्यधिक नमी की संभावना है। सिंचाई रोक दें।";
          plantingRecommendation = "जलभराव से बचने के लिए बुवाई टालें। मजबूत पौधों का रोपण किया जा सकता है।";
          fertilizerGuidance = "कीटनाशक या उर्वरक का छिड़काव न करें। बारिश से रसायन बह जाएंगे।";
          harvestAdvisory = "कटाई का काम रोक दें। कटी हुई फसल को तिरपाल से ढककर सुरक्षित रखें।";
          suitabilityScore = 45;
        } else {
          moistureAlert = "मिट्टी की नमी सामान्य है। दोपहर में वाष्पीकरण की दर अधिक रह सकती है।";
          plantingRecommendation = "गर्मी सहन करने वाली फसलों की बुवाई के लिए उपयुक्त समय। नमी बनाए रखें।";
          fertilizerGuidance = "कीटनाशक छिड़काव और यूरिया फैलाने के लिए अनुकूल परिस्थितियां हैं।";
          harvestAdvisory = "फसल कटाई के लिए उत्तम मौसम। कटी हुई फसल को सूखे स्थान पर रखें।";
          suitabilityScore = 85;
        }
      }

      advisory = {
        moistureAlert,
        plantingRecommendation,
        fertilizerGuidance,
        harvestAdvisory,
        suitabilityScore
      };
    }

    res.json({
      location: locName,
      latitude,
      longitude,
      currentWeather: {
        temp,
        humidity,
        windSpeed,
        precipProb,
        precipSum,
        weatherCode: weatherData.current?.weather_code || 0
      },
      advisory
    });
  });

  // --- Expert Portal API ---

  // GET All Disease Logs
  app.get("/api/logs/disease", (req, res) => {
    const db = readDb();
    res.json(db.diseaseLogs);
  });

  // POST Expert Reply to Disease Log
  app.post("/api/logs/disease/:id/reply", (req, res) => {
    const { id } = req.params;
    const { expertReply, expertName } = req.body;

    const db = readDb();
    const index = db.diseaseLogs.findIndex(log => log.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Disease log not found" });
    }

    db.diseaseLogs[index] = {
      ...db.diseaseLogs[index],
      status: "resolved",
      expertReply: expertReply,
      expertName: expertName || "Dr. K. Swaminathan (Agronomist)",
      repliedAt: new Date().toISOString()
    };

    writeDb(db);
    res.json(db.diseaseLogs[index]);
  });

  // GET Crop Logs
  app.get("/api/logs/crop", (req, res) => {
    const db = readDb();
    res.json(db.cropLogs);
  });

  // GET Voice Logs
  app.get("/api/logs/voice", (req, res) => {
    const db = readDb();
    res.json(db.voiceLogs);
  });

  // GET SMS Logs
  app.get("/api/logs/sms", (req, res) => {
    const db = readDb();
    res.json(db.smsLogs);
  });

  // --- Vite & Production Serving Setup ---

  async function startServer() {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 KrishiMitra AI server running on port ${PORT}`);
    });
  }

  if (!process.env.VERCEL) {
    startServer();
  }

  export default app;
