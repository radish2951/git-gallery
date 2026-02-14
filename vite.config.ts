import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { apiMiddleware } from "./server/middleware";

export default defineConfig({
  plugins: [react(), tailwindcss(), apiMiddleware()],
});
