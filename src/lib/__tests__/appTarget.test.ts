import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { isRouteTarget } from '../appTarget';

describe('isRouteTarget', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    sessionStorage.clear();
  });

  function mockLocation({
    hostname = 'rovie.africa',
    port = '',
    search = '',
  }: {
    hostname?: string;
    port?: string;
    search?: string;
  }) {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        hostname,
        port,
        search,
      },
    });
  }

  it('returns true on route.rovie.africa', () => {
    mockLocation({ hostname: 'route.rovie.africa' });
    expect(isRouteTarget()).toBe(true);
  });

  it('returns true on any route subdomain', () => {
    mockLocation({ hostname: 'route.staging.rovie.africa' });
    expect(isRouteTarget()).toBe(true);
  });

  it('returns true on local route port 5174', () => {
    mockLocation({ hostname: 'localhost', port: '5174' });
    expect(isRouteTarget()).toBe(true);
  });

  it('returns false on rovie.africa main domain', () => {
    mockLocation({ hostname: 'rovie.africa' });
    expect(isRouteTarget()).toBe(false);
  });

  it('returns false on standard dev port 5173', () => {
    mockLocation({ hostname: 'localhost', port: '5173' });
    expect(isRouteTarget()).toBe(false);
  });

  it('activates route mode when ?app=route is present and remembers it in sessionStorage', () => {
    mockLocation({ hostname: 'rovie-africa.netlify.app', search: '?app=route' });
    expect(isRouteTarget()).toBe(true);
    expect(sessionStorage.getItem('rovie_app_target')).toBe('route');

    // On subsequent navigation without the query param, remains true from sessionStorage
    mockLocation({ hostname: 'rovie-africa.netlify.app', search: '' });
    expect(isRouteTarget()).toBe(true);
  });

  it('deactivates route mode when ?app=main is provided', () => {
    sessionStorage.setItem('rovie_app_target', 'route');
    mockLocation({ hostname: 'rovie-africa.netlify.app', search: '?app=main' });
    expect(isRouteTarget()).toBe(false);
    expect(sessionStorage.getItem('rovie_app_target')).toBeNull();
  });
});

