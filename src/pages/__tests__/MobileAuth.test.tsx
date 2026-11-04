import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const getMe = vi.fn();
const updateMe = vi.fn();
const createApiKey = vi.fn();

vi.mock('../../sdk', () => ({
  rovie: {
    portal: {
      getMe: (...a: unknown[]) => getMe(...a),
      updateMe: (...a: unknown[]) => updateMe(...a),
      createApiKey: (...a: unknown[]) => createApiKey(...a),
    },
  },
}));

import { AuthProvider } from '../../context/AuthContext';
import { MobileAuth } from '../Auth/MobileAuth';

const USER_WITH_COUNTRY = {
  id: 'u1',
  email: 'user@example.com',
  name: 'Test User',
  emailVerified: true,
  image: null,
  phone: null,
  country: 'KE',
  kycTier: 0,
  createdAt: new Date().toISOString(),
  lowBalanceThresholdUsd: null,
};

const USER_WITHOUT_COUNTRY = {
  ...USER_WITH_COUNTRY,
  country: '',
};

function renderMobileAuth() {
  return render(
    <MemoryRouter initialEntries={['/auth/mobile']}>
      <AuthProvider>
        <MobileAuth />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('MobileAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('prompts the user to select their country when needsCountry is true', async () => {
    getMe.mockResolvedValue({ user: USER_WITHOUT_COUNTRY, needsCountry: true });
    updateMe.mockResolvedValue({ user: { ...USER_WITHOUT_COUNTRY, country: 'GH' }, needsCountry: false });
    createApiKey.mockResolvedValue({ apiKey: 'sk-rovie-12345', shownOnce: true });

    renderMobileAuth();

    // Country selection screen should be shown
    expect(await screen.findByRole('heading', { name: /select your country/i })).toBeInTheDocument();
    expect(createApiKey).not.toHaveBeenCalled();

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'GH');

    const submitBtn = screen.getByRole('button', { name: /continue to rovie mobile/i });
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(updateMe).toHaveBeenCalledWith({ country: 'GH' });
      expect(createApiKey).toHaveBeenCalledWith('Rovie Mobile');
    });

    expect(await screen.findByRole('heading', { name: /rovie mobile connected/i })).toBeInTheDocument();
  });

  it('authorizes directly without prompting when country is already set', async () => {
    getMe.mockResolvedValue({ user: USER_WITH_COUNTRY, needsCountry: false });
    createApiKey.mockResolvedValue({ apiKey: 'sk-rovie-already-set', shownOnce: true });

    renderMobileAuth();

    await waitFor(() => {
      expect(createApiKey).toHaveBeenCalledWith('Rovie Mobile');
    });

    expect(updateMe).not.toHaveBeenCalled();
    expect(await screen.findByRole('heading', { name: /rovie mobile connected/i })).toBeInTheDocument();
  });
});

