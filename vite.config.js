import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // ✅ Quan trọng để tải đúng tài nguyên trên Render

  plugins: [react()],

  // ✅ Dùng để chạy thử build local bằng: npm run preview
  preview: {
    port: 4173,
    host: true,
    allowedHosts: ['datn-9f68.onrender.com'],
  },

  // ✅ Chỉ dùng trong môi trường phát triển (localhost)
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:7003",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
