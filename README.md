# 🪔 Happy Diwali 2026 — 3D Scroll Storytelling Experience

A single-page, scroll-driven 3D interactive greeting celebrating **Diwali 2026** (Sunday, 8 November 2026). Built with Vite, React 19, Tailwind CSS v4, Three.js, React Three Fiber, GSAP ScrollTrigger, and Lenis smooth scrolling.

---

## 🌟 Visual Systems & Features

- **GPU Particle Fireworks Engine:** Custom vertex and fragment shaders powering 8 distinctive firework burst styles (peony, willow, ring, double ring, heart, spiral, crackle, palm), launch streaks, screen-space readability masking, and scroll-scrubbed crescendo.
- **Interactive Cursor & Tap Fireworks:** Canvas 2D overlay featuring smooth golden cursor spark trail, click/tap mini firework bursts, hold-to-charge mechanics, and custom easing ring cursor. Fully responsive and rate-limited.
- **Hero Quality Diya & 3-Layer Flame:** Procedural lathe geometry with base foot, belly, thick rim, and wick spout; charred cotton wick; 3-layer GLSL flame (blue core, saffron mantle, white/gold tip); volumetric light cone; billboard glow sprite; glossy reflective ground; and drifting marigold petals.
- **Synchronized Scene Timeline (`src/lib/timelineConfig.js`):** Unified timeline defining normalized scroll bounds matching DOM layout heights so 3D camera choreography, sky gradients, navigation dots, and particle effects transition seamlessly together.
- **Atmosphere & Per-Scene Sky Gradients:** Dynamic 3-stop linear gradient interpolation across all 8 scenes, drifting nebula blobs, and twinkling 3D background stars.
- **Navigation Chrome:** Slim auto-hiding top bar with wordmark, audio toggle, and gold progress line; desktop right-side scene navigation dots with hover tooltips and direct smooth scroll.
- **Adaptive Performance Quality:** Real-time FPS monitor that gracefully steps down DPR and particle counts if framerate falls below 45fps on low-end devices, with automatic pause on hidden tabs.
- **Clean, Calm & Readable:** Designed for effortless readability with dark protective scrim panels, text shadows, and high contrast against the 3D scene (WCAG AA compliant).
- **English Only & Inter Only:** Written in plain, warm English. Typography powered exclusively by `@fontsource-variable/inter` (weights 400 to 800, no weights below 400).
- **Pinned Wishes Sequence:** Config-driven GSAP ScrollTrigger pin. Total scroll distance is automatically calculated from `wishes.length * 75vh`. Each wish has a generous 50% hold dwell period.
- **Web Audio Soundscape:** 100% procedural ambient soundscape, harmonic bell chimes, and firework crackle pops via Web Audio API.

---

## 📅 Confirmed Festival Date

- **Day & Date:** Sunday, 8 November 2026

---

## ✍️ How to Edit Wishes (`src/config/wishes.js`)

All wish messages are stored in [`src/config/wishes.js`](./src/config/wishes.js):

```javascript
export const wishes = [
  {
    id: 1,
    text: "May your home glow with happiness.",
    sub: "Warmth in every room, peace in every corner.",
    theme: "Happiness",
  },
  // Add or edit wishes as needed!
];
```

> **Dynamic Pinning:** Adding or removing items automatically adjusts the pinned scroll distance (`wishes.length * 75vh`).

---

## 💌 Personalization with URL Parameters

Personalize the greeting using `?to=` and `?from=`:

```
https://your-domain.com/?to=Priya&from=Rahul
```

- **`to`:** Displayed in the Hero badge ("For {to}") and Share dialog.
- **`from`:** Displayed in the Final Card section ("With love, {from}").
- **Security:** Input parameters are automatically sanitized, length-limited to 30 characters, and escaped.

---

## 🚀 How to Run & Deploy

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Run ESLint check
pnpm run lint

# Build for production
pnpm run build
```

### Deploy to Vercel or Netlify
- **Framework Preset:** Vite
- **Build Command:** `pnpm run build`
- **Output Directory:** `dist`

---

## 📄 License
MIT License. Crafted for Diwali 2026.
