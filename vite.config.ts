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
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // ── Vendor chunks ──────────────────────────────────────────
          // Largest standalone vendor libs split into their own chunks so they
          // are cached independently of app code (rare changes vs frequent app
          // deploys) and downloaded in parallel on first load.
          // We deliberately keep React + react-is + scheduler bundled with the
          // rest of node_modules to avoid circular-chunk warnings (recharts and
          // many libs reach back into the React runtime).
          if (id.includes('node_modules')) {
            if (id.includes('@tiptap') || id.includes('prosemirror')) return 'vendor-editor';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('reactflow') || id.includes('@reactflow')) return 'vendor-reactflow';
            if (id.includes('@stripe')) return 'vendor-stripe';
            // recharts/victory/d3 kept in main vendor: their deps (react-is, etc.)
            // are shared with the app and splitting them causes TDZ errors from
            // circular-chunk init order ("Cannot access 'T' before initialization").
            return 'vendor';
          }
          // ── Admin code ─────────────────────────────────────────────
          // Split the large /src/admin/ surface into multiple parallel chunks
          // so HTTP/2 multiplexing speeds up first paint. Files grouped by
          // usage frequency: core (most used) loaded first, advanced features
          // can be deferred behind interaction.
          if (id.includes('/src/admin/AdminSidebarComponent')) return 'app-admin-super'; // super-admin panel + sidebar
          if (id.includes('/src/admin/pages/')) return 'app-admin-pages'; // Roles, Calendar, Audit, Buddy, OrgChart…
          if (id.includes('/src/admin/AdminCooptation') ||
              id.includes('/src/admin/AdminIntegrations') ||
              id.includes('/src/admin/AdminNPSContrats')) return 'app-admin-features';
          if (id.includes('/src/admin/AdminWorkflowsTemplates') ||
              id.includes('/src/admin/AdminParcoursDocs') ||
              id.includes('/src/admin/AdminPanels')) return 'app-admin-modules';
          if (id.includes('/src/admin/')) return 'app-admin-core'; // AdminInlinePages + AdminDashboardSuivi
          // ── Setup wizard ───────────────────────────────────────────
          if (id.includes('/src/pages/SetupWizard')) return 'app-setup';
        },
      },
    },
  },
});
