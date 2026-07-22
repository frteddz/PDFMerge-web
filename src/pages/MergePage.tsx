import { useState, useCallback } from 'react';
import { PDFDropZone } from '../components/PDFDropZone';
import { PDFFileList } from '../components/PDFFileList';
import { ProgressBar } from '../components/ProgressBar';
import { usePDF } from '../hooks/usePDF';
import { mergePDF } from '../services/pdfService';

export function MergePage() {
  const {
    files, loading, error, progress, status,
    addFiles, removeFile, reorderFiles,
    setProgress, setStatus, setLoading, setError, reset,
  } = usePDF();
  const [completed, setCompleted] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setCompleted(false);
    setResultBlob(null);
    await addFiles(newFiles);
  }, [addFiles]);

  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setLoading(true);
    setError(null);
    setCompleted(false);
    setResultBlob(null);
    try {
      const blob = await mergePDF(files.map((f) => f.file), (p) => setProgress(p));
      setResultBlob(blob);
      setStatus('Merge complete!');
      setCompleted(true);
    } catch {
      setError('Failed to merge PDFs');
    } finally {
      setLoading(false);
    }
  }, [files, setLoading, setError, setProgress, setStatus]);

  const handleDownload = useCallback(() => {
    if (!resultBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(resultBlob);
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [resultBlob]);

  const handleReset = useCallback(() => {
    reset();
    setCompleted(false);
    setResultBlob(null);
  }, [reset]);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease forwards', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>Merge PDFs</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Combine multiple PDF files into a single document</p>
      </div>

      {completed ? (
        <div style={{
          textAlign: 'center', padding: 48,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: 'var(--color-success)' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text)', marginBottom: 16 }}>
            PDFs merged successfully!
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={handleDownload}
              style={{
                padding: '10px 24px', background: 'var(--color-success)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download merged PDF
            </button>
            <button onClick={handleReset}
              style={{
                padding: '10px 24px', background: 'var(--color-primary)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}
            >
              Merge more files
            </button>
          </div>
        </div>
      ) : (
        <>
          {!loading && <PDFDropZone onFiles={handleFiles} />}

          <div style={{ marginTop: files.length > 0 ? 16 : 0 }}>
            <PDFFileList files={files} onReorder={reorderFiles} onRemove={removeFile} />
          </div>

          {error && (
            <div style={{
              padding: 12, background: 'var(--color-error-light)',
              color: 'var(--color-error)', borderRadius: 'var(--radius-md)',
              fontSize: 14, marginTop: 16,
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: 24 }}>
              <ProgressBar progress={progress} status={status} />
            </div>
          )}

          {files.length >= 2 && !loading && (
            <button onClick={handleMerge}
              style={{
                marginTop: 24, padding: '12px 32px',
                background: 'var(--color-primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 16, width: '100%', cursor: 'pointer',
              }}
            >
              Merge {files.length} files
            </button>
          )}

          {files.length > 0 && files.length < 2 && !loading && (
            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--color-text-tertiary)' }}>
              Add at least 2 PDF files to merge
            </p>
          )}
        </>
      )}
    </div>
  );
}
