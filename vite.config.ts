import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/shiva-portfolio/", // ✅ Matches your GitHub repo name
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Nice use of aliasing
    },
  },
});
