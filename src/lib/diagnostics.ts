import axios from "axios";

export interface DiagnosticResult {
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  recommendation: string;
  autoFix?: () => Promise<void>;
}

export interface NetworkPattern {
  type: string;
  frequency: number;
  impact: "low" | "medium" | "high";
  description: string;
}

export class NetworkDiagnostics {
  private static thresholds = {
    latency: { warning: 100, high: 300, critical: 500 },
    packetLoss: { warning: 2, high: 10, critical: 30 },
  };

  static async runSmartTests(): Promise<DiagnosticResult[]> {
    const results: DiagnosticResult[] = [];

    if (!navigator.onLine) {
      return [
        {
          issue: "Offline",
          severity: "critical",
          recommendation:
            "Your device is offline. Please connect to a network.",
        },
      ];
    }

    try {
      // DNS Test
      try {
        const dnsResponse = await fetch(
          "https://cloudflare-dns.com/dns-query?name=example.com&type=A",
          {
            headers: { accept: "application/dns-json" },
          }
        );
        if (!dnsResponse.ok) {
          results.push({
            issue: "DNS Resolution Problem",
            severity: "high",
            recommendation: "Use CloudFlare DNS (1.1.1.1) or Google DNS (8.8.8.8).",
          });
        }
      } catch {
        results.push({
          issue: "DNS Resolution Check Failed",
          severity: "high",
          recommendation: "Ensure DNS server is reachable. Try changing DNS settings.",
        });
      }

      // Latency & Packet Loss Test
      try {
        const response = await axios.get("http://127.0.0.1:5000/network-health");
        const { latency, packetLoss } = response.data;

        // LATENCY CHECK
        if (latency > this.thresholds.latency.critical) {
          results.push({
            issue: "Extreme Network Latency",
            severity: "critical",
            recommendation: "Switch to Ethernet and restart your router.",
          });
        } else if (latency > this.thresholds.latency.high) {
          results.push({
            issue: "High Network Latency",
            severity: "high",
            recommendation: "Reduce network load and check router placement.",
          });
        } else if (latency > this.thresholds.latency.warning) {
          results.push({
            issue: "Moderate Latency",
            severity: "medium",
            recommendation: "Pause background downloads or streaming apps.",
          });
        }

        // PACKET LOSS CHECK
        if (packetLoss > this.thresholds.packetLoss.critical) {
          results.push({
            issue: "Severe Packet Loss",
            severity: "critical",
            recommendation:
              "Try a wired connection and contact your ISP. This level of loss is unacceptable.",
          });
        } else if (packetLoss > this.thresholds.packetLoss.high) {
          results.push({
            issue: "High Packet Loss",
            severity: "high",
            recommendation:
              "Check cables, switch to Ethernet, and minimize interference.",
          });
        } else if (packetLoss > this.thresholds.packetLoss.warning) {
          results.push({
            issue: "Mild Packet Loss",
            severity: "medium",
            recommendation: "Reboot your modem and check for interference.",
          });
        }
      } catch {
        results.push({
          issue: "Latency and Packet Loss Check Failed",
          severity: "critical",
          recommendation:
            "Could not gather performance metrics. Ensure local server is running.",
        });
      }

      // Connection Type Info
      try {
        const connection = (navigator as any).connection || {};
        const effectiveType = connection.effectiveType || "unknown";

        if (["2g", "slow-2g"].includes(effectiveType)) {
          results.push({
            issue: "Slow Network Connection",
            severity: "high",
            recommendation: "Switch to a faster network like Wi-Fi or 4G/5G.",
          });
        }
      } catch {
        results.push({
          issue: "Connection Info Check Failed",
          severity: "low",
          recommendation: "Unable to check connection quality.",
        });
      }

      return results;
    } catch {
      results.push({
        issue: "Network Diagnostics Error",
        severity: "critical",
        recommendation: "An error occurred. Try restarting the app or checking your internet.",
      });
    }

    return results;
  }

  static async suggestFixes(
    diagnosticResults: DiagnosticResult[]
  ): Promise<string[]> {
    const suggestions = new Set<string>();
    const lowercasedIssues = diagnosticResults.map((r) => r.issue.toLowerCase());

    const isOffline = lowercasedIssues.some((issue) =>
      ["offline", "network diagnostics error", "latency and packet loss check failed"].some(
        (keyword) => issue.includes(keyword)
      )
    );

    if (isOffline) {
      suggestions.add("You're currently offline. Reconnect to Wi-Fi or Ethernet.");
      suggestions.add("Restart your modem/router.");
      suggestions.add("Check with your ISP for outages.");
      suggestions.add("Try toggling airplane mode or rebooting your device.");
      return Array.from(suggestions);
    }

    const relevantResults = diagnosticResults.filter(
      (r) =>
        r.severity !== "low" &&
        !r.issue.toLowerCase().includes("connection info check failed")
    );

    if (relevantResults.length === 0) {
      return ["Your network appears stable. No fixes are required."];
    }

    for (const result of relevantResults) {
      switch (result.severity) {
        case "critical":
          suggestions.add(`Urgent: ${result.recommendation}`);
          break;
        case "high":
          suggestions.add(`Important: ${result.recommendation}`);
          break;
        case "medium":
          suggestions.add(result.recommendation);
          break;
      }
    }

    if (lowercasedIssues.some((i) => i.includes("latency"))) {
      suggestions.add("Restart your router.");
      suggestions.add("Use a wired connection for better stability.");
      suggestions.add("Limit background data usage or streaming.");
    }

    if (lowercasedIssues.some((i) => i.includes("packet loss"))) {
      suggestions.add("Check router cables for damage.");
      suggestions.add("Avoid interference by moving closer to the router.");
      suggestions.add("Contact your ISP if issues persist.");
    }

    if (lowercasedIssues.some((i) => i.includes("dns"))) {
      suggestions.add("Change DNS to 1.1.1.1 or 8.8.8.8.");
      suggestions.add("Flush DNS cache on your system.");
    }

    if (lowercasedIssues.some((i) => i.includes("connection"))) {
      suggestions.add("Turn off battery saver mode.");
      suggestions.add("Update network drivers.");
    }

    return Array.from(suggestions);
  }
}
