import { LanguageCode } from "../types";

export interface TranslationSet {
  loginTitle: string;
  loginSub: string;
  phoneLabel: string;
  phonePlaceholder: string;
  otpLabel: string;
  otpPlaceholder: string;
  sendOtp: string;
  verifyOtp: string;
  loginBtn: string;
  homeTitle: string;
  homeSub: string;
  cropRec: string;
  weatherAlert: string;
  diseaseDet: string;
  voiceAsst: string;
  smsSupport: string;
  expertPortal: string;
  profile: string;
  selectLang: string;
  
  // Crop Recommend form
  cropTitle: string;
  soilType: string;
  location: string;
  ph: string;
  groundwater: string;
  season: string;
  getRecommendation: string;
  analyzingSoil: string;
  
  // Crop Result
  bestCrop: string;
  alternatives: string;
  expectedYield: string;
  waterReq: string;
  fertilizerAdvice: string;
  profitEstimate: string;
  confidence: string;

  // Weather Advisory
  weatherTitle: string;
  condition: string;
  rainfall: string;
  wind: string;
  advisoryList: string;
  irrigationSugg: string;

  // Disease Detection
  diseaseTitle: string;
  diseaseSub: string;
  selectSample: string;
  uploadImage: string;
  diagnoseBtn: string;
  diagnosing: string;
  resultTitle: string;
  symptoms: string;
  treatment: string;
  expertRequired: string;
  expertWaiting: string;
  expertResolved: string;

  // Voice Assistant
  voiceTitle: string;
  voiceSub: string;
  askAssistant: string;
  tapToSpeak: string;
  voicePresets: string[];

  // SMS Support
  smsTitle: string;
  smsSub: string;
  smsPresets: string[];
}

export const translations: Record<LanguageCode, TranslationSet> = {
  en: {
    loginTitle: "KrishiMitra AI",
    loginSub: "Voice & SMS Agricultural Intelligence Platform",
    phoneLabel: "Phone Number",
    phonePlaceholder: "Enter 10-digit phone number",
    otpLabel: "One-Time Password (OTP)",
    otpPlaceholder: "Enter 4-digit OTP (e.g. 1234)",
    sendOtp: "Get OTP",
    verifyOtp: "Verify & Login",
    loginBtn: "Access Platform",
    homeTitle: "KrishiMitra Mobile",
    homeSub: "Welcome back, Farmer!",
    cropRec: "Crop Recommendation",
    weatherAlert: "Weather Advisory",
    diseaseDet: "Disease Detection",
    voiceAsst: "Voice Assistant",
    smsSupport: "SMS Support Desk",
    expertPortal: "Expert Escalation",
    profile: "Farmer Profile",
    selectLang: "Select Language",

    cropTitle: "Optimal Crop Predictor",
    soilType: "Soil Type",
    location: "Location / Village",
    ph: "Soil pH (3.0 - 9.0)",
    groundwater: "Groundwater Level",
    season: "Current Season",
    getRecommendation: "Get AI Recommendation",
    analyzingSoil: "Analyzing soil & climate metrics...",

    bestCrop: "Highly Recommended Crop",
    alternatives: "Suitable Alternatives",
    expectedYield: "Expected Yield",
    waterReq: "Water Requirement",
    fertilizerAdvice: "Fertilizer Schedule",
    profitEstimate: "Estimated Net Profit",
    confidence: "Confidence Score",

    weatherTitle: "Daily Weather Advisory",
    condition: "Condition",
    rainfall: "Rainfall Estimate",
    wind: "Wind Speed",
    advisoryList: "Today's Action Plan",
    irrigationSugg: "Irrigation & Chemical Guidance",

    diseaseTitle: "AI Leaf Doctor",
    diseaseSub: "Take a photo of an infected leaf to diagnose instantly",
    selectSample: "Or select a test leaf pattern below:",
    uploadImage: "Upload leaf image from camera",
    diagnoseBtn: "Analyze Infected Leaf",
    diagnosing: "Consulting plant pathology models...",
    resultTitle: "AI Diagnostic Report",
    symptoms: "Observed Symptoms",
    treatment: "Recommended Treatment",
    expertRequired: "Expert Escalation Required",
    expertWaiting: "Awaiting agricultural scientist's review...",
    expertResolved: "Expert Resolution Received!",

    voiceTitle: "Krishi Mitra Assistant",
    voiceSub: "Speak or ask in your native language",
    askAssistant: "Ask anything about crops, pests or water...",
    tapToSpeak: "Tap to Speak",
    voicePresets: [
      "When should I water my Paddy crops?",
      "Suggest organic fertilizer for Maize.",
      "How to prevent leaf rust in Wheat?"
    ],

    smsTitle: "SMS Support Simulation",
    smsSub: "Send text commands to shortcode 555-AI",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  te: {
    loginTitle: "కృషిమిత్ర AI",
    loginSub: "ధ్వని & SMS వ్యవసాయ సమాచార వేదిక",
    phoneLabel: "ఫోన్ నెంబర్",
    phonePlaceholder: "10 అంకెల ఫోన్ నెంబర్ నమోదు చేయండి",
    otpLabel: "వన్-టైమ్ పాస్‌వర్డ్ (OTP)",
    otpPlaceholder: "4 అంకెల OTP ని నమోదు చేయండి (ఉదా: 1234)",
    sendOtp: "OTP ని పొందండి",
    verifyOtp: "ధృవీకరించండి & లాగిన్ అవ్వండి",
    loginBtn: "ప్రవేశించండి",
    homeTitle: "కృషిమిత్ర మొబైల్",
    homeSub: "మరలా స్వాగతం, రైతు సోదరా!",
    cropRec: "పంట సిఫార్సు",
    weatherAlert: "వాతావరణ సలహా",
    diseaseDet: "పంట తెగులు గుర్తింపు",
    voiceAsst: "వాయిస్ అసిస్టెంట్",
    smsSupport: "SMS సహాయ కేంద్రం",
    expertPortal: "నిపుణుల సహాయం",
    profile: "రైతు ప్రొఫైల్",
    selectLang: "భాషను ఎంచుకోండి",

    cropTitle: "పంట సిఫార్సు కాలిక్యులేటర్",
    soilType: "నేల రకం",
    location: "ప్రదేశం / గ్రామం",
    ph: "మట్టి pH విలువ (3.0 - 9.0)",
    groundwater: "భూగర్భ జల మట్టం",
    season: "ప్రస్తుత కాలం",
    getRecommendation: "AI సిఫార్సు పొందండి",
    analyzingSoil: "మట్టి మరియు వాతావరణ విశ్లేషణ జరుగుతోంది...",

    bestCrop: "అత్యంత సిఫార్సు చేయబడిన పంట",
    alternatives: "ప్రత్యామ్నాయ పంటలు",
    expectedYield: "ఆశించిన దిగుబడి",
    waterReq: "నీటి అవసరం",
    fertilizerAdvice: "ఎరువుల ప్రణాళిక",
    profitEstimate: "అంచనా నికర లాభం",
    confidence: "విశ్వసనీయత స్కోరు",

    weatherTitle: "రోజువారీ వాతావరణ సలహా",
    condition: "వాతావరణం",
    rainfall: "వర్షపాతం అంచనా",
    wind: "గాలి వేగం",
    advisoryList: "నేటి కార్యాచరణ ప్రణాళిక",
    irrigationSugg: "నీటి పారుదల & రసాయన మార్గదర్శకత్వం",

    diseaseTitle: "AI ఆకు తెగులు నిపుణుడు",
    diseaseSub: "తక్షణ నిర్ధారణ కోసం సోకిన ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి",
    selectSample: "లేదా క్రింది పరీక్షా ఆకు నమూనాను ఎంచుకోండి:",
    uploadImage: "కెమెరా నుండి ఆకు చిత్రాన్ని అప్‌లోడ్ చేయండి",
    diagnoseBtn: "సోకిన ఆకును విశ్లేషించండి",
    diagnosing: "మొక్కల రోగనిర్ధారణ నమూనాల విశ్లేషణ జరుగుతోంది...",
    resultTitle: "AI వ్యాధి విశ్లేషణ నివేదిక",
    symptoms: "కనిపించిన లక్షణాలు",
    treatment: "సిఫార్సు చేయబడిన నివారణ చర్యలు",
    expertRequired: "నిపుణుల పర్యవేక్షణ అవసరం",
    expertWaiting: "వ్యవసాయ శాస్త్రవేత్త సమీక్ష కోసం వేచి ఉంది...",
    expertResolved: "నిపుణుల నుండి సలహా అందింది!",

    voiceTitle: "కృషిమిత్ర సహాయకుడు",
    voiceSub: "మీ మాతృభాషలో మాట్లాడండి లేదా అడగండి",
    askAssistant: "పంటలు, పురుగులు లేదా నీటి గురించి ఏదైనా అడగండి...",
    tapToSpeak: "మాట్లాడటానికి నొక్కండి",
    voicePresets: [
      "నా వరి పంటకు నీళ్లు ఎప్పుడు పెట్టాలి?",
      "మొక్కజొన్న పంటకు సేంద్రీయ ఎరువును సూచించండి.",
      "గోధుమలలో ఆకు తుప్పు తెగులును ఎలా నివారించాలి?"
    ],

    smsTitle: "SMS సహాయ అనుకరణ",
    smsSub: "555-AI కి మీ సందేశాన్ని పంపండి",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  hi: {
    loginTitle: "कृषिमित्र AI",
    loginSub: "ध्वनि एवं एसएमएस कृषि सूचना मंच",
    phoneLabel: "फ़ोन नंबर",
    phonePlaceholder: "10 अंकों का फ़ोन नंबर दर्ज करें",
    otpLabel: "वन-टाइम पासवर्ड (OTP)",
    otpPlaceholder: "4 अंकों का OTP दर्ज करें (जैसे: 1234)",
    sendOtp: "OTP प्राप्त करें",
    verifyOtp: "सत्यापित करें और लॉगिन करें",
    loginBtn: "मंच में प्रवेश करें",
    homeTitle: "कृषिमित्र मोबाइल",
    homeSub: "कृषिमित्र मंच पर आपका स्वागत है!",
    cropRec: "फसल सिफारिश",
    weatherAlert: "मौसम परामर्श",
    diseaseDet: "पत्ता रोग पहचान",
    voiceAsst: "ध्वनि सहायक",
    smsSupport: "एसएमएस सहायता डेस्क",
    expertPortal: "विशेषज्ञ सहायता",
    profile: "किसान प्रोफ़ाइल",
    selectLang: "भाषा चुनें",

    cropTitle: "अनुकूल फसल सिफारिश कैलकुलेटर",
    soilType: "मिट्टी का प्रकार",
    location: "स्थान / गाँव",
    ph: "मिट्टी का पीएच (3.0 - 9.0)",
    groundwater: "भूजल स्तर",
    season: "वर्तमान मौसम",
    getRecommendation: "AI सिफारिश प्राप्त करें",
    analyzingSoil: "मिट्टी और जलवायु संकेतकों का विश्लेषण जारी है...",

    bestCrop: "अत्यधिक अनुशंसित फसल",
    alternatives: "उपयुक्त वैकल्पिक फसलें",
    expectedYield: "अपेक्षित उपज",
    waterReq: "पानी की आवश्यकता",
    fertilizerAdvice: "उर्वरक कार्यक्रम",
    profitEstimate: "अनुमानित शुद्ध लाभ",
    confidence: "सटीकता स्कोर",

    weatherTitle: "दैनिक मौसम परामर्श",
    condition: "मौसम की स्थिति",
    rainfall: "वर्षा अनुमान",
    wind: "हवा की गति",
    advisoryList: "आज की कार्य योजना",
    irrigationSugg: "सिंचाई एवं कीटनाशक निर्देश",

    diseaseTitle: "AI पत्ता चिकित्सक",
    diseaseSub: "त्वरित जांच के लिए रोगग्रस्त पत्ते की तस्वीर अपलोड करें",
    selectSample: "या नीचे दिए गए परीक्षण पत्ते के नमूने चुनें:",
    uploadImage: "कैमरे से पत्ते की तस्वीर अपलोड करें",
    diagnoseBtn: "संक्रमित पत्ते का विश्लेषण करें",
    diagnosing: "वनस्पति रोग मॉडल से विश्लेषण जारी है...",
    resultTitle: "AI रोग निदान रिपोर्ट",
    symptoms: "दिखने वाले लक्षण",
    treatment: "अनुशंसित उपचार और समाधान",
    expertRequired: "विशेषज्ञ परामर्श आवश्यक है",
    expertWaiting: "कृषि वैज्ञानिक की समीक्षा की प्रतीक्षा है...",
    expertResolved: "विशेषज्ञ समाधान प्राप्त हुआ!",

    voiceTitle: "कृषिमित्र सहायक",
    voiceSub: "अपनी मातृभाषा में बोलें या पूछें",
    askAssistant: "फसल, कीट या पानी के बारे में कुछ भी पूछें...",
    tapToSpeak: "बोलने के लिए टैप करें",
    voicePresets: [
      "धान की फसल में पानी कब देना चाहिए?",
      "मक्का के लिए जैविक खाद की सिफारिश करें।",
      "गेहूं में पत्ती के जंग रोग को कैसे रोकें?"
    ],

    smsTitle: "एसएमएस सहायता सिम्युलेटर",
    smsSub: "लघु कोड 555-AI पर संदेश भेजें",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  ta: {
    loginTitle: "கிருஷ்மித்ரா AI",
    loginSub: "குரல் மற்றும் SMS விவசாய நுண்ணறிவுத் தளம்",
    phoneLabel: "தொலைபேசி எண்",
    phonePlaceholder: "10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்",
    otpLabel: "ஒரு முறை கடவுச்சொல் (OTP)",
    otpPlaceholder: "4 இலக்க OTP ஐ உள்ளிடவும் (எ.கா: 1234)",
    sendOtp: "OTP பெறவும்",
    verifyOtp: "சரிபார்த்து உள்நுழையவும்",
    loginBtn: "தளத்தை அணுகவும்",
    homeTitle: "கிருஷ்மித்ரா மொபைல்",
    homeSub: "மீண்டும் வருக, விவசாயி!",
    cropRec: "பயிர் பரிந்துரை",
    weatherAlert: "வானிலை ஆலோசனை",
    diseaseDet: "இலை நோய் கண்டறிதல்",
    voiceAsst: "குரல் உதவியாளர்",
    smsSupport: "SMS ஆதரவு மையம்",
    expertPortal: "நிபுணர் உதவி",
    profile: "விவசாயி சுயவிவரம்",
    selectLang: "மொழியைத் தேர்ந்தெடுக்கவும்",

    cropTitle: "உகந்த பயிர் கணிப்பான்",
    soilType: "மண் வகை",
    location: "இடம் / கிராமம்",
    ph: "மண் pH (3.0 - 9.0)",
    groundwater: "நிலத்தடி நீர் மட்டம்",
    season: "தற்போதைய பருவம்",
    getRecommendation: "AI பரிந்துரை பெறவும்",
    analyzingSoil: "மண் மற்றும் காலநிலை அளவீடுகளை பகுப்பாய்வு செய்கிறது...",

    bestCrop: "மிகவும் பரிந்துரைக்கப்படும் பயிர்",
    alternatives: "பொருத்தமான மாற்றுகள்",
    expectedYield: "எதிர்பார்க்கப்படும் மகசூல்",
    waterReq: "நீர் தேவை",
    fertilizerAdvice: "உர அட்டவணை",
    profitEstimate: "மதிப்பிடப்பட்ட நிகர லாபம்",
    confidence: "நம்பிக்கை மதிப்பெண்",

    weatherTitle: "தினசரி வானிலை ஆலோசனை",
    condition: "நிலைமை",
    rainfall: "மழைப்பொழிவு மதிப்பீடு",
    wind: "காற்றின் வேகம்",
    advisoryList: "இன்றைய செயல் திட்டம்",
    irrigationSugg: "நீர் பாசனம் மற்றும் இரசாயன வழிகாட்டுதல்",

    diseaseTitle: "AI இலை மருத்துவர்",
    diseaseSub: "உடனடியாகக் கண்டறிய பாதிக்கப்பட்ட இலையின் புகைப்படத்தை எடுக்கவும்",
    selectSample: "அல்லது கீழே உள்ள சோதனை இலை வடிவத்தைத் தேர்ந்தெடுக்கவும்:",
    uploadImage: "கேமராவிலிருந்து இலை படத்தை பதிவேற்றவும்",
    diagnoseBtn: "பாதிக்கப்பட்ட இலையை பகுப்பாய்வு செய்யவும்",
    diagnosing: "தாவர நோயியல் மாதிரிகளை கலந்தாலோசிக்கிறது...",
    resultTitle: "AI கண்டறிதல் அறிக்கை",
    symptoms: "கண்டறியப்பட்ட அறிகுறிகள்",
    treatment: "பரிந்துரைக்கப்பட்ட சிகிச்சை",
    expertRequired: "நிபுணர் ஆலோசனை தேவை",
    expertWaiting: "விவசாய விஞ்ஞானியின் மதிப்பாய்வுக்காக காத்திருக்கிறது...",
    expertResolved: "நிபுணர் தீர்வு பெறப்பட்டது!",

    voiceTitle: "கிருஷ்மித்ரா உதவியாளர்",
    voiceSub: "உங்கள் சொந்த மொழியில் பேசவும் அல்லது கேட்கவும்",
    askAssistant: "பயிர்கள், பூச்சிகள் அல்லது நீர் பற்றி எதையும் கேளுங்கள்...",
    tapToSpeak: "பேச தட்டவும்",
    voicePresets: [
      "எனது நெல் பயிர்களுக்கு எப்போது தண்ணீர் பாய்ச்ச வேண்டும்?",
      "சோளத்திற்கு இயற்கை உரத்தைப் பரிந்துரைக்கவும்.",
      "கோதுமையில் இலை துரு நோயை எவ்வாறு தடுப்பது?"
    ],

    smsTitle: "SMS ஆதரவு உருவகப்படுத்துதல்",
    smsSub: "555-AI என்ற குறுகிய குறியீட்டுக்கு குறுஞ்செய்தி அனுப்பவும்",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  kn: {
    loginTitle: "ಕೃಷಿಮಿತ್ರ AI",
    loginSub: "ಧ್ವನಿ ಮತ್ತು SMS ಕೃಷಿ ಮಾಹಿತಿ ವೇದಿಕೆ",
    phoneLabel: "ದೂರವಾಣಿ ಸಂಖ್ಯೆ",
    phonePlaceholder: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ",
    otpLabel: "ಒನ್-ಟೈಮ್ ಪಾಸ್‌ವರ್ಡ್ (OTP)",
    otpPlaceholder: "4 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ (ಉದಾ: 1234)",
    sendOtp: "OTP ಪಡೆಯಿರಿ",
    verifyOtp: "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ",
    loginBtn: "ವೇದಿಕೆ ಪ್ರವೇಶಿಸಿ",
    homeTitle: "ಕೃಷಿಮಿತ್ರ ಮೊಬೈಲ್",
    homeSub: "ಸ್ವಾಗತ, ರೈತ ಬಾಂಧವರೇ!",
    cropRec: "ಬೆಳೆ ಶಿಫಾರಸು",
    weatherAlert: "ಹವಾಮಾನ ಸಲಹೆ",
    diseaseDet: "ಎಲೆ ರೋಗ ಪತ್ತೆ",
    voiceAsst: "ಧ್ವನಿ ಸಹಾಯಕ",
    smsSupport: "SMS ಸಹಾಯ ಕೇಂದ್ರ",
    expertPortal: "ತಜ್ಞರ ನೆರವು",
    profile: "ರೈತರ ಪ್ರೊಫೈಲ್",
    selectLang: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",

    cropTitle: "ಸೂಕ್ತ ಬೆಳೆ ಮುನ್ಸೂಚಕ",
    soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
    location: "ಸ್ಥಳ / ಗ್ರಾಮ",
    ph: "ಮಣ್ಣಿನ pH (3.0 - 9.0)",
    groundwater: "ಅಂತರ್ಜಲ ಮಟ್ಟ",
    season: "ಪ್ರಸ್ತುತ ಹಂಗಾಮು",
    getRecommendation: "AI ಶಿಫಾರಸು ಪಡೆಯಿರಿ",
    analyzingSoil: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನದ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...",

    bestCrop: "ಹೆಚ್ಚು ಶಿಫಾರಸು ಮಾಡಲಾದ ಬೆಳೆ",
    alternatives: "ಸೂಕ್ತ ಪರ್ಯಾಯಗಳು",
    expectedYield: "ನಿರೀಕ್ಷಿತ ಇಳುವರಿ",
    waterReq: "ನೀರಿನ ಅವಶ್ಯಕತೆ",
    fertilizerAdvice: "ಗೊಬ್ಬರ ನೀಡುವ ವೇಳಾಪಟ್ಟಿ",
    profitEstimate: "ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ",
    confidence: "ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್",

    weatherTitle: "ದೈನಂದिन ಹವಾಮಾನ ಸಲಹೆ",
    condition: "ಹವಾಮಾನ ಸ್ಥಿತಿ",
    rainfall: "ಮಳೆಯ ಮುನ್ಸೂಚನೆ",
    wind: "ಗಾಳಿಯ ವೇಗ",
    advisoryList: "ಇಂದಿನ ಕ್ರಿಯಾ ಯೋಜನೆ",
    irrigationSugg: "ನೀರಾವरी ಮತ್ತು ರಾಸಾಯನಿಕ ಬಳಕೆ ಮಾರ್ಗದರ್ಶನ",

    diseaseTitle: "AI ಎಲೆ ವೈದ್ಯ",
    diseaseSub: "ತಕ್ಷಣದ ತಪಾಸಣೆಗಾಗಿ ಪೀಡಿತ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    selectSample: "ಅಥವಾ ಕೆಳಗಿನ ಪರೀಕ್ಷಾ ಎಲೆಯ ಮಾದರಿಯನ್ನು ಆರಿಸಿ:",
    uploadImage: "ಕ್ಯಾಮೆರಾದಿಂದ ಎಲೆಯ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    diagnoseBtn: "ಸೋಂಕಿತ ಎಲೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    diagnosing: "ಸಸ್ಯ ರೋಗ ಮಾದರಿಗಳ ವಿಶ್ಲೇಷಣೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ...",
    resultTitle: "AI ರೋಗನಿರ್ಣಯ ವರದಿ",
    symptoms: "ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು",
    treatment: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಚಿಕಿತ್ಸೆ",
    expertRequired: "ತಜ್ಞರ ನೆರವು ಅಗತ್ಯವಿದೆ",
    expertWaiting: "ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳ ವಿಮರ್ಶೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    expertResolved: "ತಜ್ಞರಿಂದ ಪರಿಹಾರ ಲಭಿಸಿದೆ!",

    voiceTitle: "ಕೃಷಿಮಿತ್ರ ಸಹಾಯಕ",
    voiceSub: "ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಕೇಳಿ",
    askAssistant: "ಬೆಳೆಗಳು, ಕೀಟಗಳು ಅಥವಾ ನೀರಿನ ಬಗ್ಗೆ ಏನನ್ನಾದರೂ ಕೇಳಿ...",
    tapToSpeak: "ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    voicePresets: [
      "ನನ್ನ ಭತ್ತದ ಬೆಳೆಗೆ ಯಾವಾಗ ನೀರು ಹರಿಸಬೇಕು?",
      "ಮೆಕ್ಕೆಜೋಳಕ್ಕೆ ಸಾವಯವ ಗೊಬ್ಬರವನ್ನು ಶಿಫಾರಸು ಮಾಡಿ.",
      "ಗೋಧಿಯಲ್ಲಿ ಎಲೆ ತುಕ್ಕು ರೋಗವನ್ನು ತಡೆಗಟ್ಟುವುದು ಹೇಗೆ?"
    ],

    smsTitle: "SMS ಸಹಾಯ ಅನುಕರಣೆ",
    smsSub: "ಕಿರು ಕೋಡ್ 555-AI ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  ml: {
    loginTitle: "कृषिമിത്ര AI",
    loginSub: "വോയ്സ് & എസ്എംഎസ് കാർഷിക വിവര പ്ലാറ്റ്ഫോം",
    phoneLabel: "ഫോൺ നമ്പർ",
    phonePlaceholder: "10 അക്ക ഫോൺ നമ്പർ നൽകുക",
    otpLabel: "വൺ-ടൈം പാസ്‌വേഡ് (OTP)",
    otpPlaceholder: "4 അക്ക OTP നൽകുക (ഉദാ: 1234)",
    sendOtp: "OTP നേടുക",
    verifyOtp: "പരിശോധിച്ച് ലോഗിൻ ചെയ്യുക",
    loginBtn: "പ്ലാറ്റ്ഫോം പ്രവേശിക്കുക",
    homeTitle: "കൃഷിമിത്ര മൊബൈൽ",
    homeSub: "സ്വാഗതം, കർഷക സുഹൃത്തേ!",
    cropRec: "വിള ശുപാർശ",
    weatherAlert: "കാലാവസ്ഥാ നിർദ്ദേശം",
    diseaseDet: "ഇല രോഗനിർണ്ണയം",
    voiceAsst: "വോയ്സ് അസിസ്റ്റന്റ്",
    smsSupport: "എസ്എംഎസ് സഹായ കേന്ദ്രം",
    expertPortal: "വിദഗ്ദ്ധ സഹாயം",
    profile: "കർഷക പ്രൊഫൈൽ",
    selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക",

    cropTitle: "അനുയോജ്യമായ വിള പ്രവചനം",
    soilType: "മണ്ണിന്റെ തരം",
    location: "സ്ഥലം / ഗ്രാമം",
    ph: "മണ്ണിന്റെ pH (3.0 - 9.0)",
    groundwater: "ഭൂഗർഭ ജലനിരപ്പ്",
    season: "നിലവിലെ സീസൺ",
    getRecommendation: "AI ശുപാർശ നേടുക",
    analyzingSoil: "മണ്ണും കാലാവസ്ഥാ സൂചകങ്ങളും വിശകലനം ചെയ്യുന്നു...",

    bestCrop: "ഏറ്റവും അനുയോജ്യമായ വിള",
    alternatives: "മറ്റ് അനുയോജ്യമായ വിളകൾ",
    expectedYield: "പ്രതീക്ഷിക്കുന്ന വിളവ്",
    waterReq: "ആവശ്യമായ വെള്ളം",
    fertilizerAdvice: "വളപ്രയോഗ സമയം",
    profitEstimate: "പ്രതീക്ഷിക്കുന്ന അറ്റാദായം",
    confidence: "കൃത്യത നിരക്ക്",

    weatherTitle: "ദിനപത്ര കാലാവസ്ഥാ നിർദ്ദേശം",
    condition: "കാലാവസ്ഥാ സ്ഥിതി",
    rainfall: "മഴയുടെ സാധ്യത",
    wind: "കാറ്റിന്റെ വേഗത",
    advisoryList: "ഇന്നത്തെ പ്രവർത്തന പദ്ധതി",
    irrigationSugg: "ജലസേചനവും കീടനാശിനി നിർദ്ദേശങ്ങളും",

    diseaseTitle: "AI ഇല ഡോക്ടർ",
    diseaseSub: "ഉടൻ രോഗനിർണ്ണയത്തിനായി രോഗബാധിത ഇലയുടെ ഫോട്ടോ എടുക്കുക",
    selectSample: "അല്ലെങ്കിൽ താഴെയുള്ള പരീക്ഷണ ഇല മാതൃക തിരഞ്ഞെടുക്കുക:",
    uploadImage: "ക്യാമറയിൽ നിന്ന് ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക",
    diagnoseBtn: "ഇല വിശകലനം ചെയ്യുക",
    diagnosing: "വിള രോഗ മാതൃകകൾ വിശകലനം ചെയ്യുന്നു...",
    resultTitle: "AI രോഗനിർണ്ണയ റിപ്പോർട്ട്",
    symptoms: "കണ്ടെത്തിയ ലಕ್ಷಣങ്ങൾ",
    treatment: "ശുപാർശ ചെയ്യുന്ന ചികിത്സ",
    expertRequired: "വിദഗ്ദ്ധ പര്യവേക്ഷണം ആവശ്യമാണ്",
    expertWaiting: "കാർഷിക ശാസ്ത്രജ്ഞന്റെ അവലോകനത്തിനായി കാത്തിരിക്കുന്നു...",
    expertResolved: "വിദഗ്ദ്ധ പരിഹാരം ലഭിച്ചു!",

    voiceTitle: "കൃഷിമിത്ര അസിസ്റ്റന്റ്",
    voiceSub: "നിങ്ങളുടെ മാതൃഭാഷയിൽ സംസാരിക്കുകയോ ചോദിക്കുകയോ ചെയ്യുക",
    askAssistant: "വിളകൾ, കീടങ്ങൾ, ജലസേചനം എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കാം...",
    tapToSpeak: "സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക",
    voicePresets: [
      "ഞാൻ എപ്പോഴാണ് നെല്ലിന് നനയ്ക്കേണ്ടത്?",
      "ചോളത്തിന് അനുയോജ്യമായ ജൈവവളം നിർദ്ദേശിക്കുക.",
      "ഗോതമ്പിലെ ഇല തുരുമ്പ് രോഗം എങ്ങനെ തടയാം?"
    ],

    smsTitle: "എസ്എംഎസ് സഹായ സിമുലേറ്റർ",
    smsSub: "555-AI എന്ന നമ്പറിലേക്ക് മെസ്സേജ് അയക്കുക",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  mr: {
    loginTitle: "कृषिमित्र AI",
    loginSub: "व्हॉइस आणि एसएमएस कृषी माहिती मंच",
    phoneLabel: "फोन नंबर",
    phonePlaceholder: "१० अंकी फोन नंबर प्रविष्ट करा",
    otpLabel: "वन-टाइम पासवर्ड (OTP)",
    otpPlaceholder: "४ अंकी OTP प्रविष्ट करा (उदा: 1234)",
    sendOtp: "OTP मिळवा",
    verifyOtp: "सत्यापित करा आणि लॉगिन करा",
    loginBtn: "मंचामध्ये प्रवेश करा",
    homeTitle: "कृषिमित्र मोबाईल",
    homeSub: "स्वागत आहे, शेतकरी बंधूंनो!",
    cropRec: "पीक शिफारस",
    weatherAlert: "हवामान सल्ला",
    diseaseDet: "पानावरील रोग ओळखणे",
    voiceAsst: "व्हॉइस असिस्टंट",
    smsSupport: "एसएमएस मदत केंद्र",
    expertPortal: "तज्ञांची मदत",
    profile: "शेतकरी प्रोफाइल",
    selectLang: "भाषा निवडा",

    cropTitle: "अनुकूल पीक शिफारस कॅल्क्युलेटर",
    soilType: "मातीचा प्रकार",
    location: "स्थान / गाव",
    ph: "मातीचा पीएच (3.0 - 9.0)",
    groundwater: "भूजल पातळी",
    season: "सध्याचा हंगाम",
    getRecommendation: "AI शिफारस मिळवा",
    analyzingSoil: "माती आणि हवामान घटकांचे विश्लेषण सुरू आहे...",

    bestCrop: "अत्यंत शिफारस केलेले पीक",
    alternatives: "योग्य पर्यायी पिके",
    expectedYield: "अपेक्षित उत्पादन",
    waterReq: "पाण्याची आवश्यकता",
    fertilizerAdvice: "खत व्यवस्थापन वेळापत्रक",
    profitEstimate: "अंदाजे निव्वळ नफा",
    confidence: "अचूकता स्कोअर",

    weatherTitle: "दैनिक हवामान सल्ला",
    condition: "हवामान स्थिती",
    rainfall: "वर्षा अंदाज",
    wind: "वाऱ्याचा वेग",
    advisoryList: "आजची कार्य योजना",
    irrigationSugg: "सिंचन आणि रासायनिक खतांचे मार्गदर्शन",

    diseaseTitle: "AI पान डॉक्टर",
    diseaseSub: "त्वरित तपासणीसाठी बाधित पानाचा फोटो काढा",
    selectSample: "किंवा खालीलपैकी चाचणी पान निवडा:",
    uploadImage: "कॅमेरा मधून पानाचा फोटो अपलोड करा",
    diagnoseBtn: "बाधित पानाचे विश्लेषण करा",
    diagnosing: "वनस्पती रोग मॉडेलद्वारे विश्लेषण सुरू आहे...",
    resultTitle: "AI रोग निदान अहवाल",
    symptoms: "दिसणारी लक्षणे",
    treatment: "शिफारस केलेले उपचार आणि उपाय",
    expertRequired: "तज्ञ सल्ला आवश्यक आहे",
    expertWaiting: "कृषी वैज्ञानिकांच्या पुनरावलोकनाची प्रतीक्षा आहे...",
    expertResolved: "तज्ञांकडून उपाय प्राप्त झाला!",

    voiceTitle: "कृषिमित्र सहाय्यक",
    voiceSub: "तुमच्या मातृभाषेत बोला किंवा विचारा",
    askAssistant: "पीक, कीटक किंवा पाण्याबद्दल काहीही विचारा...",
    tapToSpeak: "बोलण्यासाठी टॅप करा",
    voicePresets: [
      "माझ्या भात पिकाला कधी पाणी द्यावे?",
      "मक्यासाठी सेंद्रिय खताची शिफारस करा.",
      "गव्हातील तांबेरा रोग कसा रोखावा?"
    ],

    smsTitle: "एसएमएस मदत सिम्युलेटर",
    smsSub: "लघु कोड 555-AI वर संदेश पाठवा",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  bn: {
    loginTitle: "কৃষি মিত্র AI",
    loginSub: "ভয়েস এবং এসএমএস কৃষি তথ্য কেন্দ্র",
    phoneLabel: "ফোন নম্বর",
    phonePlaceholder: "১০ অঙ্কের ফোন নম্বর লিখুন",
    otpLabel: "ওয়ান-টাইম পাসওয়ার্ড (OTP)",
    otpPlaceholder: "৪ অঙ্কের OTP লিখুন (যেমন: 1234)",
    sendOtp: "OTP পান",
    verifyOtp: "যাচাই করুন এবং লগইন করুন",
    loginBtn: "প্ল্যাটফর্মে প্রবেশ করুন",
    homeTitle: "কৃষি মিত্র মোবাইল",
    homeSub: "স্বাগতম, কৃষক ভাই!",
    cropRec: "ফসল সুপারিশ",
    weatherAlert: "আবহাওয়া পরামর্শ",
    diseaseDet: "পাতার রোগ শনাক্তকরণ",
    voiceAsst: "ভয়েস অ্যাসিস্ট্যান্ট",
    smsSupport: "এসএমএস সহায়তা ডেস্ক",
    expertPortal: "विशेषज्ञ सहायता",
    profile: "কৃষক প্রোফাইল",
    selectLang: "ভাষা নির্বাচন করুন",

    cropTitle: "সেরা ফসল নির্বাচক",
    soilType: "মাটির ধরন",
    location: "স্থান / গ্রাম",
    ph: "মাটির pH (3.0 - 9.0)",
    groundwater: "ভূগর্ভস্থ জলের স্তর",
    season: "বর্তমান ঋতু",
    getRecommendation: "AI সুপারিশ পান",
    analyzingSoil: "মাটি এবং আবহাওয়া বিশ্লেষণ করা হচ্ছে...",

    bestCrop: "অত্যন্ত প্রস্তাবিত ফসল",
    alternatives: "উপযুক্ত বিকল্প ফসল",
    expectedYield: "প্রত্যাশিত ফলন",
    waterReq: "জলের প্রয়োজন",
    fertilizerAdvice: "সার প্রয়োগের সূচী",
    profitEstimate: "আনুমানিক নেট লাভ",
    confidence: "নির্ভুলতার হার",

    weatherTitle: "দৈনিক আবহাওয়া পরামর্শ",
    condition: "আবহাওয়ার অবস্থা",
    rainfall: "বৃষ্টিপাতের পূর্বাভাস",
    wind: "বাতাসের গতিবেগ",
    advisoryList: "আজকের কর্ম পরিকল্পনা",
    irrigationSugg: "সেচ এবং কীটনাশক নির্দেশিকা",

    diseaseTitle: "AI পাতার ডাক্তার",
    diseaseSub: "তাত্ক্ষণিক রোগ নির্ণয়ের জন্য আক্রান্ত পাতার ছবি তুলুন",
    selectSample: "অথবা নিচে দেওয়া পরীক্ষার পাতার নমুনা চয়ন করুন:",
    uploadImage: "ক্যামেরা থেকে পাতার ছবি আপলোড করুন",
    diagnoseBtn: "আক্রান্ত পাতা বিশ্লেষণ করুন",
    diagnosing: "উদ্ভিদ রোগ নির্ণয় মডেল বিশ্লেষণ করছে...",
    resultTitle: "AI রোগ নির্ণয় রিপোর্ট",
    symptoms: "লক্ষ্য করা লক্ষণসমূহ",
    treatment: "প্রস্তাবিত প্রতিকার এবং চিকিৎসা",
    expertRequired: "বিশেষজ্ঞের পরামর্শ প্রয়োজন",
    expertWaiting: "কৃষি বিজ্ঞানীর পর্যালোচনার জন্য অপেক্ষা করা হচ্ছে...",
    expertResolved: "বিশেষজ্ঞের সমাধান পাওয়া গেছে!",

    voiceTitle: "কৃষি মিত্র সহকারী",
    voiceSub: "আপনার নিজের ভাষায় কথা বলুন বা জিজ্ঞাসা করুন",
    askAssistant: "ফসল, কীটপতঙ্গ বা জল সম্পর্কে যেকোনো কিছু জিজ্ঞাসা করুন...",
    tapToSpeak: "কথা বলতে আলতো চাপুন",
    voicePresets: [
      "ধান চাষে কখন জল দেওয়া উচিত?",
      "ভুট্টার জন্য জৈব সারের সুপারিশ করুন।",
      "গমের পাতার মরচে রোগ কীভাবে প্রতিরোধ করব?"
    ],

    smsTitle: "এসএমএস সহায়তা সিমুলেটর",
    smsSub: "শর্ট কোড 555-AI তে বার্তা পাঠান",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  gu: {
    loginTitle: "કૃષિમિત્ર AI",
    loginSub: "વોઇસ અને એસએમએસ કૃષિ માહિતી મંચ",
    phoneLabel: "ફોન નંબર",
    phonePlaceholder: "10 અંકનો ફોન નંબર દાખલ કરો",
    otpLabel: "વન-ટાઇમ પાસવર્ડ (OTP)",
    otpPlaceholder: "4 અંકનો OTP દાખલ કરો (દા.ત: 1234)",
    sendOtp: "OTP મેળવો",
    verifyOtp: "ચકાસો અને લોગિન કરો",
    loginBtn: "મંચ પર પ્રવેશ કરો",
    homeTitle: "કૃષિમિત્ર મોબાઇલ",
    homeSub: "સ્વાગત છે, ખેડૂત મિત્રો!",
    cropRec: "પાકની ભલામણ",
    weatherAlert: "હવામાન સલાહ",
    diseaseDet: "પર્ણ રોગની ઓળખ",
    voiceAsst: "વોઇસ આસિસ્ટન્ટ",
    smsSupport: "એસએમએસ સહાય ડેસ્ક",
    expertPortal: "નિષ્ણાતોની મદદ",
    profile: "ખેડૂત પ્રોફાઇલ",
    selectLang: "ભાષા પસંદ કરો",

    cropTitle: "શ્રેષ્ઠ પાક ભલામણ કેલ્ક્યુલેટર",
    soilType: "જમીનનો પ્રકાર",
    location: "સ્થળ / ગામ",
    ph: "જમીનનો pH (3.0 - 9.0)",
    groundwater: "ભૂગર્ભ જળ સ્તર",
    season: "વર્તમાન ઋતુ",
    getRecommendation: "AI ભલામણ મેળવો",
    analyzingSoil: "જમીન અને હવામાન પરિબળોનું વિશ્લેષણ ચાલુ છે...",

    bestCrop: "ખૂબ જ ભલામણ કરેલ પાક",
    alternatives: "યોગ્ય વૈકલ્પિક પાકો",
    expectedYield: "અપેક્ષિત ઉત્પાદન",
    waterReq: "પાણીની જરૂરિયાત",
    fertilizerAdvice: "ખાતર વ્યવસ્થાપન સમયપત્રક",
    profitEstimate: "અંદાજિત ચોખ્ખો નફો",
    confidence: "ચોકસાઈ સ્કોર",

    weatherTitle: "દૈનિક હવામાન સલાહ",
    condition: "હવામાન સ્થિતિ",
    rainfall: "વરસાદની આગાહી",
    wind: "પવનની ગતિ",
    advisoryList: "આજની કાર્ય યોજના",
    irrigationSugg: "સિંચાઈ અને જંતુનાશકો વિશે માર્ગદર્શન",

    diseaseTitle: "AI પાંદડાના ડૉક્ટર",
    diseaseSub: "ત્વરિત તપાસ માટે રોગિષ્ઠ પાંદડાનો ફોટો પાડો",
    selectSample: "અથવા નીચે આપેલા પરીક્ષણ પાંદડાના નમૂદા પસંદ કરો:",
    uploadImage: "કેમેરા માંથી પાંદડાનો ફોટો અપલોડ કરો",
    diagnoseBtn: "રોગિષ્ઠ પાંદડાનું વિશ્લેષણ કરો",
    diagnosing: "વનસ્પતિ રોગ વિજ્ઞાન મોડલ વિશ્લેષણ કરી રહ્યું છે...",
    resultTitle: "AI રોગ નિદાન અહેવાલ",
    symptoms: "જોવા મળેલા લક્ષણો",
    treatment: "ભલામણ કરેલ સારવાર અને ઉપાયો",
    expertRequired: "નિષ્ણાત સલાહ જરૂરી છે",
    expertWaiting: "કૃષિ વૈજ્ઞાનિકની સમીક્ષાની રાહ જોવાઈ રહી છે...",
    expertResolved: "નિષ્ણાતો તરફથી ઉકેલ પ્રાપ્ત થયો!",

    voiceTitle: "કૃષિમિત્ર સહાયક",
    voiceSub: "તમારી માતૃભાષામાં બોલો અથવા પૂછો",
    askAssistant: "પાક, જંતુઓ અથવા પાણી વિશે કંઈપણ પૂછો...",
    tapToSpeak: "બોલવા માટે ટેપ કરો",
    voicePresets: [
      "મારા ડાંગરના પાકને ક્યારે પાણી આપવું જોઈએ?",
      "મકાઈ માટે જૈવિક ખાતરની ભલામણ કરો.",
      "ઘઉંમાં પાનનો ગેરુ રોગ કેવી રીતે અટકાવવો?"
    ],

    smsTitle: "એસએમએસ સહાય સિમ્યુલેટર",
    smsSub: "લઘુ કોડ 555-AI પર સંદેશ મોકલો",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  pa: {
    loginTitle: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ AI",
    loginSub: "ਵੌਇਸ ਅਤੇ ਐਸਐਮਐਸ ਖੇਤੀਬਾੜੀ ਸੂਚਨਾ ਪਲੇਟਫਾਰਮ",
    phoneLabel: "ਫ਼ੋਨ ਨੰਬਰ",
    phonePlaceholder: "10-ਅੰਕਾਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ",
    otpLabel: "ਵਨ-ਟਾਈਮ ਪਾਸਵਰਡ (OTP)",
    otpPlaceholder: "4-ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ (ਜਿਵੇਂ: 1234)",
    sendOtp: "OTP ਪ੍ਰਾਪਤ ਕਰੋ",
    verifyOtp: "ਸਤਿਆਪਿਤ ਕਰੋ ਅਤੇ ਲੋਗਇਨ ਕਰੋ",
    loginBtn: "ਪਲੇਟਫਾਰਮ ਵਿੱਚ ਪ੍ਰਵੇਸ਼ ਕਰੋ",
    homeTitle: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਮੋਬਾਈਲ",
    homeSub: "ਜੀ ਆਇਆਂ ਨੂੰ, ਕਿਸਾਨ ਵੀਰੋ!",
    cropRec: "ਫਸਲ ਦੀ ਸਿਫਾਰਸ਼",
    weatherAlert: "ਮੌਸਮ ਸੰਬੰਧੀ ਸਲਾਹ",
    diseaseDet: "ਪੱਤਿਆਂ ਦੀ ਬਿਮਾਰੀ ਦੀ ਪਛਾਣ",
    voiceAsst: "ਵੌਇਸ ਅਸਿਸਟੈਂਟ",
    smsSupport: "ਐਸਐਮਐਸ ਸਹਾਇਤਾ ਡੈਸਕ",
    expertPortal: "ਤਕਨੀਕੀ ਸਹਾਇਤਾ",
    profile: "ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ",
    selectLang: "ਭਾਸ਼ਾ ਚੁਣੋ",

    cropTitle: "ਸਰਵੋਤਮ ਫਸਲ ਚੋਣਕਾਰ",
    soilType: "ਮਿੱਟੀ ਦੀ ਕਿਸਮ",
    location: "ਸਥਾਨ / ਪਿੰਡ",
    ph: "ਮਿੱਟੀ ਦਾ pH (3.0 - 9.0)",
    groundwater: "ਜ਼ਮੀਨ ਹੇਠਲੇ ਪਾਣੀ ਦਾ ਪੱਧਰ",
    season: "ਮੌਜੂਦਾ ਮੌਸਮ",
    getRecommendation: "AI ਸਿਫਾਰਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
    analyzingSoil: "ਮਿੱਟੀ ਅਤੇ ਮੌਸਮ ਦੇ ਤੱਤਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਜਾਰੀ ਹੈ...",

    bestCrop: "ਬਹੁਤ ਜ਼ਿਆਦਾ ਸਿਫਾਰਸ਼ ਕੀਤੀ ਫਸਲ",
    alternatives: "ਢੁਕਵੀਆਂ ਵਿਕਲਪਿਕ ਫਸਲਾਂ",
    expectedYield: "ਉਮੀਦ ਕੀਤੀ ਉਪਜ",
    waterReq: "ਪਾਣੀ ਦੀ ਲੋੜ",
    fertilizerAdvice: "ਖਾਦ ਦੀ ਵਰਤੋਂ ਦਾ ਸਮਾਂ-ਸਾਰਣੀ",
    profitEstimate: "ਅੰਦਾਜ਼ਨ ਸ਼ੁੱਧ ਮੁਨਾਫਾ",
    confidence: "ਸ਼ੁੱਧਤਾ ਸਕੋਰ",

    weatherTitle: "ਰੋਜ਼ਾਨਾ ਮੌਸਮ ਸਲਾਹ",
    condition: "ਮੌਸम ਦੀ ਸਥਿਤੀ",
    rainfall: "ਮੀਂਹ ਦੀ ਭਵਿੱਖਬਾਣੀ",
    wind: "ਹਵਾ ਦੀ ਗਤੀ",
    advisoryList: "ਅੱਜ ਦੀ ਕਾਰਜ ਯੋਜਨਾ",
    irrigationSugg: "ਸਿੰਚਾਈ ਅਤੇ ਕੀਟਨਾਸ਼ਕਾਂ ਸੰਬੰधी ਮਾਰਗਦਰਸ਼ਨ",

    diseaseTitle: "AI ਪੱਤਾ ਡਾਕਟਰ",
    diseaseSub: "ਤੁਰੰਤ ਜਾਂਚ ਲਈ ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਦੀ ਫੋਟो ਖਿੱਚੋ",
    selectSample: "ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਟੈਸਟ ਪੱਤੇ ਦੇ ਨਮੂਨੇ ਚੁਣੋ:",
    uploadImage: "ਕੈਮਰੇ ਤੋਂ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
    diagnoseBtn: "ਪ੍ਰਭਾਵਿਤ ਪੱਤੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ",
    diagnosing: "ਪੌਦਿਆਂ ਦੇ ਰੋਗ ਮਾਡਲਾਂ ਦੁਆਰਾ ਵਿਸ਼ਲੇਸ਼ਣ ਜਾਰੀ ਹੈ...",
    resultTitle: "AI ਰੋਗ ਨਿਦਾਨ ਰਿਪੋਰਟ",
    symptoms: "ਦਿਸਣ ਵਾਲੇ ਲੱਛਣ",
    treatment: "ਸਿਫਾਰਸ਼ੀ ਇਲਾਜ ਅਤੇ ਹੱਲ",
    expertRequired: "ਮਾਹਿਰ ਦੀ ਸਲਾਹ ਜ਼ਰૂਰੀ ਹੈ",
    expertWaiting: "ਖੇਤੀਬਾੜੀ ਵਿਗਿਆਨੀ ਦੀ ਸਮੀਖਿਆ ਦੀ ਉਡੀਕ ਹੈ...",
    expertResolved: "ਮਾਹਿਰ ਵੱਲੋਂ ਹੱਲ ਪ੍ਰਾਪत ਹੋਇਆ!",

    voiceTitle: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ ਸਹਾਇਕ",
    voiceSub: "ਆਪਣੀ ਮਾਤ੍ਰ ਭਾਸ਼ਾ ਵਿੱਚ ਬੋਲੋ ਜਾਂ ਪੁੱਛੋ",
    askAssistant: "ਫਸਲ, ਕੀੜੇ ਜਾਂ ਪਾਣੀ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ...",
    tapToSpeak: "ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ",
    voicePresets: [
      "ਮੈਨੂੰ ਝੋਨੇ ਦੀ ਫਸਲ ਨੂੰ ਪਾਣੀ ਕਦੋਂ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ?",
      "ਮੱਕੀ ਲਈ ਜੈਵਿਕ ਖਾਦ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ।",
      "ਕਣਕ ਵਿੱਚ ਪੱਤਿਆਂ ਦੀ ਕੁੰਗੀ ਰੋਗ ਨੂੰ ਕਿਵੇਂ ਰੋਕਿਆ ਜਾਵੇ?"
    ],

    smsTitle: "ਐਸਐਮਐਸ ਸਹਾਇਤਾ ਸਿਮੂਲੇਟਰ",
    smsSub: "ਸ਼ਾਰਟ ਕੋਡ 555-AI 'ਤੇ ਸੁਨੇਹਾ ਭੇਜੋ",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  },
  or: {
    loginTitle: "କୃଷିମିତ୍ର AI",
    loginSub: "ଭଏସ୍ ଏବଂ ଏସଏମଏସ କୃଷି ସୂଚନା ମଞ୍ଚ",
    phoneLabel: "ଫୋନ୍ ନମ୍ବର",
    phonePlaceholder: "10-ଅଙ୍କ ବିଶିଷ୍ଟ ଫୋନ୍ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ",
    otpLabel: "ୱାନ୍-ଟାଇମ୍ ପାସୱାର୍ଡ (OTP)",
    otpPlaceholder: "4-ଅଙ୍କ ବିଶିଷ୍ଟ OTP ପ୍ରବେଶ କରନ୍ତୁ (ଯେପରି: 1234)",
    sendOtp: "OTP ପ୍ରାପ୍ତ କରନ୍ତୁ",
    verifyOtp: "ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ଲଗଇନ୍ କରନ୍ତୁ",
    loginBtn: "ମଞ୍ଚରେ ପ୍ରବେଶ କରନ୍ତୁ",
    homeTitle: "କୃଷିମିତ୍ର ମୋବାଇଲ୍",
    homeSub: "ସ୍ୱାଗତ, ଚାଷୀ ଭାଇ!",
    cropRec: "ଫସଲ ସୁପାରିଶ",
    weatherAlert: "ପାଣିପାଗ ପରାମର୍ଶ",
    diseaseDet: "ପତ୍ର ରୋଗ ଚିହ୍ନଟ",
    voiceAsst: "ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ",
    smsSupport: "ଏସଏମଏସ ସହାୟତା କେନ୍ଦ୍ର",
    expertPortal: "ବିଶେଷଜ୍ଞ ସହାୟତା",
    profile: "ଚାଷୀ ପ୍ରୋଫାଇଲ୍",
    selectLang: "ଭାଷା ଚୟନ କରନ୍ତୁ",

    cropTitle: "ଉପଯୁକ୍ତ ଫସଲ ଚୟନକାରୀ",
    soilType: "ମାଟିର ପ୍ରକାର",
    location: "ସ୍ଥାନ / ଗ୍ରାମ",
    ph: "ମାଟିର pH (3.0 - 9.0)",
    groundwater: "ଭୂତଳ ଜଳ ସ୍ତର",
    season: "ବର୍ଣ୍ଣମାନର ଋତୁ",
    getRecommendation: "AI ସୁପାରିଶ ପ୍ରାପ୍ତ କରନ୍ତୁ",
    analyzingSoil: "ମାଟି ଏବଂ ପାଣିପାଗର ବିଶ୍ଳେଷଣ ଚାଲିଛି...",

    bestCrop: "ଅତ୍ୟଧିକ ସୁପାରିଶ କରାଯାଇଥିବା ଫସଲ",
    alternatives: "ଉପଯୁକ୍ତ ବିକଳ୍ପ ଫସଲ",
    expectedYield: "ଆଶା କରାଯାଉଥିବା ଅମଳ",
    waterReq: "ଜଳ ଆବଶ୍ୟକତା",
    fertilizerAdvice: "ସାର ପ୍ରୟୋଗ ସମୟସୂଚୀ",
    profitEstimate: "ଆନୁମାନିକ ଶୁଦ୍ଧ ଲାଭ",
    confidence: "ସଠିକତା ସ୍କୋର",

    weatherTitle: "ଦୈନିକ ପାଣିପାଗ ପରାମର୍ଶ",
    condition: "ପାଣିପାଗ ସ୍ଥିତି",
    rainfall: "ବର୍ଷାର ପୂର୍ବାନୁମାନ",
    wind: "ପବନର ବେଗ",
    advisoryList: "ଆଜିର କାର୍ଯ୍ୟ ଯୋଜନା",
    irrigationSugg: "ଜଳସେਚନ ଏବଂ କୀଟନାଶକ ପ୍ରୟୋગ ମାର୍ଗଦର୍ଶନ",

    diseaseTitle: "AI ପତ୍ର ଡାକ୍ତର",
    diseaseSub: "ତୁରନ୍ତ ଯାଞ୍ચ ପାଇଁ ରୋଗାକ୍ରାନ୍ତ ପତ୍ରର ଫଟୋ ଉଠାନ୍ତୁ",
    selectSample: "କିମ୍ବା ନିମ୍ନଲିଖିତ ପରୀକ୍ଷା ପତ୍ର ନମୁନା ବାଛନ୍ତୁ:",
    uploadImage: "କ୍ୟାମେରାରୁ ପତ୍ର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତು",
    diagnoseBtn: "ରୋଗାକ୍ରାନ୍ତ ପତ୍ରର ବିଶ୍ଳେଷଣ କରନ୍ତು",
    diagnosing: "ଉଦ୍ଭିଦ ରୋଗ ନିଦାନ ମଡେଲ୍ ଦ୍ୱାରା ବିଶ୍ଳେଷଣ ଚାଲିଛି...",
    resultTitle: "AI ରୋଗ ନିଦାନ ରିପୋର୍ଟ",
    symptoms: "ଦେଖାଯାଇଥିବା ଲକ୍ଷଣ",
    treatment: "ସୁପାରિଶ କରାଯାଇଥିବା ପ୍ରତିକାର",
    expertRequired: "ବିଶେଷଜ୍ଞ ପରାମର୍ଶ ଆବଶ୍ୟକ",
    expertWaiting: "କୃଷି ବୈଜ୍ଞାନିକଙ୍କ ସମୀକ୍ଷାକୁ ଅପେક્ષା କରାଯାଇଛି...",
    expertResolved: "ବିଶେଷଜ୍ଞଙ୍କ ଠାରୁ ସମାଧାନ ମିଳିଲା!",

    voiceTitle: "କୃଷିମିତ୍ର ସହାୟକ",
    voiceSub: "ଆପଣଙ୍କ ମାତୃଭାଷାରେ କୁହନ୍ତୁ କିମ୍ବା ପଚାରନ୍ତୁ",
    askAssistant: "ଫସล, କୀଟ କିମ୍ବା ଜଳ ବିଷୟରେ କିଛି ବି ପଚାରନ୍ତୁ...",
    tapToSpeak: "କହିବା ପାଇଁ ଟ୍ୟାପ୍ କରନ୍ତು",
    voicePresets: [
      "ମୋର ଧାନ ଫସଲରେ କେବେ ଜଳସେଚନ କରିବା ଉଚିତ୍?",
      "ମକା ପାଇଁ ଜୈବିକ ସାର ସୁପାରିଶ କରନ୍ତୁ।",
      "ଗହମରେ ପତ୍ର କଳଙ୍କି ରୋଗ କିପରି ପ୍ରତିହତ କରିବେ?"
    ],

    smsTitle: "ଏସଏମଏସ ସହାୟତା ସିମୁଲେଟର୍",
    smsSub: "ସର୍ଟ କୋଡ୍ 555-AI କୁ ବାର୍ତ୍ତା ପଠାନ୍ତୁ",
    smsPresets: [
      "HELP",
      "WEATHER KUPPAM",
      "CROP MAIZE"
    ]
  }
};
