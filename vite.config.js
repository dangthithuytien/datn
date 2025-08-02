import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // ✅ Thêm cấu hình cho preview (Render dùng lệnh `vite preview`)
  preview: {
    port: process.env.PORT || 4173,
    host: true,
    allowedHosts: ['datn-9f68.onrender.com'], // Cho phép domain của bạn
  },
  server: {
    proxy: {
      "/api": {
        target: "https://chosachonline-datn.onrender.com", // nếu API chạy local
        changeOrigin: true,
        secure: false,
      },
    },
  }
});
