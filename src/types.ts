export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genres: string[];
  rating: number;
  trailerUrl: string;
  posterUrl: string;
  backgroundUrl: string;
  releaseYear: number;
  director: string;
  cast: string[];
  duration: string; // e.g. "2h 15m"
}

export type MovieMood = "Cyberpunk" | "Neo-Noir" | "Psychological" | "Space Opera" | "Retro-Future" | "Late Night Thrills" | "Sunday Morning Vibes";

export interface MovieCollection {
  id: string;
  title: string;
  description: string;
  movies: string[]; // movie IDs
  icon: string;
  accent: string;
}
