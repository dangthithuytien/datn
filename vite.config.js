import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  base: "/", // ✳️ QUAN TRỌNG để router không lỗi khi F5
  preview: {
    port: process.env.PORT || 4173,
    host: true,
    allowedHosts: ["datn-rg9q.onrender.com"],
  },
  server: command === "serve" ? {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://chosachonline-datn.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
}));
