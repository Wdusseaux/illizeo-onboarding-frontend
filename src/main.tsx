import React from 'react';
import ReactDOM from 'react-dom/client';
import OnboardingModule from './Onboarding_v1';
import PublicCooptationLanding from './pages/PublicCooptationLanding';

// Auto-recover from stale-bundle errors: if the browser has an old index.html
// in cache that references a JS chunk no longer on the server, the chunk now
// returns 404 (since /build/ is excluded from the SPA catch-all). We listen
// for those failures and reload once with cache bypass to fetch fresh HTML.
// sessionStorage flag prevents an infinite loop if the reload itself fails.
window.addEventListener('error', (e) => {
  const t = e.target as HTMLScriptElement | HTMLLinkElement | null;
  if (!t) return;
  const url = (t as any).src || (t as any).href || '';
  if (typeof url !== 'string' || !url.includes('/build/assets/')) return;
  if (sessionStorage.getItem('iz_cache_busted') === '1') return;
  sessionStorage.setItem('iz_cache_busted', '1');
  // Force a fresh fetch by appending a one-time cache-bust param.
  const u = new URL(window.location.href);
  u.searchParams.set('_cb', String(Date.now()));
  window.location.replace(u.toString());
}, true);
window.addEventListener('vite:preloadError', () => {
  if (sessionStorage.getItem('iz_cache_busted') === '1') return;
  sessionStorage.setItem('iz_cache_busted', '1');
  window.location.reload();
});

// Public share landing — when the URL matches /:tenant/c/:shareToken we
// render a standalone page without going through the auth flow.
const publicShareMatch = window.location.pathname.match(/^\/([^/]+)\/c\/([A-Za-z0-9]+)\/?$/);
const root = ReactDOM.createRoot(document.getElementById('root')!);
if (publicShareMatch) {
  root.render(
    <React.StrictMode>
      <PublicCooptationLanding tenantId={publicShareMatch[1]} shareToken={publicShareMatch[2]} />
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <OnboardingModule />
    </React.StrictMode>
  );
}
