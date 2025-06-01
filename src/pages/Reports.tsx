import React, { useState, useEffect } from 'react';
import { AuroraBackground } from '../components/ui/aurora-background';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useReportStore } from '../store/reportStore';
import { ReportCard } from '../components/ReportCard';
import { NetworkMetricsChart } from '../components/NetworkMetricsChart';
import axios from 'axios';

function Reports() {
  const { reports, isLoading, fetchReports, addReport, deleteReport } = useReportStore();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const generateNewReport = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get('http://127.0.0.1:5000/network-health');
      const networkData = response.data;
      
      // Extract latency and packet loss from the response
      const latencyMatch = networkData.reason.match(/(\d+\.?\d*)\s*ms/);
      const packetLossMatch = networkData.reason.match(/(\d+)\s*%\s*packet loss/);
      
      const latency = latencyMatch ? parseFloat(latencyMatch[1]) : 0;
      const packetLoss = packetLossMatch ? parseInt(packetLossMatch[1]) : 0;
      
      // Estimate bandwidth based on latency (this is a simplified estimation)
      const bandwidth = Math.max(1000 - latency * 2, 100);

      const newReport = {
        title: `Network Performance Report`,
        status: networkData.status === 'healthy' ? 'Completed' : networkData.status === 'warning' ? 'In Progress' : 'Failed',
        type: 'Performance',
        details: {
          latency,
          packetLoss,
          bandwidth,
          dnsResolution: networkData.status !== 'critical',
        },
        summary: networkData.reason,
      };

      await addReport(newReport);
    } catch (error) {
      // Add error report
      await addReport({
        title: 'Network Analysis Failed',
        status: 'Failed',
        type: 'Error',
        details: {
          latency: 0,
          packetLoss: 100,
          bandwidth: 0,
          dnsResolution: false,
        },
        summary: 'Failed to connect to network analysis service.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (selectedReport === id) {
      setSelectedReport(null);
    }
    await deleteReport(id);
  };

  const chartData = {
    labels: reports.slice(0, 10).map(r => r.date.split(' ')[0]).reverse(),
    latency: reports.slice(0, 10).map(r => r.details.latency).reverse(),
    packetLoss: reports.slice(0, 10).map(r => r.details.packetLoss).reverse(),
  };

  if (isLoading) {
    return (
      <AuroraBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AuroraBackground>
    );
  }

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl px-4 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Network Reports
          </h1>
          <button
            onClick={generateNewReport}
            disabled={isGenerating}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 ${
              isGenerating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FileText className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate New Report'}
          </button>
        </div>

        {reports.length > 0 ? (
          <>
            <div className="mb-8">
              <NetworkMetricsChart data={chartData} />
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {reports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDelete={handleDeleteReport}
                    onView={(id) => setSelectedReport(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center gap-4 p-8 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
          >
            <AlertCircle className="w-12 h-12 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">No reports available</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate a new report to see network performance metrics
            </p>
          </motion.div>
        )}
      </motion.div>
    </AuroraBackground>
  );
}

export default Reports;