import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', // WICHTIG: Relative Pfade für Electron (.exe) und APK
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
