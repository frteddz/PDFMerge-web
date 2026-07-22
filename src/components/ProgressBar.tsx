interface ProgressBarProps {
  progress: number;
  status?: string;
}

export function ProgressBar({ progress, status }: ProgressBarProps) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 8,
        fontSize: 14,
        color: 'var(--color-text-secondary)',
      }}>
        <span>{status || 'Processing...'}</span>
        <span>{progress}%</span>
      </div>
      <div style={{
        width: '100%',
        height: 8,
        background: 'var(--color-surface-secondary)',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            background: 'var(--color-primary)',
            borderRadius: 4,
            transition: 'width var(--transition-normal)',
          }}
        />
      </div>
    </div>
  );
}
