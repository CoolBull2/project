import axios from 'axios';

const AI_BACKEND_URL = 'http://localhost:3000';

export interface NetworkMetrics {
  timestamp: string;
  latency_ms: number;
  packet_loss: number;
  jitter_ms: number;
  errors: number;
}

export interface Anomaly {
  field: string;
  value: number;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface AnomalyResponse {
  anomalies: Anomaly[];
  timestamp: string;
  analysis: {
    summary: string;
    details: string[];
  };
}

export interface QueryResponse {
  response: string;
  confidence: number;
  category: string;
}

export const aiService = {
  async analyzeMetrics(metrics: NetworkMetrics): Promise<AnomalyResponse> {
    try {
      const response = await axios.post(`${AI_BACKEND_URL}/analyze-logs`, metrics);
      return response.data;
    } catch (error) {
      console.error('Failed to analyze metrics:', error);
      throw new Error('Analysis failed');
    }
  },

  async askQuestion(query: string): Promise<QueryResponse> {
    try {
      const response = await axios.post(`${AI_BACKEND_URL}/ask`, { query });
      return response.data;
    } catch (error) {
      console.error('Failed to process query:', error);
      throw new Error('Query processing failed');
    }
  }
};