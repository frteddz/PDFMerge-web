import type { PageData } from '../hooks/usePDF';

interface PagePreviewProps {
  page: PageData;
  onRotate?: (pageId: string, angle: number) => void;
  selected?: boolean;
  onToggleSelect?: (pageId: string) => void;
}

export function PagePreview({ page, onRotate, selected, onToggleSelect }: PagePreviewProps) {
  return (
    <div
      onClick={() => onToggleSelect?.(page.id)}
      style={{
        position: 'relative',
        background: 'var(--color-surface)',
        border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: 8,
        cursor: onToggleSelect ? 'pointer' : 'default',
        transition: 'all var(--transition-fast)',
      }}
    >
      <div
        style={{
          aspectRatio: '210 / 297',
          background: 'var(--color-surface-secondary)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: 'var(--color-text-secondary)',
          transform: page.rotation ? `rotate(${page.rotation}deg)` : undefined,
          transition: 'transform var(--transition-normal)',
        }}
      >
        Page {page.pageNumber}
      </div>
      {page.rotation !== 0 && (
        <span
          style={{
            position: 'absolute',
            top: 4,
            right: 4,
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: 11,
            padding: '2px 6px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
          }}
        >
          {page.rotation}°
        </span>
      )}
      {onRotate && (
        <div style={{ display: 'flex', gap: 4, marginTop: 8, justifyContent: 'center' }}>
          {[90, 180, 270].map((angle) => (
            <button
              key={angle}
              onClick={(e) => { e.stopPropagation(); onRotate(page.id, angle); }}
              style={{
                padding: '4px 8px',
                fontSize: 11,
                background: 'var(--color-surface-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              {angle}°
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
