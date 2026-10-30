import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Download } from '../Download/Download';
import { ROVIE_CODE_VERSION } from '../../content/downloads';

describe('Download page', () => {
  it('renders download options for all major platforms', () => {
    render(
      <MemoryRouter>
        <Download />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /download rovie code/i })
    ).toBeInTheDocument();
    expect(screen.getByText(ROVIE_CODE_VERSION)).toBeInTheDocument();

    // Platforms
    expect(screen.getByRole('heading', { level: 3, name: /macos/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /windows/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /linux/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /vs code & cursor/i })).toBeInTheDocument();

    // Direct download links
    const macArmDmg = screen.getByRole('link', { name: /download for macos \(apple silicon\)/i });
    expect(macArmDmg).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-mac-arm64.dmg'));

    const winX64 = screen.getByRole('link', { name: /download for windows \(windows x64\)/i });
    expect(winX64).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-win-x64.exe'));

    const linuxDeb = screen.getByRole('link', { name: /download for linux \(debian \/ ubuntu\)/i });
    expect(linuxDeb).toHaveAttribute('href', expect.stringContaining('rovie-code-desktop-linux-amd64.deb'));

    const vsixLink = screen.getByRole('link', { name: /download vsix/i });
    expect(vsixLink).toHaveAttribute('href', expect.stringContaining('.vsix'));
  });

  it('allows copying install and package manager commands', () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <MemoryRouter>
        <Download />
      </MemoryRouter>
    );

    const copyQuickInstallBtn = screen.getByRole('button', { name: /copy quick install script/i });
    fireEvent.click(copyQuickInstallBtn);
    expect(writeTextMock).toHaveBeenCalledWith('curl -fsSL https://code.rovie.africa/install | bash');

    const copyExtensionBtn = screen.getByRole('button', { name: /copy editor install command/i });
    fireEvent.click(copyExtensionBtn);
    expect(writeTextMock).toHaveBeenCalledWith('code --install-extension rovie-code');
  });

  it('toggles FAQ questions and displays the answer', () => {
    render(
      <MemoryRouter>
        <Download />
      </MemoryRouter>
    );

    const questionBtn = screen.getByRole('button', { name: /what is rovie code\?/i });
    expect(questionBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/rovie code is an open autonomous coding agent/i)).not.toBeInTheDocument();

    fireEvent.click(questionBtn);
    expect(questionBtn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/rovie code is an open autonomous coding agent/i)).toBeInTheDocument();

    fireEvent.click(questionBtn);
    expect(questionBtn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText(/rovie code is an open autonomous coding agent/i)).not.toBeInTheDocument();
  });
});
