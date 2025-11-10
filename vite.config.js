// import { fileURLToPath } from "url";
// import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ __dirname 대체 구문
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],

  // build: {
  //   outDir: resolve(__dirname, "../src/main/resources/static/react/"), // ✅ 백엔드 안으로 빌드 결과 복사
  //   emptyOutDir: true,
  // },

  server: {
    host: true, // ✅ 외부에서도 접속 가능하게
    port: 5173,
    proxy: {
      "/api": "http://localhost:8080", // ✅ Spring Boot API 프록시
    },
  },
});
