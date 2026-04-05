# Panels

![dashboard](./docs/static/homepage-panels.png)

**Panels** is an all-in-one toolbox for your FTC robot, developed by [**Lazar**](https://bylazar.com) from team **19234 ByteForce**.  
It provides a powerful set of features with minimal boilerplate, using **Kotlin** for cleaner syntax (also works in **Java**).

![dashboard](./docs/static/all-plugins.png)

## Panels 1.0: Built on Plugins

Panels is now entirely plugin-driven. Out of the box, you get all the essentials delivered as native plugins.
Extend with custom plugins.

Build a Svelte frontend and Kotlin backend, hook into the full Panels UI, and use the JS utilities, components, and FTC SDK to quickly ship new features. Panels becomes your FTC app modding platform.

Read the full [**docs**](https://panels.bylazar.com).

---

## Panels Features

**Panels** includes:

- **OpMode control** – Just like the Driver Hub.
- **Real-time telemetry** – See all your robot data live.
- **Field view** – A canvas-like interface for drawing on the field.
- **Graph view** – A graphing tool for tuning and debugging.
- **Capture mode** – Record and replay matches for debugging.
- **Configurables** – Tune your robot in real time **without uploading code again**.
- **Limelight Support** - Use your Limelight 3A without USB connection.
- **Plugins** - Extend Panels using custom plugins.

---

Stay tuned for more features as Panels evolves!

---

## FTC Team 19859 Fork Additions

This repository now contains two clearly separated frontend targets:

- **Production FTC runtime** (original behavior preserved):
	- `library/`
	- `examples/`
- **Standalone frontend mock environment** (no robot required):
	- `mock-demo/`

The mock demo is isolated and does **not** replace the FTC robot-side deployment flow.

### Run the standalone mock demo

```sh
cd mock-demo
npm install
npm run dev
```

### Run the docs site

```sh
cd docs
npm install
npm run dev
```

### Render deployment quick settings

- **Docs site**
	- Root Directory: `docs`
	- Build Command: `npm install && npm run build`
	- Publish Directory: `build`
- **Mock demo**
	- Root Directory: `mock-demo`
	- Build Command: `npm install && npm run build`
	- Publish Directory: `dist`

### Attribution

Panels is originally created by **Lazar** from team **19234 ByteForce**.
This fork by **FTC Team 19859** adds workflow and usability enhancements while preserving credit and compatibility.
