import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/build/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Largest standalone vendor libs split into their own chunks so they
          // are cached independently of app code (rare changes vs frequent app
          // deploys) and downloaded in parallel on first load.
          // We deliberately keep React + react-is + scheduler bundled with the
          // rest of node_modules to avoid circular-chunk warnings (recharts and
          // many libs reach back into the React runtime).
          if (id.includes('node_modules')) {
            if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-editor';
            if (id.includes('lucide-react')) return 'vendor-icons';
            // recharts/victory/d3 kept in main vendor: their deps (react-is, etc.)
            // are shared with the app and splitting them causes TDZ errors from
            // circular-chunk init order ("Cannot access 'T' before initialization").
            return 'vendor';
          }
          // Admin code is huge and never used by collaborateurs. Splitting it
          // means a separate cacheable chunk; pair this with dynamic imports
          // later for full lazy-loading.
          if (id.includes('/src/admin/')) return 'app-admin';
          if (id.includes('/src/pages/SetupWizard')) return 'app-setup';
        },
      },
    },
  },
});
