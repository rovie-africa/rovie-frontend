/**
 * Resolves whether the current application context is Rovie Route.
 *
 * Route is served as its own product experience:
 * - At build/dev time: via `VITE_APP_TARGET=route` or port 5174 (`npm run dev:route`).
 * - In production: on `route.rovie.africa` (or subdomains containing/starting with `route`).
 * - In deploy previews / testing: via `?app=route` query param (persisted in sessionStorage for the session).
 */
export function isRouteTarget(): boolean {
  if (import.meta.env.VITE_APP_TARGET === 'route') {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  const { hostname, port, search } = window.location;

  // Dedicated Route domains or local port
  if (
    hostname === 'route.rovie.africa' ||
    hostname.startsWith('route.') ||
    hostname.includes('route') ||
    port === '5174'
  ) {
    return true;
  }

  // Allow explicit testing or preview toggling
  if (search) {
    const params = new URLSearchParams(search);
    const app = params.get('app');
    if (app === 'route') {
      try {
        sessionStorage.setItem('rovie_app_target', 'route');
      } catch {
        // Ignore storage exceptions
      }
      return true;
    }
    if (app === 'main' || app === 'company') {
      try {
        sessionStorage.removeItem('rovie_app_target');
      } catch {
        // Ignore storage exceptions
      }
      return false;
    }
  }

  try {
    return sessionStorage.getItem('rovie_app_target') === 'route';
  } catch {
    return false;
  }
}

