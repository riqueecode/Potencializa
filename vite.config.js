import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	base: './',
	server: {
		watch: {
			// Perfil temporário criado durante a inspeção local no Chrome. Ele pode
			// manter ficheiros de cookies bloqueados no Windows e não faz parte do app.
			ignored: ["**/.chrome-debug/**"],
		},
	},
	build: {
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js",
				chunkFileNames: "assets/[name].js",
				assetFileNames: "assets/[name][extname]",
			},
		},
	},
	plugins: [react()],
});
