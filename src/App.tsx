import { useState, lazy, Suspense } from 'react';
import { useTheme } from './hooks/useTheme';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const MergePage = lazy(() => import('./pages/MergePage').then((m) => ({ default: m.MergePage })));
const SplitPage = lazy(() => import('./pages/SplitPage').then((m) => ({ default: m.SplitPage })));
const RotatePage = lazy(() => import('./pages/RotatePage').then((m) => ({ default: m.RotatePage })));

type Page = 'home' | 'merge' | 'split' | 'rotate';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'merge',
    label: 'Merge',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" /><path d="M3 12h18" />
      </svg>
    ),
  },
  {
    id: 'split',
    label: 'Split',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    id: 'rotate',
    label: 'Rotate',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    ),
  },
];

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 64, color: 'var(--color-text-tertiary)',
    }}>
      <div style={{
        width: 32, height: 32,
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isDark, toggleTheme } = useTheme();

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'merge': return <MergePage />;
      case 'split': return <SplitPage />;
      case 'rotate': return <RotatePage />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240, background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', padding: 16,
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 8px', marginBottom: 24,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--color-primary)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 18,
          }}>
            P
          </div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-text)' }}>
            PDFMerge
          </span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', border: 'none', borderRadius: 'var(--radius-md)',
                background: currentPage === item.id ? 'var(--color-primary-light)' : 'transparent',
                color: currentPage === item.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: currentPage === item.id ? 600 : 400,
                fontSize: 14, cursor: 'pointer', transition: 'all var(--transition-fast)',
                textAlign: 'left', width: '100%',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'transparent', color: 'var(--color-text-secondary)',
            fontSize: 14, cursor: 'pointer', width: '100%',
            transition: 'all var(--transition-fast)',
          }}
        >
          {isDark ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
      </aside>

      <main style={{
        flex: 1, padding: 32, overflow: 'auto',
        background: 'var(--color-background)',
      }}>
        <Suspense fallback={<LoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
