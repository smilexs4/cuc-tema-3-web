import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  // Start on 0.0.0.0
  server: {
    host: "0.0.0.0",
    https: true, // Enable HTTPS
  },
});
