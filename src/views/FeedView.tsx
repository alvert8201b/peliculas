import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Plus, Share2, Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMoviesByMood } from "../services/geminiService";
import { Movie } from "../types";
import { cn } from "../lib/utils";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function FeedView() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const data = await getMoviesByMood("Cyberpunk");
      setMovies(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollPos = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight;
    const index = Math.round(scrollPos / height);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4 bg-background-lowest">
        <div className="w-12 h-12 border-4 border-neon-magenta/20 border-t-neon-magenta rounded-full animate-spin" />
        <p className="font-headline text-neon-magenta animate-pulse tracking-widest uppercase text-sm">Initializing CineSwipe...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="h-screen overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
    >
      {movies.map((movie, index) => (
        <TrailerCard 
          key={movie.id} 
          movie={movie} 
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
}

function TrailerCard({ movie, isActive }: { movie: Movie; isActive: boolean; key?: any }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useLocalStorage<string[]>("liked-movies", []);
  const [saved, setSaved] = useLocalStorage<string[]>("saved-movies", []);

  const isLiked = liked.includes(movie.id);
  const isSaved = saved.includes(movie.id);

  const toggleLike = () => {
    setLiked(prev => isLiked ? prev.filter(id => id !== movie.id) : [...prev, movie.id]);
  };

  const toggleSave = () => {
    setSaved(prev => isSaved ? prev.filter(id => id !== movie.id) : [...prev, movie.id]);
  };

  return (
    <div className="relative h-screen w-full snap-start overflow-hidden">
      {/* Background Visual (Mock Trailer) */}
      <div className="absolute inset-0 bg-background-lowest">
        <img 
          src={movie.backgroundUrl} 
          alt={movie.title}
          className={cn(
            "w-full h-full object-cover transition-transform duration-[10000ms] ease-linear",
            isActive ? "scale-125" : "scale-100"
          )}
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-lowest via-transparent to-transparent opacity-90" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/40 to-transparent opacity-60" />
      </div>

      {/* Content Overlay */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute inset-0 flex flex-col justify-end px-6 pb-40"
      >
        <div className="max-w-md space-y-4">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20">
            <span className="text-[10px] font-bold tracking-widest text-neon-cyan uppercase">
              {movie.genres[0]} • {movie.releaseYear}
            </span>
          </div>

          <h1 className="font-headline text-5xl md:text-7xl font-bold leading-none tracking-tight text-white uppercase break-words">
            {movie.title}
          </h1>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-[90%] line-clamp-3">
            {movie.synopsis}
          </p>

          <div className="pt-4 flex items-center gap-4">
            <button 
              onClick={() => window.open(movie.trailerUrl, "_blank")}
              className="bg-gradient-to-br from-neon-magenta to-neon-magenta-dark text-on-primary font-bold px-8 py-4 rounded-full neon-glow-magenta transition-transform active:scale-95 flex items-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              Watch Trailer
            </button>
            <button 
              onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
              className="glass-morphism text-white border-white/10 px-6 py-4 rounded-full font-medium transition-transform active:scale-95 flex items-center gap-2"
            >
              <Info size={20} />
              Details
            </button>
          </div>
        </div>
      </motion.div>

      {/* Side Interactions */}
      <div className="absolute right-4 bottom-48 flex flex-col items-center gap-6 z-20">
        <InteractionButton 
          icon={<Heart size={28} className={isLiked ? "fill-neon-magenta text-neon-magenta" : ""} />} 
          label="Like" 
          onClick={toggleLike}
          active={isLiked}
        />
        <InteractionButton 
          icon={<Plus size={28} className={isSaved ? "text-neon-cyan" : ""} />} 
          label="Save" 
          onClick={toggleSave}
          active={isSaved}
        />
        <InteractionButton 
          icon={<Share2 size={28} />} 
          label="Share" 
          onClick={() => navigator.share?.({ title: movie.title, text: movie.synopsis, url: window.location.href })}
        />
      </div>
    </div>
  );
}

function InteractionButton({ 
  icon, 
  label, 
  onClick, 
  active 
}: { 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void,
  active?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <button 
        onClick={onClick}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center glass-morphism border-white/5 transition-all duration-300 active:scale-75",
          active ? "bg-white/10 border-white/20" : "hover:bg-white/5"
        )}
      >
        {icon}
      </button>
      <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{label}</span>
    </div>
  );
}
