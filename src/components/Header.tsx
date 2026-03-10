import { Bell, User, Sprout } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
          <Sprout size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          AgriScan AI
        </h1>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
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
        <button className="hidden p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
          <Bell size={18} />
        </button>
        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
