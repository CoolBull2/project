import { create } from 'zustand';
import { DiagnosticResult } from '../lib/diagnostics';

interface DiagnosticStore {
  status: string | null;
  report: string | null;
  isLoading: boolean;
  diagnosticResults: DiagnosticResult[];
  suggestions: string[];
  setStatus: (status: string | null) => void;
  setReport: (report: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDiagnosticResults: (results: DiagnosticResult[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  clearAll: () => void;
}

export const useDiagnosticStore = create<DiagnosticStore>((set) => ({
  status: null,
  report: null,
  isLoading: false,
  diagnosticResults: [],
  suggestions: [],
  setStatus: (status) => set({ status }),
  setReport: (report) => set({ report }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setDiagnosticResults: (results) => set({ diagnosticResults: results }),
  setSuggestions: (suggestions) => set({ suggestions }),
  clearAll: () => set({
    status: null,
    report: null,
    isLoading: false,
    diagnosticResults: [],
    suggestions: []
  })
}));