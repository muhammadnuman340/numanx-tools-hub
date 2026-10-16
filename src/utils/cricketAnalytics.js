// FILE: src/utils/cricketAnalytics.js

/**
 * Converts cricket overs notation (e.g. 17.3) to exact decimal overs (e.g. 17.5).
 * Under ICC Law 16.10.2, if a team is all out, their full quota (e.g. 20 or 50 overs) is used.
 */
export function cricketOversToDecimal(oversNotation, isAllOut = false, maxQuotaOvers = 20) {
  if (isAllOut) return Number(maxQuotaOvers); // ICC Law 16.10.2 All-Out full-quota penalty
  const [completedStr, ballsStr = '0'] = String(oversNotation).trim().split('.');
  const completed = parseInt(completedStr, 10) || 0;
  const balls = Math.min(Math.max(parseInt(ballsStr, 10) || 0, 0), 5);
  return completed + balls / 6;
}

/**
 * Converts decimal overs (e.g. 17.5) back to cricket notation (e.g. 17.3).
 */
export function decimalToCricketOvers(decimalOvers) {
  const safe = Math.max(0, Number(decimalOvers) || 0);
  const whole = Math.floor(safe);
  const balls = Math.round((safe - whole) * 6);
  return balls === 6 ? `${whole + 1}.0` : `${whole}.${balls}`;
}

/**
 * Calculates Tournament Net Run Rate (NRR) per official ICC regulations.
 */
export function calculateTournamentNRR({
  runsScored,
  oversFacedNotation,
  isAllOutBatting = false,
  runsConceded,
  oversBowledNotation,
  isAllOutBowling = false,
  maxQuotaOvers = 20
}) {
  const effectiveOversFaced = cricketOversToDecimal(oversFacedNotation, isAllOutBatting, maxQuotaOvers);
  const effectiveOversBowled = cricketOversToDecimal(oversBowledNotation, isAllOutBowling, maxQuotaOvers);
  if (effectiveOversFaced <= 0 || effectiveOversBowled <= 0) return 0;
  const forRate = Number(runsScored) / effectiveOversFaced;
  const againstRate = Number(runsConceded) / effectiveOversBowled;
  return Number((forRate - againstRate).toFixed(4));
}

/**
 * Solves the maximum overs a chasing team can take to surpass a rival team's NRR for playoff qualification.
 */
export function solveChaseOversForTargetNRR({
  prevRunsScored = 0,
  prevOversFaced = 0,
  prevRunsConceded = 0,
  prevOversBowled = 0,
  matchRunsConceded = 160,
  matchOversBowled = 20,
  targetRunsToScore = 161,
  rivalNRR = 0.45
}) {
  const totalConceded = prevRunsConceded + matchRunsConceded;
  const totalBowled = prevOversBowled + matchOversBowled;
  const requiredScoringRate = rivalNRR + totalConceded / totalBowled;
  if (requiredScoringRate <= 0) {
    return { possible: true, maxChaseOversCricket: `${matchOversBowled}.0` };
  }
  const maxTotalOversAllowed = (prevRunsScored + targetRunsToScore) / requiredScoringRate;
  const maxChaseOversDec = maxTotalOversAllowed - prevOversFaced;
  return {
    possible: maxChaseOversDec >= 1.0 && maxChaseOversDec <= matchOversBowled,
    maxChaseOversCricket: decimalToCricketOvers(Math.min(Math.max(0, maxChaseOversDec), matchOversBowled))
  };
}

/**
 * Generates an industrial 1080x1920 vertical format card for YouTube Shorts / TikTok / Instagram Reels.
 */
export function exportWWSStatCardPNG({
  playerName = 'Babar Azam',
  tournament = 'PSL / T20 Statistical Breakdown',
  runs = 568,
  balls = 398,
  dismissals = 10,
  brandTag = 'World Wonders & Sports (WWS) × NumanX Tools'
}) {
  if (typeof document === 'undefined') return;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#064e3b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1920);

  const numRuns = Number(runs) || 0;
  const numBalls = Math.max(1, Number(balls) || 1);
  const numDismissals = Math.max(1, Number(dismissals) || 1);

  const sr = ((numRuns / numBalls) * 100).toFixed(2);
  const avg = (numRuns / numDismissals).toFixed(2);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(tournament.toUpperCase(), 90, 210);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 84px sans-serif';
  ctx.fillText(playerName, 90, 330);

  const cards = [
    { label: 'TOTAL RUNS SCORED', val: String(numRuns) },
    { label: 'BATTING AVERAGE', val: avg },
    { label: 'STRIKE RATE (SR)', val: sr },
    { label: 'BALLS FACED', val: String(numBalls) }
  ];

  cards.forEach((c, idx) => {
    const y = 480 + idx * 275;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
    ctx.fillRect(90, y, 900, 225);
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.strokeRect(90, y, 900, 225);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText(c.label, 140, y + 80);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 76px sans-serif';
    ctx.fillText(c.val, 140, y + 175);
  });

  ctx.fillStyle = '#a5b4fc';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(brandTag, 90, 1790);

  const link = document.createElement('a');
  link.download = `${playerName.toLowerCase().replace(/\s+/g, '-')}-wws-shorts-card.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Standard Duckworth-Lewis-Stern (DLS) resource constants (Standard Edition).
 * Z0 represents asymptotic resource percentage for wickets 0-9.
 * b represents exponential decay rate per over.
 */
const DLS_Z0 = [100.0, 93.4, 85.1, 74.9, 62.7, 49.0, 34.9, 22.0, 11.9, 4.7];
const DLS_B = [0.035, 0.034, 0.032, 0.030, 0.027, 0.024, 0.020, 0.018, 0.015, 0.013];

/**
 * Computes remaining resource percentage R(u, w) under DLS Standard Edition.
 * @param {number} oversRemaining - Overs left in innings (0 to 50)
 * @param {number} wicketsLost - Wickets fallen (0 to 10)
 */
export function getDLSResourcePercentage(oversRemaining, wicketsLost = 0) {
  const w = Math.min(Math.max(parseInt(wicketsLost, 10) || 0, 0), 10);
  if (w >= 10 || oversRemaining <= 0) return 0.0;
  const u = Math.max(0, Number(oversRemaining) || 0);
  const z = DLS_Z0[w];
  const b = DLS_B[w];
  const resource = z * (1 - Math.exp(-b * u));
  return Number(Math.min(100.0, Math.max(0.0, resource)).toFixed(2));
}

/**
 * Calculates rain-interrupted revised target under ICC DLS Standard Edition.
 * @param {Object} params
 * @param {number} params.team1Runs - Team 1 total runs scored (S1)
 * @param {number} params.team1OversQuota - Team 1 total allocated overs (e.g. 50 or 20)
 * @param {number} params.team2OversQuota - Revised overs available to Team 2
 * @param {number} [params.team1ResourceLost] - Any resources lost during Team 1 innings
 * @param {number} [params.format] - 'ODI' (G50=245) or 'T20' (G50=160)
 */
export function calculateDLSTarget({
  team1Runs = 250,
  team1OversQuota = 50,
  team2OversQuota = 35,
  team1ResourceLost = 0,
  format = 'ODI'
}) {
  const S1 = Math.max(0, Number(team1Runs) || 0);
  const R1 = Math.max(1, getDLSResourcePercentage(team1OversQuota, 0) - team1ResourceLost);
  const R2 = getDLSResourcePercentage(team2OversQuota, 0);
  const G = format.toUpperCase() === 'T20' ? 160 : 245;

  let target;
  let parScore;

  if (R2 <= R1) {
    // Team 2 resources are less than or equal to Team 1
    parScore = Math.floor(S1 * (R2 / R1));
    target = parScore + 1;
  } else {
    // Team 1 innings was curtailed earlier and Team 2 has more resources
    parScore = Math.floor(S1 + ((R2 - R1) * G) / 100);
    target = parScore + 1;
  }

  const rrr = team2OversQuota > 0 ? Number((target / team2OversQuota).toFixed(2)) : 0;

  return {
    team1Runs: S1,
    team1Resource: R1,
    team2Resource: R2,
    parScore,
    target,
    requiredRunRate: rrr,
    reducedOvers: team2OversQuota
  };
}

/**
 * Simulates a multi-team cricket tournament points table with exact ICC NRR standings.
 * @param {Array} teams - Array of { name, played, won, lost, nr, forRuns, forOvers, againstRuns, againstOvers }
 * @param {Array} [newMatches] - Array of match outcomes to project { teamA, teamB, aRuns, aOvers, aAllOut, bRuns, bOvers, bAllOut, maxOvers }
 */
export function simulatePointsTable(teams = [], newMatches = []) {
  // Deep clone team standings
  const standings = teams.map((t) => ({
    name: t.name,
    played: Number(t.played) || 0,
    won: Number(t.won) || 0,
    lost: Number(t.lost) || 0,
    nr: Number(t.nr) || 0,
    points: (Number(t.won) || 0) * 2 + (Number(t.nr) || 0),
    forRuns: Number(t.forRuns) || 0,
    forOversDecimal: cricketOversToDecimal(t.forOvers || 0),
    againstRuns: Number(t.againstRuns) || 0,
    againstOversDecimal: cricketOversToDecimal(t.againstOvers || 0),
    nrr: 0
  }));

  // Apply new simulation matches
  for (const m of newMatches) {
    const tA = standings.find((t) => t.name === m.teamA);
    const tB = standings.find((t) => t.name === m.teamB);
    if (!tA || !tB) continue;

    const maxOvers = m.maxOvers || 20;
    const aOversEff = cricketOversToDecimal(m.aOvers, m.aAllOut, maxOvers);
    const bOversEff = cricketOversToDecimal(m.bOvers, m.bAllOut, maxOvers);

    tA.played += 1;
    tB.played += 1;

    tA.forRuns += m.aRuns;
    tA.forOversDecimal += aOversEff;
    tA.againstRuns += m.bRuns;
    tA.againstOversDecimal += bOversEff;

    tB.forRuns += m.bRuns;
    tB.forOversDecimal += bOversEff;
    tB.againstRuns += m.aRuns;
    tB.againstOversDecimal += aOversEff;

    if (m.aRuns > m.bRuns) {
      tA.won += 1;
      tA.points += 2;
      tB.lost += 1;
    } else if (m.bRuns > m.aRuns) {
      tB.won += 1;
      tB.points += 2;
      tA.lost += 1;
    } else {
      tA.nr += 1;
      tA.points += 1;
      tB.nr += 1;
      tB.points += 1;
    }
  }

  // Calculate NRR for each team
  for (const t of standings) {
    const forRate = t.forOversDecimal > 0 ? t.forRuns / t.forOversDecimal : 0;
    const againstRate = t.againstOversDecimal > 0 ? t.againstRuns / t.againstOversDecimal : 0;
    t.nrr = Number((forRate - againstRate).toFixed(4));
    t.forOvers = decimalToCricketOvers(t.forOversDecimal);
    t.againstOvers = decimalToCricketOvers(t.againstOversDecimal);
  }

  // Sort by Points (descending), then NRR (descending), then Wins
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.nrr !== a.nrr) return b.nrr - a.nrr;
    return b.won - a.won;
  });

  return standings.map((t, idx) => ({
    rank: idx + 1,
    qualified: idx < 4,
    ...t
  }));
}

