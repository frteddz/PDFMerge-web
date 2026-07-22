export function formatPageCount(count: number): string {
  if (count === 1) return '1 page';
  return `${count} pages`;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${size} ${units[i]}`;
}

export function validatePDF(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}
