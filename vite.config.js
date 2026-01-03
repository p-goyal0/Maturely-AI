import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      // Map '@' to the repository root so imports like '@/components/*' and '@/lib/*'
      // resolve to the top-level folders. tsconfig.json already maps '@/*' -> './*'.
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  server: {
    port: 5173,
    open: false,
  },
  // Load environment variables
  envPrefix: 'VITE_',
});
