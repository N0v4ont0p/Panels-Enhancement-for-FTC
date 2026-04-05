# Panels — Enhanced Fork by FTC Team 19859

![dashboard](./docs/static/homepage-panels.png)

> **This is an enhanced fork of [Panels](https://panels.bylazar.com), maintained by FTC Team 19859.**  
> For the original project, see the [upstream repository](https://panels.bylazar.com).

**Panels** is an all-in-one web-based toolbox for your FTC robot. It gives you real-time telemetry, field visualization, PID tuning, OpMode control, and much more — all from your browser, with minimal setup.

Built with **Kotlin** on the robot side (also works in **Java**) and **Svelte** on the frontend.

---

## 📋 Table of Contents

- [What's Different in This Fork](#-whats-different-in-this-fork)
- [Features](#-features)
- [Getting Started](#-getting-started)
- [Screenshots](#-screenshots)
- [Credits](#-credits)

---

## 🔀 What's Different in This Fork

This fork, maintained by **FTC Team 19859**, builds on the original Panels project with targeted improvements focused on usability, reliability, and REV Hub deployment readiness.

### UI / UX Improvements
- **Responsive layout** — Grid min-width now uses `clamp()` for fluid scaling on any screen size (1040 px → 1320 px range), eliminating the need to zoom in on standard laptop screens.
- **Spacing system** — Introduced a consistent spacing scale (`--space-1` through `--space-5`) and border-radius tokens (`--radius-sm`, `--radius-md`, `--radius-lg`) for uniform visual rhythm across every component.
- **Larger controls** — Tab min-height raised to `2rem`; drag/resize/options icon buttons enlarged to `2rem × 2rem`; plugin button grid increased from 32 px → 42 px. Easier to click during competition.
- **Better typography** — Base font size scales responsively with `clamp(14px, 0.17vw + 13px, 16px)`; headings use fluid `clamp()` sizing; line-height improved to 1.4+ for readability at 100% zoom.
- **Visual depth** — Consistent box shadows and borders added to panels and widgets for clear visual hierarchy.
- **Topbar polish** — Height increased from 64px → 74px; larger icon buttons; status indicator dot; improved overlay positioning.
- **Modal / overlay improvements** — Overlays respect the viewport (`min-width: min(Xpx, calc(100vw - Ypx))`); dialogs fit standard laptop screens without scrolling.
- **19 files updated** — All changes are presentation-only; no backend logic, data flow, chart behaviour, or plugin architecture was altered.

### Bug Fixes
| # | File | Issue | Fix |
|---|------|-------|-----|
| 1 | `src/routes/docs/+page.svelte` | `href="panels.bylazar.com"` missing protocol | Changed to `href="https://panels.bylazar.com" target="_blank" rel="noopener noreferrer"` |
| 2 | `src/routes/plugins/+page.svelte` | `<a>No website</a>` missing `href` — invalid HTML & accessibility violation | Replaced with `<span style="opacity: 0.6;">No website</span>` |
| 3 | `src/lib/grid/Overlay.svelte` | `handleMouseOut(e)` used deprecated `e.toElement` without type annotation | Typed as `MouseEvent`; replaced with standard `e.relatedTarget` |
| 4 | `src/routes/docs/+page.svelte` | Duplicate `p { margin: … }` rules with conflicting values | Removed duplicate; replaced with proper heading styles |
| 5 | `src/routes/docs/+page.svelte` | Unused CSS selectors causing Svelte warnings | Removed unused selectors; replaced with `h1` styles |

### REV Hub Deployment Readiness
- Added CSS fallback variables for `color-mix()` to ensure the UI degrades gracefully on older Chromium versions that may ship on some REV Hubs:
  - `--light-border-80`, `--light-border-85`, `--light-hover-75`, `--primary-35`, `--accent-text-85`, `--focus-outline`
- Verified that no deprecated or non-standard browser APIs are used in modified code.
- All event listeners are properly attached and cleaned up — no memory leaks.

---

## ✨ Features

All original Panels features are fully preserved:

| Feature | Description |
|---------|-------------|
| **OpMode Control** | Start, stop, and select OpModes — just like the Driver Hub |
| **Real-Time Telemetry** | See all robot data live in your browser |
| **Field View** | Canvas-based drawing interface for the competition field |
| **Graph View** | Live graphing tool for PID tuning and debugging |
| **Capture Mode** | Record and replay matches for post-match analysis |
| **Configurables** | Tune values on the fly — no re-upload required |
| **Limelight Support** | Use your Limelight 3A wirelessly, without USB |
| **Plugin System** | Extend Panels with custom Svelte + Kotlin plugins |

---

## 🚀 Getting Started

Read the full documentation at **[panels.bylazar.com](https://panels.bylazar.com)**.

Panels uses **Kotlin** (Java-compatible) on the robot side and is served directly from the REV Hub. The enhanced frontend in this fork is a drop-in replacement — no API or SDK changes are needed.

---

## 📸 Screenshots

![All Plugins](./docs/static/all-plugins.png)

---

## 🏆 Credits

### Fork Maintainer
**FTC Team 19859** — UI/UX improvements, bug fixes, and REV Hub deployment hardening for this enhanced fork.

---

### Original Project
Panels was created by [**Lazar**](https://bylazar.com) from **FTC Team 19234 ByteForce**.  
Full documentation and the upstream project live at [panels.bylazar.com](https://panels.bylazar.com).

---

*Licensed under the terms of the included [LICENSE](./LICENSE.md).*
