import React, { useState } from 'react';
import { AuroraBackground } from '../components/ui/aurora-background';
import { motion } from 'framer-motion';
import { Wifi, Globe, Server, RefreshCw, AlertTriangle } from 'lucide-react';
import { NetworkDiagnostics, DiagnosticResult } from '../lib/diagnostics';

function Issues() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const tests = [
    {
      id: 'connectivity',
      name: 'Internet Connectivity',
      icon: <Globe className="w-6 h-6" />,
      description: 'Test connection to major internet services'
    },
    {
      id: 'latency',
      name: 'Network Latency',
      icon: <Wifi className="w-6 h-6" />,
      description: 'Measure response times to key servers'
    },
    {
      id: 'dns',
      name: 'DNS Resolution',
      icon: <Server className="w-6 h-6" />,
      description: 'Check DNS server functionality'
    }
  ];

  const handleTest = async (testId: string) => {
    setIsLoading(true);
    setSelectedTest(testId);
    setDiagnosticResults([]);
    setSuggestions([]);

    try {
      // First run the diagnostic tests
      const results = await NetworkDiagnostics.runSmartTests();
      setDiagnosticResults(results);

      // Then generate suggestions based on the results
      const fixSuggestions = await NetworkDiagnostics.suggestFixes(results);
      setSuggestions(fixSuggestions);
    } catch (error) {
      setDiagnosticResults([{
        issue: 'Diagnostic Error',
        severity: 'critical',
        recommendation: 'Failed to run network diagnostics. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: DiagnosticResult['severity']) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  };

  const getSeverityBadge = (severity: DiagnosticResult['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl px-4 py-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Network Diagnostics
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {tests.map((test) => (
            <motion.button
              key={test.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTest(test.id)}
              className={`p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg text-left transition-colors ${
                selectedTest === test.id ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="text-blue-500">{test.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {test.name}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {test.description}
              </p>
            </motion.button>
          ))}
        </div>

        {selectedTest && (
          <div className="space-y-6">
            {/* Test Results */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Diagnostic Results
                </h3>
                {isLoading && (
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                )}
              </div>

              {isLoading ? (
                <p className="text-gray-600 dark:text-gray-300">Running diagnostics...</p>
              ) : diagnosticResults.length > 0 ? (
                <div className="space-y-4">
                  {diagnosticResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`font-semibold ${getSeverityColor(result.severity)}`}>
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {result.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-300">
                    No diagnostic results available. Run a test to see results.
                  </p>
                </div>
              )}
            </motion.div>

            {/* Recommended Fixes */}
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recommended Fixes
                </h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <Wifi className="w-4 h-4 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </AuroraBackground>
  );
}

export default Issues;