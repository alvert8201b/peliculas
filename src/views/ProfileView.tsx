import React from "react";
import { motion } from "motion/react";
import { Settings, Heart, Plus, ChevronRight, UserCircle } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export default function ProfileView() {
  const navigate = useNavigate();
  const [liked] = useLocalStorage<string[]>("liked-movies", []);
  const [saved] = useLocalStorage<string[]>("saved-movies", []);

  return (
    <div className="min-h-screen pt-4 px-6 space-y-10">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan p-1">
            <div className="w-full h-full rounded-full bg-background-lowest flex items-center justify-center text-white overflow-hidden">
              <UserCircle size={48} className="text-slate-700" />
            </div>
          </div>
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight uppercase">Cinematic Soul</h1>
            <p className="text-slate-500 text-xs font-bold tracking-widest uppercase">Pro Member • Est. 2024</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center text-slate-400">
          <Settings size={20} />
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Stat count={liked.length} label="Likes" />
        <Stat count={saved.length} label="Saved" />
        <Stat count={24} label="Seen" />
      </div>

      {/* Lists */}
      <div className="space-y-4 pt-4">
        <ListSection 
          title="Watchlist" 
          count={saved.length} 
          icon={<Plus className="text-neon-cyan" />}
          gradient="from-neon-cyan/20 to-transparent"
        />
        <ListSection 
          title="Favorites" 
          count={liked.length} 
          icon={<Heart className="text-neon-magenta" />}
          gradient="from-neon-magenta/20 to-transparent"
        />
      </div>

      {/* Settings Options */}
      <div className="space-y-2 pt-6">
        <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Account Settings</h3>
        <Option label="App Preferences" />
        <Option label="Notification Center" />
        <Option label="Help & Support" />
        <Option label="Sign Out" variant="danger" />
      </div>
    </div>
  );
}

function Stat({ count, label }: { count: number, label: string }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-3xl bg-surface-container-high/40 border border-white/5">
      <span className="text-2xl font-black text-white">{count}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
    </div>
  );
}

function ListSection({ title, count, icon, gradient }: { title: string, count: number, icon: React.ReactNode, gradient: string }) {
  return (
    <div className={cn(
      "relative p-6 rounded-3xl overflow-hidden group border border-white/5 flex items-center justify-between cursor-pointer active:scale-95 transition-transform",
      "bg-gradient-to-br", gradient
    )}>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="font-headline font-bold text-white uppercase">{title}</h4>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{count} Movies</p>
        </div>
      </div>
      <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
    </div>
  );
}

function Option({ label, variant }: { label: string, variant?: "danger" }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 cursor-pointer transition-colors group">
      <span className={cn(
        "font-medium tracking-wide",
        variant === "danger" ? "text-red-400" : "text-slate-300"
      )}>{label}</span>
      <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
    </div>
  );
}
