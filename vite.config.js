import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from the network
    open: false, // Do not open the browser automatically
  },
  build: {
    minify: true, // Use default minification
    rollupOptions: {
      output: {
        manualChunks: undefined, // Use default chunking
      },
    },
  },
});
