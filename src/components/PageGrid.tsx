import type { PageData } from '../hooks/usePDF';
import { PagePreview } from './PagePreview';

interface PageGridProps {
  pages: PageData[];
  onRotatePage?: (id: string, angle: number) => void;
  selectedPages?: Set<string>;
  onToggleSelect?: (id: string) => void;
}

export function PageGrid({ pages, onRotatePage, selectedPages, onToggleSelect }: PageGridProps) {
  if (pages.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: 48,
        color: 'var(--color-text-tertiary)',
      }}>
        <p>No pages loaded</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 16,
    }}>
      {pages.map((page) => (
        <PagePreview
          key={page.id}
          page={page}
          onRotate={onRotatePage}
          selected={selectedPages?.has(page.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
