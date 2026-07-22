import { useRef } from 'react';
import type { PDFFileData } from '../hooks/usePDF';
import { formatFileSize, formatPageCount } from '../utils/pdfUtils';

interface PDFFileListProps {
  files: PDFFileData[];
  onReorder: (files: PDFFileData[]) => void;
  onRemove: (id: string) => void;
}

export function PDFFileList({ files, onReorder, onRemove }: PDFFileListProps) {
  const dragItem = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    const items = [...files];
    const [moved] = items.splice(dragItem.current, 1);
    items.splice(index, 0, moved);
    dragItem.current = index;
    onReorder(items);
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  if (files.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {files.map((file, index) => (
        <div
          key={file.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'grab',
            transition: 'all var(--transition-fast)',
          }}
        >
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: 20 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="8" y1="18" x2="16" y2="18" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              fontWeight: 500, fontSize: 14, color: 'var(--color-text)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {file.file.name}
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              {formatFileSize(file.file.size)} &middot; {formatPageCount(file.pageCount)}
            </p>
          </div>
          <button
            onClick={() => onRemove(file.id)}
            title="Remove file"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
