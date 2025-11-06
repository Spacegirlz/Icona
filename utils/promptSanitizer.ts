/**
 * Sanitizes user input to prevent prompt injection attacks
 * and ensures prompts are safe for API calls
 */

export function sanitizePrompt(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove control characters and potentially dangerous sequences
  let sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/[^\w\s.,!?\-'":;()[\]{}]/g, '') // Keep only safe characters
    .trim();

  // Limit length to prevent abuse
  const MAX_LENGTH = 1000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitizes and validates prompt for refinement requests
 */
export function sanitizeRefinementPrompt(input: string): string {
  const sanitized = sanitizePrompt(input);
  
  // Ensure it's not empty after sanitization
  if (sanitized.length < 3) {
    throw new Error('Refinement prompt must be at least 3 characters');
  }

  return sanitized;
}

/**
 * Sanitizes manual era text input
 */
export function sanitizeManualEraText(input: string): string {
  const sanitized = sanitizePrompt(input);
  
  // Manual era text can be longer
  const MAX_LENGTH = 2000;
  if (sanitized.length > MAX_LENGTH) {
    return sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitizes additional details input
 */
export function sanitizeAdditionalDetails(input: string): string {
  const sanitized = sanitizePrompt(input);
  
  // Additional details should be shorter
  const MAX_LENGTH = 500;
  if (sanitized.length > MAX_LENGTH) {
    return sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Validates that prompt doesn't contain injection attempts
 */
export function validatePromptSafety(prompt: string): { safe: boolean; reason?: string } {
  const dangerousPatterns = [
    /ignore\s+(previous|all|above|instructions?)/i,
    /forget\s+(previous|all|above|instructions?)/i,
    /system\s*:?\s*you\s+are/i,
    /assistant\s*:?\s*you\s+are/i,
    /you\s+must\s+(not|never)/i,
    /override/i,
    /bypass/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(prompt)) {
      return {
        safe: false,
        reason: 'Prompt contains potentially unsafe instructions',
      };
    }
  }

  return { safe: true };
}

