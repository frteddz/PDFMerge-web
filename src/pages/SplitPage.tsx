import { useState, useCallback } from 'react';
import { PDFDropZone } from '../components/PDFDropZone';
import { ProgressBar } from '../components/ProgressBar';
import { usePDF } from '../hooks/usePDF';
import { splitPDF } from '../services/pdfService';
import type { PageRange } from '../services/pdfService';

export function SplitPage() {
  const {
    files, loading, error, progress, status,
    addFiles, removeFile,
    setProgress, setStatus, setLoading, setError, reset,
  } = usePDF();
  const [rangeInput, setRangeInput] = useState('');
  const [completed, setCompleted] = useState(false);
  const [resultBlobs, setResultBlobs] = useState<Blob[]>([]);

  const handleFiles = useCallback(async (newFiles: File[]) => {
    setCompleted(false);
    setResultBlobs([]);
    await addFiles(newFiles.slice(0, 1));
  }, [addFiles]);

  const parseRanges = useCallback((input: string): PageRange[] => {
    const ranges: PageRange[] = [];
    const parts = input.split(',').map((p) => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        if (!isNaN(a) && !isNaN(b)) ranges.push({ start: a, end: b });
      } else {
        const n = Number(part);
        if (!isNaN(n)) ranges.push({ start: n, end: n });
      }
    }
    return ranges;
  }, []);

  const handleSplit = useCallback(async () => {
    if (files.length === 0) return;
    const ranges = parseRanges(rangeInput);
    if (ranges.length === 0) return;
    setLoading(true);
    setError(null);
    setCompleted(false);
    setResultBlobs([]);
    try {
      const blobs = await splitPDF(files[0].file, ranges, (p) => setProgress(p));
      setResultBlobs(blobs);
      setStatus('Split complete!');
      setCompleted(true);
    } catch {
      setError('Failed to split PDF');
    } finally {
      setLoading(false);
    }
  }, [files, rangeInput, parseRanges, setLoading, setError, setProgress, setStatus]);

  const handleDownloadAll = useCallback(() => {
    resultBlobs.forEach((blob, i) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `split-part-${i + 1}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }, [resultBlobs]);

  const handleReset = useCallback(() => {
    reset();
    setCompleted(false);
    setRangeInput('');
    setResultBlobs([]);
  }, [reset]);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease forwards', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4 }}>Split PDF</h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Divide a PDF into separate documents by page ranges</p>
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
            PDF split successfully! ({resultBlobs.length} parts)
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={handleDownloadAll}
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
              Download all parts
            </button>
            <button onClick={handleReset}
              style={{
                padding: '10px 24px', background: 'var(--color-primary)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}
            >
              Split another file
            </button>
          </div>
        </div>
      ) : (
        <>
          {!loading && files.length === 0 && <PDFDropZone onFiles={handleFiles} />}

          {files.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 16px', background: 'var(--color-surface)',
              border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
              marginBottom: 20,
            }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--color-text)' }}>{files[0].file.name}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>Enter page ranges to extract</p>
              </div>
              <button onClick={() => removeFile(files[0].id)}
                style={{
                  background: 'none', border: 'none',
                  color: 'var(--color-text-tertiary)', cursor: 'pointer', padding: 4,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {files.length > 0 && !loading && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: 'var(--color-text)', marginBottom: 8 }}>
                Page ranges
              </label>
              <input
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-9"
                style={{
                  width: '100%', padding: '10px 14px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text)', fontSize: 14, outline: 'none',
                }}
              />
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                Enter page numbers or ranges separated by commas
              </p>
            </div>
          )}

          {error && (
            <div style={{
              padding: 12, background: 'var(--color-error-light)',
              color: 'var(--color-error)', borderRadius: 'var(--radius-md)', fontSize: 14, marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {loading && (
            <div style={{ marginTop: 24 }}>
              <ProgressBar progress={progress} status={status} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <button onClick={handleSplit}
              disabled={!rangeInput.trim()}
              style={{
                marginTop: 8, padding: '12px 32px',
                background: rangeInput.trim() ? 'var(--color-primary)' : 'var(--color-border)',
                color: rangeInput.trim() ? '#fff' : 'var(--color-text-tertiary)',
                border: 'none', borderRadius: 'var(--radius-md)',
                fontWeight: 600, fontSize: 16, width: '100%',
                cursor: rangeInput.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Split PDF
            </button>
          )}
        </>
      )}
    </div>
  );
}
