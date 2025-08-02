import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  preview: {
    port: process.env.PORT || 4173,
    host: true,
    allowedHosts: ["datn-9f68.onrender.com"],
  },
  // ✅ CHỈ dùng proxy khi chạy local dev
  server: command === "serve" ? {
    proxy: {
      "/api": {
        target: "https://chosachonline-datn.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  } : undefined,
}));
