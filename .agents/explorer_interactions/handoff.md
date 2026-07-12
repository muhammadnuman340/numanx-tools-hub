# Handoff Report

## 1. Observation

Direct observations made in the codebase:

- **File Path:** `src/layouts/MainLayout.astro`
  - **Sound Ticks (lines 219-232):**
    ```javascript
    const playTick = () => {
      if (!audioCtx || audioCtx.state === 'suspended') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    };
    ```
  - **Custom Cursor Markup & Logic (lines 147-158 & 266-354):**
    - Dot (`#custom-cursor-dot`) and Ring (`#custom-cursor-ring`) fixed overlays are defined.
    - Motion tracking updates `mx = e.clientX; my = e.clientY`.
    - Interpolated tracking for ring: `rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; r.style.left = rx + 'px'; r.style.top = ry + 'px';`
    - Morph style (hover) shifts scale to `1.5`, background to `rgba(251, 191, 36, 0.1)` and border-color to `rgba(251, 191, 36, 0.8)`.
  - **WebGL Particle System (lines 419-480):** Uses Three.js to render particles responding to mouse coordinate vectors.
- **File Path:** `src/pages/index.astro`
  - **Advanced Magnetic 3D Tracker (lines 407-450):**
    - Iterates cards inside sections (`cards-container-1` through `cards-container-6` and `recently-used-grid`).
    - Calculates client bounding boxes and mouse coordinates.
    - Tilted transform on hover: `card.style.transform = perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02);`
  - **Scroll Reveal Triggers (lines 452-480):** Registers GSAP `ScrollTrigger` for `.reveal-text` (blur reveal) and `.group-section` cards (staggered 3D back-out reveal).

## 2. Logic Chain

1.  **Audio Context Restrictions:** Web Audio requires explicit user interaction (`click` or `keydown`) before it starts playing. To circumvent this, `initAudio` binds to click/keydown on the body with `{ once: true }` and gets re-called inside mouseenter triggers (see Observation in `MainLayout.astro` and `index.astro`).
2.  **Sound Tick Execution:** When `mouseenter` occurs on elements matching `interactiveSelectors`, `playTick()` is called, synthesizing a 30ms sine-wave sweeping down from 800Hz to 100Hz with volume decay (from 0.03 to 0.001 gain).
3.  **Visual Cursor Separation:** The custom cursor maps mouse positioning onto two separate DOM elements. The dot tracks instantly, while the ring is animated smoothly within a `requestAnimationFrame` loop using a `0.12` interpolation coefficient (lerp), matching visual responsiveness with organic drag (see Observation in `MainLayout.astro`).
4.  **Advanced 3D Magnetic Tilts:** Card hover glows are mapped by setting CSS variables `--mouse-x` and `--mouse-y` dynamically via mousemove listener. The advanced 3D tilting computes the offset of the cursor from the center of the card. In `index.astro`, this is handled at the container level for better performance and is amplified to a 4-degree tilt, 10px translateZ, and 1.02x scale zoom, while the global fallback in `MainLayout.astro` uses a simpler 2-degree tilt.
5.  **Scroll Animations:** GSAP ScrollTrigger acts on `.reveal-text` (animating opacity, translation, and filter blur) and `.group-section` (staggered 3D card layout entries with a `back.out(1.5)` ease), configured to toggle on viewport threshold entry.

## 3. Caveats

- **Audio Support Fallback:** If the browser does not support `AudioContext` or `webkitAudioContext`, the application fails silently without crashing.
- **Media Query Boundary:** Custom cursor and advanced card tilt coordinates are strictly bound to screens $\ge 1024$px wide. Touch interactions on mobile devices disable the custom cursor and mouse tracking layers.
- **Astro View Transitions Page Transitions:** Dynamic page transitions (`astro:page-load`) require hooks to re-bind event listeners. Some dynamic elements (such as "Recently Used Tools") re-apply these event listeners explicitly upon localStorage parsing.

## 4. Conclusion

The interactive systems of NumanX Tools Hub are clean, modern, client-side scripts integrated via Astro layout scripts and page templates. Performance is maintained through event delegation on parent grids for 3D card tilt calculations, Web Audio synthesizer synthesis for instantaneous micro-soundticks, and WebGL optimization for particle vectors.

## 5. Verification Method

- **Code Review:** Inspect `src/layouts/MainLayout.astro` and `src/pages/index.astro` script sections.
- **Desktop Browser Verification:**
  1. Open index page on desktop.
  2. Move mouse to watch `#custom-cursor-dot` track instantly and `#custom-cursor-ring` follow with soft lerping.
  3. Click anywhere to activate `AudioContext`, and hover over links/cards to listen for micro-sound ticks.
  4. Move the cursor across grids (`cards-container-1`, etc.) to watch cards dynamically tilt towards the mouse, zoom 1.02x, elevate, and highlight with radial spotlight glows.
