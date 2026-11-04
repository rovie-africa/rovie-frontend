import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAuthNext,
  messageForOAuthError,
  recallAuthNext,
  rememberAuthNext,
  safeNext,
  signInPath,
} from '../authReturn';

describe('authReturn', () => {
  beforeEach(() => localStorage.clear());

  it('only accepts same-origin paths', () => {
    expect(safeNext('/auth/mobile')).toBe('/auth/mobile');
    expect(safeNext('//evil.example')).toBe('/dashboard');
    expect(safeNext('https://evil.example')).toBe('/dashboard');
    expect(safeNext(null)).toBe('/dashboard');
  });

  it('remembers and clears the destination', () => {
    rememberAuthNext('/auth/mobile');
    expect(recallAuthNext()).toBe('/auth/mobile');
    clearAuthNext();
    expect(recallAuthNext()).toBeNull();
  });

  it('ignores stale destinations', () => {
    localStorage.setItem(
      'rovie_auth_next',
      JSON.stringify({ next: '/auth/mobile', at: Date.now() - 31 * 60 * 1000 })
    );
    expect(recallAuthNext()).toBeNull();
  });

  it('builds a sign-in path carrying next and error', () => {
    expect(signInPath('/auth/mobile', 'state_mismatch')).toBe(
      '/signin?next=%2Fauth%2Fmobile&error=state_mismatch'
    );
  });

  it('maps OAuth codes to wording', () => {
    expect(messageForOAuthError(null)).toBeNull();
    expect(messageForOAuthError('state_mismatch')).toMatch(/expired/);
    expect(messageForOAuthError('weird_code')).toMatch(/weird_code/);
  });
});

