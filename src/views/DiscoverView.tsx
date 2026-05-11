import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Search, ChevronRight, Hash } from "lucide-react";
import { getMoviesByMood, searchMovies } from "../services/geminiService";
import { Movie } from "../types";
import { cn } from "../lib/utils";
import { useNavigate } from "react-router-dom";

export default function DiscoverView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeMood, setActiveMood] = useState("Cyberpunk");
  const [moodMovies, setMoodMovies] = useState<Movie[]>([]);
  const [loadingMood, setLoadingMood] = useState(false);

  const moods = ["Cyberpunk", "Neo-Noir", "Psychological", "Space Opera", "Retro-Future"];

  useEffect(() => {
    async function load() {
      setLoadingMood(true);
      const data = await getMoviesByMood(activeMood);
      setMoodMovies(data);
      setLoadingMood(false);
    }
    load();
  }, [activeMood]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const data = await searchMovies(searchQuery);
    setResults(data);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen pt-4 px-6 space-y-8">
      {/* Search Header */}
      <div className="flex flex-col gap-4">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Explore</h1>
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-neon-magenta transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies, actors, vibes..."
            className="w-full bg-surface-container-high border-none rounded-full py-4 pl-12 pr-6 text-white placeholder-slate-500 focus:ring-2 focus:ring-neon-magenta/30 transition-all outline-none"
          />
        </form>
      </div>

      {/* Results or Discovery */}
      {searchQuery && results.length > 0 ? (
        <div className="space-y-6">
          <h2 className="font-headline text-xl font-bold text-slate-400 uppercase tracking-widest">Search Results</h2>
          <div className="grid grid-cols-2 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Mood Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold">Curated Vibes</h2>
            </div>
            <div className="flex overflow-x-auto gap-3 hide-scrollbar -mx-6 px-6">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => setActiveMood(mood)}
                  className={cn(
                    "flex-shrink-0 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300",
                    activeMood === mood 
                      ? "bg-neon-magenta text-on-primary shadow-lg shadow-neon-magenta/20" 
                      : "bg-surface-container-highest text-slate-400 hover:bg-surface-container-high"
                  )}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Results */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-2xl font-semibold">{activeMood}</h2>
              <span className="text-neon-magenta text-sm font-bold tracking-widest uppercase flex items-center gap-1 cursor-pointer hover:opacity-80">
                See All <ChevronRight size={16} />
              </span>
            </div>
            
            {loadingMood ? (
              <div className="grid grid-cols-2 gap-4 animate-pulse">
                {[1, 2, 4, 5].map(i => (
                  <div key={i} className="aspect-[2/3] bg-surface-container-high rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {moodMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })} />
                ))}
              </div>
            )}
          </div>

          {/* Editorial Section */}
          <section className="pb-12">
            <div className="relative h-64 rounded-3xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1542204113-e93526280436?auto=format&fit=crop&q=80&w=1080" 
                alt="Late night" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background-lowest via-background-lowest/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-8 space-y-2">
                <span className="text-neon-cyan text-[10px] font-bold uppercase tracking-widest">Editor's Choice</span>
                <h3 className="font-headline text-3xl font-bold max-w-[200px] leading-tight text-white uppercase">Midnight Echoes</h3>
                <p className="text-slate-400 text-xs max-w-[200px]">A dive into the world of auditory hallucinations and urban isolation.</p>
                <div className="pt-2">
                  <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-colors">Explore Collection</button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function MovieCard({ movie, onClick }: { movie: Movie; onClick: () => void; key?: any }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={() => { onClick(); }}
      className="relative aspect-[2/3] group rounded-2xl overflow-hidden cursor-pointer"
    >
      <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-4 left-4 right-4">
        <p className="font-headline text-sm font-bold leading-tight uppercase line-clamp-1">{movie.title}</p>
        <p className="text-slate-400 text-[10px] mt-1 uppercase font-bold tracking-wider">{movie.genres[0]} • {movie.releaseYear}</p>
      </div>
    </motion.div>
  );
}
