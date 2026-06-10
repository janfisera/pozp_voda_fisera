/**
 * Vite configuration file for the project.
 * @file Sets up React Router and Tailwind plugins.
 */
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter(), tailwindcss()],
});
