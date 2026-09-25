import { describe, it, expect } from 'vitest';
import { generateFallbackLesions } from '../src/utils/lesionDetector';

describe('Lesion Detector Heuristic', () => {
  it('generates healthy fallback lesions correctly', () => {
    const result = generateFallbackLesions(1.0, 500, 500, true);
    expect(result.isHealthy).toBe(true);
    expect(result.lesions.length).toBe(0);
    expect(result.affectedAreaPct).toBe(0.0);
  });

  it('generates diseased fallback lesions correctly', () => {
    const result = generateFallbackLesions(1.0, 500, 500, false);
    expect(result.isHealthy).toBe(false);
    expect(result.lesions.length).toBe(5);
    expect(result.affectedAreaPct).toBeGreaterThan(20);
  });
});

describe('Gemini Response JSON Validator/Parser (Simulation)', () => {
  it('strips markdown fences and parses valid JSON', () => {
    const rawResponse = "```json\n{\"plant_type\": {\"en\": \"Tomato\"}, \"is_healthy\": true}\n```";
    const cleaned = rawResponse.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    
    expect(parsed.is_healthy).toBe(true);
    expect(parsed.plant_type.en).toBe('Tomato');
  });

  it('throws on invalid JSON', () => {
    const rawResponse = "```json\n{\"plant_type\": {\"en\": \"Tomato\"}, \n```";
    const cleaned = rawResponse.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    expect(() => JSON.parse(cleaned)).toThrow();
  });
});

describe('Rate Limiter Logic (Simulation)', () => {
  it('allows requests under the limit', () => {
    let requests = 0;
    const maxRequests = 10;
    
    const tryRequest = () => {
      if (requests >= maxRequests) return false;
      requests++;
      return true;
    };

    expect(tryRequest()).toBe(true); // 1
    expect(tryRequest()).toBe(true); // 2
    
    // simulate up to 10
    for(let i=0; i<8; i++) tryRequest();
    
    // 11th should fail
    expect(tryRequest()).toBe(false);
  });
});
