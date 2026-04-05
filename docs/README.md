# Team 19859 Docs Site

This folder contains the public project site for FTC Team 19859's fork of Panels.

The site explains:

- what this fork is and why it exists
- improvements over upstream Panels
- real FTC deployment workflow vs standalone mock/demo workflow
- attribution to the original creator/project

## Local Development

```sh
cd docs
npm install
npm run dev
```

## Build + Preview

```sh
cd docs
npm install
npm run build
npm run preview
```

## Render Deployment (Recommended)

Use a Static Site service with:

- Root Directory: `docs`
- Build Command: `npm install && npm run build`
- Publish Directory: `build`

## Notes

- This docs site is intentionally separate from the FTC runtime code in `library/` and `examples/`.
- For frontend-only testing without a robot, use `../mock-demo`.
