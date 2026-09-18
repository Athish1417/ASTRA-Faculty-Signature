import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // exposes the dev server on your LAN so phones can reach it
    port: 5173,
  },
});
