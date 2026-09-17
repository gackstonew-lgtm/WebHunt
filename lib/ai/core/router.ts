import { AIModel, AIRequest, AIRoutingStrategy, AICapability } from "./types";
import { ModelRegistry } from "./registry";
import { HealthTracker } from "./health";

export class Router {
  constructor(
    private registry: ModelRegistry,
    private health: HealthTracker
  ) {}

  selectModels(request: AIRequest, strategy: AIRoutingStrategy): AIModel[] {
    let pool = this.registry.getModels().filter(m => m.enabled);

    // Filter by required capabilities
    if (request.requiredCapabilities && request.requiredCapabilities.length > 0) {
      pool = pool.filter(m => 
        request.requiredCapabilities!.every(cap => m.capabilities.includes(cap))
      );
    }

    // Filter by health
    pool = pool.filter(m => this.health.isHealthy(m.providerId, m.id));

    if (pool.length === 0) {
      return [];
    }

    // Sort based on strategy
    switch (strategy) {
      case "COST_OPTIMIZED":
        pool.sort((a, b) => (a.inputCostPer1M + a.outputCostPer1M) - (b.inputCostPer1M + b.outputCostPer1M));
        break;
      case "PERFORMANCE":
        // Lower priority number = better performance/capability conceptually, or sort by context
        pool.sort((a, b) => b.priority - a.priority);
        break;
      case "AUTO":
      case "BALANCED":
        // Balance of priority and cost
        pool.sort((a, b) => (b.priority / (b.inputCostPer1M || 1)) - (a.priority / (a.inputCostPer1M || 1)));
        break;
      case "MANUAL":
        if (request.targetProvider && request.targetModel) {
          const manualModel = pool.find(m => m.providerId === request.targetProvider && m.id === request.targetModel);
          return manualModel ? [manualModel] : [];
        }
        break;
      default:
        pool.sort((a, b) => b.priority - a.priority);
    }

    return pool;
  }
}
