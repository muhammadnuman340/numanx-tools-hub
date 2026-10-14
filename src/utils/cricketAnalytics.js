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
