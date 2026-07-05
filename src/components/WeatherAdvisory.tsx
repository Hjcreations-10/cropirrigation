import { useState, useEffect, FormEvent } from "react";
import { 
  CloudRain, Sun, Droplets, Wind, MapPin, 
  AlertTriangle, CheckCircle2, Navigation, 
  TrendingUp, ShieldCheck, Sparkles, RefreshCw,
  Volume2, VolumeX
} from "lucide-react";
import { LanguageCode } from "../types";

interface WeatherAdvisoryProps {
  selectedLanguage: LanguageCode;
  userVillage?: string;
}

export default function WeatherAdvisory({ selectedLanguage, userVillage }: WeatherAdvisoryProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);

  const fetchAdvisory = async (lat: number | null, lon: number | null, locationName: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const body: any = { language: selectedLanguage };
      if (lat !== null && lon !== null) {
        body.lat = lat;
        body.lon = lon;
      }
      if (locationName) {
        body.locationName = locationName;
      }

      const res = await fetch("/api/weather-advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error("Failed to fetch weather advisories");
      }

      const data = await res.json();
      setWeatherData(data);
      if (data.latitude && data.longitude) {
        setCoordinates({ lat: data.latitude, lon: data.longitude });
      }
      
      // Stop speaking if new data is loaded
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingSection(null);
      }
    } catch (err: any) {
      console.error(err);
      setError("Unable to load advisories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchAdvisory(null, null, searchQuery);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAdvisory(latitude, longitude, null);
        },
        (err) => {
          console.warn("Geolocation access denied or failed, using fallback:", err);
          fetchAdvisory(null, null, userVillage || "Kuppam");
        }
      );
    } else {
      fetchAdvisory(null, null, userVillage || "Kuppam");
    }
  };

  useEffect(() => {
    fetchAdvisory(null, null, userVillage || "Kuppam");
  }, [selectedLanguage, userVillage]);

  // Clean up speech when leaving component or changing language
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLanguage]);

  // Speech Reader Handler
  const speakText = (text: string, sectionKey: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser configuration.");
      return;
    }

    if (isSpeaking && speakingSection === sectionKey) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingSection(null);
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active readout

    const utterance = new SpeechSynthesisUtterance(text);
    const languageLocales: Record<LanguageCode, string> = {
      en: "en-IN", te: "te-IN", hi: "hi-IN", ta: "ta-IN", kn: "kn-IN",
      ml: "ml-IN", mr: "mr-IN", bn: "bn-IN", gu: "gu-IN", pa: "pa-IN", or: "or-IN"
    };

    utterance.lang = languageLocales[selectedLanguage] || "en-IN";
    utterance.rate = 0.95; // slightly slower for high clarity

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSection(sectionKey);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingSection(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingSection(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Weather codes mapping for descriptions & icons
  const getWeatherInfo = (code: number) => {
    if (code === 0) return { label: "Clear sky", icon: <Sun className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: "20s" }} /> };
    if ([1, 2, 3].includes(code)) return { label: "Partly cloudy", icon: <Sun className="w-8 h-8 text-sky-400" /> };
    if ([45, 48].includes(code)) return { label: "Foggy conditions", icon: <Wind className="w-8 h-8 text-slate-400" /> };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: <CloudRain className="w-8 h-8 text-sky-500" /> };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rain showers", icon: <CloudRain className="w-8 h-8 text-blue-500 animate-bounce" /> };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snow", icon: <CloudRain className="w-8 h-8 text-sky-200" /> };
    if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: <CloudRain className="w-8 h-8 text-violet-500 animate-pulse" /> };
    return { label: "Cloudy", icon: <CloudRain className="w-8 h-8 text-slate-500" /> };
  };

  const weatherMeta = weatherData ? getWeatherInfo(weatherData.currentWeather.weatherCode) : { label: "Unknown", icon: <Sun /> };

  // Translations dictionary for UI
  const t: Record<string, Record<LanguageCode, string>> = {
    title: {
      en: "Live Agri-Weather Advisory",
      te: "నిజ సమయ వాతావరణ వ్యవసాయ సలహాలు",
      hi: "लाइव कृषि-मौसम सलाहकार",
      ta: "நேரடி வேளாண் வானிலை ஆலோசனை",
      kn: "ಲೈವ್ ಹವಾಮಾನ ಕೃಷಿ ಸಲಹೆ",
      ml: "തത്സമയ കാർഷിക കാലാവസ്ഥാ ഉപദേശം",
      mr: "थेट कृषी-हवामान सल्ला",
      bn: "লাইভ কৃষি-আবহাওয়া পরামর্শ",
      gu: "લાઇવ કૃષિ-હવામાન સલાહ",
      pa: "ਲਾਈਵ ਖੇਤੀਬਾੜੀ-ਮੌਸਮ ਸਲਾਹਕਾਰ",
      or: "ସିଧାସଳଖ କୃଷି-ପାଣିପାଗ ପରାମର୍ଶ"
    },
    subTitle: {
      en: "Real-time crop guidance powered by coordinates-based environmental intelligence.",
      te: "అక్షాంశ రేఖాంశాల ఆధారంగా లభించే వాతావరణ పరిజ్ఞానంతో పనిచేసే పంటల సలహాలు.",
      hi: "स्थान-आधारित सटीक पर्यावरणीय बुद्धिमत्ता द्वारा संचालित वास्तविक समय फसल मार्गदर्शन।",
      ta: "ஆயத்தொலைவுகள் அடிப்படையிலான சுற்றுச்சூழல் நுண்ணறிவு மூலம் வழங்கப்படும் நிகழ்நேர பயிர் வழிகாட்டுதல்.",
      kn: "ಸ್ಥಳ-ಆಧಾರಿತ ಪರಿಸರ ಬುದ್ಧಿಮತ್ತೆಯೊಂದಿಗೆ ನೈಜ-ಸಮಯದ ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ.",
      ml: "നിങ്ങളുടെ പ്രദേശത്തിന്റെ അടിസ്ഥാനത്തിലുള്ള തത്സമയ വിള മാർഗ്ഗനിർദ്ദേശം.",
      mr: "स्थान-आधारित पर्यावरणीय बुद्धिमत्तेद्वारे थेट पीक मार्गदर्शन.",
      bn: "স্থান-ভিত্তিক পরিবেশগত বুদ্ধিমত্তা দ্বারা চালিত রিয়েল-টাইম ফসল নির্দেশিকা।",
      gu: "સ્થાન-આધારિત સચોટ પર્યાવરણીય બુદ્ધિમત્તા દ્વારા સંચાલિત પાક માર્ગદર્શન.",
      pa: "ਸਥਾਨ-ਅਧਾਰਤ ਵਾਤਾਵਰਣ ਬੁੱਧੀ ਦੁਆਰਾ ਸੰਚਾਲਿਤ ਲਾਈਵ ਫਸਲ ਮਾਰਗਦਰਸ਼ਨ।",
      or: "ସ୍ଥାନ-ଆଧାରିତ ପରିବେଶ ଜ୍ଞାନକୌଶଳ ଦ୍ୱାରା ଚାଳିତ ରିୟଲ୍-ଟାଇମ୍ ଫସଲ ପରାମର୍ଶ |"
    },
    searchPlaceholder: {
      en: "Search village, district, or town...",
      te: "గ్రామం, జిల్లా లేదా పట్టణం పేరు టైప్ చేయండి...",
      hi: "गाँव, जिला या शहर खोजें...",
      ta: "கிராமம், மாவட்டம் அல்லது நகரத்தைத் தேடுக...",
      kn: "ಗ್ರಾಮ, ಜಿಲ್ಲೆ ಅಥವಾ ಪಟ್ಟಣವನ್ನು ಹುಡುಕಿ...",
      ml: "ഗ്രാമം, ജില്ല അല്ലെങ്കിൽ നഗരം തിരയുക...",
      mr: "गाव, जिल्हा किंवा शहर शोधा...",
      bn: "গ্রাম, জেলা বা শহর খুঁজুন...",
      gu: "ગામ, જિલ્લો અથવા शहर શોધો...",
      pa: "ਪਿੰਡ, ਜ਼ਿਲ੍ਹਾ ਜਾਂ ਸ਼ਹਿਰ ਖੋਜੋ...",
      or: "ଗ୍ରାମ, ଜିଲ୍ଲା କିମ୍ବା ସହର ଖୋଜନ୍ତୁ..."
    },
    gpsBtn: {
      en: "Use GPS Location",
      te: "నా జీపీఎస్ స్థానం",
      hi: "जीपीएस स्थान",
      ta: "ஜிபிஎஸ் இருப்பிடம்",
      kn: "ಜಿಪಿಎಸ್ ಸ್ಥಳ",
      ml: "ജിപിഎസ് സ്ഥാനം",
      mr: "जीपीएस स्थान",
      bn: "জিপিএস অবস্থান",
      gu: "જીપીએસ स्थान",
      pa: "ਜੀਪੀਐਸ ਸਥਾਨ",
      or: "ଜିପିଏସ ସ୍ଥାନ"
    },
    moisture: {
      en: "Soil Moisture Alert",
      te: "నేల తేమ హెచ్చరిక",
      hi: "मिट्टी नमी चेतावनी",
      ta: "மண் ஈரப்பத எச்சரிக்கை",
      kn: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಎಚ್ಚರಿಕೆ",
      ml: "മണ്ണിലെ ഈർപ്പ മുന്നറിയിപ്പ്",
      mr: "मातीतील ओलावा चेतावणी",
      bn: "মাটির আর্দ্রতা সতর্কতা",
      gu: "જમીન ભેજ ચેતવણી",
      pa: "ਮਿੱਟੀ ਦੀ ਨਮੀ ਸੰਬੰਧੀ ਚੇਤਾਵਨੀ",
      or: "ମାଟି ଆର୍ଦ୍ରତା ସତର୍କତା"
    },
    planting: {
      en: "Planting & Sowing Guidance",
      te: "విత్తనాలు నాటే సమయం సలహా",
      hi: "बुवाई और रोपण मार्गदर्शन",
      ta: "பயிர் நடவு மற்றும் விதைப்பு வழிகாட்டுதல்",
      kn: "ಬಿತ್ತನೆ ಮತ್ತು ನಾಟಿ ಮಾರ್ಗದರ್ಶನ",
      ml: "വിത്ത് നടീൽ മാർഗ്ഗനിർദ്ദേശം",
      mr: "पेरणी आणि लागवड मार्गदर्शन",
      bn: "রোপণ ও বুনে দেওয়া নির্দেশিকা",
      gu: "વાવણી અને રોપણ માર્ગદર્શન",
      pa: "ਬੁਵਾਈ ਅਤੇ ਬੂਟੇ ਲਗਾਉਣ ਦੀ ਸਲਾਹ",
      or: "ଫସଲ ବୁଣିବା ପରାମର୍ଶ"
    },
    fertilizer: {
      en: "Fertilizer & Spraying",
      te: "ఎరువులు మరియు పిచికారీ",
      hi: "उर्वरक और कीटनाशक छिड़काव",
      ta: "உரம் மற்றும் மருந்து தெளித்தல்",
      kn: "ಗೊಬ್ಬರ ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ",
      ml: "വളപ്രയോഗവും മരുന്നടിയും",
      mr: "खत आणि फवारणी मार्गदर्शन",
      bn: "সার ও কীটনাশক ছেটানো",
      gu: "ખાતર અને જંતુનાશક છંટકાવ",
      pa: "ਖਾਦ ਅਤੇ ਕੀਟਨਾਸ਼ਕ ਛਿੜਕਾਅ",
      or: "ସାର ଏବଂ କୀଟନାଶକ ପ୍ରୟୋਗ"
    },
    harvest: {
      en: "Harvesting Advisory",
      te: "పంట కోత సలహాలు",
      hi: "फसल कटाई सलाह",
      ta: "அறுவடை ஆலோசனை",
      kn: "ಕೊಯ್ಲು ಸಲಹೆಗಳು",
      ml: "വിളവെടുപ്പ് ഉപദേശം",
      mr: "पीक काढणी सल्ला",
      bn: "ফসল কাটার পরামর্শ",
      gu: "પાક લણણી સલાહ",
      pa: "ਫਸਲ ਕਟਾਈ ਸੰਬੰਧੀ ਸਲਾਹ",
      or: "ଫସଲ ଅମଳ ପରାମର୍ଶ"
    },
    suitability: {
      en: "Farming Suitability Index",
      te: "వ్యవసాయ పనుల అనుకూలత సూచిక",
      hi: "कृषि अनुकूलता सूचकांक",
      ta: "வேளாண் பொருத்தம் குறியீடு",
      kn: "ಕೃಷಿ ಸೂಕ್ತತೆ ಸೂಚ್ಯಂಕ",
      ml: "കാർഷിക യോഗ്യതാ സൂചിക",
      mr: "कृषी सुसंगतता निर्देशांक",
      bn: "কৃষি উপযুক্ততা সূচক",
      gu: "કૃષિ અનુકૂળતા સૂચકાંક",
      pa: "ਖੇਤੀਬਾੜੀ ਅਨੁਕੂਲਤਾ ਸੂਚਕਾਂਕ",
      or: "କୃଷି ଉପଯୋଗିତା ସୂଚକାଙ୍କ"
    },
    ideal: {
      en: "Ideal conditions for open field work",
      te: "పొలంలో పనులు చేయడానికి అత్యంత అనుకూలమైన వాతావరణం",
      hi: "खेत के कामों के लिए आदर्श परिस्थितियां",
      ta: "வெளிப்புற வயல் வேலைகளுக்கு உகந்த சூழல்",
      kn: "ಹೊರಾಂಗಣ ಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ಅತ್ಯುತ್ತಮ ವಾತಾವರಣ",
      ml: "കൃഷിപ്പണികൾ ചെയ്യാൻ ഏറ്റവും അനുയോജ്യമായ സമയം",
      mr: "शेती कामांसाठी अत्यंत अनुकूल परिस्थिती",
      bn: "মাঠের কাজের জন্য পরিস্থিতি খুবই ভালো",
      gu: "ખેતરના કામો માટે આદર્શ પરિસ્થિતિ",
      pa: "ਖੇਤ ਦੇ ਕੰਮਾਂ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹਾਲਤਾਂ",
      or: "କ୍ଷେତ କାର୍ଯ୍ୟ ପାଇଁ ଅତ୍ୟಂತ ଅନੁକୂଳ ପରିବେଶ"
    },
    notIdeal: {
      en: "Farming activities require precaution today",
      te: "నేడు వ్యవసాయ పనుల్లో తగిన జాగ్రత్తలు అవసరం",
      hi: "आज कृषि कार्यों में विशेष सावधानी की आवश्यकता है",
      ta: "இன்று வேளாண் பணிகளில் கூடுதல் கவனம் தேவை",
      kn: "ಇಂದು ಕೃಷಿ ಕೆಲಸಗಳಲ್ಲಿ ಮುನ್ನೆಚ್ಚರಿಕೆ ಅಗತ್ಯವಿದೆ",
      ml: "ഇന്ന് കാർഷിക പ്രവൃത്തികളിൽ ജാഗ്രത പാലിക്കുക",
      mr: "आज शेतीच्या कामांमध्ये खबरदारी घेणे आवश्यक आहे",
      bn: "আজ চাষের কাজে বিশেষ সতর্কতার প্রয়োজন রয়েছে",
      gu: "આજે કૃષિ કાર્યોમાં સાવચેતી રાખવી જરૂરી છે",
      pa: "ਅੱਜ ਖੇਤੀਬਾੜੀ ਦੇ ਕੰਮਾਂ ਵਿੱਚ ਸਾਵਧਾਨੀ ਵਰਤਣ ਦੀ ਲੋੜ ਹੈ",
      or: "ଆଜి କୃଷି କାର୍ଯ୍ୟରେ ସତר୍କତା ଆବଶ୍ୟక"
    },
    listenBtn: {
      en: "Listen to Full Advisory",
      te: "పూర్తి సలహా వినండి",
      hi: "पूरी सलाह सुनें",
      ta: "முழு ஆலோசனையைக் கேளுங்கள்",
      kn: "ಪೂರ್ಣ ಸಲಹೆ ಆಲಿಸಿ",
      ml: "നിർദ്ദേശം മുഴുവനായി കേൾക്കുക",
      mr: "सर्व सल्ला ऐका",
      bn: "সম্পূর্ণ পরামর্শ শুনুন",
      gu: "આખી સલાહ સાંભળો",
      pa: "ਪੂਰੀ ਸਲਾਹ ਸੁਣੋ",
      or: "ସମ୍ପୂର୍ଣ୍ଣ ପରାମର୍ଶ ଶୁଣନ୍ତୁ"
    },
    stopBtn: {
      en: "Stop Readout",
      te: "వినడం ఆపండి",
      hi: "पढ़ना बंद करें",
      ta: "வாசிப்பதை நிறுத்து",
      kn: "ವಾಚನ ನಿಲ್ಲಿಸಿ",
      ml: "വായന നിർത്തുക",
      mr: "वाचन थांबवा",
      bn: "পড়া বন্ধ করুন",
      gu: "વાંચવાનું બંધ કરો",
      pa: "ਪੜ੍ਹਨਾ ਬੰਦ ਕਰੋ",
      or: "ଶୁଣିବା ବନ୍ଦ କରନ୍ତୁ"
    }
  };

  const currentT = (key: string) => {
    return t[key]?.[selectedLanguage] || t[key]?.["en"] || "";
  };

  const getFullSpeechText = () => {
    if (!weatherData) return "";
    const adv = weatherData.advisory;
    return `${weatherData.location} ${currentT("title")}. ${currentT("moisture")}: ${adv.moistureAlert}. ${currentT("planting")}: ${adv.plantingRecommendation}. ${currentT("fertilizer")}: ${adv.fertilizerGuidance}. ${currentT("harvest")}: ${adv.harvestAdvisory}.`;
  };

  return (
    <div id="weather-advisory-card" className="glassmorphism rounded-3xl p-5 border border-emerald-500/10 shadow-md space-y-4 hover-card-premium animate-fade-in-up">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200/60 pb-4 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg shrink-0 shadow-xs">
              <Sparkles className="w-4.5 h-4.5" />
            </span>
            <h2 className="font-display font-black text-slate-800 text-base tracking-tight">
              {currentT("title")}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 max-w-lg leading-relaxed">
            {currentT("subTitle")}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* TTS Readout Button */}
          {weatherData && (
            <button
              onClick={() => speakText(getFullSpeechText(), "global")}
              className={`flex items-center gap-1.5 text-[10px] font-bold py-1.5 px-3 rounded-xl border transition-all cursor-pointer ${
                isSpeaking && speakingSection === "global"
                  ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700 shadow-sm"
              }`}
            >
              {isSpeaking && speakingSection === "global" ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{currentT("stopBtn")}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{currentT("listenBtn")}</span>
                </>
              )}
            </button>
          )}

          {/* GPS location fetcher */}
          <button
            id="btn-gps-weather"
            type="button"
            onClick={handleGetCurrentLocation}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold py-1.5 px-3 rounded-xl border border-emerald-200/50 cursor-pointer transition shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            {currentT("gpsBtn")}
          </button>
        </div>
      </div>

      {/* Manual Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-weather-search"
            type="text"
            placeholder={currentT("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white transition"
          />
        </div>
        <button
          id="btn-weather-search"
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4.5 rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer border border-emerald-700"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 text-red-900 border border-red-200 p-3 rounded-xl text-xs flex gap-2 items-center">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Loading overlay spinner */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">Analyzing regional environmental metrics...</p>
        </div>
      ) : weatherData ? (
        <div className="space-y-4">
          {/* Main Top Bento Row (Current Weather & Score Meter) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Weather Metric Display Card */}
            <div className="md:col-span-7 bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-4.5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-2 top-2 text-6xl text-emerald-400/10 pointer-events-none">
                {weatherMeta.icon}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] bg-emerald-950/60 py-0.5 px-2.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/20">
                    {weatherData.location}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <h3 className="text-3xl font-display font-black tracking-tight">{weatherData.currentWeather.temp}°C</h3>
                  <span className="text-[10px] font-semibold text-emerald-300">/ Apparent {Math.round(weatherData.currentWeather.temp + 1)}°C</span>
                </div>
                <p className="text-[11px] font-bold text-emerald-100 flex items-center gap-1.5">
                  <span>{weatherMeta.label}</span>
                  {coordinates && (
                    <span className="text-[8.5px] font-mono font-bold text-emerald-300 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                      ({coordinates.lat.toFixed(3)}, {coordinates.lon.toFixed(3)})
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-1 border-t border-emerald-500/20 pt-3.5 mt-4 text-[9.5px] text-emerald-100 font-medium">
                <div>
                  <span className="text-emerald-300 text-[8px] uppercase font-extrabold block">Humidity</span>
                  <strong className="text-white text-[11px] block flex items-center gap-0.5 mt-0.5">
                    <Droplets className="w-3 h-3 text-sky-300 shrink-0" /> {weatherData.currentWeather.humidity}%
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-300 text-[8px] uppercase font-extrabold block">Wind</span>
                  <strong className="text-white text-[11px] block flex items-center gap-0.5 mt-0.5">
                    <Wind className="w-3 h-3 text-amber-300 shrink-0" /> {weatherData.currentWeather.windSpeed} km/h
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-300 text-[8px] uppercase font-extrabold block">Rain Prob</span>
                  <strong className="text-white text-[11px] block flex items-center gap-0.5 mt-0.5">
                    <CloudRain className="w-3 h-3 text-sky-300 shrink-0" /> {weatherData.currentWeather.precipProb}%
                  </strong>
                </div>
                <div>
                  <span className="text-emerald-300 text-[8px] uppercase font-extrabold block">Volume</span>
                  <strong className="text-white text-[11px] block flex items-center gap-0.5 mt-0.5">
                    <CloudRain className="w-3 h-3 text-sky-300 shrink-0" /> {weatherData.currentWeather.precipSum} mm
                  </strong>
                </div>
              </div>
            </div>

            {/* General Farming Suitability Meter */}
            <div className="md:col-span-5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="space-y-0.5">
                <span className="text-slate-400 text-[9px] font-extrabold uppercase tracking-wider block">
                  {currentT("suitability")}
                </span>
                <span className="text-[10.5px] text-slate-600 block leading-tight font-medium">
                  {weatherData.advisory.suitabilityScore >= 70 ? currentT("ideal") : currentT("notIdeal")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-all duration-1000 ${
                        weatherData.advisory.suitabilityScore >= 75 
                          ? "text-emerald-500" 
                          : weatherData.advisory.suitabilityScore >= 55 
                          ? "text-amber-500" 
                          : "text-red-500"
                      }`}
                      strokeDasharray={`${weatherData.advisory.suitabilityScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-black text-slate-800">{weatherData.advisory.suitabilityScore}%</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-slate-700">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className={`w-4.5 h-4.5 ${weatherData.advisory.suitabilityScore >= 70 ? "text-emerald-500" : "text-amber-500"}`} />
                    <span className="text-[11px] font-bold text-slate-800">
                      {weatherData.advisory.suitabilityScore >= 75 ? "Excellent Day" : weatherData.advisory.suitabilityScore >= 55 ? "Caution Day" : "Alert Day"}
                    </span>
                  </div>
                  <p className="text-[9px] leading-snug text-slate-400 font-medium">
                    Calculated from actual solar indexes, precipitation probability, and wind velocities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Real-Time Agricultural Advisories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
            
            {/* 1. Moisture advisory */}
            <div className="bg-white/60 hover:bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-1.5 relative group">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-sky-50 text-sky-600 rounded shrink-0">
                    <Droplets className="w-3.5 h-3.5" />
                  </span>
                  <strong className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">{currentT("moisture")}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(weatherData.advisory.moistureAlert, "moisture")}
                  className={`p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors ${speakingSection === "moisture" ? "text-emerald-600 animate-pulse bg-emerald-50" : ""}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{weatherData.advisory.moistureAlert}</p>
            </div>

            {/* 2. Planting advisory */}
            <div className="bg-white/60 hover:bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-1.5 relative group">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-emerald-50 text-emerald-600 rounded shrink-0">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </span>
                  <strong className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">{currentT("planting")}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(weatherData.advisory.plantingRecommendation, "planting")}
                  className={`p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors ${speakingSection === "planting" ? "text-emerald-600 animate-pulse bg-emerald-50" : ""}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{weatherData.advisory.plantingRecommendation}</p>
            </div>

            {/* 3. Fertilizer & Spraying */}
            <div className="bg-white/60 hover:bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-1.5 relative group">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-purple-50 text-purple-600 rounded shrink-0">
                    <Wind className="w-3.5 h-3.5" />
                  </span>
                  <strong className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">{currentT("fertilizer")}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(weatherData.advisory.fertilizerGuidance, "fertilizer")}
                  className={`p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors ${speakingSection === "fertilizer" ? "text-emerald-600 animate-pulse bg-emerald-50" : ""}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{weatherData.advisory.fertilizerGuidance}</p>
            </div>

            {/* 4. Harvesting */}
            <div className="bg-white/60 hover:bg-white p-3.5 rounded-xl border border-slate-200/50 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-1.5 relative group">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="p-1 bg-amber-50 text-amber-600 rounded shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  <strong className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">{currentT("harvest")}</strong>
                </div>
                <button
                  type="button"
                  onClick={() => speakText(weatherData.advisory.harvestAdvisory, "harvest")}
                  className={`p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors ${speakingSection === "harvest" ? "text-emerald-600 animate-pulse bg-emerald-50" : ""}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">{weatherData.advisory.harvestAdvisory}</p>
            </div>

          </div>
        </div>
      ) : null}
    </div>
  );
}
