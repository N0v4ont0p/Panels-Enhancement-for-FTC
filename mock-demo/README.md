# Panels Mock Demo (Standalone)

This folder contains a fully separate frontend-only mock environment for FTC Team 19859.

It is intentionally isolated from the real FTC robot runtime in `library/` and `examples/`.
No robot-side Kotlin/Java behavior is modified by this demo.

## Purpose

Use this app to test frontend UI changes without requiring:

- a REV Control Hub / Robot Controller
- a physical robot connection
- plugin websocket traffic from the FTC runtime

The demo mirrors the Panels experience using mocked services for:

- connection status and latency
- telemetry stream
- opmode list/state
- widget health/fps
- graph data stream
- field/pose trail
- gamepad state

The goal is high-fidelity frontend testing for UI/UX improvements while keeping the real runtime untouched.

Visual alignment target:

- `mock-demo/` follows the same core design tokens, theme behavior, and shell styling direction as the real Panels UI hosted from the FTC runtime on REV hardware.

Behavior defaults:

- Demo opens in a stable snapshot state (live updates are paused by default).
- Use **Start Live Mock** in the top bar when you want streaming changes.

## Local Development

```bash
cd mock-demo
npm install
npm run dev
```

Default URL: `http://localhost:4173`

## Production Build

```bash
cd mock-demo
npm install
npm run build
npm run preview
```

## Render Deployment (Static Site)

Create a new **Static Site** and use:

- Root Directory: `mock-demo`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

If you previously deployed an older build, trigger a clear rebuild/redeploy so the new assets replace cached ones.

## Limitations vs Real FTC Runtime

- Uses generated mock data, not live robot/plugin sockets.
- Does not invoke robot-side commands.
- Does not replace or alter real REV Hub deployment flows.

### Separation Guarantee

- Real FTC behavior remains in `library/` and `examples/`.
- `mock-demo/` is intentionally isolated for standalone UI development and hosting.

If you need real hardware behavior, run the standard FTC app paths documented in the root README and the existing `library/` + `examples/` workflows.
