import { Bell, User, Sprout } from "lucide-react";
import { CircularText } from "./CircularText";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="w-full bg-black/80 backdrop-blur-md border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 15, scale: 1.1 }}
          className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Sprout size={22} strokeWidth={2.5} />
        </motion.div>
        
        <div className="flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white mt-0.5"
            style={{ backgroundSize: '200% auto', animation: 'shine 3s linear infinite' }}
          >
            AgriScan <span className="text-emerald-500">AI</span>
          </motion.h1>
          <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mt-1.5">
            From Leaf to Insight — Powered by AgriScan AI
          </p>
        </div>
        
        <div className="ml-4 hidden sm:block">
          <CircularText text="AGRISCAN AI • PREMIUM • " radius={22} fontSize="7px" color="#10b981" speed={8} />
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <a href="#" className="hover:text-emerald-600 transition-colors">
          {/* My Crops */}
        </a>
        <a href="#" className="hover:text-emerald-600 transition-colors">
          {/* History */}
        </a>
        <a href="#" className="hover:text-emerald-600 transition-colors">
          {/* Advisory */}
        </a>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden p-2 bg-zinc-900 text-emerald-500 rounded-full hover:bg-zinc-800 transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 bg-zinc-900 text-emerald-500 rounded-full hover:bg-zinc-800 transition-colors">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
