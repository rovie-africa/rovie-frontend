/**
 * Keeps the post-sign-in destination alive across an OAuth round trip.
 *
 * portal-api honours `callbackURL` on success and `errorCallbackURL` on most
 * failures, but when the OAuth state itself can't be read (expired, cookie
 * lost, flow restarted in another tab) Better Auth has nothing to read those
 * from and falls back to its global error URL - Route's homepage with
 * `?error=<code>`. Remembering `next` here lets that landing hand the visitor
 * back to the flow they started (e.g. /auth/mobile for the Rovie app) instead
 * of stranding them on the marketing page.
 */
const KEY = 'rovie_auth_next';
const MAX_AGE_MS = 30 * 60 * 1000;

/** Only same-origin paths; `?next=` must never bounce someone off-site. */
export function safeNext(raw: string | null | undefined, fallback = '/dashboard'): string {
  return raw && raw.startsWith('/') && !raw.startsWith('//') ? raw : fallback;
}

export function rememberAuthNext(next: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ next: safeNext(next), at: Date.now() }));
  } catch {
    // Storage disabled: the error bounce falls back to /dashboard.
  }
}

export function recallAuthNext(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { next, at } = JSON.parse(raw) as { next?: string; at?: number };
    if (!next || !at || Date.now() - at > MAX_AGE_MS) return null;
    return safeNext(next);
  } catch {
    return null;
  }
}

export function clearAuthNext(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore storage exceptions
  }
}

/** Builds the sign-in URL that carries both the destination and an error code. */
export function signInPath(next: string, error?: string | null): string {
  const params = new URLSearchParams({ next: safeNext(next) });
  if (error) params.set('error', error);
  return `/signin?${params.toString()}`;
}

const OAUTH_MESSAGES: Record<string, string> = {
  state_mismatch: 'Sign-in expired before it finished. Try again.',
  please_restart_the_process: 'Sign-in expired before it finished. Try again.',
  state_not_found: 'Sign-in expired before it finished. Try again.',
  invalid_code: 'Sign-in expired before it finished. Try again.',
  access_denied: 'Sign-in was cancelled.',
  account_not_linked:
    'That email already has a Route account. Sign in with your password or email link.',
  email_not_found: 'Your provider account has no verified email Route can use.',
  email_doesn_t_match: 'That provider account uses a different email.',
  unable_to_create_user: 'Couldn’t create your account. Try again.',
  unable_to_link_account: 'Couldn’t link that account. Try again.',
  signup_disabled: 'New sign-ups are closed.',
};

/** Wording for an OAuth `?error=` code, or null when there isn't one. */
export function messageForOAuthError(code: string | null | undefined): string | null {
  if (!code) return null;
  return OAUTH_MESSAGES[code.toLowerCase()] ?? `Sign-in failed (${code}). Try again.`;
}

