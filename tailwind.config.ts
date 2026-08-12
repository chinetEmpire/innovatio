import type { Config } from "tailwindcss";
const config: Config = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./data/**/*.{ts,tsx}"], theme: { extend: { colors: { brand: "#5429d0", ink: "#17131f" }, boxShadow: { soft: "0 8px 20px rgba(47, 31, 101, .12)" } } }, plugins: [] };
export default config;
