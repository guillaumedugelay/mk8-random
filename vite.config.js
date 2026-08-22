import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Deux cibles, deux bases :
//   npm run build      → le site GitHub Pages, servi sous /mk8-random/
//   npm run build:app  → l'app Capacitor, servie depuis un schéma local
//
// Une base absolue dans l'app Android ferait chercher /mk8-random/assets/…,
// qui n'existe pas : écran blanc au lancement.
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'app' ? './' : '/mk8-random/',
}))
