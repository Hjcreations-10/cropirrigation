import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { 
  Phone, Smartphone, Check, ChevronLeft, Send, Mic, MicOff, RefreshCw, 
  Upload, CloudRain, AlertTriangle, MessageSquare, Volume2, ArrowRight, UserCheck,
  TrendingUp, TrendingDown, Search, Coins, Store, ArrowLeftRight, Play, Eye
} from "lucide-react";
import { translations, TranslationSet } from "../data/translations";
import { sampleLeaves } from "../data/sampleLeaves";
import { User, CropLog, DiseaseLog, VoiceLog, SmsLog, WeatherAdvisory, LanguageCode } from "../types";

const marketTranslations: Record<LanguageCode, {
  buttonText: string;
  buttonSubText: string;
  screenTitle: string;
  screenSubText: string;
  searchPlaceholder: string;
  headerMandi: string;
  headerTrend: string;
  headerToday: string;
  headerYesterday: string;
  adviceLabel: string;
  refreshLabel: string;
  trendUp: string;
  trendDown: string;
  trendStable: string;
  filtersLabel: string;
  allFilter: string;
}> = {
  en: {
    buttonText: "Market Prices",
    buttonSubText: "Live Mandi Rates",
    screenTitle: "Market Price Tracker",
    screenSubText: "Live agricultural market price trends from nearby Mandis",
    searchPlaceholder: "Search crops (e.g. Paddy, Tomato)...",
    headerMandi: "Mandi / Volume",
    headerTrend: "Trend",
    headerToday: "Today",
    headerYesterday: "Yesterday",
    adviceLabel: "Sales Recommendation",
    refreshLabel: "Refresh Prices",
    trendUp: "Rising",
    trendDown: "Falling",
    trendStable: "Stable",
    filtersLabel: "Filter by Trend:",
    allFilter: "All Crops"
  },
  te: {
    buttonText: "మార్కెట్ ధరలు",
    buttonSubText: "మండీ లైవ్ రేట్లు",
    screenTitle: "మండీ మార్కెట్ ధరలు",
    screenSubText: "సమీప మార్కెట్ యార్డుల నుండి తాజా పంటల ధరల సమాచారం",
    searchPlaceholder: "పంట కోసం వెతకండి (ఉదా: వరి, టమోటా)...",
    headerMandi: "మార్కెట్ / నిల్వలు",
    headerTrend: "ధోరణి",
    headerToday: "ఈరోజు ధర",
    headerYesterday: "నిన్నటి ధర",
    adviceLabel: "అమ్మకాల సలహా",
    refreshLabel: "ధరలను తాజాకరించు",
    trendUp: "పెరుగుతోంది",
    trendDown: "తగ్గుతోంది",
    trendStable: "స్థిరంగా ఉంది",
    filtersLabel: "ధరల ధోరణి ఫిల్టర్:",
    allFilter: "అన్ని పంటలు"
  },
  hi: {
    buttonText: "मंडी भाव",
    buttonSubText: "लाइव बाजार रेट",
    screenTitle: "मंडी बाजार भाव",
    screenSubText: "आसपास की मंडियों से कृषि उपज के ताजा दैनिक भाव और रुझान",
    searchPlaceholder: "फसल खोजें (जैसे: धान, टमाटर)...",
    headerMandi: "मंडी / आवक",
    headerTrend: "रुझान",
    headerToday: "आज का भाव",
    headerYesterday: "कल का भाव",
    adviceLabel: "बिक्री परामर्श",
    refreshLabel: "ताजा भाव प्राप्त करें",
    trendUp: "तेजी",
    trendDown: "मंदी",
    trendStable: "स्थिर",
    filtersLabel: "रुझान के अनुसार छानें:",
    allFilter: "सभी फसलें"
  },
  ta: {
    buttonText: "சந்தை விலை",
    buttonSubText: "நேரடி மார்க்கெட் விலைகள்",
    screenTitle: "விவசாய சந்தை விலைகள்",
    screenSubText: "அருகிலுள்ள மார்க்கெட்டுகளின் நேரடி பயிர் விலைகள்",
    searchPlaceholder: "பயிர்களைத் தேடுங்கள்...",
    headerMandi: "சந்தை / அளவு",
    headerTrend: "போக்கு",
    headerToday: "இன்று",
    headerYesterday: "நேற்று",
    adviceLabel: "விற்பனை ஆலோசனை",
    refreshLabel: "விலைகளைப் புதுப்பி",
    trendUp: "அதிகரிப்பு",
    trendDown: "குறைவு",
    trendStable: "நிலையானது",
    filtersLabel: "வடிகட்டுதல்:",
    allFilter: "அனைத்து பயிர்கள்"
  },
  kn: {
    buttonText: "ಮಾರುಕಟ್ಟೆ ದರ",
    buttonSubText: "ಲೈವ್ ಮಂಡಿ ದರಗಳು",
    screenTitle: "ಮಾರುಕಟ್ಟೆ ದರ ಮಾಹಿತಿ",
    screenSubText: "ಸಮೀಪದ ಮಾರುಕಟ್ಟೆಗಳಿಂದ ಲೈವ್ ಕೃಷಿ ದರಗಳು",
    searchPlaceholder: "ಬೆಳೆಗಳನ್ನು ಹುಡುಕಿ...",
    headerMandi: "ಮಾರುಕಟ್ಟೆ / ಪ್ರಮಾಣ",
    headerTrend: "ಟ್ರೆಂಡ್",
    headerToday: "ಇಂದು",
    headerYesterday: "ನಿನ್ನೆ",
    adviceLabel: "ಮಾರಾಟ ಸಲಹೆ",
    refreshLabel: "ದರಗಳನ್ನು ನವೀಕರಿಸಿ",
    trendUp: "ಏರಿಕೆ",
    trendDown: "ಇಳಿಕೆ",
    trendStable: "ಸ್ಥಿರ",
    filtersLabel: "ಫಿಲ್ಟರ್ ಮಾಡಿ:",
    allFilter: "ಎಲ್ಲಾ ಬೆಳೆಗಳು"
  },
  ml: {
    buttonText: "വിപണി വില",
    buttonSubText: "ലൈവ് മണ്ടി നിരക്കുകൾ",
    screenTitle: "കാർഷിക വിപണി നിരക്കുകൾ",
    screenSubText: "സമീപത്തെ വിപണികളിൽ നിന്നുള്ള തത്സമയ വിള വില വിവരങ്ങൾ",
    searchPlaceholder: "വിളകൾ തിരയുക...",
    headerMandi: "വിപണി / അളവ്",
    headerTrend: "ട്രെൻഡ്",
    headerToday: "ഇന്ന്",
    headerYesterday: "ഇന്നലെ",
    adviceLabel: "വിൽപ്പന നിർദ്ദേശം",
    refreshLabel: "വില വിവരങ്ങൾ പുതുക്കുക",
    trendUp: "വർദ്ധനവ്",
    trendDown: "കുറവ്",
    trendStable: "സ്ഥിരതയുള്ളത്",
    filtersLabel: "ഫിൽട്ടർ:",
    allFilter: "എല്ലാ വിളകളും"
  },
  mr: {
    buttonText: "बाजार भाव",
    buttonSubText: "लाइव्ह मंडी दर",
    screenTitle: "बाजार भाव ट्रॅकर",
    screenSubText: "जवळपासच्या कृषी बाजारांमधील पिकांचे दर आणि कल",
    searchPlaceholder: "पिके शोधा...",
    headerMandi: "बाजार / आवक",
    headerTrend: "कल",
    headerToday: "आज",
    headerYesterday: "काल",
    adviceLabel: "विक्री शिफारस",
    refreshLabel: "दर ताजे करा",
    trendUp: "तेजी",
    trendDown: "मंदी",
    trendStable: "स्थिर",
    filtersLabel: "कलानुसार फिल्टर:",
    allFilter: "सर्व पिके"
  },
  bn: {
    buttonText: "বাজার মূল্য",
    buttonSubText: "লাইভ মান্ডি দর",
    screenTitle: "বাজার দর ট্র্যাকার",
    screenSubText: "নিকটবর্তী কৃষি মন্ডির ফসল কেনাবেচার দৈনিক বাজার দর",
    searchPlaceholder: "ফসল খুঁজুন...",
    headerMandi: "মান্ডি / পরিমাণ",
    headerTrend: "প্রবণতা",
    headerToday: "আজ",
    headerYesterday: "গতকাল",
    adviceLabel: "বিক্রয় পরামর্শ",
    refreshLabel: "দর আপডেট করুন",
    trendUp: "ঊর্ধ্বমুখী",
    trendDown: "নিম্নমুখী",
    trendStable: "স্থিতিশীল",
    filtersLabel: "প্রবণতা অনুযায়ী ফিল্টার:",
    allFilter: "সব ফসল"
  },
  gu: {
    buttonText: "બજાર ભાવો",
    buttonSubText: "લાઈવ માર્કેટ યાર્ડ ભાવો",
    screenTitle: "માર્કેટ યાર્ડ ભાવો",
    screenSubText: "નજીકના બજારોના કૃષિ ભાવો અને વલણની માહિતી",
    searchPlaceholder: "પાક શોધો...",
    headerMandi: "બજાર / આવક",
    headerTrend: "વલણ",
    headerToday: "આજ",
    headerYesterday: "ગઈકાલ",
    adviceLabel: "વેચાણ ભલામણ",
    refreshLabel: "ભાવો અપડેટ કરો",
    trendUp: "તેજી",
    trendDown: "મંદી",
    trendStable: "સ્થિર",
    filtersLabel: "વલણ મુજબ ફિલ્ટર:",
    allFilter: "તમામ પાક"
  },
  pa: {
    buttonText: "ਮੰਡੀ ਦੇ ਭਾਅ",
    buttonSubText: "ਲਾਈਵ ਮੰਡੀ ਰੇਟ",
    screenTitle: "ਮੰਡੀ ਭਾਅ ਜਾਣਕਾਰੀ",
    screenSubText: "ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਤੋਂ ਫਸਲਾਂ ਦੇ ਰੋਜ਼ਾਨਾ ਲਾਈਵ ਰੇਟ",
    searchPlaceholder: "ਫਸਲ ਲੱਭੋ...",
    headerMandi: "ਮੰਡੀ / ਆਮਦਨ",
    headerTrend: "ਰੁਝਾਨ",
    headerToday: "ਅੱਜ",
    headerYesterday: "ਕੱਲ੍ਹ",
    adviceLabel: "ਵੇਚਣ ਦੀ ਸਲਾਹ",
    refreshLabel: "ਭਾਅ ਰਿਫ੍ਰੈਸ਼ ਕਰੋ",
    trendUp: "ਤੇਜ਼ੀ",
    trendDown: "ਮੰਡੀ",
    trendStable: "ਸਥਿਰ",
    filtersLabel: "ਫਿਲਟਰ ਕਰੋ:",
    allFilter: "ਸਾਰੀਆਂ ਫਸਲਾਂ"
  },
  or: {
    buttonText: "ମଣ୍ଡି ଦର",
    buttonSubText: "ଲାଇଭ୍ ମଣ୍ଡି ରେଟ୍",
    screenTitle: "ମଣ୍ଡି ଦର ଟ୍ରାକର୍",
    screenSubText: "ନିକଟସ୍ଥ କୃଷି ମଣ୍ଡିରୁ ଫସଲର ଦୈନିକ ଲାଇଭ୍ ଦର ବିବରଣୀ",
    searchPlaceholder: "ଫସଲ ଖୋଜନ୍ତୁ...",
    headerMandi: "ମଣ୍ଡି / ଆମଦାନୀ",
    headerTrend: "ଧାରା",
    headerToday: "ଆଜି",
    headerYesterday: "ଗତକାଲି",
    adviceLabel: "ବିକ୍ରୟ ପରାମର୍ଶ",
    refreshLabel: "ଧର ଅପଡେଟ୍ କରନ୍ତು",
    trendUp: "ଉର୍ଦ୍ଧ୍ୱଗାମୀ",
    trendDown: "ନିମ୍ନଗାମୀ",
    trendStable: "ସ୍ଥିର",
    filtersLabel: "ଫିଲ୍ଟର୍:",
    allFilter: "ସମସ୍ତ ଫସଲ"
  }
};

function CropPriceCard({ crop, selectedLanguage, percentDiff, priceDiff, speakText }: { 
  key?: any;
  crop: any; 
  selectedLanguage: LanguageCode;
  percentDiff: string;
  priceDiff: number;
  speakText: (text: string) => void;
}) {
  const [quintals, setQuintals] = useState("");
  const [showCalc, setShowCalc] = useState(false);

  const getEmoji = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("paddy") || n.includes("rice")) return "🌾";
    if (n.includes("cotton")) return "☁️";
    if (n.includes("tomato")) return "🍅";
    if (n.includes("wheat")) return "🌾";
    if (n.includes("maize") || n.includes("corn")) return "🌽";
    if (n.includes("groundnut")) return "🥜";
    if (n.includes("onion")) return "🧅";
    if (n.includes("chilli") || n.includes("chili")) return "🌶️";
    if (n.includes("sugarcane")) return "🎋";
    return "🪴";
  };

  const isUp = crop.trend === "UP";
  const isDown = crop.trend === "DOWN";

  const numQuintals = parseFloat(quintals) || 0;
  const estimatedPayout = numQuintals * crop.currentPrice;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3 transition hover:shadow-xs hover-card-premium relative overflow-hidden">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <span className="text-3xl p-1 bg-slate-50 rounded-xl">{getEmoji(crop.englishName)}</span>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-slate-800 text-sm leading-tight truncate">{crop.localName}</h4>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{crop.englishName}</p>
            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500 font-semibold">
              <Store className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate max-w-[120px]">{crop.mandiName}</span>
              <span>•</span>
              <span className="shrink-0">{crop.volume}</span>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="text-right shrink-0">
          <div className="font-display font-black text-slate-900 text-sm">
            ₹{crop.currentPrice.toLocaleString("en-IN")}
          </div>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
            {marketTranslations[selectedLanguage]?.headerYesterday || "Yesterday"}: ₹{crop.yesterdayPrice}
          </p>
          
          {/* Badge Trend */}
          <div className="mt-1 flex justify-end">
            {isUp && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <TrendingUp className="w-3 h-3" />
                <span>+{percentDiff}%</span>
              </span>
            )}
            {isDown && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                <TrendingDown className="w-3 h-3" />
                <span>-{percentDiff}%</span>
              </span>
            )}
            {!isUp && !isDown && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-0.5" />
                <span>Stable</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day APMC Sparkline chart */}
      <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/70 space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[8px] uppercase tracking-wider font-extrabold text-slate-400 block">7-Day APMC price trend</span>
          <span className="text-[8px] font-mono text-emerald-600 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">LIVE FEED</span>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-24 h-6 text-emerald-600 shrink-0" viewBox="0 0 100 30" preserveAspectRatio="none">
            <path 
              d={isUp ? "M 0 25 L 20 22 L 40 18 L 60 12 L 80 15 L 100 5" : isDown ? "M 0 5 L 20 8 L 40 12 L 60 18 L 80 15 L 100 25" : "M 0 15 L 20 16 L 40 14 L 60 15 L 80 14 L 100 15"} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
          </svg>
          <div className="text-[9.5px] text-slate-500 leading-tight font-medium">
            {isUp ? (
              <span className="text-emerald-700 font-extrabold">Rising demand. Hold/Sell at peaks.</span>
            ) : isDown ? (
              <span className="text-amber-700 font-extrabold">Price saturation. Sell crops immediately.</span>
            ) : (
              <span>Stable. Supply and demand balanced.</span>
            )}
          </div>
        </div>
      </div>

      {/* AI Recommendation Panel */}
      <div className="bg-emerald-50/20 p-2.5 rounded-xl border border-emerald-500/10 flex gap-2 items-start relative group">
        <span className="text-sm shrink-0">💡</span>
        <div className="space-y-0.5 flex-1 pr-6">
          <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400 block">
            {marketTranslations[selectedLanguage]?.adviceLabel || "Sales Advice"}
          </span>
          <p className="text-[10.5px] text-slate-600 font-semibold leading-normal">
            {crop.recommendation}
          </p>
        </div>
        <button
          onClick={() => speakText(crop.recommendation)}
          className="absolute right-2 top-2 text-slate-400 hover:text-emerald-600 p-1 hover:bg-slate-100 rounded-full transition"
          title="Listen to Advice"
        >
          <Volume2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Interactive payout calculator */}
      <div className="pt-2 border-t border-slate-100">
        {!showCalc ? (
          <button
            onClick={() => setShowCalc(true)}
            className="text-[10px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>
              {selectedLanguage === "te" ? "ఆదాయాన్ని లెక్కించండి" : selectedLanguage === "hi" ? "कमाई की गणना करें" : "Calculate Estimated Earnings"}
            </span>
          </button>
        ) : (
          <div className="bg-emerald-50/40 border border-emerald-100/55 rounded-xl p-2.5 space-y-2 animate-fade-in text-[10px]">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {selectedLanguage === "te" ? "ఆదాయ కాలిక్యులేటర్" : selectedLanguage === "hi" ? "कमाई कैलकुलेटर" : "Earnings Calculator"}
                </span>
              </span>
              <button
                type="button"
                onClick={() => { setShowCalc(false); setQuintals(""); }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder={selectedLanguage === "te" ? "పరిమాణం (క్వింటాళ్ళు)" : selectedLanguage === "hi" ? "मात्रा (क्विंटल)" : "Quantity (Quintals)"}
                  value={quintals}
                  onChange={(e) => setQuintals(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                />
                <span className="absolute right-2 top-1.5 text-[9px] text-slate-400 font-bold">
                  {selectedLanguage === "te" ? "క్వింటాల్" : selectedLanguage === "hi" ? "क्विंटल" : "Qtl"}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="block text-[8px] uppercase tracking-wider font-extrabold text-slate-400 font-sans">
                  {selectedLanguage === "te" ? "అంచనా ఆదాయం" : selectedLanguage === "hi" ? "अनुमानित कमाई" : "Est. Payout"}
                </span>
                <span className="block font-display font-black text-emerald-700 text-xs">
                  ₹{estimatedPayout.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileSimulatorProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  diseaseLogs: DiseaseLog[];
  onNewDiseaseLogSubmitted: () => void;
  expertRepliedAlert: string | null;
  onClearExpertAlert: () => void;
}

export default function MobileSimulator({ 
  currentUser, 
  onLogin, 
  diseaseLogs, 
  onNewDiseaseLogSubmitted,
  expertRepliedAlert,
  onClearExpertAlert
}: MobileSimulatorProps) {
  // Navigation & State
  const [currentScreen, setCurrentScreen] = useState<"login" | "home" | "crop" | "weather" | "disease" | "voice" | "sms" | "market">("login");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  
  // Login fields
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [farmerName, setFarmerName] = useState("");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Crop Recommendation states
  const [soilType, setSoilType] = useState("Clayey");
  const [cropLocation, setCropLocation] = useState("");
  const [ph, setPh] = useState("6.5");
  const [nitrogen, setNitrogen] = useState("50");
  const [phosphorus, setPhosphorus] = useState("35");
  const [potassium, setPotassium] = useState("40");
  const [groundwater, setGroundwater] = useState("Medium");
  const [season, setSeason] = useState("Kharif (Monsoon)");
  const [isRecommending, setIsRecommending] = useState(false);
  const [cropResult, setCropResult] = useState<CropLog | null>(null);

  // Weather states
  const [weatherData, setWeatherData] = useState<WeatherAdvisory | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Disease states
  const [selectedSampleLeaf, setSelectedSampleLeaf] = useState<string | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [voiceSymptomsText, setVoiceSymptomsText] = useState("");
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isScanningLeaf, setIsScanningLeaf] = useState(false);
  const [scanStatusText, setScanStatusText] = useState("");
  const [diagnosticResult, setDiagnosticResult] = useState<DiseaseLog | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice Assistant states
  const [isRecording, setIsRecording] = useState(false);
  const [activeSpeechField, setActiveSpeechField] = useState<"voice" | "sms" | "disease" | null>(null);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [voiceReply, setVoiceReply] = useState("");
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const [voiceConversation, setVoiceConversation] = useState<{role: "user" | "ai", text: string}[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // SMS Simulator states
  const [smsText, setSmsText] = useState("");
  const [smsConversation, setSmsConversation] = useState<SmsLog[]>([]);
  const [isSmsSending, setIsSmsSending] = useState(false);

  // Market Price Tracker states
  const [marketPrices, setMarketPrices] = useState<any[]>([]);
  const [loadingMarket, setLoadingMarket] = useState(false);
  const [marketSearchQuery, setMarketSearchQuery] = useState("");
  const [marketFilterTrend, setMarketFilterTrend] = useState<"all" | "UP" | "DOWN" | "STABLE">("all");

  const t = translations[selectedLanguage];

  // Auto-fill form values on user load
  useEffect(() => {
    if (currentUser) {
      setPhone(currentUser.phone);
      setSelectedLanguage(currentUser.language);
      setFarmerName(currentUser.name);
      setVillage(currentUser.village);
      setDistrict(currentUser.district);
      setCropLocation(currentUser.village);
      setCurrentScreen("home");
      
      // Load user's SMS history
      fetch(`/api/logs/sms`)
        .then(res => {
          if (res.ok) return res.json();
          return [];
        })
        .then(logs => {
          const userSms = Array.isArray(logs) ? logs.filter((log: SmsLog) => log.phone === currentUser.phone) : [];
          setSmsConversation(userSms);
        })
        .catch(err => {
          console.warn("Failed to fetch SMS logs:", err);
          setSmsConversation([]);
        });
    }
  }, [currentUser]);

  // Speech Recognition API
  const [recognition, setRecognition] = useState<any>(null);

  const languageLocales: Record<LanguageCode, string> = {
    en: "en-IN",
    te: "te-IN",
    hi: "hi-IN",
    ta: "ta-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    mr: "mr-IN",
    bn: "bn-IN",
    gu: "gu-IN",
    pa: "pa-IN",
    or: "or-IN"
  };

  const startSpeechRecognition = (target: "voice" | "sms" | "disease") => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Safari.");
      return;
    }

    if (isRecording) {
      recognition?.stop();
      setIsRecording(false);
      setActiveSpeechField(null);
      return;
    }

    playWebAudioSound("start");
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = languageLocales[selectedLanguage] || "en-IN";
    
    rec.onstart = () => {
      setIsRecording(true);
      setActiveSpeechField(target);
    };
    
    rec.onend = () => {
      setIsRecording(false);
      setActiveSpeechField(null);
    };

    rec.onerror = (err: any) => {
      console.error("Speech Recognition Error:", err);
      setIsRecording(false);
      setActiveSpeechField(null);
    };

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      if (target === "voice") {
        setVoiceQuery(text);
        submitVoiceQuery(text);
      } else if (target === "sms") {
        setSmsText(text.toUpperCase());
      } else if (target === "disease") {
        setVoiceSymptomsText(text);
      }
    };

    rec.start();
    setRecognition(rec);
  };

  // Web Audio API custom chime synthesizer
  const playWebAudioSound = (type: "start" | "success" | "chime") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "start") {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.2);
      } else if (type === "success") {
        const now = ctx.currentTime;
        [
          { freq: 783.99, delay: 0 },   // G5
          { freq: 1046.50, delay: 0.1 } // C6
        ].forEach(({ freq, delay }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + delay);
          gain.gain.setValueAtTime(0.08, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.2);
        });
      } else if (type === "chime") {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880.00, now); // A5
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(now + 0.1);
      }
    } catch (err) {
      console.warn("Web Audio chime blocked/failed:", err);
    }
  };

  // Trigger Text-to-Speech
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageLocales[selectedLanguage] || "en-IN";
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Login handler
  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!farmerName) setFarmerName("Ramesh Kumar");
    if (!village) setVillage("Kuppam");
    if (!district) setDistrict("Chittoor");
    setOtpSent(true);
    setOtpCode("1234");
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== "1234") {
      alert("Invalid OTP. Enter '1234' for simulator testing.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name: farmerName,
          village,
          district,
          language: selectedLanguage
        })
      });
      const data = await response.json();
      if (response.ok) {
        onLogin(data);
        setCurrentScreen("home");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Soil recommend handler
  const fetchCropRecommendation = async (e: FormEvent) => {
    e.preventDefault();
    setIsRecommending(true);
    setCropResult(null);

    try {
      const response = await fetch("/api/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          soil: {
            type: soilType,
            ph: parseFloat(ph) || 6.5,
            n: parseInt(nitrogen) || 50,
            p: parseInt(phosphorus) || 35,
            k: parseInt(potassium) || 40
          },
          location: cropLocation || village || "Kuppam",
          season,
          groundwater
        })
      });
      const data = await response.json();
      setCropResult(data);
      playWebAudioSound("success");
    } catch (e) {
      console.error(e);
    } finally {
      setIsRecommending(false);
    }
  };

  // Weather advisory handler
  const fetchWeatherAdvisory = async () => {
    setLoadingWeather(true);
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(village || "Kuppam")}&lang=${selectedLanguage}`);
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    if (currentScreen === "weather") {
      fetchWeatherAdvisory();
    }
  }, [currentScreen, selectedLanguage]);

  // Market prices handler
  const fetchMarketPrices = async () => {
    setLoadingMarket(true);
    try {
      const response = await fetch(`/api/market-prices?location=${encodeURIComponent(district || village || "Kuppam")}&lang=${selectedLanguage}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMarketPrices(data);
      }
    } catch (error) {
      console.error("Failed to fetch market prices:", error);
    } finally {
      setLoadingMarket(false);
    }
  };

  useEffect(() => {
    if (currentScreen === "market") {
      fetchMarketPrices();
    }
  }, [currentScreen, selectedLanguage]);

  // Leaf Disease Diagnostics handler with interactive laser scan simulator
  const handleDiseaseDiagnose = async () => {
    if (!selectedSampleLeaf && !customImage && !voiceSymptomsText.trim()) {
      alert("Please select a leaf pattern, upload an image, or describe symptoms with voice");
      return;
    }

    setIsDiagnosing(true);
    setDiagnosticResult(null);
    setCheckedSteps({});
    
    // Begin step-by-step scanner visual simulation
    setIsScanningLeaf(true);
    setScanStatusText("Aligning leaf crop region...");
    
    setTimeout(() => {
      setScanStatusText("Analyzing chlorophyll density...");
      setTimeout(() => {
        setScanStatusText("Detecting necrotic regions...");
        setTimeout(() => {
          setScanStatusText("Consulting plant pathology models...");
          setTimeout(async () => {
            try {
              const body: any = { userId: currentUser?.id };
              if (voiceSymptomsText.trim()) {
                body.voiceSymptoms = voiceSymptomsText;
              } else if (customImage) {
                body.photoBase64 = customImage;
              } else {
                body.sampleId = selectedSampleLeaf;
              }

              const response = await fetch("/api/disease", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
              });
              const data = await response.json();
              setDiagnosticResult(data);
              setIsScanningLeaf(false);
              setIsDiagnosing(false);
              playWebAudioSound("success");
              onNewDiseaseLogSubmitted();
            } catch (e) {
              console.error(e);
              setIsScanningLeaf(false);
              setIsDiagnosing(false);
            }
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  // Handle image upload & base64 encoding
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
        setSelectedSampleLeaf(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice Assistant handler
  const toggleRecording = () => {
    startSpeechRecognition("voice");
  };

  const submitVoiceQuery = async (query: string) => {
    if (!query.trim()) return;

    playWebAudioSound("start");
    const newConv = [...voiceConversation, { role: "user" as const, text: query }];
    setVoiceConversation(newConv);
    setIsVoiceThinking(true);

    try {
      const response = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          queryText: query,
          language: selectedLanguage
        })
      });
      const data = await response.json();
      setVoiceReply(data.reply);
      setVoiceConversation([...newConv, { role: "ai", text: data.reply }]);
      playWebAudioSound("success");
      speakText(data.reply);
    } catch (error) {
      console.error(error);
    } finally {
      setIsVoiceThinking(false);
    }
  };

  // SMS support simulator handler
  const sendSmsMessage = async (messageText: string) => {
    const textToSend = messageText || smsText;
    if (!textToSend.trim() || !currentUser) return;

    setIsSmsSending(true);
    setSmsText("");

    const mockLog: SmsLog = {
      id: "temp-" + Date.now(),
      userId: currentUser.id,
      phone: currentUser.phone,
      date: new Date().toISOString(),
      message: textToSend,
      reply: "Sending...",
      language: selectedLanguage
    };
    setSmsConversation(prev => [...prev, mockLog]);

    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: currentUser.phone,
          message: textToSend
        })
      });
      const data = await response.json();
      setSmsConversation(prev => 
        prev.map(sms => sms.id === mockLog.id ? data : sms)
      );
      playWebAudioSound("success");
      speakText(data.reply); // automatically read out the SMS response for accessibility
    } catch (error) {
      console.error(error);
    } finally {
      setIsSmsSending(false);
    }
  };

  // Render SVG Circular NPK Gauges helper
  const renderCircularGauge = (label: string, value: number, ideal: number, color: string) => {
    const pct = Math.min(100, Math.round((value / Math.max(1, ideal)) * 100));
    const radius = 15.915;
    const strokeDashoffset = 100 - pct;
    return (
      <div className="flex flex-col items-center justify-center p-2.5 bg-slate-50 border border-slate-100 rounded-2xl flex-1 hover:bg-slate-100/30 transition">
        <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</span>
        <div className="relative w-11 h-11 flex items-center justify-center">
          <svg className="w-11 h-11 transform -rotate-90 shadow-2xs rounded-full" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle 
              cx="18" 
              cy="18" 
              r={radius} 
              fill="none" 
              stroke={color} 
              strokeWidth="3.5" 
              strokeDasharray="100" 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <span className="absolute text-[10px] font-black text-slate-800">{value}</span>
        </div>
        <span className="text-[8px] text-slate-500 font-extrabold mt-1">Ideal: {ideal}</span>
      </div>
    );
  };

  return (
    <div id="farmer-mobile-simulator" className="relative flex flex-col items-center justify-center py-6 px-2">
      {/* Phone Shell */}
      <div className="relative w-full max-w-[380px] h-[720px] bg-slate-900 rounded-[45px] p-3 shadow-2xl border-4 border-slate-800 ring-12 ring-slate-950/20 flex flex-col overflow-hidden">
        
        {/* Notch / Speaker */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
          <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-2 pb-1 text-xs text-white bg-slate-900 select-none font-sans z-40">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-emerald-600 px-1 py-0.5 rounded font-mono font-medium">5G</span>
            <div className="w-5 h-2.5 border border-white rounded-sm p-0.5 flex items-center">
              <div className="w-full h-full bg-white rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* In-App Live Alert Notification banner from expert */}
        {expertRepliedAlert && currentUser && (
          <div 
            onClick={() => {
              setCurrentScreen("disease");
              onClearExpertAlert();
            }}
            className="absolute top-10 left-3 right-3 bg-emerald-600 text-white text-xs py-2.5 px-4 rounded-xl shadow-lg z-50 flex items-center justify-between cursor-pointer animate-bounce border border-emerald-400"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span><strong>నిపుణుల సలహా / Expert Reply!</strong> Click to view.</span>
            </div>
            <span className="text-[10px] bg-emerald-800 px-1.5 py-0.5 rounded">VIEW</span>
          </div>
        )}

        {/* Dynamic Display Body */}
        <div className="flex-1 bg-emerald-50/40 rounded-[35px] overflow-hidden flex flex-col relative text-slate-800">
          
          {/* Header (Within App) */}
          {currentScreen !== "login" && (
            <div className="bg-emerald-600 text-white py-3.5 px-4 flex items-center shadow-md">
              {currentScreen !== "home" && (
                <button 
                  onClick={() => {
                    setCurrentScreen("home");
                    setCropResult(null);
                    setDiagnosticResult(null);
                    setSelectedSampleLeaf(null);
                    setCustomImage(null);
                    setVoiceSymptomsText("");
                  }} 
                  className="mr-2 hover:bg-emerald-700 p-1 rounded-full transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex-1">
                <h3 className="font-display font-bold leading-tight text-sm">
                  {currentScreen === "home" 
                    ? t.homeTitle 
                    : currentScreen === "market" 
                      ? (marketTranslations[selectedLanguage]?.screenTitle || "Market Prices") 
                      : (t[currentScreen as keyof TranslationSet] as string)}
                </h3>
                <p className="text-[10px] opacity-85">{village || "Kuppam"}, {district || "AP"}</p>
              </div>

              {/* Language quick switcher */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-emerald-700 text-white text-xs px-2 py-1 rounded border-none outline-none font-sans cursor-pointer max-w-[100px]"
              >
                <option value="en">English</option>
                <option value="te">తెలుగు</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ml">മലയാളം</option>
                <option value="mr">मराठी</option>
                <option value="bn">বাংলা</option>
                <option value="gu">ગુજરાતી</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="or">ଓଡ଼ିଆ</option>
              </select>
            </div>
          )}

          {/* Screen Controller */}
          <div className="flex-1 overflow-y-auto font-sans">
            
            {/* 1. LOGIN SCREEN */}
            {currentScreen === "login" && (
              <div className="p-6 h-full flex flex-col justify-between bg-gradient-to-b from-emerald-50 to-white">
                <div className="text-center mt-6">
                  <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md mb-3">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h1 className="text-2xl font-display font-extrabold text-emerald-800 tracking-tight">{t.loginTitle}</h1>
                  <p className="text-xs text-slate-500 mt-1 px-4 leading-normal">{t.loginSub}</p>
                </div>

                <div className="my-6 space-y-3.5 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  {/* Lang choice in login */}
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t.selectLang}</label>
                    <div className="grid grid-cols-3 gap-2 max-h-[110px] overflow-y-auto pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                      {([
                        { code: "en", label: "English" },
                        { code: "te", label: "తెలుగు" },
                        { code: "hi", label: "हिन्दी" },
                        { code: "ta", label: "தமிழ்" },
                        { code: "kn", label: "ಕನ್ನಡ" },
                        { code: "ml", label: "മലയാളം" },
                        { code: "mr", label: "मराठी" },
                        { code: "bn", label: "বাংলা" },
                        { code: "gu", label: "ગુજરાતી" },
                        { code: "pa", label: "ਪੰਜਾਬੀ" },
                        { code: "or", label: "ଓଡ଼ିଆ" }
                      ] as const).map(({ code, label }) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setSelectedLanguage(code)}
                          className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border transition truncate ${
                            selectedLanguage === code 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold" 
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t.phoneLabel}</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder={t.phonePlaceholder}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>
                  </div>

                  {otpSent ? (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{t.otpLabel}</label>
                      <input
                        type="text"
                        maxLength={4}
                        placeholder={t.otpPlaceholder}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-center tracking-widest text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Farmer Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Ramesh"
                            value={farmerName}
                            onChange={(e) => setFarmerName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-none font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Village</label>
                          <input
                            type="text"
                            placeholder="e.g. Kuppam"
                            value={village}
                            onChange={(e) => setVillage(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-none font-semibold"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">District / State</label>
                        <input
                          type="text"
                          placeholder="e.g. Chittoor, AP"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1 px-2.5 text-xs focus:outline-none font-semibold"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                  disabled={isLoggingIn}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : otpSent ? (
                    t.verifyOtp
                  ) : (
                    t.sendOtp
                  )}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* 2. HOME SCREEN */}
            {currentScreen === "home" && currentUser && (
              <div className="p-4 space-y-4">
                {/* Farmer greeting bar */}
                <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-extrabold text-slate-800 text-sm">Namaste, {currentUser.name}!</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{t.homeSub}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                {/* Dashboard grid */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => { setCurrentScreen("crop"); setCropLocation(village); }}
                    className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border-2 border-[#6EE7B7] shadow-sm flex flex-col items-center text-center group transition cursor-pointer"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition duration-200">🌾</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{t.cropRec}</span>
                    <span className="text-[9px] text-slate-400 mt-1 leading-none font-semibold">Soil NPK & Season</span>
                  </button>

                  <button 
                    onClick={() => setCurrentScreen("weather")}
                    className="bg-white hover:bg-amber-50/50 p-4 rounded-2xl border-2 border-[#FCD34D] shadow-sm flex flex-col items-center text-center group transition cursor-pointer"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition duration-200">🌦</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{t.weatherAlert}</span>
                    <span className="text-[9px] text-slate-400 mt-1 leading-none font-semibold">Daily Action Advisory</span>
                  </button>

                  <button 
                    onClick={() => setCurrentScreen("disease")}
                    className="bg-white hover:bg-blue-50/50 p-4 rounded-2xl border-2 border-[#93C5FD] shadow-sm flex flex-col items-center text-center group transition cursor-pointer"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition duration-200">📷</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{t.diseaseDet}</span>
                    <span className="text-[9px] text-slate-400 mt-1 leading-none font-semibold">Upload Leaf Photo</span>
                  </button>

                  <button 
                    onClick={() => setCurrentScreen("voice")}
                    className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border-2 border-[#86EFAC] shadow-sm flex flex-col items-center text-center group transition cursor-pointer"
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition duration-200">🎙</span>
                    <span className="text-xs font-bold text-slate-700 leading-tight">{t.voiceAsst}</span>
                    <span className="text-[9px] text-slate-400 mt-1 leading-none font-semibold">Telugu & Hindi Audio</span>
                  </button>

                  <button 
                    onClick={() => setCurrentScreen("market")}
                    className="col-span-2 bg-gradient-to-r from-emerald-50/60 to-teal-50/60 hover:from-emerald-100/60 hover:to-teal-100/60 p-4 rounded-2xl border-2 border-[#34D399] shadow-sm flex items-center justify-between px-6 group transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:scale-110 transition duration-200">📈</span>
                      <div className="text-left">
                        <span className="block text-xs font-bold text-slate-700 leading-tight">
                          {marketTranslations[selectedLanguage]?.buttonText || "Market Prices"}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block font-semibold">
                          {marketTranslations[selectedLanguage]?.buttonSubText || "Live Mandi Rates"}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <button 
                  onClick={() => setCurrentScreen("sms")}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{t.smsSupport}</span>
                </button>

                {/* Info Card banner */}
                <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/50 flex gap-2.5">
                  <span className="text-lg">💡</span>
                  <div className="text-[11px] text-amber-800 leading-relaxed font-semibold">
                    <strong>Tip:</strong> Submitting a low-confidence leaf diagnosis automatically triggers a ticket to the Expert Console (shown on the right)!
                  </div>
                </div>
              </div>
            )}

            {/* 3. CROP RECOMMENDATION SCREEN */}
            {currentScreen === "crop" && (
              <div className="p-4 space-y-4">
                {!cropResult ? (
                  <form onSubmit={fetchCropRecommendation} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3 text-xs">
                    <h4 className="font-display font-black text-slate-800 text-sm border-b border-slate-100 pb-2">{t.cropTitle}</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 mb-0.5 font-semibold">{t.location}</label>
                        <input
                          type="text"
                          value={cropLocation}
                          onChange={(e) => setCropLocation(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-0.5 font-semibold">{t.soilType}</label>
                        <select
                          value={soilType}
                          onChange={(e) => setSoilType(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold"
                        >
                          <option value="Clayey">Clayey (వరికి అనుకూలం)</option>
                          <option value="Loamy">Loamy (మొక్కజొన్నకు అనుకూలం)</option>
                          <option value="Sandy">Sandy (వేరుశనగకు అనుకూలం)</option>
                          <option value="Black">Black Soil (పత్తికి అనుకూలం)</option>
                          <option value="Red">Red Soil</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-500 mb-0.5 font-semibold">{t.ph}</label>
                        <input
                          type="number"
                          step="0.1"
                          min="3"
                          max="9"
                          value={ph}
                          onChange={(e) => setPh(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 mb-0.5 font-semibold">{t.season}</label>
                        <select
                          value={season}
                          onChange={(e) => setSeason(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold"
                        >
                          <option value="Kharif (Monsoon)">Kharif (Monsoon)</option>
                          <option value="Rabi (Winter)">Rabi (Winter)</option>
                          <option value="Zaid (Summer)">Zaid (Summer)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Soil Nutrient Profile (N-P-K in ppm)</span>
                      
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-600">
                          <span>Nitrogen (N)</span>
                          <span className="text-emerald-600 font-bold">{nitrogen} ppm</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="150" 
                          value={nitrogen} 
                          onChange={(e) => setNitrogen(e.target.value)}
                          className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-600">
                          <span>Phosphorus (P)</span>
                          <span className="text-emerald-600 font-bold">{phosphorus} ppm</span>
                        </div>
                        <input 
                          type="range" 
                          min="5" 
                          max="100" 
                          value={phosphorus} 
                          onChange={(e) => setPhosphorus(e.target.value)}
                          className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10.5px] font-semibold text-slate-600">
                          <span>Potassium (K)</span>
                          <span className="text-emerald-600 font-bold">{potassium} ppm</span>
                        </div>
                        <input 
                          type="range" 
                          min="10" 
                          max="150" 
                          value={potassium} 
                          onChange={(e) => setPotassium(e.target.value)}
                          className="w-full accent-emerald-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-500 mb-0.5 font-semibold">{t.groundwater}</label>
                      <select
                        value={groundwater}
                        onChange={(e) => setGroundwater(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 font-semibold"
                      >
                        <option value="High (అధికం)">High (Abundant)</option>
                        <option value="Medium (మధ్యమం)">Medium</option>
                        <option value="Low (తక్కువ)">Low (Deep borewell)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isRecommending}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl mt-2 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isRecommending ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t.analyzingSoil}</span>
                        </>
                      ) : (
                        <span>{t.getRecommendation}</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3 animate-fade-in text-xs">
                    {/* Primary crop recommendation display */}
                    <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
                      <div className="absolute right-3 top-3 opacity-10 text-6xl">🌾</div>
                      <span className="text-[10px] bg-emerald-800 py-0.5 px-2 rounded-full font-bold uppercase tracking-wider">{t.bestCrop}</span>
                      <h3 className="text-xl font-display font-extrabold">{cropResult.recommendation.crop}</h3>
                      <div className="flex gap-3 items-center mt-1">
                        <div className="flex gap-3 text-[10px] bg-emerald-700/50 p-1.5 rounded-lg w-max font-semibold">
                          <span>{t.confidence}: <strong>{cropResult.recommendation.confidence}</strong></span>
                          <span>Water: <strong>{cropResult.recommendation.water}</strong></span>
                        </div>
                        <button
                          onClick={() => speakText(`${cropResult.recommendation.crop}. Expected Yield: ${cropResult.recommendation.yield}. Estimated profit: ${cropResult.recommendation.profit}.`)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white p-1 rounded-full shadow-sm"
                          title="Listen to recommendation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* ADVANCED FACILITY: Soil Nutrient Match & Crop Compatibility Circular Gauges */}
                    {(() => {
                      const targetCrop = cropResult.recommendation.crop || "Cotton";
                      let idealN = 75, idealP = 40, idealK = 50;
                      if (targetCrop.includes("Cotton") || targetCrop.includes("పత్తి")) {
                        idealN = 70; idealP = 45; idealK = 60;
                      } else if (targetCrop.includes("Paddy") || targetCrop.includes("Rice") || targetCrop.includes("వరి")) {
                        idealN = 90; idealP = 40; idealK = 45;
                      } else if (targetCrop.includes("Groundnut") || targetCrop.includes("వేరుశనగ")) {
                        idealN = 40; idealP = 50; idealK = 55;
                      } else if (targetCrop.includes("Maize") || targetCrop.includes("మొక్కజొన్న")) {
                        idealN = 80; idealP = 35; idealK = 50;
                      }

                      const currentN = Number(cropResult.soil.n) || 50;
                      const currentP = Number(cropResult.soil.p) || 35;
                      const currentK = Number(cropResult.soil.k) || 40;

                      const suitScore = Math.max(65, Math.min(100, 100 - (Math.abs(currentN - idealN) + Math.abs(currentP - idealP) + Math.abs(currentK - idealK)) * 0.4));

                      return (
                        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-display font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">📊 AI Soil Suitability Match</h4>
                            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full border border-emerald-200">
                              {Math.round(suitScore)}% Fit
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-400 leading-snug font-semibold">
                            Comparing NPK concentration (ppm) to ideal values for {targetCrop}:
                          </p>

                          <div className="flex gap-2 justify-between mt-2">
                            {renderCircularGauge("Nitrogen (N)", currentN, idealN, "#10b981")}
                            {renderCircularGauge("Phosphorus (P)", currentP, idealP, "#0284c7")}
                            {renderCircularGauge("Potassium (K)", currentK, idealK, "#d97706")}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Crop stats card */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-2.5">
                      <div className="grid grid-cols-2 gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.expectedYield}</span>
                          <span className="text-slate-800 font-extrabold">{cropResult.recommendation.yield}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.profitEstimate}</span>
                          <span className="text-emerald-600 font-black">{cropResult.recommendation.profit}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.alternatives}</span>
                        <div className="flex gap-2 mt-1">
                          {cropResult.recommendation.alternatives.map((alt, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 py-1 px-2.5 rounded-full text-[11px] font-semibold">
                              {alt}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 mt-2 relative">
                        <strong className="block text-[10px] font-bold uppercase mb-0.5 text-emerald-900">{t.fertilizerAdvice}</strong>
                        <p className="leading-relaxed text-[11px] font-medium pr-6">{cropResult.recommendation.fertilizer}</p>
                        <button
                          onClick={() => speakText(cropResult.recommendation.fertilizer)}
                          className="absolute right-2 top-2 text-emerald-600 hover:bg-emerald-100/50 p-1 rounded-full transition"
                          title="Listen"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setCropResult(null)}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-xl font-bold transition cursor-pointer"
                    >
                      Analyze Another Soil Sample
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 4. WEATHER SCREEN */}
            {currentScreen === "weather" && (
              <div className="p-4 space-y-4 relative">
                {loadingWeather ? (
                  <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-2xs flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-xs text-slate-500">Fetching daily agricultural weather advisory...</p>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-3 text-xs animate-fade-in">
                    
                    {/* Current Weather Card with live rain drop simulator */}
                    <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-4 rounded-2xl shadow-md relative overflow-hidden">
                      {/* Raindrops animations if conditions indicate rain */}
                      {(weatherData.condition.toLowerCase().includes("rain") || 
                        weatherData.condition.toLowerCase().includes("shower") || 
                        weatherData.condition.toLowerCase().includes("storm")) && (
                        <div className="weather-rain-container">
                          <div className="rain-drop" style={{ left: "10%", animationDelay: "0s" }}></div>
                          <div className="rain-drop" style={{ left: "25%", animationDelay: "0.2s" }}></div>
                          <div className="rain-drop" style={{ left: "40%", animationDelay: "0.5s" }}></div>
                          <div className="rain-drop" style={{ left: "55%", animationDelay: "0.1s" }}></div>
                          <div className="rain-drop" style={{ left: "70%", animationDelay: "0.4s" }}></div>
                          <div className="rain-drop" style={{ left: "85%", animationDelay: "0.3s" }}></div>
                        </div>
                      )}
                      
                      <div className="absolute right-4 top-2 text-6xl opacity-15"><CloudRain /></div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] bg-sky-700/60 py-0.5 px-2 rounded-full font-bold uppercase">LIVE STATUS</span>
                        <button
                          onClick={() => speakText(`Weather today is ${weatherData.temp} and ${weatherData.condition}. Advisories: ${weatherData.advice.join(". ")}`)}
                          className="bg-sky-700/40 hover:bg-sky-700/70 text-white p-1 rounded-full transition"
                          title="Listen to Weather Advisory"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="text-3xl font-display font-black mt-2">{weatherData.temp}</h3>
                      <p className="text-sm font-semibold">{weatherData.condition}</p>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-sky-400/30 text-[10px] font-semibold">
                        <div>Humidity: <strong>{weatherData.humidity}</strong></div>
                        <div>Wind Speed: <strong>{weatherData.windSpeed}</strong></div>
                      </div>
                    </div>

                    {/* Action Items Advisory List */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                      <h4 className="font-display font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>{t.advisoryList}</span>
                      </h4>

                      <div className="space-y-2">
                        {weatherData.advice.map((item, idx) => (
                          <div key={idx} className="flex gap-2 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/20 transition relative group">
                            <span className="bg-emerald-100 text-emerald-800 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <p className="text-slate-700 font-semibold leading-normal pr-6">{item}</p>
                            <button
                              onClick={() => speakText(item)}
                              className="absolute right-1 top-2 text-slate-400 hover:text-emerald-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Listen"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ADVANCED FACILITY: 3-Hour Interval Irrigation Advisory Timeline */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="font-display font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                          <span>💧 Irrigation Schedule Optimizer</span>
                        </h4>
                        <span className="text-[9px] font-bold text-sky-600 bg-sky-50 py-0.5 px-2 rounded-full border border-sky-100">
                          Recommended
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-snug font-semibold">
                        AI-generated timing guidance based on regional wind speeds, temperature spikes, and transpiration coefficients:
                      </p>

                      <div className="relative pl-4 space-y-3 mt-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 before:border-dashed">
                        {[
                          { time: "06:00 AM", rating: "Perfect", statusText: "అత్యుత్తమ సమయం", desc: "Minimal solar evaporation rate. High root hydration retention.", color: "bg-emerald-500", labelColor: "text-emerald-700 bg-emerald-50 border-emerald-100" },
                          { time: "12:00 PM", rating: "Avoid", statusText: "సిఫార్సు చేయబడదు", desc: "Extreme leaf solar burn hazards. Instant thermal water evaporation.", color: "bg-red-500", labelColor: "text-red-700 bg-red-50 border-red-100" },
                          { time: "04:00 PM", rating: "Fair", statusText: "సాధారణం", desc: "Excellent for secondary light sprinklers or drip cycles.", color: "bg-amber-500", labelColor: "text-amber-700 bg-amber-50 border-amber-100" },
                          { time: "08:00 PM", rating: "Caution", statusText: "జాగ్రత్త", desc: "Stagnant humidity levels could prompt fungal growth overnight.", color: "bg-amber-600", labelColor: "text-amber-700 bg-amber-50 border-amber-100" }
                        ].map((item, idx) => (
                          <div key={idx} className="relative text-[11px] space-y-0.5">
                            <span className={`absolute -left-[13px] top-1.5 w-2 h-2 rounded-full ${item.color} ring-4 ring-white`} />
                            
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-800">{item.time}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold border ${item.labelColor}`}>
                                {item.rating} • {item.statusText}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug font-medium">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={fetchWeatherAdvisory}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Weather Data</span>
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            {/* MARKET PRICES SCREEN */}
            {currentScreen === "market" && (
              <div className="p-4 space-y-4">
                {/* Search and Filters */}
                <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      placeholder={marketTranslations[selectedLanguage]?.searchPlaceholder || "Search crops..."}
                      value={marketSearchQuery}
                      onChange={(e) => setMarketSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  {/* Filter by trend tabs */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">
                      {marketTranslations[selectedLanguage]?.filtersLabel || "Filter by Trend:"}
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {[
                        { id: "all", label: marketTranslations[selectedLanguage]?.allFilter || "All Crops", color: "border-slate-200" },
                        { id: "UP", label: marketTranslations[selectedLanguage]?.trendUp || "Rising", color: "border-emerald-200 text-emerald-700 bg-emerald-50" },
                        { id: "DOWN", label: marketTranslations[selectedLanguage]?.trendDown || "Falling", color: "border-red-200 text-red-700 bg-red-50" },
                        { id: "STABLE", label: marketTranslations[selectedLanguage]?.trendStable || "Stable", color: "border-slate-300 text-slate-700 bg-slate-100" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setMarketFilterTrend(tab.id as any)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition shrink-0 cursor-pointer ${
                            marketFilterTrend === tab.id 
                              ? "bg-slate-800 text-white border-slate-800" 
                              : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {loadingMarket ? (
                  <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-2xs flex flex-col items-center justify-center space-y-3">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-semibold">Connecting to APMC gateways...</p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in text-xs">
                    {/* Render prices */}
                    {marketPrices.length === 0 ? (
                      <div className="bg-white rounded-2xl p-6 text-center text-slate-400 border border-slate-100">
                        No market prices registered.
                      </div>
                    ) : (
                      marketPrices
                        .filter(crop => {
                          const q = marketSearchQuery.toLowerCase();
                          const matchesSearch = crop.englishName.toLowerCase().includes(q) || crop.localName.toLowerCase().includes(q);
                          const matchesTrend = marketFilterTrend === "all" || crop.trend === marketFilterTrend;
                          return matchesSearch && matchesTrend;
                        })
                        .map((crop, idx) => {
                          const priceDiff = crop.currentPrice - crop.yesterdayPrice;
                          const percentDiff = ((Math.abs(priceDiff) / crop.yesterdayPrice) * 100).toFixed(1);
                          return (
                            <CropPriceCard 
                              key={idx} 
                              crop={crop} 
                              selectedLanguage={selectedLanguage}
                              percentDiff={percentDiff}
                              priceDiff={priceDiff}
                              speakText={speakText}
                            />
                          );
                        })
                    )}

                    <button
                      type="button"
                      onClick={fetchMarketPrices}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-xl font-bold border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{marketTranslations[selectedLanguage]?.refreshLabel || "Refresh Prices"}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 5. DISEASE DETECTION SCREEN */}
            {currentScreen === "disease" && (
              <div className="p-4 space-y-4">
                {/* Active scan simulation layout */}
                {isScanningLeaf && (
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-4 text-center animate-pulse">
                    <h4 className="font-display font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">🔬 AI leaf multi-spectral scan</h4>
                    
                    <div className="relative w-full h-44 rounded-xl border border-emerald-500/20 bg-slate-950 overflow-hidden flex items-center justify-center p-3 shadow-inner">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:10px_10px]" />
                      
                      {/* Green sweeping laser line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] z-10 animate-laser" />
                      
                      {/* Reticle corner brackets */}
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                      
                      {/* Leaf Image or Emoji placeholder */}
                      {customImage ? (
                        <img src={customImage} className="max-h-32 object-contain rounded-lg opacity-40 z-0" alt="Scanning Leaf" />
                      ) : (
                        <div className="text-6xl opacity-30 z-0 animate-bounce">
                          {selectedSampleLeaf === "rice_blast" ? "🌾" : selectedSampleLeaf === "tomato_early_blight" ? "🍅" : selectedSampleLeaf === "cotton_blight" ? "☁️" : "🍃"}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-emerald-600 font-extrabold uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {scanStatusText}
                      </span>
                      <p className="text-[9px] text-slate-400 font-semibold">Do not close this application during active diagnostics.</p>
                    </div>
                  </div>
                )}

                {!diagnosticResult && !isScanningLeaf && (
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs space-y-3 text-xs">
                    <h4 className="font-display font-black text-slate-800 text-sm">{t.diseaseTitle}</h4>
                    <p className="text-slate-500 leading-normal text-[11px] font-semibold">{t.diseaseSub}</p>

                    {/* Custom upload area */}
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
                        customImage ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      {customImage ? (
                        <div className="space-y-2">
                          <img src={customImage} alt="Uploaded leaf" className="max-h-24 mx-auto rounded-lg shadow-sm border border-slate-100" />
                          <span className="text-[10px] text-emerald-600 font-bold block">✓ Custom Image Ready</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2">
                          <Upload className="w-8 h-8 text-slate-400 mb-1.5" />
                          <span className="text-slate-600 font-semibold">{t.uploadImage}</span>
                        </div>
                      )}
                    </div>

                    {/* OR Voice Symptom Reporting Section */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="block text-[10px] uppercase font-bold text-emerald-800 tracking-wider">🎤 Voice Symptom Reporter</span>
                        {isRecording && activeSpeechField === "disease" && (
                          <span className="text-[8px] uppercase font-mono text-red-600 font-bold animate-pulse">
                            ● Recording...
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight font-semibold">
                        No leaf photo? Tap the microphone and describe symptoms:
                      </p>
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          onClick={() => startSpeechRecognition("disease")}
                          className={`p-2.5 rounded-full shadow-md transition shrink-0 cursor-pointer ${
                            isRecording && activeSpeechField === "disease"
                              ? "bg-red-600 hover:bg-red-700 text-white animate-bounce"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                          title="Record Symptoms"
                        >
                          {isRecording && activeSpeechField === "disease" ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                        </button>
                        <textarea
                          rows={2}
                          value={voiceSymptomsText}
                          onChange={(e) => {
                            setVoiceSymptomsText(e.target.value);
                            setSelectedSampleLeaf(null);
                            setCustomImage(null);
                          }}
                          placeholder="Spoken symptoms will transcribe here..."
                          className="flex-1 bg-white border border-slate-200 rounded-xl py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-[11px] leading-snug font-semibold resize-none"
                        />
                      </div>
                      {voiceSymptomsText && (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setVoiceSymptomsText("");
                            }}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold underline cursor-pointer"
                          >
                            Clear Symptoms
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">{t.selectSample}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {sampleLeaves.map((leaf) => (
                          <button
                            key={leaf.id}
                            type="button"
                            onClick={() => {
                              setSelectedSampleLeaf(leaf.id);
                              setCustomImage(null);
                              setVoiceSymptomsText("");
                            }}
                            className={`p-2 rounded-xl text-left border transition flex flex-col justify-between h-20 cursor-pointer ${
                              selectedSampleLeaf === leaf.id 
                                ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20" 
                                : "bg-white border-slate-100 hover:bg-slate-50"
                            }`}
                          >
                            <div>
                              <span className="block font-extrabold text-slate-800 text-[10px] leading-tight truncate">{leaf.name}</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5 font-semibold">{leaf.crop}</span>
                            </div>
                            <span className="text-[8px] bg-slate-100 text-slate-500 py-0.5 px-1.5 rounded-md truncate max-w-full font-semibold">
                              {leaf.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleDiseaseDiagnose}
                      disabled={isDiagnosing || (!selectedSampleLeaf && !customImage && !voiceSymptomsText.trim())}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl mt-2 transition flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {isDiagnosing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{t.diagnosing}</span>
                        </>
                      ) : (
                        <span>{t.diagnoseBtn}</span>
                      )}
                    </button>
                  </div>
                )}

                {diagnosticResult && !isScanningLeaf && (
                  <div className="space-y-3 text-xs animate-fade-in">
                    {/* Diagnosis Result banner */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3">
                      <div className="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">{t.resultTitle}</span>
                          <h4 className="text-sm font-extrabold text-slate-800">{diagnosticResult.diagnosis.disease}</h4>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            {diagnosticResult.diagnosis.confidence} Match
                          </span>
                          <button
                            onClick={() => speakText(`Diagnosed disease: ${diagnosticResult.diagnosis.disease}. Recommended treatment: ${diagnosticResult.diagnosis.treatment}`)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-1 rounded-full transition"
                            title="Speak diagnosis report"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2.5 text-[11px]">
                        <div>
                          <strong className="block text-slate-400 text-[10px] font-bold uppercase">{t.symptoms}</strong>
                          <p className="text-slate-700 font-semibold leading-normal">{diagnosticResult.diagnosis.symptoms}</p>
                        </div>
                        <div className="space-y-3">
                          <strong className="block text-slate-400 text-[10px] font-bold uppercase">{t.treatment}</strong>
                          <p className="text-emerald-950 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-100/60 leading-relaxed">
                            {diagnosticResult.diagnosis.treatment}
                          </p>

                          {/* ADVANCED FACILITY: Treatment Checklist */}
                          {(() => {
                            const steps = [
                              "Prune and destroy infected plant foliage immediately",
                              `Apply treatment: ${diagnosticResult.diagnosis.treatment.split('.')[0] || "Appropriate botanical spray"}.`,
                              "Optimize irrigation: Keep soil aerated and avoid late-night foliar water spray",
                              "Sanitize agricultural tools to avoid cross-contaminating other crop rows"
                            ];
                            const checkedCount = steps.filter((_, idx) => checkedSteps[idx]).length;
                            const progressPct = Math.round((checkedCount / steps.length) * 100);

                            return (
                              <div className="space-y-2.5 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                                <div className="flex justify-between items-center">
                                  <strong className="block text-slate-500 text-[10px] font-bold uppercase">📋 Treatment Checklist</strong>
                                  <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 py-0.5 px-1.5 rounded">
                                    {checkedCount}/{steps.length} Done ({progressPct}%)
                                  </span>
                                </div>

                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-emerald-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                                </div>

                                <div className="space-y-1.5 mt-2">
                                  {steps.map((stepText, idx) => {
                                    const isChecked = !!checkedSteps[idx];
                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                          playWebAudioSound("chime");
                                          setCheckedSteps(prev => ({
                                            ...prev,
                                            [idx]: !prev[idx]
                                          }));
                                        }}
                                        className={`w-full flex gap-2 items-start text-left p-2 rounded-xl border transition cursor-pointer ${
                                          isChecked 
                                            ? "bg-emerald-50/40 border-emerald-200 text-slate-400 line-through" 
                                            : "bg-slate-50/50 border-slate-100/70 text-slate-700 hover:bg-slate-100/50"
                                        }`}
                                      >
                                        <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[9px] shrink-0 mt-0.5 transition ${
                                          isChecked 
                                            ? "bg-emerald-600 border-emerald-600 text-white" 
                                            : "bg-white border-slate-300 text-transparent font-bold"
                                        }`}>
                                          ✓
                                        </span>
                                        <span className="text-[11px] leading-tight font-semibold">{stepText}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Expert Escalation Box */}
                      {diagnosticResult.diagnosis.needExpert && (
                        <div className="border-t border-slate-100 pt-3 mt-3">
                          <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 flex gap-2">
                            <span className="text-base">👨‍🔬</span>
                            <div className="text-[10px] leading-relaxed font-semibold">
                              <strong>{t.expertRequired}:</strong> Leaf profile escalated to pathology labs.
                              
                              <div className="mt-2 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-slate-500 italic">
                                  {diagnosticResult.expertReply ? t.expertResolved : t.expertWaiting}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show Reply from expert directly inside the diagnostic page if populated! */}
                      {diagnosticResult.expertReply && (
                        <div className="bg-emerald-50 text-emerald-950 p-3.5 rounded-xl border border-emerald-200 shadow-2xs mt-3 animate-fade-in text-[11px] relative">
                          <div className="flex justify-between border-b border-emerald-100 pb-1.5 mb-1.5">
                            <strong className="text-emerald-900 font-extrabold font-display">👨‍🌾 Expert Resolution Note</strong>
                            <span className="text-[9px] text-emerald-600 font-semibold">{new Date(diagnosticResult.repliedAt || "").toLocaleTimeString()}</span>
                          </div>
                          <p className="leading-relaxed italic pr-6">"{diagnosticResult.expertReply}"</p>
                          <span className="block text-[10px] text-emerald-700 font-bold mt-2">Resolved by: {diagnosticResult.expertName}</span>
                          <button
                            onClick={() => speakText(`Reply from scientist. ${diagnosticResult.expertReply}`)}
                            className="absolute right-2 top-2 text-emerald-600 hover:bg-emerald-100/50 p-1 rounded-full transition"
                            title="Speak reply"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setDiagnosticResult(null)}
                      className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-xl font-bold transition cursor-pointer"
                    >
                      Diagnose New Crop Leaf
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 6. VOICE ASSISTANT SCREEN */}
            {currentScreen === "voice" && (
              <div className="p-4 flex flex-col h-[580px] justify-between text-xs">
                
                {/* Header Instruction / Status */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs text-center space-y-1">
                  <h4 className="font-display font-black text-slate-800 text-sm">{t.voiceTitle}</h4>
                  <p className="text-slate-450 font-semibold">{t.voiceSub}</p>
                </div>

                {/* Conversation Box */}
                <div className="flex-1 overflow-y-auto my-3 space-y-2.5 pr-1 py-1 flex flex-col">
                  {voiceConversation.length === 0 ? (
                    <div className="my-auto text-center py-8 space-y-2">
                      <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-pulse">
                        <Mic className="w-6 h-6" />
                      </div>
                      <p className="text-slate-400 font-semibold">{t.askAssistant}</p>
                    </div>
                  ) : (
                    voiceConversation.map((chat, idx) => (
                      <div 
                        key={idx} 
                        className={`max-w-[85%] rounded-2xl p-3 leading-normal shadow-2xs font-semibold ${
                          chat.role === "user" 
                            ? "bg-emerald-600 text-white self-end rounded-br-none" 
                            : "bg-white text-slate-700 self-start border border-slate-100 rounded-bl-none"
                        }`}
                      >
                        <p>{chat.text}</p>
                        {chat.role === "ai" && idx === voiceConversation.length - 1 && (
                          <button 
                            onClick={() => speakText(chat.text)} 
                            className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase hover:underline cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Listen Again</span>
                          </button>
                        )}
                      </div>
                    ))
                  )}

                  {isVoiceThinking && (
                    <div className="bg-white text-slate-400 self-start p-3 rounded-2xl border border-slate-100 rounded-bl-none flex items-center gap-1.5 animate-pulse font-semibold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>Gemini Assistant is replying...</span>
                    </div>
                  )}
                </div>

                {/* Soundwave Visualizer linked to index.css keyframes */}
                {(isSpeaking || isRecording || isVoiceThinking) && (
                  <div className="flex items-center justify-center gap-1.5 my-1 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] uppercase font-extrabold text-emerald-800 animate-pulse mr-2">
                      {isRecording ? "Listening..." : isVoiceThinking ? "Gemini Analysing..." : "Assistant speaking..."}
                    </span>
                    <div className="voice-wave">
                      <div className="voice-bar" style={{ animationDelay: "0.1s" }}></div>
                      <div className="voice-bar" style={{ animationDelay: "0.3s" }}></div>
                      <div className="voice-bar" style={{ animationDelay: "0.5s" }}></div>
                      <div className="voice-bar" style={{ animationDelay: "0.2s" }}></div>
                      <div className="voice-bar" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                )}

                {/* Interactive Mic/Inputs */}
                <div className="space-y-3 bg-white p-3 rounded-2xl border border-slate-100">
                  {/* Presets */}
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-slate-400 mb-1">Click a Preset Question:</span>
                    <div className="flex flex-col gap-1.5">
                      {t.voicePresets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setVoiceQuery(preset);
                            submitVoiceQuery(preset);
                          }}
                          className="text-left py-1.5 px-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 leading-snug border border-slate-100 transition truncate cursor-pointer font-semibold"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      onClick={toggleRecording}
                      className={`p-3 rounded-full shadow-md transition cursor-pointer ${
                        isRecording && activeSpeechField === "voice"
                          ? "bg-red-600 hover:bg-red-700 text-white animate-bounce" 
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                      title={t.tapToSpeak}
                    >
                      {isRecording && activeSpeechField === "voice" ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    
                    <input
                      type="text"
                      placeholder="Type agricultural question..."
                      value={voiceQuery}
                      onChange={(e) => setVoiceQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitVoiceQuery(voiceQuery)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs font-semibold"
                    />

                    <button
                      onClick={() => submitVoiceQuery(voiceQuery)}
                      className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-xl transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 7. SMS SUPPORT SCREEN */}
            {currentScreen === "sms" && (
              <div className="p-4 flex flex-col h-[580px] justify-between text-xs font-mono">
                
                {/* SMS Recipient header */}
                <div className="bg-slate-800 text-slate-300 p-2.5 rounded-xl text-center border border-slate-700">
                  <span className="block text-[9px] uppercase tracking-wider text-slate-405">TO SHORTCODE</span>
                  <span className="text-sm font-bold text-emerald-400">555-AI (KrishiMitra SMS)</span>
                </div>

                {/* Simulated SMS Thread */}
                <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 py-1 flex flex-col">
                  {smsConversation.length === 0 ? (
                    <div className="my-auto text-center text-slate-400 space-y-2 py-8">
                      <span className="text-3xl">📩</span>
                      <p className="text-[11px] leading-relaxed font-semibold">
                        Simulate offline feature! Farmers send HELP, WEATHER, or CROP commands to get quick automated SMS updates.
                      </p>
                    </div>
                  ) : (
                    smsConversation.map((sms, idx) => (
                      <div key={idx} className="space-y-1.5 flex flex-col">
                        <div className="bg-slate-200 text-slate-800 max-w-[80%] rounded-xl px-3 py-2 text-xs leading-normal self-end font-semibold">
                          <p>{sms.message}</p>
                          <span className="block text-[8px] text-slate-500 text-right mt-0.5">{new Date(sms.date).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="bg-emerald-700 text-white max-w-[80%] rounded-xl px-3 py-2 text-xs leading-normal self-start relative font-semibold group pr-7">
                          <p>{sms.reply}</p>
                          <span className="block text-[8px] text-emerald-300 mt-0.5">FROM: KrishiMitra AI</span>
                          <button
                            onClick={() => speakText(sms.reply)}
                            className="absolute right-1 top-2 text-emerald-300 hover:text-white p-1 rounded-full transition"
                            title="Speak reply"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {isSmsSending && (
                    <div className="bg-slate-100 text-slate-400 p-2 rounded-lg text-center animate-pulse text-[10px] self-start">
                      Transmitting SMS via APMC Gateway...
                    </div>
                  )}
                </div>

                {/* SMS Presets & Custom inputs */}
                <div className="space-y-3 bg-white p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">Click automated SMS preset:</span>
                    <div className="flex gap-1.5">
                      {t.smsPresets.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendSmsMessage(preset)}
                          className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold text-center border border-slate-700 transition cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      onClick={() => startSpeechRecognition("sms")}
                      className={`p-2.5 rounded-full shadow-md transition shrink-0 cursor-pointer ${
                        isRecording && activeSpeechField === "sms"
                          ? "bg-red-600 hover:bg-red-700 text-white animate-bounce"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                      title="Speak SMS"
                    >
                      {isRecording && activeSpeechField === "sms" ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <input
                      type="text"
                      placeholder="Type custom SMS e.g. HELP"
                      value={smsText}
                      onChange={(e) => setSmsText(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && sendSmsMessage("")}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 focus:outline-none focus:ring-1 focus:ring-slate-500 uppercase text-xs font-mono font-bold"
                    />
                    <button
                      onClick={() => sendSmsMessage("")}
                      className="bg-slate-900 hover:bg-slate-800 text-emerald-400 px-3 py-2 rounded-xl transition cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Navigation Bar */}
          {currentScreen !== "login" && (
            <div className="border-t border-slate-200 py-3.5 bg-white flex justify-around items-center select-none z-30 shadow-inner rounded-b-[35px]">
              <button 
                onClick={() => {
                  setCurrentScreen("home");
                  setCropResult(null);
                  setDiagnosticResult(null);
                }} 
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === "home" ? "text-emerald-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-semibold"}`}
              >
                <Smartphone className="w-5 h-5" />
                <span className="text-[10px]">Home</span>
              </button>

              <button 
                onClick={() => setCurrentScreen("disease")} 
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === "disease" ? "text-emerald-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-semibold"}`}
              >
                <span className="text-base leading-none">🍃</span>
                <span className="text-[10px]">Leaf Doctor</span>
              </button>

              <button 
                onClick={() => setCurrentScreen("voice")} 
                className={`flex flex-col items-center gap-0.5 cursor-pointer ${currentScreen === "voice" ? "text-emerald-600 font-extrabold" : "text-slate-400 hover:text-slate-600 font-semibold"}`}
              >
                <Mic className="w-5 h-5" />
                <span className="text-[10px]">Assistant</span>
              </button>
            </div>
          )}

        </div>

        {/* Simulated Home Indicator Bar */}
        <div className="w-32 h-1 bg-slate-800 rounded-full mx-auto mt-2 mb-1"></div>
      </div>
    </div>
  );
}
