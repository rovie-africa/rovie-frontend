export const ROVIE_CODE_VERSION = 'v2.2.0';
export const RELEASE_BASE_URL = `https://github.com/rovie-africa/rovie-code/releases/download/${ROVIE_CODE_VERSION}`;
export const RELEASE_PAGE_URL = `https://github.com/rovie-africa/rovie-code/releases/tag/${ROVIE_CODE_VERSION}`;
export const SHA256SUMS_URL = `${RELEASE_BASE_URL}/SHA256SUMS`;

export interface DownloadArtifact {
  title: string;
  arch: string;
  format: string;
  size: string;
  url: string;
  recommended?: boolean;
}

export interface PlatformDownload {
  id: 'macos' | 'windows' | 'linux';
  name: string;
  artifacts: readonly DownloadArtifact[];
  packageManagerCommand?: string;
}

export const DESKTOP_DOWNLOADS: readonly PlatformDownload[] = [
  {
    id: 'macos',
    name: 'macOS',
    artifacts: [
      {
        title: 'Apple Silicon',
        arch: 'M1 · M2 · M3 · M4 (arm64)',
        format: '.dmg',
        size: '323 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-mac-arm64.dmg`,
        recommended: true,
      },
      {
        title: 'Intel',
        arch: 'Intel Core / Xeon (x64)',
        format: '.dmg',
        size: '335 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-mac-x64.dmg`,
      },
    ],
    packageManagerCommand: 'brew install --cask rovie-code-desktop',
  },
  {
    id: 'windows',
    name: 'Windows',
    artifacts: [
      {
        title: 'Windows x64',
        arch: 'Intel / AMD (64-bit)',
        format: '.exe',
        size: '259 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-win-x64.exe`,
        recommended: true,
      },
      {
        title: 'Windows ARM64',
        arch: 'Snapdragon / ARM64',
        format: '.exe',
        size: '246 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-win-arm64.exe`,
      },
    ],
  },
  {
    id: 'linux',
    name: 'Linux',
    artifacts: [
      {
        title: 'Debian / Ubuntu',
        arch: 'amd64 / x86_64',
        format: '.deb',
        size: '241 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-linux-amd64.deb`,
        recommended: true,
      },
      {
        title: 'Fedora / RHEL',
        arch: 'x86_64',
        format: '.rpm',
        size: '213 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-linux-x86_64.rpm`,
      },
      {
        title: 'Universal',
        arch: 'x86_64',
        format: '.AppImage',
        size: '303 MB',
        url: `${RELEASE_BASE_URL}/rovie-code-desktop-linux-x86_64.AppImage`,
      },
    ],
  },
];

export const EXTENSION_DOWNLOAD = {
  name: 'VS Code & Cursor',
  command: 'code --install-extension rovie-code',
  vsixUrl: `${RELEASE_BASE_URL}/rovie-code-2.2.0.vsix`,
  size: '5.4 KB',
};

export const EXTENSION_VARIANTS = [
  {
    id: 'vscode',
    name: 'VS Code',
    command: 'code --install-extension rovie-code',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    command: 'cursor --install-extension rovie-code',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    command: 'windsurf --install-extension rovie-code',
  },
  {
    id: 'vscodium',
    name: 'VSCodium',
    command: 'codium --install-extension rovie-code',
  },
] as const;

export const CLI_INSTALL_COMMANDS = {
  script: 'curl -fsSL https://code.rovie.africa/install | bash',
  npm: 'npm install -g rovie-code',
  bun: 'bun install -g --trust rovie-code',
  brew: 'brew install rovie-africa/tap/rovie-code',
};

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const DOWNLOAD_FAQS: readonly FaqItem[] = [
  {
    id: 'what-is-rovie-code',
    question: 'What is Rovie Code?',
    answer:
      'Rovie Code is an open autonomous coding agent designed for African engineers and global teams. It provides a coordinated agent workflow across native desktop workspaces, web interfaces, terminal CLI, and editor extensions.',
  },
  {
    id: 'subscriptions',
    question: 'Do I need extra AI subscriptions to use Rovie Code?',
    answer:
      'No external subscription is required. Rovie Code connects directly to Rovie Route with zero setup. You can fund your wallet in local currencies (NGN, KES, GHS, UGX, ZAR) or USD to access 32 frontier models including Claude 3.5 Sonnet, GPT-4o, Gemini, DeepSeek, and Qwen.',
  },
  {
    id: 'terminal-only',
    question: 'Can I only use Rovie Code in the terminal?',
    answer:
      'Not anymore! Rovie Code is available as a native desktop workspace for macOS, Windows, and Linux, in the browser with rovie web, and as an extension for VS Code and Cursor.',
  },
  {
    id: 'operating-systems',
    question: 'What operating systems are supported?',
    answer:
      'Native desktop builds are available for macOS (Apple Silicon and Intel), Windows (x64 and ARM64), and Linux (.deb, .rpm, and .AppImage). All builds are verified and signed.',
  },
  {
    id: 'open-source',
    question: 'Is Rovie Code open source?',
    answer:
      'Yes, Rovie Code is open source under the MIT License. You can inspect the source code, verify release SHA-256 checksums, submit pull requests, and contribute on GitHub.',
  },
];

