import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow access from the network
    port: 3000, // Specify a port if needed
    strictPort: true, // Ensure the server uses the specified port, or fails if it's not available
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
