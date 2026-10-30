import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Code } from '../Code/Code';
import { ROUTE_URL } from '../../content/navLinks';
import { ROVIE_CODE_VERSION } from '../../content/downloads';

describe('Rovie Code page', () => {
  it('describes the agent-focused product, hero actions, and version badge', () => {
    render(
      <MemoryRouter>
        <Code />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1, name: /rovie code/i })).toBeInTheDocument();
    expect(screen.getByText(/an ai coding companion/i)).toBeInTheDocument();
    expect(screen.getByText(ROVIE_CODE_VERSION)).toBeInTheDocument();

    expect(screen.getAllByRole('link', { name: /explore rovie route/i })[0]).toHaveAttribute(
      'href',
      ROUTE_URL
    );
    expect(screen.getByRole('link', { name: /^download$/i })).toHaveAttribute(
      'href',
      '#download'
    );
  });

  it('renders all four surfaces in the switcher and updates the active screenshot', () => {
    render(
      <MemoryRouter>
        <Code />
      </MemoryRouter>
    );

    // Initial surface is Desktop
    expect(screen.getByRole('tab', { name: /desktop/i })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('heading', { level: 3, name: /native desktop workspace/i })
    ).toBeInTheDocument();

    // Click Web tab
    fireEvent.click(screen.getByRole('tab', { name: /web/i }));
    expect(screen.getByRole('tab', { name: /web/i })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('heading', { level: 3, name: /browser sessions and remote review/i })
    ).toBeInTheDocument();

    // Click Terminal tab
    fireEvent.click(screen.getByRole('tab', { name: /terminal/i }));
    expect(screen.getByRole('tab', { name: /terminal/i })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('heading', { level: 3, name: /interactive command-line agent/i })
    ).toBeInTheDocument();

    // Click Extension tab
    fireEvent.click(screen.getByRole('tab', { name: /extension/i }));
    expect(screen.getByRole('tab', { name: /extension/i })).toHaveAttribute('aria-selected', 'true');
    expect(
      screen.getByRole('heading', { level: 3, name: /vs code and cursor integration/i })
    ).toBeInTheDocument();
  });

  it('renders download options and FAQ directly on the overview page', () => {
    render(
      <MemoryRouter>
        <Code />
      </MemoryRouter>
    );

    // Section headings in downloads
    expect(screen.getByText(/rovie code terminal/i)).toBeInTheDocument();
    expect(screen.getByText(/rovie code desktop/i)).toBeInTheDocument();
    expect(screen.getByText(/rovie code extensions/i)).toBeInTheDocument();

    // Platforms
    expect(screen.getByRole('heading', { level: 3, name: /macos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /windows/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /linux/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /vs code & cursor/i })).toBeInTheDocument();

    // Download links
    expect(
      screen.getByRole('link', { name: /download for macos \(apple silicon\)/i })
    ).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-mac-arm64.dmg'));

    expect(
      screen.getByRole('link', { name: /download for windows \(windows x64\)/i })
    ).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-win-x64.exe'));

    expect(
      screen.getByRole('link', { name: /download for linux \(debian \/ ubuntu\)/i })
    ).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-linux-amd64.deb'));

    expect(screen.getByRole('link', { name: /download vsix/i })).toHaveAttribute(
      'href',
      expect.stringContaining('.vsix')
    );

    // FAQ
    expect(screen.getByRole('heading', { level: 2, name: /^faq$/i })).toBeInTheDocument();
  });
});
