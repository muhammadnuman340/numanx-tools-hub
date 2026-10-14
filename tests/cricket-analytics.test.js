// FILE: tests/cricket-analytics.test.js
import { describe, it, expect } from 'vitest';
import {
  cricketOversToDecimal,
  decimalToCricketOvers,
  calculateTournamentNRR,
  solveChaseOversForTargetNRR
} from '../src/utils/cricketAnalytics.js';

describe('ICC Cricket Analytics & NRR Engine', () => {
  it('converts base-6 cricket overs notation (17.3) to exact decimal (17.5)', () => {
    expect(cricketOversToDecimal('17.3', false, 20)).toBeCloseTo(17.5, 5);
  });

  it('enforces ICC Law 16.10.2 All-Out full quota penalty (17.3 all out -> 20.0 overs)', () => {
    expect(cricketOversToDecimal('17.3', true, 20)).toBe(20);
  });

  it('calculates exact NRR difference between not-out (8.5714 RPO) and all-out (7.5000 RPO)', () => {
    const nrrNotOut = calculateTournamentNRR({
      runsScored: 150, oversFacedNotation: '17.3', isAllOutBatting: false,
      runsConceded: 150, oversBowledNotation: '20.0', isAllOutBowling: false
    });
    const nrrAllOut = calculateTournamentNRR({
      runsScored: 150, oversFacedNotation: '17.3', isAllOutBatting: true,
      runsConceded: 150, oversBowledNotation: '20.0', isAllOutBowling: false
    });
    expect(nrrNotOut).toBeCloseTo(1.0714, 3);
    expect(nrrAllOut).toBeCloseTo(0.0, 3);
  });

  it('solves maximum chase overs to surpass rival NRR', () => {
    const res = solveChaseOversForTargetNRR({
      prevRunsScored: 640, prevOversFaced: 80,
      prevRunsConceded: 650, prevOversBowled: 80,
      matchRunsConceded: 150, matchOversBowled: 20,
      targetRunsToScore: 151, rivalNRR: 0.25
    });
    expect(res.possible).toBe(true);
    expect(res.maxChaseOversCricket).toMatch(/^\d+\.[0-5]$/);
  });
});
