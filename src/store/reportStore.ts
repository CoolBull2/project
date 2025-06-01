import { create } from 'zustand';
import { NetworkReport, db_operations } from '../lib/db';

interface ReportStore {
  reports: NetworkReport[];
  isLoading: boolean;
  fetchReports: () => Promise<void>;
  addReport: (report: Omit<NetworkReport, 'id' | 'date'>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Promise<NetworkReport | undefined>;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  reports: [],
  isLoading: false,

  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const reports = await db_operations.fetchReports();
      set({ reports });
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addReport: async (reportData) => {
    try {
      const newReport = await db_operations.addReport(reportData);
      set((state) => ({ reports: [newReport, ...state.reports] }));
    } catch (error) {
      console.error('Error adding report:', error);
    }
  },

  deleteReport: async (id) => {
    try {
      await db_operations.deleteReport(id);
      set((state) => ({
        reports: state.reports.filter((report) => report.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  },

  getReport: async (id) => {
    return db_operations.getReport(id);
  },
}));

export type { NetworkReport };