import { create } from 'zustand';
import { DiagnosticResult } from '../lib/diagnostics';
import { Anomaly } from '../lib/ai';

interface DiagnosticStore {
  status: string | null;
  report: string | null;
  isLoading: boolean;
  diagnosticResults: DiagnosticResult[];
  suggestions: string[];
  anomalies: Anomaly[];
  setStatus: (status: string | null) => void;
  setReport: (report: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setDiagnosticResults: (results: DiagnosticResult[]) => void;
  setSuggestions: (suggestions: string[]) => void;
  setAnomalies: (anomalies: Anomaly[]) => void;
  clearAll: () => void;
}

export const useDiagnosticStore = create<DiagnosticStore>((set) => ({
  status: null,
  report: null,
  isLoading: false,
  diagnosticResults: [],
  suggestions: [],
  anomalies: [],
  setStatus: (status) => set({ status }),
  setReport: (report) => set({ report }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setDiagnosticResults: (results) => set({ diagnosticResults: results }),
  setSuggestions: (suggestions) => set({ suggestions }),
  setAnomalies: (anomalies) => set({ anomalies }),
  clearAll: () => set({
    status: null,
    report: null,
    isLoading: false,
    diagnosticResults: [],
    suggestions: [],
    anomalies: []
  })
}));