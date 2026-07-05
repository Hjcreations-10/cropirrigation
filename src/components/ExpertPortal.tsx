import { useState, useEffect, FormEvent } from "react";
import { 
  Users, AlertCircle, CheckCircle, Clock, RefreshCw, Send, ShieldAlert, 
  MapPin, Phone, MessageSquare, Database, FileText, Search, User, Sparkles,
  Volume2
} from "lucide-react";
import { DiseaseLog, CropLog, SmsLog, VoiceLog } from "../types";

interface ExpertPortalProps {
  diseaseLogs: DiseaseLog[];
  onExpertReplied: () => void;
}

export default function ExpertPortal({ diseaseLogs, onExpertReplied }: ExpertPortalProps) {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [expertReply, setExpertReply] = useState("");
  const [expertName, setExpertName] = useState("Dr. K. Swaminathan (Plant Pathologist)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"disease" | "crop" | "sms" | "voice">("disease");
  
  // Other logs state (for full observability)
  const [cropLogs, setCropLogs] = useState<CropLog[]>([]);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  const refreshExpertLogs = async () => {
    try {
      const fetchJson = async (url: string) => {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
          }
        } catch (err) {
          console.warn(`Failed to fetch ${url}:`, err);
        }
        return [];
      };

      const [crops, sms, voices] = await Promise.all([
        fetchJson("/api/logs/crop"),
        fetchJson("/api/logs/sms"),
        fetchJson("/api/logs/voice")
      ]);
      setCropLogs([...crops].reverse());
      setSmsLogs([...sms].reverse());
      setVoiceLogs([...voices].reverse());
    } catch (e) {
      console.error("Expert logs refresh failed:", e);
    }
  };

  useEffect(() => {
    refreshExpertLogs();
    const interval = setInterval(refreshExpertLogs, 5000); // refresh metadata every 5s
    return () => clearInterval(interval);
  }, []);

  // Sync selected log to first pending if none selected
  useEffect(() => {
    if (diseaseLogs.length > 0 && !selectedLogId) {
      const pending = diseaseLogs.find(log => log.status === "pending");
      if (pending) {
        setSelectedLogId(pending.id);
      } else {
        setSelectedLogId(diseaseLogs[0].id);
      }
    }
  }, [diseaseLogs]);

  const selectedLog = diseaseLogs.find(log => log.id === selectedLogId);

  const handleSubmitReply = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedLogId || !expertReply.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/logs/disease/${selectedLogId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertReply,
          expertName
        })
      });

      if (response.ok) {
        setExpertReply("");
        onExpertReplied(); // refresh parent states
        refreshExpertLogs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render crop leaf icon representation inside a high-tech microscopic focus screen
  const renderLeafImage = (photoId: string) => {
    const getLeafContent = () => {
      if (photoId === "rice_blast") {
        return { emoji: "🌾", title: "Rice Leaf Blast", desc: "Brown spindle lesions detected" };
      } else if (photoId === "tomato_early_blight") {
        return { emoji: "🍅", title: "Tomato Early Blight", desc: "Dark concentric ring necrosis" };
      } else if (photoId === "cotton_blight") {
        return { emoji: "☁️", title: "Cotton Angular Spot", desc: "Water-soaked leaf veins" };
      } else if (photoId === "healthy_wheat") {
        return { emoji: "🌿", title: "Healthy Wheat Leaf", desc: "Lush green standard layout" };
      } else {
        return { emoji: "📸", title: "Custom Image Upload", desc: "Farmer uploaded leaf photo" };
      }
    };

    const details = getLeafContent();

    return (
      <div className="relative w-full h-32 rounded-xl border border-emerald-500/20 bg-slate-900 overflow-hidden flex flex-col items-center justify-center p-3 text-center shadow-inner group">
        {/* Microscrope grid layout visual effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 rounded-full border border-emerald-500/10 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-dashed border-emerald-500/25"></div>
          </div>
        </div>

        {/* Microscope reticle corners */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-emerald-400"></div>
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-emerald-400"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-emerald-400"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-emerald-400"></div>

        <div className="text-4xl relative z-10 animate-float">{details.emoji}</div>
        <span className="text-[9.5px] uppercase font-mono font-bold text-emerald-300 mt-2 tracking-wider relative z-10">{details.title}</span>
        <p className="text-[8px] text-slate-400 leading-tight mt-0.5 relative z-10">{details.desc}</p>
      </div>
    );
  };

  return (
    <div className="glassmorphism rounded-3xl border border-emerald-500/20 shadow-xl overflow-hidden flex flex-col h-[720px] animate-fade-in-up">
      
      {/* Console Top Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-5 flex items-center justify-between border-b border-emerald-700/35">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-float">👨‍🔬</span>
            <h2 className="text-lg font-display font-extrabold text-white tracking-tight">KrishiMitra Expert Console</h2>
          </div>
          <p className="text-xs text-emerald-200/80 mt-0.5">National Crop Protection & Pathology Council Dashboard</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-extrabold tracking-wider bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-500/10">SECURE CLOUD ENGINE</span>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex bg-slate-50 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("disease")}
          className={`flex-1 py-3 px-4 font-display font-bold text-xs flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "disease" 
              ? "border-emerald-600 bg-white text-emerald-800 shadow-2xs font-extrabold" 
              : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Disease Logs ({diseaseLogs.filter(l => l.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("crop")}
          className={`flex-1 py-3 px-4 font-display font-bold text-xs flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "crop" 
              ? "border-emerald-600 bg-white text-emerald-800 shadow-2xs font-extrabold" 
              : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Soil Logs ({cropLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("voice")}
          className={`flex-1 py-3 px-4 font-display font-bold text-xs flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "voice" 
              ? "border-emerald-600 bg-white text-emerald-800 shadow-2xs font-extrabold" 
              : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>Voice Feed ({voiceLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sms")}
          className={`flex-1 py-3 px-4 font-display font-bold text-xs flex items-center justify-center gap-2 border-b-2 transition ${
            activeTab === "sms" 
              ? "border-emerald-600 bg-white text-emerald-800 shadow-2xs font-extrabold" 
              : "border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-600" />
          <span>SMS Gateway ({smsLogs.length})</span>
        </button>
      </div>

      {/* Main Console Body */}
      <div className="flex-1 overflow-hidden flex bg-slate-50/50">

        {/* 1. DISEASE TAB */}
        {activeTab === "disease" && (
          <>
            {/* Ticket List Panel (Left) */}
            <div className="w-85 border-r border-slate-200 flex flex-col bg-white">
              <div className="p-3 border-b border-slate-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter by farmer name or village..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {diseaseLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No farmer disease submissions registered yet.
                  </div>
                ) : (
                  diseaseLogs
                    .filter(log => {
                      if (!searchQuery) return true;
                      return log.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             log.village.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((log) => (
                      <button
                        key={log.id}
                        onClick={() => setSelectedLogId(log.id)}
                        className={`w-full p-3.5 text-left transition flex flex-col gap-1.5 border-l-4 ${
                          selectedLogId === log.id 
                            ? "bg-emerald-50/40 border-emerald-600" 
                            : "border-transparent hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-extrabold text-slate-800 text-xs truncate max-w-[130px]">{log.userName}</span>
                          <span className="text-[9px] text-slate-400 font-mono font-medium">{new Date(log.date).toLocaleTimeString()}</span>
                        </div>

                        <div className="text-[10px] text-slate-500 leading-tight">
                          <span className="font-bold text-slate-700">{log.diagnosis.disease}</span>
                          <span className="block mt-0.5 text-slate-400 font-medium">Village: {log.village}</span>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          <span className={`text-[9px] font-bold uppercase py-0.5 px-2 rounded-full ${
                            log.status === "pending" 
                              ? "bg-amber-50 text-amber-800 border border-amber-200/50" 
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200/50"
                          }`}>
                            {log.status === "pending" ? "Awaiting Advice" : "Resolved"}
                          </span>
                          <span className="text-[9px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold">
                            {log.diagnosis.confidence} Match
                          </span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Ticket details work area (Right) */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              {selectedLog ? (
                <div className="space-y-5 flex-1 animate-fade-in-up">
                  
                  {/* Farmer profile banner */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-600" />
                        <strong className="text-slate-800 text-sm font-extrabold">{selectedLog.userName}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-slate-500 text-[11px] font-semibold">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedLog.village}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {selectedLog.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] text-slate-400 uppercase font-mono font-extrabold tracking-wider">Ticket Registered</span>
                      <span className="text-[11px] font-bold text-slate-700">{new Date(selectedLog.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Diagnosis & leaf Image panel */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 space-y-1.5">
                      <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider block">Submitted Crop Leaf</span>
                      {renderLeafImage(selectedLog.photo)}
                    </div>

                    <div className="col-span-2 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-emerald-100/50 pb-2">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
                          <strong className="text-emerald-950 font-display font-bold">Gemini Vision Analysis</strong>
                        </div>
                        <span className="bg-emerald-600 text-white py-0.5 px-2 rounded-md font-extrabold text-[8px] uppercase tracking-wider">AI PRE-ANALYZED</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="block text-[8.5px] text-emerald-700 font-extrabold uppercase">Identified Disease</span>
                          <span className="font-bold text-emerald-950 text-[11px]">{selectedLog.diagnosis.disease}</span>
                        </div>
                        <div>
                          <span className="block text-[8.5px] text-emerald-700 font-extrabold uppercase">Pre-Analysis Confidence</span>
                          <span className="font-bold text-emerald-950 text-[11px]">{selectedLog.diagnosis.confidence}</span>
                        </div>
                      </div>

                      <div>
                        <span className="block text-[8.5px] text-emerald-700 font-extrabold uppercase">Observed Leaf Symptoms</span>
                        <p className="text-emerald-900/90 leading-relaxed text-[11px] mt-0.5 font-medium">{selectedLog.diagnosis.symptoms}</p>
                      </div>
                    </div>
                  </div>

                  {/* Standard auto-treatment schedule */}
                  <div className="bg-slate-100/60 p-3.5 rounded-xl border border-slate-200/50 text-xs">
                    <span className="block text-[8.5px] text-slate-400 font-extrabold uppercase tracking-wider">Standard AI-Suggested Treatment</span>
                    <p className="text-slate-600 leading-relaxed mt-1 font-medium">{selectedLog.diagnosis.treatment}</p>
                  </div>

                  {/* Scientist Resolution Advice Form */}
                  <div className="border-t border-slate-200/60 pt-4 mt-2 space-y-3">
                    <h4 className="font-display font-black text-slate-800 text-sm flex items-center gap-1.5">
                      <AlertCircle className="w-4.5 h-4.5 text-emerald-600" />
                      <span>Formulate Official Expert Advisory</span>
                    </h4>

                    {selectedLog.status === "pending" ? (
                      <form onSubmit={handleSubmitReply} className="space-y-3 text-xs animate-fade-in-up">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-slate-500 mb-1 font-semibold">Assigned Scientist / Advisor Name</label>
                            <select
                              value={expertName}
                              onChange={(e) => setExpertName(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              <option value="Dr. K. Swaminathan (Plant Pathologist)">Dr. K. Swaminathan (Plant Pathologist)</option>
                              <option value="Dr. Rajeshwari (Agronomist)">Dr. Rajeshwari (Agronomist)</option>
                              <option value="Dr. Anil Deshmukh (Soil Microbiologist)">Dr. Anil Deshmukh (Soil Microbiologist)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-500 mb-1 font-semibold">Detailed Expert Treatment Note & Recommendations</label>
                          <textarea
                            rows={3}
                            placeholder="Type specialized advisory note. Be encouraging, precise and provide clear dosage instructions..."
                            value={expertReply}
                            onChange={(e) => setExpertReply(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 font-medium"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-5 rounded-xl shadow-sm transition flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          {isSubmitting ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>Transmit Expert Resolution</span>
                        </button>
                      </form>
                    ) : (
                      <div className="bg-emerald-50/50 text-emerald-950 p-4 rounded-xl border border-emerald-200 space-y-2">
                        <div className="flex justify-between border-b border-emerald-100 pb-2">
                          <strong className="text-emerald-900">Advice Dispatched and Resolved</strong>
                          <span className="text-[10px] text-emerald-600 font-mono font-semibold">Dispatched: {new Date(selectedLog.repliedAt || "").toLocaleString()}</span>
                        </div>
                        <p className="leading-relaxed text-slate-700 italic font-medium">"{selectedLog.expertReply}"</p>
                        <span className="block text-[10px] text-emerald-800 font-bold mt-2">Dispatched by: {selectedLog.expertName}</span>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="my-auto text-center py-12 text-slate-400 font-medium">
                  Select a farmer disease log to formulate specialist feedback.
                </div>
              )}
            </div>
          </>
        )}

        {/* 2. CROP LOGS TAB */}
        {activeTab === "crop" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-display font-extrabold text-slate-800 text-sm">Soil Nutrient Predictor Records</h3>
              <span className="text-slate-400 font-mono text-[10.5px] font-extrabold bg-slate-100 px-2 py-0.5 rounded">HISTORIC ENTRIES: {cropLogs.length}</span>
            </div>

            <div className="space-y-3">
              {cropLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No soil samples analyzed yet.</p>
              ) : (
                cropLogs.map((log) => (
                  <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs grid grid-cols-4 gap-4 hover-card-premium">
                    <div className="col-span-1 space-y-1 border-r border-slate-100 pr-2">
                      <strong className="block text-slate-800 text-sm truncate font-extrabold">{log.userName}</strong>
                      <span className="text-[10.5px] text-slate-500 block truncate font-medium">{log.village}</span>
                      <span className="text-[9px] text-slate-400 font-mono block mt-1">{new Date(log.date).toLocaleString()}</span>
                    </div>

                    <div className="col-span-1 space-y-1 border-r border-slate-100 pr-2 font-semibold">
                      <span className="block text-[8px] text-slate-400 font-extrabold uppercase tracking-wider">Soil metrics</span>
                      <p className="text-slate-600">Type: <span className="font-bold text-slate-800">{log.soil.type}</span></p>
                      <p className="text-slate-600">pH Level: <span className="font-bold text-slate-800">{log.soil.ph}</span></p>
                      <div className="flex gap-2 text-[9.5px] text-slate-500 mt-1 font-mono font-extrabold">
                        <span className="text-emerald-700 bg-emerald-50 px-1 rounded">N:{log.soil.n}</span>
                        <span className="text-sky-700 bg-sky-50 px-1 rounded">P:{log.soil.p}</span>
                        <span className="text-amber-700 bg-amber-50 px-1 rounded">K:{log.soil.k}</span>
                      </div>
                    </div>

                    <div className="col-span-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/60 space-y-1 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-950 font-extrabold font-display text-[11px]">{log.recommendation.crop}</span>
                        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold border border-emerald-200/50">{log.recommendation.confidence} Confidence</span>
                      </div>
                      <p className="text-slate-600 leading-normal text-[10px] line-clamp-1 mt-1 font-medium"><span className="font-bold text-slate-700">Advice:</span> {log.recommendation.fertilizer}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-2 pt-1.5 border-t border-emerald-100/30 font-semibold">
                        <span>Yield: <strong className="text-slate-700">{log.recommendation.yield}</strong></span>
                        <span>Estimated Profit: <strong className="text-emerald-700 font-bold">{log.recommendation.profit}</strong></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 3. VOICE TAB */}
        {activeTab === "voice" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-display font-extrabold text-slate-800 text-sm">Interactive Voice Assistant Query stream</h3>
              <span className="text-slate-400 font-mono text-[10.5px] font-extrabold bg-slate-100 px-2 py-0.5 rounded">QUERIES: {voiceLogs.length}</span>
            </div>

            <div className="space-y-3">
              {voiceLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No voice interactions registered yet.</p>
              ) : (
                voiceLogs.map((log) => (
                  <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs space-y-2.5 hover-card-premium">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-100 pb-1.5 font-semibold">
                      <span className="font-bold text-slate-600">{log.userName} ({log.village})</span>
                      <div className="flex gap-2">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded uppercase font-bold tracking-wide border border-emerald-100">{log.language} Language</span>
                        <span className="font-mono mt-0.5">{new Date(log.date).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px] uppercase tracking-wider font-extrabold">Farmer Spoken Query</span>
                      <p className="text-slate-700 font-medium italic mt-0.5">"{log.query}"</p>
                    </div>
                    <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/50">
                      <span className="text-emerald-700 block text-[8px] uppercase tracking-wider font-extrabold">Assistant TTS Response</span>
                      <p className="text-slate-600 font-medium mt-1">"{log.reply}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 4. SMS TAB */}
        {activeTab === "sms" && (
          <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs animate-fade-in-up">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-display font-extrabold text-slate-800 text-sm">Automated SMS Gateway transactions</h3>
              <span className="text-slate-400 font-mono text-[10.5px] font-extrabold bg-slate-100 px-2 py-0.5 rounded">MESSAGES TRANSMITTED: {smsLogs.length}</span>
            </div>

            <div className="space-y-3">
              {smsLogs.length === 0 ? (
                <p className="text-slate-400 text-center py-12">No SMS transmissions recorded yet.</p>
              ) : (
                smsLogs.map((log) => (
                  <div key={log.id} className="bg-slate-900 text-slate-300 p-4 rounded-xl border border-slate-800 shadow-sm space-y-2.5">
                    <div className="flex justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5 font-semibold">
                      <span>Sender: <strong className="text-emerald-400">+{log.phone}</strong></span>
                      <span className="font-mono">{new Date(log.date).toLocaleTimeString()}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[8px] uppercase font-extrabold tracking-wider">Farmer Incoming Message</span>
                      <p className="text-slate-100 font-mono mt-1 font-semibold">{log.message}</p>
                    </div>

                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/40 text-emerald-400">
                      <span className="text-emerald-600 block text-[8px] uppercase font-extrabold tracking-wider">Outbound Gateway Response</span>
                      <p className="font-mono mt-1 font-medium">{log.reply}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
