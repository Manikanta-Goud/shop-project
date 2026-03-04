import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — changes very rarely, cache aggressively
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Animation library — large, keep separate
          "vendor-motion": ["framer-motion"],
          // Supabase client
          "vendor-supabase": ["@supabase/supabase-js"],
          // Auth library
          "vendor-clerk": ["@clerk/clerk-react"],
          // Data fetching
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
    // Warn if any chunk exceeds 600kb
    chunkSizeWarningLimit: 600,
  },
}));
