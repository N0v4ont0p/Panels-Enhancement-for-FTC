# PR: Comprehensive UI/UX Redesign (Feature-Preserving) + Mock/Docs Alignment

## Summary

This PR delivers a comprehensive UI/UX enhancement pass for FTC Team 19859's Panels fork while preserving all existing capabilities and runtime behavior.

The original FTC robot-side behavior is preserved:

- No breaking functional changes to `library/` runtime logic
- No breaking functional changes to `examples/` robot behavior
- No changes to REV Hub / Control Hub deployment flow

## What Was Enhanced

### 1) Real app UI/UX redesign (`library/Panels/web`)

- Upgraded global design tokens and visual system in shared shell styles
- Refined top bar/nav controls, overlays, plugin/docs cards, and notification surfaces
- Improved widget chrome (tabs, header/options/resize affordances, grid overlays)
- Improved spacing rhythm, readability, hierarchy, contrast, and responsive behavior
- Preserved all existing feature pathways and dashboard functionality

### 2) Isolated mock frontend app (`mock-demo/`) aligned to enhanced direction

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
- Keeps separation from robot runtime while supporting polished UI iteration

### 3) Docs site and documentation alignment (`docs/` + root docs)

- Reworked landing page content and layout for FTC Team 19859 fork identity
- Explicitly states this project is a fork of original Panels
- Highlights motivation and improvements over upstream
- Adds screenshots gallery from repo assets
- Documents real FTC deployment workflow vs mock/demo workflow
- Adds clear credits/attribution section
- Adds developer scripts for hosted dev and strict build checks
- Clarifies real runtime (`library/` + `examples/`) vs mock path (`mock-demo/`)

### 4) Repository documentation updates

- Root README now documents:
  - comprehensive UI/UX enhancement intent
  - preserved feature/runtime guarantees
  - real FTC runtime targets vs mock-demo target separation
  - local commands and Render settings
- Added `mock-demo/README.md` with purpose, setup, limitations, and Render deploy guidance
- Replaced generic docs README with project-specific hostable docs instructions

## Feature Preservation Statement

This PR intentionally preserves major capabilities, including:

- graphs
- telemetry
- field view
- capture-related surfaces
- opmode controls
- configurables
- gamepad UI
- widget/panel/plugin workflows
- layout interactions (tabs/group/widget operations)

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

### Real Panels web app

```bash
cd library/Panels/web
npm run check
```

Status: Passed

## Non-Goals / Untouched Areas

- Did not replace real FTC app with mock app
- Did not modify production FTC plugin runtime behavior
- Did not alter robot-side deployment architecture

## Suggested Review Focus

- Confirm UI improvements preserve existing functionality and workflows
- Confirm separation boundary between `mock-demo/` and FTC runtime code
- Confirm docs/readme messaging around real runtime vs mock-demo
