import { Navigate, useSearchParams } from 'react-router-dom';
import { RouteProduct } from '../../pages/Route/Route';
import { recallAuthNext, signInPath } from '../../lib/authReturn';

/**
 * Route's homepage, plus the landing for OAuth failures portal-api can't
 * attribute to a flow (lost or expired state ends at `/?error=<code>`).
 * Those are sent back to sign-in with the destination they started from, so
 * a failed GitHub round trip from the Rovie app returns to /auth/mobile's
 * sign-in rather than the marketing page.
 */
export function RouteHome() {
  const [params] = useSearchParams();
  const error = params.get('error');

  if (error) {
    return <Navigate to={signInPath(recallAuthNext() ?? '/dashboard', error)} replace />;
  }

  return <RouteProduct />;
}

