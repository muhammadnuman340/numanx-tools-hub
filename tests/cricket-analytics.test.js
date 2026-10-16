// FILE: tests/cricket-analytics.test.js
import { describe, it, expect } from 'vitest';
import {
  cricketOversToDecimal,
  decimalToCricketOvers,
  calculateTournamentNRR,
  solveChaseOversForTargetNRR,
  getDLSResourcePercentage,
  calculateDLSTarget,
  simulatePointsTable
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

  it('calculates DLS resource percentages and revised rain-curtailed targets', () => {
    expect(getDLSResourcePercentage(0, 0)).toBe(0);
    expect(getDLSResourcePercentage(50, 10)).toBe(0);
    const r50 = getDLSResourcePercentage(50, 0);
    const r35 = getDLSResourcePercentage(35, 0);
    expect(r50).toBeGreaterThan(r35);
    expect(r35).toBeGreaterThan(0);

    const dls = calculateDLSTarget({
      team1Runs: 280,
      team1OversQuota: 50,
      team2OversQuota: 35,
      format: 'ODI'
    });
    expect(dls.target).toBeGreaterThan(150);
    expect(dls.target).toBeLessThan(281);
    expect(dls.requiredRunRate).toBeGreaterThan(0);
  });

  it('simulates multi-team tournament points table and ranks by Points and NRR', () => {
    const initialTeams = [
      { name: 'Team Alpha', played: 3, won: 2, lost: 1, nr: 0, forRuns: 500, forOvers: '60.0', againstRuns: 450, againstOvers: '60.0' },
      { name: 'Team Beta', played: 3, won: 2, lost: 1, nr: 0, forRuns: 480, forOvers: '60.0', againstRuns: 460, againstOvers: '60.0' },
      { name: 'Team Gamma', played: 3, won: 1, lost: 2, nr: 0, forRuns: 440, forOvers: '60.0', againstRuns: 470, againstOvers: '60.0' },
      { name: 'Team Delta', played: 3, won: 1, lost: 2, nr: 0, forRuns: 430, forOvers: '60.0', againstRuns: 470, againstOvers: '60.0' }
    ];

    const matchSimulation = [
      { teamA: 'Team Alpha', teamB: 'Team Gamma', aRuns: 180, aOvers: '20.0', aAllOut: false, bRuns: 140, bOvers: '20.0', bAllOut: false, maxOvers: 20 }
    ];

    const standings = simulatePointsTable(initialTeams, matchSimulation);
    expect(standings).toHaveLength(4);
    expect(standings[0].name).toBe('Team Alpha');
    expect(standings[0].points).toBe(6);
    expect(standings[0].rank).toBe(1);
    expect(standings[0].qualified).toBe(true);
    expect(standings[0].nrr).toBeGreaterThan(standings[1].nrr);
  });
});
