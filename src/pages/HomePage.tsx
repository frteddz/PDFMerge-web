interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  { icon: 'merge', title: 'Merge', description: 'Combine multiple PDFs into one document' },
  { icon: 'split', title: 'Split', description: 'Divide a PDF into separate documents' },
  { icon: 'rotate', title: 'Rotate', description: 'Rotate individual pages to the correct orientation' },
  { icon: 'rearrange', title: 'Rearrange', description: 'Reorder pages by simple drag and drop' },
  { icon: 'drag', title: 'Drag & Drop', description: 'Intuitive drag-and-drop interface' },
  { icon: 'local', title: 'Local Processing', description: 'All processing happens on your machine' },
];

function FeatureIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    merge: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" /><path d="M3 12h18" />
      </svg>
    ),
    split: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    rotate: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
      </svg>
    ),
    rearrange: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    drag: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    local: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  };

  return (
    <div style={{
      width: 56, height: 56, borderRadius: 'var(--radius-lg)',
      background: 'var(--color-primary-light)', color: 'var(--color-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {icons[name] || null}
    </div>
  );
}

export function HomePage() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease forwards' }}>
      <div style={{ textAlign: 'center', marginBottom: 48, marginTop: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 'var(--radius-xl)',
          background: 'var(--color-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 40, fontWeight: 700,
        }}>
          P
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          PDFMerge
        </h1>
        <p style={{ fontSize: 18, color: 'var(--color-text-secondary)' }}>
          Modern PDF Toolkit
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20, maxWidth: 960, margin: '0 auto',
      }}>
        {features.map((f) => (
          <div
            key={f.title}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 24,
              transition: 'all var(--transition-normal)',
            }}
          >
            <FeatureIcon name={f.icon} />
            <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 16, marginBottom: 8, color: 'var(--color-text)' }}>
              {f.title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
