import { useState, useCallback } from 'react';
import { PDFDropZone } from '../components/PDFDropZone';
import { PageGrid } from '../components/PageGrid';
import { ProgressBar } from '../components/ProgressBar';
import { usePDF } from '../hooks/usePDF';
import { rotatePDF } from '../services/pdfService';

export function RotatePage() {
  const {
    files, pages, loading, error, progress, status,
    addFiles, removeFile, setPages, rotatePage,
    setProgress, setStatus, setLoading, setError, reset,
  } = usePDF();
  const [completed, setCompleted] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setCompleted(false);
    setResultBlob(null);
    await addFiles(newFiles.slice(0, 1));
  }, [addFiles]);

  const generatePages = useCallback(() => {
    if (files.length === 0) return;
    const file = files[0];
    const newPages = Array.from({ length: file.pageCount }, (_, i) => ({
      id: `page-${file.id}-${i + 1}`,
      fileId: file.id,
      pageNumber: i + 1,
      rotation: 0,
    }));
    setPages(newPages);
  }, [files, setPages]);

  const handleSave = useCallback(async () => {
    if (files.length === 0) return;
    const rotatedPages = pages
      .filter((p) => p.rotation !== 0)
      .map((p) => p.pageNumber);
    if (rotatedPages.length === 0) return;
    setLoading(true);
    setError(null);
    setCompleted(false);
    setResultBlob(null);
    try {
      const angle = pages.find((p) => p.rotation !== 0)?.rotation || 90;
      const blob = await rotatePDF(files[0].file, rotatedPages, angle, (p) => setProgress(p));
      setResultBlob(blob);
      setStatus('Save complete!');
      setCompleted(true);
    } catch {
      setError('Failed to rotate PDF');
    } finally {
      setLoading(false);
    }
  }, [files, pages, setLoading, setError, setProgress, setStatus]);

  const handleDownload = useCallback(() => {
    if (!resultBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(resultBlob);
    a.download = files[0]?.file.name?.replace('.pdf', '-rotated.pdf') || 'rotated.pdf';
    a.click();
    URL.revokeObjectURL(a.href);
  }, [resultBlob, files]);

  const handleReset = useCallback(() => {
    reset();
    setCompleted(false);
    setResultBlob(null);
  }, [reset]);

  const needsSave = pages.some((p) => p.rotation !== 0);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease forwards', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>Rotate Pages</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Rotate individual pages to the correct orientation</p>
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
            Pages rotated successfully!
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
              Download rotated PDF
            </button>
            <button onClick={handleReset}
              style={{
                padding: '10px 24px', background: 'var(--color-primary)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}
            >
              Rotate another file
            </button>
          </div>
        </div>
      ) : (
        <>
          {!loading && files.length === 0 && <PDFDropZone onFiles={handleFiles} />}

          {files.length > 0 && pages.length === 0 && !loading && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button onClick={generatePages}
                style={{
                  padding: '10px 24px', background: 'var(--color-primary)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}
              >
                Load page previews
              </button>
              <div style={{ marginTop: 16 }}>
                <button onClick={() => removeFile(files[0].id)}
                  style={{
                    padding: '8px 16px', background: 'none',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-secondary)', fontSize: 14, cursor: 'pointer',
                  }}
                >
                  Remove file
                </button>
              </div>
            </div>
          )}

          {pages.length > 0 && (
            <>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  {pages.length} page{pages.length !== 1 ? 's' : ''}
                </p>
                <button onClick={() => removeFile(files[0]?.id || '')}
                  style={{
                    padding: '6px 12px', background: 'none',
                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-secondary)', fontSize: 13, cursor: 'pointer',
                  }}
                >
                  Change file
                </button>
              </div>
              <PageGrid
                pages={pages}
                onRotatePage={rotatePage}
              />
            </>
          )}

          {error && (
            <div style={{
              padding: 12, background: 'var(--color-error-light)',
              color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 14, marginTop: 16,
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: 24 }}>
              <ProgressBar progress={progress} status={status} />
            </div>
          )}

          {needsSave && !loading && (
            <button onClick={handleSave}
              style={{
                marginTop: 24, padding: '12px 32px',
                background: 'var(--color-primary)', color: '#fff',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 16, width: '100%', cursor: 'pointer',
              }}
            >
              Save rotated PDF
            </button>
          )}
        </>
      )}
    </div>
  );
}
