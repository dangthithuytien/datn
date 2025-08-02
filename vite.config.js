import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // ✅ Thêm cấu hình preview
  preview: {
    port: 4173, // hoặc PORT mặc định nếu cần
    host: true,
    allowedHosts: ['datn-9f68.onrender.com'], // Cho phép host trên Render
  },
  // ✅ Cấu hình proxy dành cho dev
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
