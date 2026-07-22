export interface PageRange {
  start: number;
  end: number;
}

export async function getPageCount(_file: File): Promise<number> {
  return new Promise((resolve) => {
    const count = Math.floor(Math.random() * 20) + 3;
    setTimeout(() => resolve(count), 300);
  });
}

export async function mergePDF(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const total = files.length;
  const chunks: Blob[] = [];
  for (let i = 0; i < total; i++) {
    const buf = await files[i].arrayBuffer();
    chunks.push(new Blob([buf], { type: 'application/pdf' }));
    onProgress?.(Math.round(((i + 1) / total) * 100));
    await new Promise((r) => setTimeout(r, 150));
  }
  return new Blob(chunks, { type: 'application/pdf' });
}

export async function splitPDF(
  file: File,
  ranges: PageRange[],
  onProgress?: (progress: number) => void
): Promise<Blob[]> {
  const results: Blob[] = [];
  for (let i = 0; i < ranges.length; i++) {
    const buf = await file.arrayBuffer();
    results.push(new Blob([buf], { type: 'application/pdf' }));
    onProgress?.(Math.round(((i + 1) / ranges.length) * 100));
    await new Promise((r) => setTimeout(r, 150));
  }
  return results;
}

export async function rotatePDF(
  file: File,
  _pages: number[],
  _angle: number,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const buf = await file.arrayBuffer();
  onProgress?.(100);
  await new Promise((r) => setTimeout(r, 300));
  return new Blob([buf], { type: 'application/pdf' });
}


