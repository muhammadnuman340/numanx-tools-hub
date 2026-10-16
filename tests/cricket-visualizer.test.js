// FILE: tests/cricket-visualizer.test.js
import { describe, it, expect } from 'vitest';
import { generateWagonWheelSVG, generateManhattanSVG } from '../src/utils/cricketVisualizer.js';

describe('Cricket Visualizer (Wagon Wheel & Manhattan Charts)', () => {
  it('generates valid 360-degree Wagon Wheel SVG markup with pitch & boundary circles', () => {
    const testShots = [
      { angleDeg: 45, runs: 4, zone: 'Cover' },
      { angleDeg: 120, runs: 6, zone: 'Mid-Wicket' },
      { angleDeg: 200, runs: 1, zone: 'Fine Leg' },
    ];
    const svg = generateWagonWheelSVG(testShots);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 500 500"');
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-label="Cricket 360 Degree Wagon Wheel"');
    expect(svg).toContain('stroke="#10b981"'); // Boundary ring
    // Should have 3 line elements for the 3 shots
    const lineCount = (svg.match(/<line /g) || []).length;
    expect(lineCount).toBe(3);
    expect(svg).toContain('#ef4444'); // Six color
    expect(svg).toContain('#10b981'); // Four color
    expect(svg).toContain('#38bdf8'); // Single color
  });

  it('generates default Wagon Wheel SVG when no shots passed', () => {
    const svg = generateWagonWheelSVG();
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('generates valid Manhattan Chart SVG with over runs and wicket markers', () => {
    const overs = [
      { over: 1, runs: 6, wickets: 0 },
      { over: 2, runs: 14, wickets: 1 },
      { over: 3, runs: 4, wickets: 0 },
      { over: 4, runs: 18, wickets: 2 },
    ];
    const svg = generateManhattanSVG(overs);

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 600 300"');
    expect(svg).toContain('Manhattan: Runs Per Over');
    // Over 2 and Over 4 have wickets, so should have 2 circle wicket markers
    const wicketMarkers = (svg.match(/fill="#ef4444"/g) || []).length;
    // Includes header dot + 2 wickets = 3
    expect(wicketMarkers).toBe(3);
  });

  it('handles empty overs array gracefully in Manhattan SVG', () => {
    const svg = generateManhattanSVG([]);
    expect(svg).toContain('No Over Data Available');
  });
});
