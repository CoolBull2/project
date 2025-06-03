import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService, type Anomaly } from '../lib/ai';
import { useaiStore } from '../store/aistore';

interface AiInsightsProps {
  anomalies: Anomaly[];
}

export const AiInsights: React.FC<AiInsightsProps> = ({ anomalies }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Zustand state
  const query = useaiStore((state) => state.query);
  const response = useaiStore((state) => state.response);
  const setQuery = useaiStore((state) => state.setQuery);
  const setResponse = useaiStore((state) => state.setResponse);

  const handleAsk = async () => {
    if (!query?.trim()) return;

    setIsLoading(true);
    try {
      const result = await aiService.askQuestion(query);
      setResponse(result);
    } catch (error) {
      console.error('Failed to get response:', error);
      setResponse({ response: 'An error occurred.', confidence: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Ask About Your Network</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query || ''}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., Why is the network slow?"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              disabled={isLoading || !query?.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Thinking...' : 'Ask'}
            </button>
          </div>

          <AnimatePresence>
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <p className="text-gray-900 dark:text-white">{response.response}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Confidence: {(response.confidence * 100).toFixed(1)}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
