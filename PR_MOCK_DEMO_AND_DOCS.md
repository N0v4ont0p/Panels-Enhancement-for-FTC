# PR: Add Isolated Mock Frontend + Team 19859 Docs Overhaul

## Summary

This PR adds a **new standalone frontend mock/demo app** for UI development without robot hardware and overhauls the docs site for FTC Team 19859 branding/public hosting.

The original FTC robot-side behavior is preserved:

- No functional changes to `library/` runtime logic
- No functional changes to `examples/` robot behavior
- No changes to REV Hub / Control Hub deployment flow

## What Was Added

### 1) New isolated mock frontend app (`mock-demo/`)

- Built as a standalone Vite + TypeScript app
- Fully separated from production FTC runtime paths
- Includes mocked services/state for:
  - connection status + latency
  - telemetry stream
  - opmode state
  - widget health/fps
  - graph stream
  - field pose/path
  - gamepad sticks/triggers/buttons
- Includes local dev, strict build check, and production preview scripts

### 2) Docs site overhaul (`docs/`)

- Reworked landing page content and layout for FTC Team 19859 fork identity
- Explicitly states this project is a fork of original Panels
- Highlights motivation and improvements over upstream
- Adds screenshots gallery from repo assets
- Documents real FTC deployment workflow vs mock/demo workflow
- Adds clear credits/attribution section
- Adds developer scripts for hosted dev and strict build checks

### 3) Repository documentation updates

- Root README now documents:
  - real FTC runtime targets vs mock-demo target separation
  - local commands for docs and mock-demo
  - recommended Render settings for both
- Added `mock-demo/README.md` with purpose, setup, limitations, and Render deploy guidance
- Replaced generic docs README with project-specific hostable docs instructions

## Validation

### Mock demo

```bash
cd mock-demo
npm run check
npm run build
```

Status: Passed

### Docs site

```bash
cd docs
npm run check
npm run build
```

Status: Passed

## Non-Goals / Untouched Areas

- Did not replace real FTC app with mock app
- Did not modify production FTC plugin runtime behavior
- Did not alter robot-side deployment architecture

## Suggested Review Focus

- Confirm separation boundary between `mock-demo/` and FTC runtime code
- Confirm docs branding and fork attribution language
- Confirm Render deployment settings match team hosting preferences
