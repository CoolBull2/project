import express from 'express';
import cors from 'cors';
import natural from 'natural';
import * as tf from '@tensorflow/tfjs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Simple anomaly detection using z-score
function detectAnomalies(metrics) {
  const threshold = 2; // Standard deviations
  const fields = ['latency_ms', 'packet_loss', 'jitter_ms', 'errors'];
  const anomalies = [];

  fields.forEach(field => {
    const value = metrics[field];
    const mean = historicalMean[field] || value;
    const stdDev = historicalStdDev[field] || 1;
    
    const zScore = Math.abs((value - mean) / stdDev);
    if (zScore > threshold) {
      anomalies.push({
        field,
        value,
        severity: zScore > 3 ? 'high' : 'medium',
        description: `Unusual ${field.replace('_', ' ')} detected`
      });
    }
  });

  return anomalies;
}

// Enhanced NLP for network-related queries
const classifier = new natural.BayesClassifier();

// Train the classifier with more comprehensive examples
classifier.addDocument('Why is the network slow?', 'latency');
classifier.addDocument('Why is my internet slow?', 'latency');
classifier.addDocument('High ping times', 'latency');
classifier.addDocument('Slow response time', 'latency');
classifier.addDocument('Website loading slowly', 'latency');
classifier.addDocument('Games lagging', 'latency');

classifier.addDocument('Why am I losing packets?', 'packet_loss');
classifier.addDocument('Connection dropping', 'packet_loss');
classifier.addDocument('Network disconnecting', 'packet_loss');
classifier.addDocument('Unstable connection', 'packet_loss');
classifier.addDocument('Packets getting lost', 'packet_loss');
classifier.addDocument('Connection timeout', 'packet_loss');

classifier.addDocument('Why is the connection unstable?', 'jitter');
classifier.addDocument('Network fluctuating', 'jitter');
classifier.addDocument('Inconsistent speeds', 'jitter');
classifier.addDocument('Variable connection', 'jitter');
classifier.addDocument('Unstable ping', 'jitter');
classifier.addDocument('Connection quality varies', 'jitter');

classifier.addDocument('Why are there so many errors?', 'errors');
classifier.addDocument('Network errors occurring', 'errors');
classifier.addDocument('Connection failures', 'errors');
classifier.addDocument('Failed network requests', 'errors');
classifier.addDocument('Network problems', 'errors');
classifier.addDocument('Connection issues', 'errors');

classifier.addDocument('Is my network secure?', 'security');
classifier.addDocument('Network vulnerabilities', 'security');
classifier.addDocument('Connection security', 'security');
classifier.addDocument('Network protection', 'security');
classifier.addDocument('Safe network', 'security');

classifier.addDocument('How can I improve my network?', 'optimization');
classifier.addDocument('Speed up network', 'optimization');
classifier.addDocument('Better connection', 'optimization');
classifier.addDocument('Optimize network', 'optimization');
classifier.addDocument('Faster internet', 'optimization');

classifier.train();

// Mock historical data
const historicalMean = {
  latency_ms: 100,
  packet_loss: 0.02,
  jitter_ms: 8,
  errors: 1
};

const historicalStdDev = {
  latency_ms: 20,
  packet_loss: 0.01,
  jitter_ms: 2,
  errors: 1
};

// Enhanced responses with more detailed explanations
const responses = {
  latency: {
    response: 'High latency can be caused by several factors: network congestion, distance to the server, insufficient bandwidth, or hardware limitations. Try these steps:\n1. Connect via ethernet instead of Wi-Fi\n2. Close bandwidth-heavy applications\n3. Check for background downloads\n4. Consider upgrading your internet plan',
    confidence: 0.9
  },
  packet_loss: {
    response: 'Packet loss often occurs due to network congestion, poor signal quality, or hardware issues. Here are some solutions:\n1. Check physical connections\n2. Move closer to your Wi-Fi router\n3. Update network drivers\n4. Contact your ISP if issues persist',
    confidence: 0.85
  },
  jitter: {
    response: 'Network jitter (connection instability) is usually caused by varying network conditions, interference, or router issues. Try these fixes:\n1. Use Quality of Service (QoS) settings\n2. Minimize Wi-Fi interference\n3. Update router firmware\n4. Consider a wired connection',
    confidence: 0.8
  },
  errors: {
    response: 'Network errors can indicate hardware problems, configuration issues, or service provider problems. Troubleshooting steps:\n1. Restart your network equipment\n2. Check for hardware failures\n3. Verify network settings\n4. Monitor error patterns',
    confidence: 0.85
  },
  security: {
    response: 'Network security is crucial. Here\'s a security checklist:\n1. Use WPA3 encryption if available\n2. Change default passwords\n3. Keep firmware updated\n4. Enable firewall protection\n5. Use a VPN for sensitive data',
    confidence: 0.9
  },
  optimization: {
    response: 'To optimize your network performance:\n1. Use modern networking equipment\n2. Position your router optimally\n3. Choose less congested Wi-Fi channels\n4. Consider mesh networking\n5. Regular maintenance and updates',
    confidence: 0.85
  }
};

app.post('/analyze-logs', (req, res) => {
  try {
    const metrics = req.body;
    const anomalies = detectAnomalies(metrics);
    
    res.json({
      anomalies,
      timestamp: new Date().toISOString(),
      analysis: {
        summary: anomalies.length > 0 
          ? 'Network issues detected'
          : 'Network performing normally',
        details: anomalies.map(a => a.description)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

app.post('/ask', (req, res) => {
  try {
    const { query } = req.body;
    const category = classifier.classify(query);
    const response = responses[category] || {
      response: 'I cannot answer that question specifically, but I can help with network performance, security, and optimization questions.',
      confidence: 0.5
    };

    res.json({
      response: response.response,
      confidence: response.confidence,
      category
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process query' });
  }
});

app.listen(port, () => {
  console.log(`AI backend running on port ${port}`);
});