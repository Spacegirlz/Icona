/**
 * Usage Tracking Utility
 * Tracks API usage for cost monitoring
 */

interface UsageRecord {
  endpoint: string;
  timestamp: Date;
  inputTokens?: number;
  outputTokens?: number;
  imageGenerated?: boolean;
  estimatedCost?: number;
  ip?: string;
}

/**
 * Simple in-memory usage tracking (for development)
 * In production, save to Supabase or external service
 */
const usageLog: UsageRecord[] = [];

/**
 * Estimate cost based on usage
 */
function estimateCost(record: UsageRecord): number {
  let cost = 0;

  // Image generation cost (most expensive)
  if (record.imageGenerated) {
    cost += 0.03; // ~$0.03 per image (average)
  }

  // Text generation costs
  if (record.inputTokens) {
    cost += (record.inputTokens / 1_000_000) * 0.075; // $0.075 per 1M input tokens
  }

  if (record.outputTokens) {
    cost += (record.outputTokens / 1_000_000) * 0.30; // $0.30 per 1M output tokens
  }

  return cost;
}

/**
 * Log API usage
 */
export function logUsage(record: Omit<UsageRecord, 'timestamp' | 'estimatedCost'>) {
  const fullRecord: UsageRecord = {
    ...record,
    timestamp: new Date(),
    estimatedCost: estimateCost(record),
  };

  usageLog.push(fullRecord);

  // Log to console (in production, send to Supabase or analytics service)
  console.log('[USAGE]', {
    endpoint: fullRecord.endpoint,
    cost: `$${fullRecord.estimatedCost?.toFixed(4)}`,
    tokens: `${fullRecord.inputTokens || 0} in / ${fullRecord.outputTokens || 0} out`,
    image: fullRecord.imageGenerated ? 'Yes' : 'No',
  });

  // TODO: Send to Supabase or external service for persistent tracking
  // await supabase.from('usage_logs').insert(fullRecord);
}

/**
 * Get usage summary
 */
export function getUsageSummary() {
  const total = usageLog.length;
  const images = usageLog.filter(r => r.imageGenerated).length;
  const totalCost = usageLog.reduce((sum, r) => sum + (r.estimatedCost || 0), 0);
  const totalInputTokens = usageLog.reduce((sum, r) => sum + (r.inputTokens || 0), 0);
  const totalOutputTokens = usageLog.reduce((sum, r) => sum + (r.outputTokens || 0), 0);

  return {
    totalRequests: total,
    imageGenerations: images,
    textGenerations: total - images,
    estimatedTotalCost: totalCost,
    totalInputTokens,
    totalOutputTokens,
    averageCostPerRequest: total > 0 ? totalCost / total : 0,
  };
}

/**
 * Get usage by endpoint
 */
export function getUsageByEndpoint() {
  const byEndpoint: Record<string, { count: number; cost: number }> = {};

  usageLog.forEach(record => {
    if (!byEndpoint[record.endpoint]) {
      byEndpoint[record.endpoint] = { count: 0, cost: 0 };
    }
    byEndpoint[record.endpoint].count++;
    byEndpoint[record.endpoint].cost += record.estimatedCost || 0;
  });

  return byEndpoint;
}

