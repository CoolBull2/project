import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Trash2, ExternalLink } from 'lucide-react';
import type { NetworkReport } from '../store/reportStore';

interface ReportCardProps {
  report: NetworkReport;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete, onView }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-500';
      case 'In Progress':
        return 'text-yellow-500';
      case 'Failed':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {report.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>{report.date}</span>
            <span>•</span>
            <span>{report.type}</span>
            <span>•</span>
            <span className={getStatusColor(report.status)}>{report.status}</span>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{report.summary}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView(report.id)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            title="View Details"
          >
            <ExternalLink className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: 'application/json',
              });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `network-report-${report.id}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            title="Download Report"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(report.id)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            title="Delete Report"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};