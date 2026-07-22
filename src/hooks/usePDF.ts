import { useState, useCallback } from 'react';
import { getPageCount } from '../services/pdfService';

export interface PDFFileData {
  id: string;
  file: File;
  pageCount: number;
}

export interface PageData {
  id: string;
  fileId: string;
  pageNumber: number;
  rotation: number;
}

export interface PDFState {
  files: PDFFileData[];
  pages: PageData[];
  loading: boolean;
  error: string | null;
  progress: number;
  status: string;
}

export interface PDFActions {
  addFiles: (files: File[]) => Promise<void>;
  removeFile: (id: string) => void;
  reorderFiles: (files: PDFFileData[]) => void;
  setPages: (pages: PageData[]) => void;
  rotatePage: (id: string, angle: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number) => void;
  setStatus: (status: string) => void;
  reset: () => void;
}

const initialState: PDFState = {
  files: [],
  pages: [],
  loading: false,
  error: null,
  progress: 0,
  status: '',
};

let fileIdCounter = 0;

export function usePDF(): PDFState & PDFActions {
  const [state, setState] = useState<PDFState>(initialState);

  const addFiles = useCallback(async (newFiles: File[]) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const filesData: PDFFileData[] = [];
      for (const file of newFiles) {
        const pageCount = await getPageCount(file);
        filesData.push({ id: `file-${++fileIdCounter}`, file, pageCount });
      }
      setState((s) => ({
        ...s,
        files: [...s.files, ...filesData],
        loading: false,
      }));
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Failed to process files' }));
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      files: s.files.filter((f) => f.id !== id),
      pages: s.pages.filter((p) => p.fileId !== id),
    }));
  }, []);

  const reorderFiles = useCallback((files: PDFFileData[]) => {
    setState((s) => ({ ...s, files }));
  }, []);

  const setPages = useCallback((pages: PageData[]) => {
    setState((s) => ({ ...s, pages }));
  }, []);

  const rotatePage = useCallback((id: string, angle: number) => {
    setState((s) => ({
      ...s,
      pages: s.pages.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + angle) % 360 } : p
      ),
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((s) => ({ ...s, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((s) => ({ ...s, error }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState((s) => ({ ...s, progress }));
  }, []);

  const setStatus = useCallback((status: string) => {
    setState((s) => ({ ...s, status }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    addFiles,
    removeFile,
    reorderFiles,
    setPages,
    rotatePage,
    setLoading,
    setError,
    setProgress,
    setStatus,
    reset,
  };
}
