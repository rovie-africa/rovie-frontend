import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ROVIE_CODE_VERSION,
  RELEASE_BASE_URL,
  EXTENSION_DOWNLOAD,
  EXTENSION_VARIANTS,
  CLI_INSTALL_COMMANDS,
  DOWNLOAD_FAQS,
} from '../../content/downloads';
import {
  AppleIcon,
  WindowsIcon,
  LinuxIcon,
  VSCodeIcon,
  CursorIcon,
  WindsurfIcon,
  VSCodiumIcon,
  CopyIcon,
  CheckIcon,
  PlusIcon,
  MinusIcon,
} from './DownloadIcons';
import styles from './Download.module.scss';

export function Download() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const handleCopy = useCallback((text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      void navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Header */}
          <header className={styles.topHeader}>
            <h1>Download Rovie Code</h1>
            <div className={styles.metaGroup}>
              <span className={styles.versionBadge}>{ROVIE_CODE_VERSION}</span>
              <Link to="/code" className={styles.backLink}>
                <span aria-hidden="true">←</span> Back to overview
              </Link>
            </div>
          </header>

          {/* Section 1: Terminal */}
          <section className={styles.downloadSection} aria-labelledby="terminal-section-heading">
            <div id="terminal-section-heading" className={styles.sectionLabel}>
              <span>[1]</span> Rovie Code Terminal
            </div>
            <div className={styles.sectionContent}>
              <button
                type="button"
                className={styles.cliRow}
                onClick={() => handleCopy(CLI_INSTALL_COMMANDS.script, 'cli-script')}
                aria-label="Copy quick install script"
              >
                <code>
                  curl -fsSL https://code.rovie.africa/<strong>install</strong> | bash
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'cli-script' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'cli-script' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>

              <button
                type="button"
                className={styles.cliRow}
                onClick={() => handleCopy(CLI_INSTALL_COMMANDS.npm, 'cli-npm')}
                aria-label="Copy npm install command"
              >
                <code>
                  npm install -g <strong>rovie-code</strong>
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'cli-npm' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'cli-npm' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>

              <button
                type="button"
                className={styles.cliRow}
                onClick={() => handleCopy(CLI_INSTALL_COMMANDS.bun, 'cli-bun')}
                aria-label="Copy bun install command"
              >
                <code>
                  bun install -g --trust <strong>rovie-code</strong>
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'cli-bun' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'cli-bun' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>

              <button
                type="button"
                className={styles.cliRow}
                onClick={() => handleCopy(CLI_INSTALL_COMMANDS.brew, 'cli-brew')}
                aria-label="Copy homebrew install command"
              >
                <code>
                  brew install <strong>rovie-africa/tap/rovie-code</strong>
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'cli-brew' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'cli-brew' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>
            </div>
          </section>

          {/* Section 2: Desktop */}
          <section className={styles.downloadSection} aria-labelledby="desktop-section-heading">
            <div id="desktop-section-heading" className={styles.sectionLabel}>
              <span>[2]</span> Rovie Code Desktop
            </div>
            <div className={styles.sectionContent}>
              {/* macOS */}
              <h3 className={styles.platformGroupHeading}>macOS</h3>
              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <AppleIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>macOS (Apple Silicon)</span>
                    <span className={styles.subMeta}>DMG · 323 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-mac-arm64.dmg`}
                  className={styles.actionButton}
                  aria-label="Download for macOS (Apple Silicon)"
                  download
                >
                  Download
                </a>
              </div>

              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <AppleIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>macOS (Intel)</span>
                    <span className={styles.subMeta}>DMG · 335 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-mac-x64.dmg`}
                  className={styles.actionButton}
                  aria-label="Download for macOS (Intel)"
                  download
                >
                  Download
                </a>
              </div>

              {/* Windows */}
              <h3 className={styles.platformGroupHeading}>Windows</h3>
              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <WindowsIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Windows (x64)</span>
                    <span className={styles.subMeta}>EXE · 259 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-win-x64.exe`}
                  className={styles.actionButton}
                  aria-label="Download for Windows (Windows x64)"
                  download
                >
                  Download
                </a>
              </div>

              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <WindowsIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Windows (ARM64)</span>
                    <span className={styles.subMeta}>EXE · 246 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-win-arm64.exe`}
                  className={styles.actionButton}
                  aria-label="Download for Windows (Windows ARM64)"
                  download
                >
                  Download
                </a>
              </div>

              {/* Linux */}
              <h3 className={styles.platformGroupHeading}>Linux</h3>
              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <LinuxIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Linux (.deb)</span>
                    <span className={styles.subMeta}>Debian / Ubuntu · 241 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-linux-amd64.deb`}
                  className={styles.actionButton}
                  aria-label="Download for Linux (Debian / Ubuntu)"
                  download
                >
                  Download
                </a>
              </div>

              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <LinuxIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Linux (.rpm)</span>
                    <span className={styles.subMeta}>Fedora / RHEL · 213 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-linux-x86_64.rpm`}
                  className={styles.actionButton}
                  aria-label="Download for Linux (Fedora / RHEL)"
                  download
                >
                  Download
                </a>
              </div>

              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <LinuxIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Linux (.AppImage)</span>
                    <span className={styles.subMeta}>Universal · 303 MB</span>
                  </div>
                </div>
                <a
                  href={`${RELEASE_BASE_URL}/rovie-code-desktop-linux-x86_64.AppImage`}
                  className={styles.actionButton}
                  aria-label="Download for Linux (Universal AppImage)"
                  download
                >
                  Download
                </a>
              </div>

              {/* Cask CLI install */}
              <button
                type="button"
                className={styles.cliRow}
                onClick={() =>
                  handleCopy('brew install --cask rovie-code-desktop', 'desktop-cask')
                }
                aria-label="Copy desktop brew install command"
              >
                <code>
                  brew install --cask <strong>rovie-code-desktop</strong>
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'desktop-cask' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'desktop-cask' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>
            </div>
          </section>

          {/* Section 3: Extensions */}
          <section className={styles.downloadSection} aria-labelledby="extensions-section-heading">
            <div id="extensions-section-heading" className={styles.sectionLabel}>
              <span>[3]</span> Rovie Code Extensions
            </div>
            <div className={styles.sectionContent}>
              <h3 className={styles.platformGroupHeading}>VS Code & Cursor</h3>
              {EXTENSION_VARIANTS.map((ext) => (
                <div key={ext.id} className={styles.downloadRow}>
                  <div className={styles.downloadInfo}>
                    <span className={styles.iconWrap}>
                      {ext.id === 'vscode' && <VSCodeIcon />}
                      {ext.id === 'cursor' && <CursorIcon />}
                      {ext.id === 'windsurf' && <WindsurfIcon />}
                      {ext.id === 'vscodium' && <VSCodiumIcon />}
                    </span>
                    <span className={styles.platformName}>{ext.name}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.actionButton}
                    onClick={() => handleCopy(ext.command, ext.id)}
                    aria-label={`Copy ${ext.name} install command`}
                  >
                    {copiedKey === ext.id ? 'Copied' : 'Install'}
                  </button>
                </div>
              ))}

              {/* Direct VSIX Download */}
              <div className={styles.downloadRow}>
                <div className={styles.downloadInfo}>
                  <span className={styles.iconWrap}>
                    <VSCodeIcon />
                  </span>
                  <div className={styles.labelWrap}>
                    <span className={styles.platformName}>Direct Extension VSIX</span>
                    <span className={styles.subMeta}>v2.2.0 · {EXTENSION_DOWNLOAD.size}</span>
                  </div>
                </div>
                <a
                  href={EXTENSION_DOWNLOAD.vsixUrl}
                  className={styles.actionButton}
                  aria-label="Download VSIX"
                  download
                >
                  Download VSIX
                </a>
              </div>

              {/* CLI Command */}
              <button
                type="button"
                className={styles.cliRow}
                onClick={() => handleCopy(EXTENSION_DOWNLOAD.command, 'extension-cli')}
                aria-label="Copy editor install command"
              >
                <code>
                  code --install-extension <strong>rovie-code</strong>
                </code>
                <span
                  className={`${styles.copyStatus} ${
                    copiedKey === 'extension-cli' ? styles.copied : ''
                  }`}
                >
                  {copiedKey === 'extension-cli' ? <CheckIcon /> : <CopyIcon />}
                </span>
              </button>
            </div>
          </section>

          {/* Section 4: FAQ */}
          <section className={styles.faqSection} aria-labelledby="faq-title">
            <h2 id="faq-title" className={styles.faqTitle}>
              FAQ
            </h2>
            <ul className={styles.faqList}>
              {DOWNLOAD_FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <li key={faq.id} className={styles.faqItem}>
                    <button
                      type="button"
                      className={styles.faqQuestion}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    >
                      <span className={styles.faqIcon}>
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                      </span>
                      <span className={styles.faqQuestionText}>{faq.question}</span>
                    </button>
                    {isOpen && (
                      <div id={`faq-answer-${faq.id}`} className={styles.faqAnswer}>
                        {faq.answer}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
