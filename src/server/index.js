import express from "express";
import cors from "cors";
import natural from "natural";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function detectAnomalies(metrics) {
  const threshold = 2; // Standard deviations
  const fields = ["latency_ms", "packet_loss", "jitter_ms", "errors"];
  const anomalies = [];

  fields.forEach((field) => {
    const value = metrics[field];
    const mean = historicalMean[field] || value;
    const stdDev = historicalStdDev[field] || 1;

    const zScore = Math.abs((value - mean) / stdDev);
    if (zScore > threshold) {
      anomalies.push({
        field,
        value,
        severity: zScore > 3 ? "high" : "medium",
        description: `Unusual ${field.replace("_", " ")} detected`,
      });
    }
  });

  return anomalies;
}

const classifier = new natural.BayesClassifier();

// Latency
classifier.addDocument("Why is the network slow?", "latency");
classifier.addDocument("Why is my internet slow?", "latency");
classifier.addDocument("High ping times", "latency");
classifier.addDocument("Slow response time", "latency");
classifier.addDocument("Website loading slowly", "latency");
classifier.addDocument("Games lagging", "latency");
classifier.addDocument("Streaming keeps buffering", "latency");
classifier.addDocument("Lag while browsing", "latency");

// Packet Loss
classifier.addDocument("Why am I losing packets?", "packet_loss");
classifier.addDocument("Connection dropping", "packet_loss");
classifier.addDocument("Network disconnecting", "packet_loss");
classifier.addDocument("Unstable connection", "packet_loss");
classifier.addDocument("Packets getting lost", "packet_loss");
classifier.addDocument("Connection timeout", "packet_loss");
classifier.addDocument("Voice call cuts", "packet_loss");

// Jitter
classifier.addDocument("Why is the connection unstable?", "jitter");
classifier.addDocument("Network fluctuating", "jitter");
classifier.addDocument("Inconsistent speeds", "jitter");
classifier.addDocument("Variable connection", "jitter");
classifier.addDocument("Unstable ping", "jitter");
classifier.addDocument("Connection quality varies", "jitter");

// Errors
classifier.addDocument("Why are there so many errors?", "errors");
classifier.addDocument("Network errors occurring", "errors");
classifier.addDocument("Connection failures", "errors");
classifier.addDocument("Failed network requests", "errors");
classifier.addDocument("Network problems", "errors");
classifier.addDocument("Connection issues", "errors");
classifier.addDocument("Page load errors", "errors");

// Security
classifier.addDocument("Is my network secure?", "security");
classifier.addDocument("Network vulnerabilities", "security");
classifier.addDocument("Connection security", "security");
classifier.addDocument("Network protection", "security");
classifier.addDocument("Safe network", "security");
classifier.addDocument("Someone hacked my Wi-Fi", "security");

// Optimization
classifier.addDocument("How can I improve my network?", "optimization");
classifier.addDocument("Speed up network", "optimization");
classifier.addDocument("Better connection", "optimization");
classifier.addDocument("Optimize network", "optimization");
classifier.addDocument("Faster internet", "optimization");
classifier.addDocument("Improve internet speed", "optimization");
classifier.addDocument("Enhance performance", "optimization");

// Greetings
classifier.addDocument("hi", "greeting");
classifier.addDocument("hello", "greeting");
classifier.addDocument("hey", "greeting");
classifier.addDocument("good morning", "greeting");
classifier.addDocument("good evening", "greeting");

// Identity
classifier.addDocument("tell me about yourself", "identity");
classifier.addDocument("are you a bot", "identity");

classifier.train();

const responses = {
  latency: {
    response: `High latency can result from congestion, distance, or limited bandwidth. Try:
1. Using a wired connection
2. Closing bandwidth-heavy apps
3. Restarting your router
4. Contacting your ISP`,
    confidence: 0.9,
  },
  packet_loss: {
    response: `Packet loss may be caused by weak signals or overloaded networks. Solutions:
1. Secure all cable connections
2. Use Ethernet instead of Wi-Fi
3. Restart network hardware
4. Update firmware/drivers`,
    confidence: 0.85,
  },
  jitter: {
    response: `Jitter causes fluctuations in your network quality. Fixes include:
1. Avoiding network congestion
2. Using a wired connection
3. Updating router settings
4. Using Quality of Service (QoS) settings`,
    confidence: 0.8,
  },
  errors: {
    response: `Frequent network errors can result from hardware issues or misconfigurations:
1. Restart modem/router
2. Check cable and port integrity
3. Scan for malware
4. Contact your ISP if persistent`,
    confidence: 0.85,
  },
  security: {
    response: `To secure your network:
1. Use WPA3 or WPA2 encryption
2. Set a strong Wi-Fi password
3. Disable remote access
4. Update firmware regularly
5. Use firewalls and VPNs`,
    confidence: 0.9,
  },
  optimization: {
    response: `Optimize your connection by:
1. Placing your router centrally
2. Using dual-band or mesh networks
3. Minimizing interference
4. Upgrading old equipment
5. Regularly restarting devices`,
    confidence: 0.85,
  },
  greeting: {
    response: "Hello! 👋 How can I assist you with your network today?",
    confidence: 1.0,
  },
  identity: {
    response:
      "I’m your AI-powered Network Troubleshooter! I help diagnose and resolve common network issues such as latency, packet loss, jitter, and more.",
    confidence: 1.0,
  },
};

app.post("/analyze-logs", (req, res) => {
  try {
    const metrics = req.body;
    const anomalies = detectAnomalies(metrics);

    res.json({
      anomalies,
      timestamp: new Date().toISOString(),
      analysis: {
        summary:
          anomalies.length > 0
            ? "Network issues detected"
            : "Network performing normally",
        details: anomalies.map((a) => a.description),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Analysis failed" });
  }
});
// Mock historical data
const historicalMean = {
  latency_ms: 100,
  packet_loss: 0.02,
  jitter_ms: 8,
  errors: 1,
};

const historicalStdDev = {
  latency_ms: 20,
  packet_loss: 0.01,
  jitter_ms: 2,
  errors: 1,
};
app.post("/ask", (req, res) => {
  try {
    const { query } = req.body;
    const category = classifier.classify(query);
    const response = responses[category] || {
      response:
        "I cannot answer that question specifically, but I can help with network performance, security, and optimization questions.",
      confidence: 0.5,
    };

    res.json({
      response: response.response,
      confidence: response.confidence,
      category,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process query" });
  }
});

app.listen(port, () => {
  console.log(`AI backend running on port ${port}`);
});
