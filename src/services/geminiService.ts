import { GoogleGenAI } from "@google/genai";
import { Movie } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are a cinematic expert and movie database assistant. 
Generate realistic but fictional or real movie data in JSON format for an app called CineSwipe. 
CineSwipe focuses on "Neon Noir", "Cyberpunk", and "Atmospheric" vibes.
Always return JSON.`;

export async function getMoviesByMood(mood: string): Promise<Movie[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 6 movies that fit the mood: "${mood}". 
      Return an array of objects matching this TypeScript interface:
      interface Movie {
        id: string;
        title: string;
        synopsis: string;
        genres: string[];
        rating: number;
        trailerUrl: string; // use sample vertical video URLs like "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" or similar
        posterUrl: string; // use placeholder image URLs: https://images.unsplash.com/...
        backgroundUrl: string;
        releaseYear: number;
        director: string;
        cast: string[];
        duration: string;
      }
      Focus on neon, atmospheric, and high-quality descriptions.`,
      config: {
         responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search or generate 5 movies related to "${query}". 
      Return an array of Move objects in JSON format.`,
      config: {
         responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}
