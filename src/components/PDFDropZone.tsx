import { useState, useCallback, useRef } from 'react';
import { validatePDF } from '../utils/pdfUtils';

interface PDFDropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function PDFDropZone({ onFiles, disabled }: PDFDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const files = Array.from(e.dataTransfer.files).filter(validatePDF);
    if (files.length > 0) onFiles(files);
  }, [disabled, onFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(validatePDF);
    if (files.length > 0) onFiles(files);
    if (inputRef.current) inputRef.current.value = '';
  }, [onFiles]);

  const handleClick = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${dragging ? 'var(--color-primary)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '48px 24px',
        textAlign: 'center',
        cursor: disabled ? 'default' : 'pointer',
        background: dragging ? 'var(--color-primary-light)' : 'var(--color-surface)',
        transition: 'all var(--transition-normal)',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <div style={{ fontSize: 48, marginBottom: 16, color: 'var(--color-primary)' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
        {dragging ? 'Drop PDFs here' : 'Drag & drop PDF files here'}
      </p>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        or click to browse &mdash; PDF files only
      </p>
    </div>
  );
}
