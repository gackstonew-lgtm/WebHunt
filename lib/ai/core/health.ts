import { AIProviderId } from "./types";

interface ModelHealth {
  consecutiveFailures: number;
  lastFailureAt?: number;
  cooldownUntil?: number;
}

export class HealthTracker {
  private health: Map<string, ModelHealth> = new Map();

  private getKey(providerId: AIProviderId, modelId: string) {
    return `${providerId}:${modelId}`;
  }

  isHealthy(providerId: AIProviderId, modelId: string): boolean {
    const record = this.health.get(this.getKey(providerId, modelId));
    if (!record) return true;
    if (record.cooldownUntil && Date.now() < record.cooldownUntil) {
      return false; // Still on cooldown
    }
    return true;
  }

  recordSuccess(providerId: AIProviderId, modelId: string) {
    const key = this.getKey(providerId, modelId);
    this.health.set(key, { consecutiveFailures: 0 });
  }

  recordFailure(providerId: AIProviderId, modelId: string, isPermanent: boolean) {
    const key = this.getKey(providerId, modelId);
    const record = this.health.get(key) || { consecutiveFailures: 0 };
    
    record.consecutiveFailures += 1;
    record.lastFailureAt = Date.now();

    if (isPermanent) {
      // Cooldown for 1 hour for permanent errors like 404
      record.cooldownUntil = Date.now() + 3600 * 1000;
    } else {
      // Exponential backoff cooldown for transient (e.g. 10s, 20s, 40s)
      const delay = Math.min(10000 * Math.pow(2, record.consecutiveFailures - 1), 60000);
      record.cooldownUntil = Date.now() + delay;
    }

    this.health.set(key, record);
  }
}
