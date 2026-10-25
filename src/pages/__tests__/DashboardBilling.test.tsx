import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

const getMe = vi.fn();
const getBalance = vi.fn();
const listPayments = vi.fn();
const getTopUpOptions = vi.fn();
const quoteTopUp = vi.fn();
const startTopUp = vi.fn();
const refreshPayment = vi.fn();

vi.mock('../../sdk', () => ({
  rovie: {
    portal: {
      getMe: (...a: unknown[]) => getMe(...a),
      getBalance: (...a: unknown[]) => getBalance(...a),
      listPayments: (...a: unknown[]) => listPayments(...a),
      getTopUpOptions: (...a: unknown[]) => getTopUpOptions(...a),
      quoteTopUp: (...a: unknown[]) => quoteTopUp(...a),
      startTopUp: (...a: unknown[]) => startTopUp(...a),
      refreshPayment: (...a: unknown[]) => refreshPayment(...a),
      signOut: vi.fn(),
    },
  },
}));

import { AuthProvider } from '../../context/AuthContext';
import { Billing } from '../Dashboard/Billing';

const NG_USER = {
  id: 'u1',
  email: 'dev@example.com',
  name: 'Dev',
  emailVerified: false,
  image: null,
  phone: null,
  country: 'NG',
  kycTier: 0,
  createdAt: new Date().toISOString(),
};

function renderBilling() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Billing />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Dashboard billing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMe.mockResolvedValue({ user: NG_USER, needsCountry: false });
    listPayments.mockResolvedValue({ payments: [] });
    getTopUpOptions.mockResolvedValue({
      payableCurrencies: ['NGN', 'UGX', 'GHS', 'KES'],
      limits: {
        NGN: { minMinor: 63161, maxMinor: 63160022 },
      },
      policyMinUsd: 0.5,
      maxUsd: 500,
    });
    getBalance.mockResolvedValue({
      availableUsd: 12.5,
      spendUsd: 2,
      maxBudgetUsd: 14.5,
      localCurrency: 'NGN',
      availableLocal: 17053.2,
      spendLocal: 2728.5,
      maxBudgetLocal: 19781.7,
      currency: 'NGN',
      country: 'NG',
    });
  });

  it('leads with the local-currency figure and keeps dollars as the footnote', async () => {
    renderBilling();
    // ₦17,053 is the headline; $12.50 is present but secondary.
    expect(await screen.findByText(/17,053/)).toBeInTheDocument();
    expect(screen.getByText('$12.50')).toBeInTheDocument();
  });

  it('says so when it had to fall back to dollars', async () => {
    // A country whose currency has no FX rate: the server reports USD, and
    // the page must not label dollars with the user's own currency.
    getMe.mockResolvedValue({ user: { ...NG_USER, country: 'ER' }, needsCountry: false });
    getBalance.mockResolvedValue({
      availableUsd: 5,
      spendUsd: 0,
      maxBudgetUsd: 5,
      localCurrency: 'USD',
      availableLocal: 5,
      spendLocal: 0,
      maxBudgetLocal: 5,
      currency: 'USD',
      country: 'ER',
    });

    renderBilling();
    expect(
      await screen.findByText(/No exchange rate is available for your country/)
    ).toBeInTheDocument();
  });

  it('blocks top-ups until a country is picked', async () => {
    getMe.mockResolvedValue({ user: { ...NG_USER, country: '' }, needsCountry: true });
    renderBilling();

    // The form is replaced with a single link to the account page where
    // country can be set.
    expect(await screen.findByRole('link', { name: 'Set your country' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Amount')).not.toBeInTheDocument();
    expect(startTopUp).not.toHaveBeenCalled();
  });

  it('defaults the picker to the user’s home currency', async () => {
    // Uganda user: picker should open on UGX, not NGN.
    getMe.mockResolvedValue({ user: { ...NG_USER, country: 'UG' }, needsCountry: false });
    renderBilling();

    const select = (await screen.findByLabelText('Currency')) as HTMLSelectElement;
    await waitFor(() => expect(select.value).toBe('UGX'));
  });

  it('tells users whose home currency is not payable that they have to pick another', async () => {
    // South Africa (ZAR) is supported for quotes but not yet payable.
    getMe.mockResolvedValue({ user: { ...NG_USER, country: 'ZA' }, needsCountry: false });
    getBalance.mockResolvedValue({
      availableUsd: 1,
      spendUsd: 0,
      maxBudgetUsd: 1,
      localCurrency: 'ZAR',
      availableLocal: 18,
      spendLocal: 0,
      maxBudgetLocal: 18,
      currency: 'ZAR',
      country: 'ZA',
    });

    renderBilling();
    const select = (await screen.findByLabelText('Currency')) as HTMLSelectElement;
    await waitFor(() => expect(select.value).toBe('NGN'));
    expect(await screen.findByText(/can't be settled in ZAR|can’t be settled in ZAR/)).toBeInTheDocument();
  });

  it('states the limits in the currency being paid in, not dollars', async () => {
    renderBilling();

    // ₦631.61 and ₦631,600.22 — the figures the amount box is denominated in.
    const limits = await screen.findByText(/Minimum/);
    expect(limits.textContent).toMatch(/631\.61/);
    expect(limits.textContent).toMatch(/631,600/);
    expect(limits.textContent).not.toMatch(/\$0\.50/);
  });

  it('falls back to dollars when the server had no rate for that currency', async () => {
    getTopUpOptions.mockResolvedValue({
      payableCurrencies: ['NGN'],
      limits: {}, // rate briefly unavailable
      policyMinUsd: 0.5,
      maxUsd: 500,
    });

    renderBilling();
    // Better a correct dollar figure than a wrong local one.
    expect((await screen.findByText(/Minimum/)).textContent).toMatch(/\$0\.50/);
  });

  it('re-prices as the amount changes', async () => {
    const user = userEvent.setup();
    quoteTopUp.mockResolvedValue({
      currency: 'NGN', amountMinor: 70000, creditUsd: 0.55, markupPercent: 8, indicative: true,
    });

    renderBilling();
    await user.type(await screen.findByLabelText('Amount'), '700');
    await waitFor(() =>
      expect(quoteTopUp).toHaveBeenCalledWith({ currency: 'NGN', amountMinor: 70000 })
    );
  });

  it("passes the provider's own minimum through verbatim", async () => {
    const user = userEvent.setup();
    const { RovieApiError } = await import('../../sdk/httpClient');
    quoteTopUp.mockResolvedValue({
      currency: 'UGX', amountMinor: 200000, creditUsd: 0.58, markupPercent: 8, indicative: true,
    });
    startTopUp.mockRejectedValue(
      new RovieApiError('failed', {
        status: 400,
        body: { error: { code: 'provider_refused', message: 'The minimum amount allowed for collection is 7300UGX' } },
      })
    );

    renderBilling();
    await user.type(await screen.findByLabelText('Amount'), '2000');
    await screen.findByText('$0.58');
    await user.click(screen.getByRole('button', { name: 'Continue to payment' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('7300UGX');
  });

  it('offers a top-up with no API key, since credit belongs to the account', async () => {
    const user = userEvent.setup();
    quoteTopUp.mockResolvedValue({
      currency: 'NGN',
      amountMinor: 2000000,
      creditUsd: 15.83,
      markupPercent: 8,
      indicative: true,
    });
    startTopUp.mockResolvedValue({
      checkoutUrl: 'https://checkout.flutterwave.com/v3/hosted/pay/abc',
      reference: 'abc',
      creditUsd: 15.83,
    });

    renderBilling();
    // Nothing in this flow consults the key list at all.
    await user.type(await screen.findByLabelText('Amount'), '20000');
    await screen.findByText('$15.83');
    expect(screen.getByRole('button', { name: 'Continue to payment' })).toBeEnabled();
  });

  it('initiates a top-up with Flutterwave', async () => {
    const user = userEvent.setup();
    quoteTopUp.mockResolvedValue({
      currency: 'NGN', amountMinor: 500000, creditUsd: 3.96, markupPercent: 8, indicative: true,
    });
    startTopUp.mockResolvedValue({
      checkoutUrl: 'https://checkout.flutterwave.com/v3/hosted/pay/abc', reference: 'abc', creditUsd: 3.96,
    });

    renderBilling();
    await user.type(await screen.findByLabelText('Amount'), '5000');
    await screen.findByText('$3.96');
    await user.click(screen.getByRole('button', { name: 'Continue to payment' }));

    await waitFor(() =>
      expect(startTopUp).toHaveBeenCalledWith({ currency: 'NGN', amountMinor: 500000 })
    );
  });

  it('lets a pending payment be checked, and reports credit when it lands', async () => {
    const user = userEvent.setup();
    listPayments.mockResolvedValue({
      payments: [{
        id: 'p1', provider: 'flutterwave', currency: 'NGN', amountMinor: '500000',
        usdCreditedMicros: null, status: 'pending',
        createdAt: new Date().toISOString(), confirmedAt: null,
      }],
    });
    refreshPayment.mockResolvedValue({ status: 'success', changed: true, addedUsd: 3.96 });

    renderBilling();
    await user.click(await screen.findByRole('button', { name: 'Check payment' }));

    await waitFor(() => expect(refreshPayment).toHaveBeenCalledWith('p1'));
    expect(await screen.findByText(/Payment confirmed — \$3\.96 added/)).toBeInTheDocument();
  });

  it('says nothing has arrived rather than implying failure', async () => {
    const user = userEvent.setup();
    listPayments.mockResolvedValue({
      payments: [{
        id: 'p1', provider: 'flutterwave', currency: 'NGN', amountMinor: '500000',
        usdCreditedMicros: null, status: 'pending',
        createdAt: new Date().toISOString(), confirmedAt: null,
      }],
    });
    refreshPayment.mockResolvedValue({ status: 'pending', changed: false, awaitingPayment: true });

    renderBilling();
    await user.click(await screen.findByRole('button', { name: 'Check payment' }));

    expect(await screen.findByText(/No payment received yet/)).toBeInTheDocument();
  });

  it('offers no check on a settled payment', async () => {
    listPayments.mockResolvedValue({
      payments: [{
        id: 'p1', provider: 'flutterwave', currency: 'NGN', amountMinor: '500000',
        usdCreditedMicros: '3958200', status: 'success',
        createdAt: new Date().toISOString(), confirmedAt: new Date().toISOString(),
      }],
    });

    renderBilling();
    // "Credited" is also a column header, so scope the query to the row.
    const row = await screen.findByRole('row', { name: /3\.96/ });
    expect(within(row).getByText('Credited')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Check payment' })).not.toBeInTheDocument();
  });

  it('surfaces a refused top-up instead of navigating', async () => {
    const user = userEvent.setup();
    const { RovieApiError } = await import('../../sdk/httpClient');
    quoteTopUp.mockResolvedValue({
      currency: 'NGN',
      amountMinor: 2000000,
      creditUsd: 15.83,
      markupPercent: 8,
      indicative: true,
    });
    startTopUp.mockRejectedValue(
      new RovieApiError('failed', {
        status: 502,
        body: { error: { code: 'payment_unavailable', message: "Couldn't start the payment. Nothing has been charged — try again shortly." } },
      })
    );

    renderBilling();
    await user.type(await screen.findByLabelText('Amount'), '20000');
    await screen.findByText('$15.83');
    await user.click(screen.getByRole('button', { name: 'Continue to payment' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Nothing has been charged');
  });

  it('does not claim a payment succeeded just because the browser came back', async () => {
    listPayments.mockResolvedValue({
      payments: [
        {
          id: 'p1',
          provider: 'flutterwave',
          currency: 'NGN',
          amountMinor: '2000000',
          usdCreditedMicros: null,
          status: 'pending',
          createdAt: new Date().toISOString(),
          confirmedAt: null,
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={['/dashboard/billing?topup=return']}>
        <AuthProvider>
          <Billing />
        </AuthProvider>
      </MemoryRouter>
    );

    // Crediting is the webhook's job, so the copy must say "as soon as it
    // confirms", never "added".
    expect(await screen.findByText(/as soon as the payment confirms/)).toBeInTheDocument();
    expect(await screen.findByText('Waiting for payment')).toBeInTheDocument();
  });
});
