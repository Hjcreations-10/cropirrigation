import { useState, useEffect, useRef } from "react";
import HeroHeader from "./components/HeroHeader";
import MobileSimulator from "./components/MobileSimulator";
import ExpertPortal from "./components/ExpertPortal";
import WeatherAdvisory from "./components/WeatherAdvisory";
import { User, DiseaseLog } from "./types";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [diseaseLogs, setDiseaseLogs] = useState<DiseaseLog[]>([]);
  const [expertRepliedAlert, setExpertRepliedAlert] = useState<string | null>(null);
  
  // Keep track of resolved log IDs seen by the client to trigger real-time notifications
  const seenResolvedLogsRef = useRef<Set<string>>(new Set());

  // Check database users / auto-restore user if stored in session
  useEffect(() => {
    const savedPhone = localStorage.getItem("krishi_user_phone");
    if (savedPhone) {
      fetch(`/api/users/${savedPhone}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("User not found");
        })
        .then(user => {
          setCurrentUser(user);
        })
        .catch(() => {
          localStorage.removeItem("krishi_user_phone");
        });
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem("krishi_user_phone", user.phone);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("krishi_user_phone");
    setExpertRepliedAlert(null);
  };

  // Fetch disease logs
  const fetchDiseaseLogs = async () => {
    try {
      const res = await fetch("/api/logs/disease");
      if (res.ok) {
        const logs: DiseaseLog[] = await res.json();
        
        // Reverse array to put newest logs on top
        const reversedLogs = [...logs].reverse();
        setDiseaseLogs(reversedLogs);

        // Check for new resolutions for current user to trigger alerts
        if (currentUser) {
          reversedLogs.forEach(log => {
            if (
              log.phone === currentUser.phone && 
              log.status === "resolved" && 
              log.expertReply && 
              !seenResolvedLogsRef.current.has(log.id)
            ) {
              // Trigger farmer alert
              setExpertRepliedAlert(log.expertReply);
              seenResolvedLogsRef.current.add(log.id);
            } else if (log.status === "resolved") {
              // Ensure we record it so it doesn't alert in the future
              seenResolvedLogsRef.current.add(log.id);
            }
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch disease logs:", err);
    }
  };

  // Initial fetch and real-time polling loop
  useEffect(() => {
    fetchDiseaseLogs();
    const interval = setInterval(fetchDiseaseLogs, 3000); // Poll every 3s for live loop updates
    return () => clearInterval(interval);
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#F0FDF4] text-[#064E3B] p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Banner Platform Header */}
        <HeroHeader />

        {/* Dual Panel workspace bento layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Simulated Mobile Smartphone */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-white p-4 rounded-3xl border border-slate-100 shadow-lg relative">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Farmer Portal Interface
                </span>
                {currentUser && (
                  <button 
                    onClick={handleLogout}
                    className="text-[10px] text-red-500 hover:underline font-bold uppercase cursor-pointer"
                  >
                    Logout Device
                  </button>
                )}
              </div>
              
              <MobileSimulator 
                currentUser={currentUser}
                onLogin={handleLogin}
                diseaseLogs={diseaseLogs}
                onNewDiseaseLogSubmitted={fetchDiseaseLogs}
                expertRepliedAlert={expertRepliedAlert}
                onClearExpertAlert={() => setExpertRepliedAlert(null)}
              />
            </div>
          </div>

          {/* Right panel: Weather Advisory & Expert Portal */}
          <div className="lg:col-span-7 space-y-6">
            <WeatherAdvisory 
              selectedLanguage={currentUser?.language || "en"}
              userVillage={currentUser?.village}
            />
            <ExpertPortal 
              diseaseLogs={diseaseLogs}
              onExpertReplied={fetchDiseaseLogs}
            />
          </div>

        </div>

        {/* Developer footer */}
        <footer className="text-center text-[10px] text-slate-400 font-medium py-6 border-t border-slate-200/50">
          🌱 KrishiMitra AI Agricultural Workspace Platform • Empowering smallholder farmers with voice-activated AI advice
        </footer>

      </div>
    </div>
  );
}
