export interface Surface {
  id: 'desktop' | 'web' | 'terminal' | 'extension';
  name: string;
  badge: string;
  title: string;
  summary: string;
  command: string;
  webp: string;
  png: string;
  alt: string;
  width: number;
  height: number;
}

export const CODE_SURFACES: readonly Surface[] = [
  {
    id: 'desktop',
    name: 'Desktop',
    badge: 'macOS · Windows · Linux',
    title: 'Native desktop workspace',
    summary:
      'Multi-tab agent sessions, background service management, and local model orchestration in a native desktop window.',
    command: 'brew install rovie-africa/tap/rovie-code',
    webp: '/images/code/desktop.webp',
    png: '/images/code/desktop.png',
    alt: 'Rovie Code desktop application session view',
    width: 2786,
    height: 1824,
  },
  {
    id: 'web',
    name: 'Web',
    badge: 'Browser tunnel',
    title: 'Browser sessions and remote review',
    summary:
      'Review agent sessions and approve changes from any device. Pairs instantly with your background daemon over a secure local tunnel.',
    command: 'rovie pair',
    webp: '/images/code/web.webp',
    png: '/images/code/web.png',
    alt: 'Rovie Code web application in browser',
    width: 2752,
    height: 1834,
  },
  {
    id: 'terminal',
    name: 'Terminal',
    badge: 'CLI · TUI',
    title: 'Interactive command-line agent',
    summary:
      'Keyboard-first TUI launched directly in your repository. Generates contextual patches, runs shell tasks, and monitors spend in local currency.',
    command: 'npm install -g rovie-code',
    webp: '/images/code/terminal.webp',
    png: '/images/code/terminal.png',
    alt: 'Rovie Code interactive terminal interface',
    width: 2624,
    height: 1824,
  },
  {
    id: 'extension',
    name: 'Extension',
    badge: 'VS Code · Cursor',
    title: 'VS Code and Cursor integration',
    summary:
      'Side-by-side agent chat, prompt-to-edit interactions, and inline patch acceptance directly inside your existing code editor.',
    command: 'code --install-extension rovie-code',
    webp: '/images/code/extension.webp',
    png: '/images/code/extension.png',
    alt: 'Rovie Code extension running inside editor',
    width: 2690,
    height: 1790,
  },
];
