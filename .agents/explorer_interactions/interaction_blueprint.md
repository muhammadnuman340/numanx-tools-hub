# NumanX Interactive Components & Scripts Blueprint

This document outlines the architecture, implementation details, and wiring mechanics of all interactive elements on the NumanX Tools Hub.

---

## 1. Global Web Audio Feedback System (Sound Ticks)

To enhance tactile immersion, the platform features a micro-acoustic feedback engine that triggers a subtle "tick" sound when hovering over interactive elements.

### Architecture & Oscillator Parameters

The audio system is implemented in `src/layouts/MainLayout.astro` (global) and `src/pages/index.astro` (index-specific). It uses the native **Web Audio API** to generate sound programmatically on the client side without relying on heavy external audio assets.

- **Instance Lifecycle:** A singleton `audioCtx: AudioContext` is lazily initialized. Due to modern browser policies blocking auto-playing audio contexts, initialization (`initAudio()`) is bound to the first user interaction on the page (first `'click'` or `'keydown'`) using `{ once: true }`.
- **Oscillator Synthesis:** The tick sound is synthesized using a sine wave oscillator.
- **Frequency Sweep:** The frequency begins at `800 Hz` and is exponentially swept down to `100 Hz` over exactly `0.03 seconds` (`30ms`).
- **Gain Envelope:** The volume uses a GainNode with an exponential decay envelope. It starts at a subtle amplitude of `0.03` (to prevent ears fatigue) and decays to `0.001` (complete silence) over the same `30ms` duration.
- **Node Graph Connection:** `OscillatorNode` $\rightarrow$ `GainNode` $\rightarrow$ `AudioContext.destination`.

#### Source Code implementation (`src/layouts/MainLayout.astro`):

```javascript
let audioCtx: AudioContext | null = null;
const initAudio = () => {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch(e) {}
  }
};
const playTick = () => {
  if(!audioCtx || audioCtx.state === 'suspended') return;
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

### Event Wiring & Selector Targets

The audio tick is bound to elements matching the `interactiveSelectors` list:

```javascript
var interactiveSelectors =
  'a, button, .hover-scale, .card-glow, .glass-card, input, select, textarea, [tabindex="0"], .audio-trigger';
```

- **Global Elements:** In `MainLayout.astro`, a delegation listener queries these selectors and registers a `'mouseenter'` event that initializes the audio context and triggers `playTick()`.
- **Marquee & Dynamic Items:** In `index.astro`, the scrolling marquee items and the dynamically rendered "Recently Used Tools" elements explicitly carry the class `.audio-trigger`.
- **Dynamic Re-binding:** When the client-side "Recently Used Tools" grid is rendered from `localStorage` data, the script explicitly runs:
  ```javascript
  grid.querySelectorAll('.audio-trigger').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      initAudio();
      playTick();
    });
  });
  ```

---

## 2. Custom Studio Cursor

On screens wider than `1024px` (`lg:` media query), the native cursor is augmented by a custom studio cursor with distinct tracking physics.

### Visual Markup (`src/layouts/MainLayout.astro`)

```html
<div
  id="custom-cursor-dot"
  class="fixed w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[999] opacity-0 mix-blend-difference transition-opacity duration-300 hidden lg:block"
  aria-hidden="true"
></div>
<div
  id="custom-cursor-ring"
  class="fixed w-8 h-8 border border-purple-500/30 rounded-full pointer-events-none z-[998] opacity-0 transition-opacity duration-300 hidden lg:block -translate-x-1/2 -translate-y-1/2"
  aria-hidden="true"
></div>
```

### Motion Physics & Lerping

The custom cursor separates tracking into two nodes to achieve a premium organic feel:

1.  **Cursor Dot (`#custom-cursor-dot`):** Instantly translates to the exact mouse coordinates on `'mousemove'`:
    ```javascript
    d.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    ```
2.  **Cursor Ring (`#custom-cursor-ring`):** Uses linear interpolation (lerp) within a `requestAnimationFrame` loop (`t()`) to drag behind the mouse coordinates with a smooth delay (factor of `0.12`):
    ```javascript
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    r.style.left = rx + 'px';
    r.style.top = ry + 'px';
    ```

### Interactive Hover State Morphing

When hovering over any element matching `interactiveSelectors`, the script appends the `.cursor-hover` class to `document.body`. A dynamically generated `<style>` tag morphs the outer cursor ring's scale and appearance:

```css
.cursor-hover #custom-cursor-ring {
  transform: translate(-50%, -50%) scale(1.5);
  background-color: rgba(251, 191, 36, 0.1); /* Subtle Amber Fill */
  border-color: rgba(251, 191, 36, 0.8); /* Amber Border Glow */
}
```

- **Enter/Leave Transitions:** Attaching `'mouseenter'` and `'mouseleave'` listeners to all interactive items handles toggling this class on the body.

---

## 3. Cinematic GSAP Scroll Animation Triggers

Scrolling reveals elements smoothly using GreenSock Animation Platform (GSAP) and its `ScrollTrigger` plugin. The triggers are re-registered on Astro Page Loads (`astro:page-load`) to support SPA-like navigations.

### Text Reveal Blur (`.reveal-text`, `.reveal`)

- **Effect:** Elements fade in, translate vertically, and lose their blur.
- **Properties:**
  - **From:** `{ opacity: 0, y: 30, filter: 'blur(10px)' }`
  - **To:** `{ opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }`
- **Trigger Configurations:**
  - `trigger`: The text element itself.
  - `start`: `'top 85%'` (starts when the top of the element is 85% from the top of the screen).
  - `toggleActions`: `'play none none reverse'` (plays forward on enter, reverses animation on scroll back past the boundary).

### 3D Grid Card Staggered Reveal

- **Effect:** Staggered 3D tilt-reveal of cards inside interactive groups.
- **Target Selectors:** Elements with `.card-spotlight` inside parent containers carrying `.group-section`.
- **Properties:**
  - **From:** `{ opacity: 0, y: 60, scale: 0.9, rotationX: 10 }`
  - **To:** `{ opacity: 1, y: 0, scale: 1, rotationX: 0, duration: 1.2, stagger: 0.1, ease: 'back.out(1.5)' }`
- **Trigger Configurations:**
  - `trigger`: The parent section (`.group-section`).
  - `start`: `'top 80%'` or `'top 85%'`.
  - `toggleActions`: `'play none none reverse'`.

---

## 4. 3D Magnetic Tilts & Card Spotlight Tracking

Spotlight cards (`.card-spotlight` and `.glass-card`) use mouse tracking to position absolute gradients and apply three-dimensional perspective shifts.

### CSS Spotlight Glow

The CSS relies on local variables `--mouse-x` and `--mouse-y` dynamically set via JavaScript, creating two concentric radial gradients via pseudo-elements:

- `::before`: White shine (`rgba(255, 255, 255, 0.05)`) over an `800px` radius.
- `::after`: Amber halo (`rgba(251, 191, 36, 0.2)`) over a `400px` radius, styled to border-glow behind the card.

### Card Bounding Box Coordinates Mapping

JavaScript calculates the cursor's location relative to the top-left boundary of the target card using `getBoundingClientRect()`:

```javascript
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
```

### Global vs. Grid Magnetic Tilt Implementations

Two distinct scripts manage 3D tilting:

1.  **Global Fallback (in `MainLayout.astro`):**
    - Tracks mouse movements globally on `.glass-card` and `.card-spotlight`.
    - Applies a subtler **2-degree** tilt when coordinates fall inside the card bounding box:
      ```javascript
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
      ```
    - Resets to flat (`rotateX(0deg) rotateY(0deg) translateZ(0px)`) when mouse leaves.

2.  **Grid-Level Advanced Magnetic Tilt (in `index.astro`):**
    - Optimized by attaching the listener to the parent container instead of individual cards. It iterates through card children under parents `'cards-container-1'` through `'cards-container-6'`, and the dynamic `'recently-used-grid'`.
    - Applies a stronger **4-degree** tilt, **1.02x scale zoom**, and elevates the card forward in 3D space:
      ```javascript
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`;
      card.style.zIndex = '50';
      card.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.1)';
      ```
    - On mouse leave (or leaving the parent grid entirely), all styles reset back to initial defaults (`zIndex = '1'`, scale and transforms flat).

---

## 5. WebGL Particle Engine (Jarvis Visuals)

The hero section features a background Canvas powered by Three.js rendering an interactive particles matrix.

### Setup and Math

- **Particle Density:** Generates `2000` vertices on mobile (<768px width) and `6000` vertices on desktop.
- **Material properties:** Uses `THREE.PointsMaterial` colored `0xffaa55` (warm gold), with additive blending (`THREE.AdditiveBlending`) and an opacity of `0.5`.

### Mouse Reaction (Parallax Rotation)

Mouse movements on the screen influence the rotation velocity and pitch of the particle mesh:

```javascript
targetX = ((event.clientX / window.innerWidth) * 2 - 1) * 0.5;
targetY = (-(event.clientY / window.innerHeight) * 2 + 1) * 0.5;

// inside animate() loop:
particleMesh.rotation.y += 0.05 * (targetX - particleMesh.rotation.y);
particleMesh.rotation.x += 0.05 * (targetY - particleMesh.rotation.x);
```

### Voice AI Reactivity

When using Jarvis Voice Mode (built via `window.SpeechRecognition`), the particle engine becomes highly reactive:

- A `voiceReactivity` value is incremented based on speech amplitude/transcript length.
- The mesh scale expands up to `1.45x` (`scale = 1 + voiceReactivity * 0.3`).
- The particle colors cycle through the full HSL spectrum using `particlesMaterial.color.setHSL((elapsedTime * 0.05) % 1, 0.8, 0.6)`.
- After speech stops, properties smoothly interpolate back to standard coordinates and the default gold tint.
