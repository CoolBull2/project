import { useState } from "react";
import axios from "axios";
import { NetworkStatus } from "../components/NetworkStatus";
import { AuroraBackground } from "../components/ui/aurora-background";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, PenTool as Tool, Zap } from "lucide-react";
import { NetworkDiagnostics, DiagnosticResult } from "../lib/diagnostics";
import { aiService, type NetworkMetrics } from "../lib/ai";
import { useReportStore } from "../store/reportStore";
import { useDiagnosticStore } from "../store/diagnosticStore";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [showFixes, setShowFixes] = useState(true);
  const { addReport } = useReportStore();

  const {
    status,
    report,
    diagnosticResults,
    suggestions,
    anomalies,
    setStatus,
    setReport,
    setDiagnosticResults,
    setSuggestions,
    setAnomalies,
  } = useDiagnosticStore();

  const runDiagnostics = async () => {
    setIsLoading(true);
    setStatus("checking");
    try {
      // Run network health check
      const response = await axios.get("http://127.0.0.1:5000/network-health");
      setStatus(response.data.status);
      setReport(response.data.reason);

      // Extract metrics from the response
      const metrics: NetworkMetrics = {
        timestamp: new Date().toISOString(),
        latency_ms: parseFloat(response.data.latency),
        packet_loss: parseFloat(response.data.packetl),
        jitter_ms: Math.random() * 20, // Mock jitter data
        errors: Math.floor(Math.random() * 5), // Mock error count
      };

      // Run AI analysis
      const aiAnalysis = await aiService.analyzeMetrics(metrics);
      setAnomalies(aiAnalysis.anomalies);

      // Run diagnostic tests
      const results = await NetworkDiagnostics.runSmartTests();
      setDiagnosticResults(results);

      // Generate fix suggestions
      const fixSuggestions = await NetworkDiagnostics.suggestFixes(results);
      setSuggestions(fixSuggestions);

      // Save diagnostic results to reports
      await addReport({
        title: "Network Diagnostic Report",
        status:
          response.data.status === "healthy"
            ? "Completed"
            : response.data.status === "warning"
            ? "In Progress"
            : "Failed",
        type: "Diagnostic",
        details: {
          latency: metrics.latency_ms,
          packetLoss: metrics.packet_loss,
          bandwidth: 1000 - metrics.latency_ms, // Simplified bandwidth estimation
          dnsResolution: response.data.status !== "critical",
        },
        summary: `${response.data.reason}\n${results
          .map((r) => `- ${r.issue}: ${r.recommendation}`)
          .join("\n")}`,
      });
    } catch (error) {
      setStatus("critical");
      setReport("Error fetching report.");
      setDiagnosticResults([
        {
          issue: "Network Connectivity Error",
          severity: "critical",
          recommendation:
            "Unable to connect to diagnostic service. Please check your connection.",
        },
      ]);
      setSuggestions([
        "Check your internet connection",
        "Ensure the diagnostic service is running",
      ]);
      setAnomalies([]);

      // Save error report
      await addReport({
        title: "Network Diagnostic Error",
        status: "Failed",
        type: "Error",
        details: {
          latency: 0,
          packetLoss: 100,
          bandwidth: 0,
          dnsResolution: false,
        },
        summary:
          "Failed to connect to diagnostic service. Network may be unreachable.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: DiagnosticResult["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      default:
        return "text-blue-500";
    }
  };

  const getSeverityBadge = (severity: DiagnosticResult["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const timestamp = new Date().toLocaleTimeString();
  const hasNoIssues =
    diagnosticResults.length === 0 &&
    suggestions.length === 0 &&
    anomalies.length === 0 &&
    status === "healthy";

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl px-4 py-8"
      >
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Network Health Monitor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Real-time network diagnostics and monitoring
          </p>
        </div>

        <div className="grid gap-6">
          <NetworkStatus status={status} />

          <div className="flex gap-4 justify-center">
            <button
              onClick={runDiagnostics}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              <Activity className="w-5 h-5" />
              {isLoading ? "Running Diagnostics..." : "Run Diagnostics"}
            </button>
          </div>

          {report && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Network Report
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{report}</p>
            </motion.div>
          )}

          {/* Diagnostic Results and Suggestions */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Network Diagnostics
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last checked: {timestamp}
              </p>
            </div>

            <AnimatePresence>
              {hasNoIssues && !isLoading && status ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center"
                >
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ✅ Everything Looks Great!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    No network issues were detected at the moment.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid gap-6"
                >
                  {/* Current Issues */}
                  {diagnosticResults.length > 0 && (
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-semibold">
                          Current Issues
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {diagnosticResults.map((result, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span
                                className={`font-semibold ${getSeverityColor(
                                  result.severity
                                )}`}
                              >
                                {result.issue}
                              </span>
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded-full ${getSeverityBadge(
                                  result.severity
                                )}`}
                              >
                                {result.severity.toUpperCase()}
                              </span>
                            </div>
                            
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {suggestions.length > 0 && (
                    <>
                      <button
                        onClick={() => setShowFixes(!showFixes)}
                        className="text-sm text-blue-600 dark:text-blue-400 underline"
                      >
                        {showFixes ? "Hide" : "Show"} Recommendations
                      </button>

                      {showFixes && (
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                          <div className="flex items-center gap-2 mb-4">
                            <Tool className="w-5 h-5 text-green-500" />
                            <h3 className="text-lg font-semibold">
                              Recommended Fixes
                            </h3>
                          </div>
                          <div className="grid gap-4">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start gap-3"
                              >
                                <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                  {suggestion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}

export default Dashboard;
