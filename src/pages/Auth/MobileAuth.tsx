import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { useVisitorCountry } from '../../hooks/useVisitorCountry';
import { AFRICA_COUNTRIES } from '../../lib/d3/africaCountries';
import { rovie } from '../../sdk';
import styles from './MobileAuth.module.scss';

export function MobileAuth() {
  const navigate = useNavigate();
  const { isSignedIn, isLoading, user, needsCountry, applyMe } = useAuth();
  const { country: visitorCountry } = useVisitorCountry();

  const [country, setCountry] = useState<string>('');
  const [touchedCountry, setTouchedCountry] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'country_required' | 'authorizing' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedCountries = useMemo(
    () => [...AFRICA_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/signin?next=/auth/mobile', { replace: true });
    }
  }, [isLoading, isSignedIn, navigate]);

  useEffect(() => {
    if (user?.country) {
      setCountry(user.country);
    } else if (visitorCountry && !touchedCountry) {
      setCountry(visitorCountry.alpha2);
    }
  }, [user?.country, visitorCountry, touchedCountry]);

  async function authorize() {
    setStatus('authorizing');
    setErrorMessage(null);
    try {
      const result = await rovie.portal.createApiKey('Rovie Mobile');
      setApiKey(result.apiKey);
      setStatus('success');

      const redirectUrl = `rovie://auth?key=${encodeURIComponent(result.apiKey)}`;
      window.location.href = redirectUrl;

      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = redirectUrl;
        document.body.appendChild(iframe);
      } catch {
        // Ignore DOM exceptions
      }
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Could not generate mobile access key.';
      setErrorMessage(msg);
    }
  }

  useEffect(() => {
    if (isLoading || !isSignedIn || apiKey) return;

    if (needsCountry || !user?.country) {
      setStatus('country_required');
    } else {
      void authorize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isSignedIn, needsCountry, user?.country, apiKey]);

  async function handleCountrySubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!country) return;

    setStatus('authorizing');
    setErrorMessage(null);
    try {
      const updatedMe = await rovie.portal.updateMe({ country });
      applyMe(updatedMe);
      await authorize();
    } catch (err: unknown) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Could not save country.';
      setErrorMessage(msg);
    }
  }

  if (isLoading || status === 'loading' || status === 'authorizing') {
    return (
      <AuthLayout title="Connecting Rovie Mobile">
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <p style={{ color: 'var(--color-text-secondary, #888)', marginBottom: '16px' }}>
            Preparing your mobile connection...
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'country_required') {
    return (
      <AuthLayout title="Select your country">
        <form className={styles.form} onSubmit={handleCountrySubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="mobile-auth-country">
              Country
            </label>
            <select
              id="mobile-auth-country"
              className={styles.select}
              value={country}
              onChange={(e) => {
                setTouchedCountry(true);
                setCountry(e.target.value);
              }}
              required
            >
              <option value="" disabled>
                Select your country
              </option>
              {sortedCountries.map((c) => (
                <option key={c.alpha2} value={c.alpha2}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" disabled={!country}>
            Continue to Rovie Mobile
          </Button>
        </form>
      </AuthLayout>
    );
  }

  if (status === 'error') {
    return (
      <AuthLayout title="Connection Failed">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ color: 'var(--color-error, #f43f5e)', marginBottom: '24px' }}>
            {errorMessage || 'Something went wrong while connecting.'}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </AuthLayout>
    );
  }

  const deepLink = apiKey ? `rovie://auth?key=${encodeURIComponent(apiKey)}` : '#';

  return (
    <AuthLayout title="Rovie Mobile Connected">
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ marginBottom: '8px', color: 'var(--color-text-secondary, #888)' }}>
          Authorized as <strong>{user?.email ?? 'User'}</strong>
        </p>

        <p style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--color-text-secondary, #888)' }}>
          If Rovie Mobile did not open automatically, tap below:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <a
            href={deepLink}
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: 'var(--color-accent, #10b981)',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 600,
              textDecoration: 'none',
              width: '100%',
              maxWidth: '280px',
            }}
          >
            Open Rovie Mobile
          </a>

          {apiKey && (
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(apiKey);
                alert('API key copied to clipboard!');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary, #888)',
                cursor: 'pointer',
                fontSize: '13px',
                textDecoration: 'underline',
              }}
            >
              Copy API key manually
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
