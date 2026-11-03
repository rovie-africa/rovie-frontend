import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/AuthLayout/AuthLayout';
import { Button } from '../../components/Button/Button';
import { useAuth } from '../../context/AuthContext';
import { rovie } from '../../sdk';

export function MobileAuth() {
  const navigate = useNavigate();
  const { isSignedIn, isLoading, user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'authorizing' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      navigate('/signin?next=/auth/mobile', { replace: true });
    }
  }, [isLoading, isSignedIn, navigate]);

  useEffect(() => {
    if (!isSignedIn || apiKey) return;

    let cancelled = false;

    async function authorize() {
      setStatus('authorizing');
      try {
        // Create an API key specifically for Rovie Mobile
        const result = await rovie.portal.createApiKey('Rovie Mobile');
        if (cancelled) return;

        setApiKey(result.apiKey);
        setStatus('success');

        // Redirect back to the mobile app via custom URL scheme
        const redirectUrl = `rovie://auth?key=${encodeURIComponent(result.apiKey)}`;
        window.location.href = redirectUrl;
      } catch (err: unknown) {
        if (cancelled) return;
        setStatus('error');
        const msg = err instanceof Error ? err.message : 'Could not generate mobile access key.';
        setErrorMessage(msg);
      }
    }

    void authorize();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, apiKey]);

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

