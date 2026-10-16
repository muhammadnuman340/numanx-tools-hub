// FILE: src/utils/cricketVisualizer.js

/**
 * Generates an SVG 360° Cricket Pitch Wagon Wheel from shot angle and run data.
 * @param {Array<{ angleDeg: number, runs: number, zone?: string }>} shots 
 * @returns {string} Clean SVG markup
 */
export function generateWagonWheelSVG(
  shots = [
    { angleDeg: 45, runs: 4, zone: 'Extra Cover' },
    { angleDeg: 135, runs: 6, zone: 'Long-On' },
    { angleDeg: 225, runs: 6, zone: 'Deep Mid-Wicket' },
    { angleDeg: 310, runs: 4, zone: 'Third Man' },
    { angleDeg: 180, runs: 2, zone: 'Straight Hit' }
  ]
) {
  const cx = 250, cy = 250, radius = 200;
  const strokeColor = {
    1: '#38bdf8', // Singles (Sky Blue)
    2: '#a855f7', // Twos (Purple)
    3: '#f59e0b', // Threes (Amber)
    4: '#10b981', // Fours (Emerald)
    6: '#ef4444'  // Sixes (Ruby Red)
  };

  const spokes = shots
    .map((s) => {
      const rad = ((Number(s.angleDeg) - 90) * Math.PI) / 180;
      const dist = s.runs >= 6 ? radius : s.runs === 4 ? radius * 0.92 : radius * 0.58;
      const x2 = (cx + dist * Math.cos(rad)).toFixed(1);
      const y2 = (cy + dist * Math.sin(rad)).toFixed(1);
      const color = strokeColor[s.runs] || '#e2e8f0';
      const w = s.runs >= 4 ? 3.5 : 2.0;
      return `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" />`;
    })
    .join('\n  ');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500" role="img" aria-label="Cricket 360 Degree Wagon Wheel">
  <rect width="500" height="500" rx="24" fill="#020617" />
  <circle cx="${cx}" cy="${cy}" r="${radius}" fill="#064e3b" stroke="#10b981" stroke-width="3" />
  <circle cx="${cx}" cy="${cy}" r="${radius * 0.45}" fill="none" stroke="#34d399" stroke-dasharray="6 6" stroke-width="1.5" />
  <rect x="${cx - 8}" y="${cy - 28}" width="16" height="56" rx="3" fill="#d97706" opacity="0.85" />
  ${spokes}
  <circle cx="${cx}" cy="${cy}" r="5" fill="#ffffff" />
</svg>`;
}

/**
 * Generates an SVG Manhattan Chart (over-by-over runs and wickets).
 * @param {Array<{ over: number, runs: number, wickets?: number }>} overs
 * @returns {string} Clean SVG markup
 */
export function generateManhattanSVG(overs = []) {
  const width = 600;
  const height = 300;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 30;
  const padBottom = 40;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  if (!overs || overs.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
      <rect width="${width}" height="${height}" rx="16" fill="#020617" />
      <text x="${width / 2}" y="${height / 2}" fill="#94a3b8" text-anchor="middle" font-family="sans-serif">No Over Data Available</text>
    </svg>`;
  }

  const maxRuns = Math.max(...overs.map(o => o.runs), 15);
  const barWidth = Math.max(6, Math.floor((chartW / overs.length) * 0.7));
  const step = chartW / overs.length;

  const bars = overs.map((o, idx) => {
    const barH = (o.runs / maxRuns) * chartH;
    const x = padLeft + idx * step + (step - barWidth) / 2;
    const y = padTop + chartH - barH;
    const isBig = o.runs >= 12;
    const color = isBig ? '#f59e0b' : '#38bdf8';

    let wicketMarker = '';
    if (o.wickets && o.wickets > 0) {
      wicketMarker = `<circle cx="${x + barWidth / 2}" cy="${y - 8}" r="4" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />`;
    }

    return `
    <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth}" height="${barH.toFixed(1)}" rx="3" fill="${color}" />
    <text x="${(x + barWidth / 2).toFixed(1)}" y="${(y - (o.wickets ? 16 : 4)).toFixed(1)}" fill="#cbd5e1" font-size="9" text-anchor="middle" font-family="monospace">${o.runs}</text>
    <text x="${(x + barWidth / 2).toFixed(1)}" y="${height - 18}" fill="#64748b" font-size="9" text-anchor="middle" font-family="monospace">${o.over || idx + 1}</text>
    ${wicketMarker}`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Cricket Manhattan Chart">
  <rect width="${width}" height="${height}" rx="16" fill="#020617" />
  <line x1="${padLeft}" y1="${padTop + chartH}" x2="${width - padRight}" y2="${padTop + chartH}" stroke="#334155" stroke-width="1.5" />
  <line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + chartH}" stroke="#334155" stroke-width="1.5" />
  ${bars}
  <text x="${padLeft}" y="18" fill="#e2e8f0" font-size="12" font-weight="bold" font-family="sans-serif">Manhattan: Runs Per Over</text>
  <text x="${width - padRight}" y="18" fill="#ef4444" font-size="10" text-anchor="end" font-family="sans-serif">● Wicket Lost</text>
</svg>`;
}
