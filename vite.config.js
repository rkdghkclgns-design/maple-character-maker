import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 단일 페이지 빌더. GitHub Pages 등 서브패스 배포 시 base 를 "/저장소명/" 으로 바꾸세요.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { port: 5173, open: true },
  build: { outDir: "dist", sourcemap: false },
});
