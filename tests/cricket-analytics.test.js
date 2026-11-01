// FILE: tests/cricket-analytics.test.js
import { describe, it, expect } from 'vitest';
import {
  cricketOversToDecimal,
  decimalToCricketOvers,
  calculateTournamentNRR,
  solveChaseOversForTargetNRR,
  getDLSResourcePercentage,
  calculateDLSTarget,
  simulatePointsTable,
  parseOvers,
  parseWholeNumber,
  formatForOvers,
  FORMAT_MAX_OVERS
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

describe('Strict overs and count input checks', () => {
  it('accepts overs.balls within the format limit', () => {
    expect(parseOvers('12.3', { maxOvers: 20 })).toEqual({ ok: true, decimal: 12.5, balls: 75 });
    expect(parseOvers('20', { maxOvers: 20 }).ok).toBe(true);
    expect(parseOvers('50.0', { maxOvers: FORMAT_MAX_OVERS.ODI }).ok).toBe(true);
  });

  it('rejects more overs than the format allows (T20 20, ODI 50)', () => {
    const t20 = parseOvers('777', { maxOvers: FORMAT_MAX_OVERS.T20, label: 'Overs bowled' });
    expect(t20.ok).toBe(false);
    expect(t20.error).toMatch(/T20 innings has at most 20 overs/);
    expect(parseOvers('20.1', { maxOvers: 20 }).ok).toBe(false);
    expect(parseOvers('50.1', { maxOvers: FORMAT_MAX_OVERS.ODI }).error).toMatch(/ODI/);
  });

  it('rejects invalid notation instead of guessing', () => {
    expect(parseOvers('12.6').ok).toBe(false);
    expect(parseOvers('12.9').error).toMatch(/0–5/);
    expect(parseOvers('12abc').ok).toBe(false);
    expect(parseOvers('12.3.4').ok).toBe(false);
    expect(parseOvers('-3').error).toMatch(/negative/);
    expect(parseOvers('').ok).toBe(false);
    expect(parseOvers('0').ok).toBe(false);
    expect(parseOvers('0', { allowZero: true }).ok).toBe(true);
  });

  it('checks whole-number counts', () => {
    expect(parseWholeNumber('145')).toEqual({ ok: true, value: 145 });
    expect(parseWholeNumber('14.5').ok).toBe(false);
    expect(parseWholeNumber('-1').error).toMatch(/negative/);
    expect(parseWholeNumber('0', { min: 1 }).ok).toBe(false);
    expect(parseWholeNumber('51', { max: 50 }).ok).toBe(false);
    expect(formatForOvers(50)).toBe('ODI');
  });
});

describe('NRR chase solver edge cases', () => {
  const base = {
    prevRunsScored: 640, prevOversFaced: 80, prevRunsConceded: 650, prevOversBowled: 80,
    matchRunsConceded: 150, matchOversBowled: 20, targetRunsToScore: 151,
  };

  it('treats a limit beyond the full quota as "any win qualifies", not impossible', () => {
    const res = solveChaseOversForTargetNRR({ ...base, rivalNRR: -5 });
    expect(res.possible).toBe(true);
    expect(res.withinFullQuota).toBe(true);
    expect(res.maxChaseOversCricket).toBe('20.0');
  });

  it('rounds the chase limit down to whole balls', () => {
    const res = solveChaseOversForTargetNRR({ ...base, rivalNRR: 0.25 });
    const [o, b] = res.maxChaseOversCricket.split('.').map(Number);
    const balls = o * 6 + b;
    // Chasing in exactly that many balls must still beat the rival
    const nrr = (640 + 151) / (80 + balls / 6) - (650 + 150) / 100;
    expect(nrr).toBeGreaterThan(0.25);
  });

  it('reports impossible when even one ball is too slow', () => {
    expect(solveChaseOversForTargetNRR({ ...base, rivalNRR: 5 }).possible).toBe(false);
  });
});
