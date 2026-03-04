import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    proxy: {
      // /api로 시작하는 요청은 백엔드로 전달
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
