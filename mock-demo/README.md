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

## Limitations vs Real FTC Runtime

- Uses generated mock data, not live robot/plugin sockets.
- Does not invoke robot-side commands.
- Does not replace or alter real REV Hub deployment flows.

If you need real hardware behavior, run the standard FTC app paths documented in the root README and the existing `library/` + `examples/` workflows.
