import { Leaf, Users, Shield, Cpu } from "lucide-react";

export default function HeroHeader() {
  return (
    <header className="glassmorphism bg-gradient-to-r from-emerald-800/80 via-teal-950/85 to-emerald-950/80 text-white py-5 px-6 md:px-8 rounded-3xl shadow-lg border border-emerald-500/20 mb-6 relative overflow-hidden select-none animate-fade-in-up">
      {/* Decorative colored glow bubbles */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-teal-500/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-400/30 shadow-inner group">
              <Leaf className="w-5 h-5 text-emerald-300 animate-float" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-emerald-300">
                KrishiMitra AI Platform
              </h1>
            </div>
          </div>
          <p className="text-[11px] text-emerald-200/90 max-w-xl font-medium leading-relaxed">
            State-of-the-art dual-interface agricultural intelligence workspace. Experience a real-time synchronous connection loop between the 
            <span className="text-emerald-300 font-bold"> Mobile Farmer Applet</span> and the <span className="text-teal-300 font-bold"> Expert Pathology Panel</span>.
          </p>
        </div>

        {/* Dynamic connection and stats tags */}
        <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-sans font-semibold text-emerald-100/90 shrink-0">
          <div className="flex items-center gap-1.5 bg-emerald-950/40 py-1.5 px-3 rounded-xl border border-emerald-500/10 backdrop-blur-xs hover:border-emerald-500/25 transition">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini 3.5 Flash</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/40 py-1.5 px-3 rounded-xl border border-emerald-500/10 backdrop-blur-xs hover:border-emerald-500/25 transition">
            <Users className="w-3.5 h-3.5 text-teal-400" />
            <span>Live Sync Loop</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/40 py-1.5 px-3 rounded-xl border border-emerald-500/10 backdrop-blur-xs hover:border-emerald-500/25 transition">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pathology Diagnostics</span>
          </div>

          {/* Connection Pulse Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-500/10 py-1.5 px-3 rounded-xl border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-emerald-400 uppercase tracking-wider text-[8px] font-bold">Live Link</span>
          </div>
        </div>
      </div>
    </header>
  );
}
