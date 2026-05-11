import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { PlayCircle, Compass, User } from "lucide-react";
import { cn } from "../lib/utils";

export default function Layout() {
  const location = useLocation();
  const isFeed = location.pathname === "/feed";

  return (
    <div className="relative min-h-screen bg-background-lowest flex flex-col max-w-2xl mx-auto overflow-hidden shadow-2xl shadow-black">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50",
        "glass-morphism rounded-full px-8 py-4 flex justify-between items-center shadow-2xl transition-all duration-500",
        isFeed ? "bg-black/20" : "bg-surface-dim/70"
      )}>
        <NavItem 
          to="/feed" 
          icon={<PlayCircle size={24} />} 
          label="Feed" 
          active={location.pathname === "/feed"}
        />
        <NavItem 
          to="/discover" 
          icon={<Compass size={24} />} 
          label="Discover" 
          active={location.pathname === "/discover"}
        />
        <NavItem 
          to="/profile" 
          icon={<User size={24} />} 
          label="Profile" 
          active={location.pathname === "/profile"}
        />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <NavLink to={to} className="flex flex-col items-center gap-1 group relative">
      <div className={cn(
        "relative transition-all duration-300",
        active ? "text-neon-magenta scale-110" : "text-slate-400 group-hover:text-slate-200"
      )}>
        {active && (
          <div className="absolute inset-0 bg-neon-magenta/20 blur-md rounded-full scale-150 animate-pulse" />
        )}
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-bold tracking-wide transition-colors",
        active ? "text-neon-magenta" : "text-slate-500 group-hover:text-slate-300"
      )}>
        {label}
      </span>
    </NavLink>
  );
}
