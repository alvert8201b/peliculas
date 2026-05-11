import { useLocation, useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Play, Star, Calendar, Clock, Share2, Heart, Plus } from "lucide-react";
import { Movie } from "../types";
import { cn } from "../lib/utils";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { getMoviesByMood } from "../services/geminiService";

export default function MovieDetailsView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(location.state?.movie || null);

  const [liked, setLiked] = useLocalStorage<string[]>("liked-movies", []);
  const [saved, setSaved] = useLocalStorage<string[]>("saved-movies", []);

  useEffect(() => {
    if (!movie && id) {
      // In a real app we'd fetch by ID, here we'll just get some and find or mock
      getMoviesByMood("Cyberpunk").then(movies => {
        const found = movies.find(m => m.id === id);
        if (found) setMovie(found);
      });
    }
  }, [id, movie]);

  if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-lowest">
        <div className="w-12 h-12 border-4 border-neon-magenta/20 border-t-neon-magenta rounded-full animate-spin" />
      </div>
    );
  }

  const isLiked = liked.includes(movie.id);
  const isSaved = saved.includes(movie.id);

  const toggleLike = () => {
    setLiked(prev => isLiked ? prev.filter(id => id !== movie.id) : [...prev, movie.id]);
  };

  const toggleSave = () => {
    setSaved(prev => isSaved ? prev.filter(id => id !== movie.id) : [...prev, movie.id]);
  };

  return (
    <div className="relative min-h-screen bg-background-lowest pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={movie.backgroundUrl} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-lowest via-background-lowest/40 to-transparent" />
        
        {/* Top Controls */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full glass-morphism flex items-center justify-center text-white">
              <Share2 size={20} />
            </button>
            <button 
              onClick={toggleLike}
              className={cn(
                "w-10 h-10 rounded-full glass-morphism flex items-center justify-center transition-all",
                isLiked ? "bg-neon-magenta text-on-primary" : "text-white"
              )}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.open(movie.trailerUrl, "_blank")}
            className="w-20 h-20 rounded-full bg-neon-magenta/20 backdrop-blur-xl border border-neon-magenta/50 flex items-center justify-center text-neon-magenta neon-glow-magenta"
          >
            <Play size={32} fill="currentColor" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-32 relative z-10 space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {movie.genres.map(genre => (
              <span key={genre} className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {genre}
              </span>
            ))}
          </div>
          
          <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tight text-white uppercase">{movie.title}</h1>
          
          <div className="flex items-center gap-6 text-sm text-slate-400 font-medium tracking-wide">
            <span className="flex items-center gap-1.5"><Star size={16} className="text-yellow-500 fill-yellow-500" /> {movie.rating}</span>
            <span className="flex items-center gap-1.5"><Calendar size={16} /> {movie.releaseYear}</span>
            <span className="flex items-center gap-1.5"><Clock size={16} /> {movie.duration}</span>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={toggleSave}
          className={cn(
            "w-full py-4 rounded-full font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
            isSaved 
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30" 
              : "bg-surface-container-high text-white hover:bg-surface-container-highest"
          )}
        >
          {isSaved ? <Plus className="rotate-45" /> : <Plus />}
          {isSaved ? "Saved to Watchlist" : "Add to My List"}
        </button>

        {/* Synopsis */}
        <div className="space-y-3">
          <h2 className="font-headline text-lg font-bold uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">Synopsis</h2>
          <p className="text-slate-300 leading-relaxed text-sm md:text-base">
            {movie.synopsis}
          </p>
        </div>

        {/* Cast & Crew */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-500">Director</h2>
            <p className="text-white font-medium">{movie.director}</p>
          </div>
          <div className="space-y-3">
            <h2 className="font-headline text-xs font-bold uppercase tracking-widest text-slate-500">Cast</h2>
            <div className="space-y-1">
              {movie.cast.map(actor => (
                <p key={actor} className="text-white text-sm font-medium">{actor}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Mock */}
        <div className="space-y-6 pt-4">
          <h2 className="font-headline text-xl font-bold">Similar Visions</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-shrink-0 w-32 aspect-[2/3] bg-surface-container-high rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
