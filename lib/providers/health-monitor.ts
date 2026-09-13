export interface ProviderHealthMetric {
  providerKey: string;
  name: string;
  type: "physical" | "online";
  status: "HEALTHY" | "DEGRADED" | "DOWN" | "REQUIRES_CREDENTIALS";
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  consecutiveFailures: number;
  averageLatencyMs: number;
  lastLatencyMs: number;
  lastSuccess?: string;
  lastFailure?: string;
  lastError?: string;
  totalResultsFound: number;
}

class ProviderHealthMonitor {
  private metrics = new Map<string, ProviderHealthMetric>();

  registerProvider(providerKey: string, name: string, type: "physical" | "online", isConfigured = true) {
    if (!this.metrics.has(providerKey)) {
      this.metrics.set(providerKey, {
        providerKey,
        name,
        type,
        status: isConfigured ? "HEALTHY" : "REQUIRES_CREDENTIALS",
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        consecutiveFailures: 0,
        averageLatencyMs: 0,
        lastLatencyMs: 0,
        totalResultsFound: 0,
      });
    }
  }

  recordSuccess(providerKey: string, latencyMs: number, resultCount: number) {
    const metric = this.metrics.get(providerKey);
    if (!metric) return;

    metric.totalRequests++;
    metric.successfulRequests++;
    metric.consecutiveFailures = 0;
    metric.lastLatencyMs = Math.round(latencyMs);
    metric.averageLatencyMs = Math.round(
      (metric.averageLatencyMs * (metric.successfulRequests - 1) + latencyMs) / metric.successfulRequests
    );
    metric.lastSuccess = new Date().toISOString();
    metric.totalResultsFound += resultCount;
    metric.status = "HEALTHY";
  }

  recordFailure(providerKey: string, latencyMs: number, error: Error | string) {
    const metric = this.metrics.get(providerKey);
    if (!metric) return;

    metric.totalRequests++;
    metric.failedRequests++;
    metric.consecutiveFailures++;
    metric.lastLatencyMs = Math.round(latencyMs);
    metric.lastFailure = new Date().toISOString();
    metric.lastError = typeof error === "string" ? error : error.message;

    if (metric.consecutiveFailures >= 5) {
      metric.status = "DOWN";
    } else if (metric.consecutiveFailures >= 2) {
      metric.status = "DEGRADED";
    }
  }

  getMetric(providerKey: string): ProviderHealthMetric | undefined {
    return this.metrics.get(providerKey);
  }

  getAllMetrics(): ProviderHealthMetric[] {
    return Array.from(this.metrics.values());
  }

  isProviderHealthy(providerKey: string): boolean {
    const m = this.metrics.get(providerKey);
    if (!m) return true;
    return m.status !== "DOWN";
  }
}

export const healthMonitor = new ProviderHealthMonitor();
export default healthMonitor;
