import "./styles.css"
import { MockPanelsService, type ConnectionStatus, type Point } from "./mockData"

const service = new MockPanelsService()
let lastTick = performance.now()
let liveMode = false
let theme: "blue" | "red" = "blue"

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) {
  throw new Error("Missing #app root element")
}

app.innerHTML = `
  <main class="shell">
    <header class="topbar">
      <a class="brand" href="#" aria-label="Panels mock home">
        <span class="brand-pill">P</span>
        <div>
          <p class="eyebrow">FTC Team 19859</p>
          <h1>Panels Mock Runtime</h1>
        </div>
      </a>
      <div class="status-wrap">
        <span class="badge" id="connection-badge">CONNECTING</span>
        <p class="mono" id="runtime-clock">--</p>
      </div>

      <div class="top-actions">
        <button class="toggle" id="toggle-live">Start Live Mock</button>
        <button class="toggle" id="toggle-theme">Theme: Blue</button>
        <label class="speed">
          Speed
          <input id="speed" type="range" min="0.25" max="1.5" step="0.05" value="0.9" />
        </label>
      </div>
    </header>

    <section class="toolbar card">
      <div class="toolbar-item"><span>Preset</span><strong>Competition Baseline</strong></div>
      <div class="toolbar-item"><span>Profile</span><strong>Full Panels</strong></div>
      <div class="toolbar-item"><span>Runtime</span><strong>Mock Isolated</strong></div>
      <div class="toolbar-item"><span>Mode</span><strong>No Robot Required</strong></div>
    </section>

    <section class="grid">
      <article class="card telemetry-card">
        <h2>Telemetry</h2>
        <div id="telemetry-grid" class="telemetry-grid"></div>
      </article>

      <article class="card opmodes-card">
        <h2>OpModes</h2>
        <ul id="opmodes" class="list"></ul>
      </article>

      <article class="card widgets-card">
        <h2>Widget Health</h2>
        <ul id="widgets" class="list"></ul>
      </article>

      <article class="card graph-card">
        <h2>Graph</h2>
        <svg id="graph" viewBox="0 0 600 200" preserveAspectRatio="none" aria-label="Mock graph"></svg>
      </article>

      <article class="card field-card">
        <h2>Field State</h2>
        <svg id="field" viewBox="0 0 144 144" class="field" aria-label="Mock field"></svg>
      </article>

      <article class="card gamepad-card">
        <h2>Gamepad</h2>
        <div class="sticks">
          <div class="stick" id="left-stick"><span></span></div>
          <div class="stick" id="right-stick"><span></span></div>
        </div>
        <div class="triggers">
          <label>L2 <progress id="left-trigger" max="1" value="0"></progress></label>
          <label>R2 <progress id="right-trigger" max="1" value="0"></progress></label>
        </div>
        <div class="buttons" id="buttons"></div>
      </article>

      <article class="card config-card">
        <h2>Configurables</h2>
        <ul id="configurables" class="list"></ul>
      </article>

      <article class="card camera-card">
        <h2>Camera Stream</h2>
        <div class="camera-frame">
          <div class="scan"></div>
          <p>Mock stream active</p>
          <p class="subtle">Rendered locally with no robot camera input.</p>
        </div>
      </article>

      <article class="card notifications-card">
        <h2>Notifications</h2>
        <ul id="notifications" class="list notifications"></ul>
      </article>
    </section>

    <footer class="card footer">
      <p>High-fidelity mock: Panels-style UX with deterministic data and optional live updates.</p>
      <p class="subtle">Production FTC runtime in library/ and examples/ remains untouched.</p>
    </footer>
  </main>
`

const connectionBadge = getById<HTMLElement>("connection-badge")
const runtimeClock = getById<HTMLElement>("runtime-clock")
const toggleLive = getById<HTMLButtonElement>("toggle-live")
const toggleTheme = getById<HTMLButtonElement>("toggle-theme")
const speedInput = getById<HTMLInputElement>("speed")
const telemetryGrid = getById<HTMLElement>("telemetry-grid")
const opmodes = getById<HTMLElement>("opmodes")
const widgets = getById<HTMLElement>("widgets")
const configurables = getById<HTMLElement>("configurables")
const notifications = getById<HTMLElement>("notifications")
const graph = getById<SVGSVGElement>("graph")
const field = getById<SVGSVGElement>("field")
const leftStick = getById<HTMLElement>("left-stick")
const rightStick = getById<HTMLElement>("right-stick")
const leftTrigger = getById<HTMLProgressElement>("left-trigger")
const rightTrigger = getById<HTMLProgressElement>("right-trigger")
const buttons = getById<HTMLElement>("buttons")

const applyTheme = () => {
  document.body.classList.remove("blue", "red")
  document.body.classList.add(theme)
}

toggleLive.addEventListener("click", () => {
  liveMode = !liveMode
  toggleLive.textContent = liveMode ? "Pause Live Mock" : "Start Live Mock"
})

toggleTheme.addEventListener("click", () => {
  theme = theme === "blue" ? "red" : "blue"
  toggleTheme.textContent = `Theme: ${theme === "blue" ? "Blue" : "Red"}`
  applyTheme()
})

const update = () => {
  const now = performance.now()
  const dt = now - lastTick
  lastTick = now

  if (liveMode) {
    const speed = Number(speedInput.value)
    service.tick(dt * speed)
  }

  const snapshot = service.getSnapshot()

  runtimeClock.textContent = `${snapshot.nowIso} | ${snapshot.latencyMs} ms latency | ${snapshot.pingMs.toFixed(1)} ms ping`
  setConnectionBadge(snapshot.connection)

  telemetryGrid.innerHTML = snapshot.telemetry
    .map((entry) => `<p class="key">${entry.key}</p><p class="val">${entry.value}</p>`)
    .join("")

  opmodes.innerHTML = snapshot.opModes
    .map(
      (mode) =>
        `<li><span>${mode.name} <small>${mode.type}</small></span><span class="state ${mode.state}">${mode.state}</span></li>`
    )
    .join("")

  widgets.innerHTML = snapshot.widgets
    .map(
      (widget) =>
        `<li><span>${widget.name}</span><span class="pill ${widget.health}">${widget.health}</span><span class="mono">${widget.fps} fps</span></li>`
    )
    .join("")

  configurables.innerHTML = snapshot.configurables
    .map(
      (entry) =>
        `<li><span>${entry.key}</span><span class="pill ${entry.changed ? "warning" : "ok"}">${entry.changed ? "changed" : "stable"}</span><span class="mono">${entry.value}</span></li>`
    )
    .join("")

  notifications.innerHTML = snapshot.notifications
    .map((item) => `<li><span>${item}</span><span class="mono">${snapshot.cycleSeconds.toFixed(1)}s</span></li>`)
    .join("")

  drawGraph(snapshot.graphSeries)
  drawField(snapshot.fieldPath)

  moveStick(leftStick, snapshot.gamepad.leftStick)
  moveStick(rightStick, snapshot.gamepad.rightStick)

  leftTrigger.value = snapshot.gamepad.triggers.left
  rightTrigger.value = snapshot.gamepad.triggers.right

  buttons.innerHTML = Object.entries(snapshot.gamepad.buttons)
    .map(([name, active]) => `<span class="button ${active ? "active" : ""}">${name}</span>`)
    .join("")
}

const interval = setInterval(update, 220)
update()
applyTheme()

window.addEventListener("beforeunload", () => {
  clearInterval(interval)
})

function getById<T extends Element>(id: string): T {
  const element = document.getElementById(id)
  if (!element) {
    throw new Error(`Missing required element #${id}`)
  }
  return element as unknown as T
}

function setConnectionBadge(connection: ConnectionStatus) {
  connectionBadge.className = `badge ${connection}`
  connectionBadge.textContent = connection.toUpperCase()
}

function drawGraph(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 600
      const normalized = (value - min) / (max - min || 1)
      const y = 180 - normalized * 150
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(" ")

  graph.innerHTML = `
    <defs>
      <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="rgba(0, 161, 255, 0.85)"/>
        <stop offset="100%" stop-color="rgba(0, 161, 255, 0)"/>
      </linearGradient>
    </defs>
    <polyline fill="none" stroke="var(--accent)" stroke-width="3" points="${points}" />
  `
}

function drawField(path: Point[]) {
  const pathPoints = path.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
  const current = path[0]

  field.innerHTML = `
    <rect x="0" y="0" width="144" height="144" fill="#0d141f" rx="4" />
    <rect x="6" y="6" width="132" height="132" fill="none" stroke="#2f4b69" stroke-dasharray="3 2" />
    <line x1="72" y1="6" x2="72" y2="138" stroke="#2f4b69" stroke-width="1" />
    <line x1="6" y1="72" x2="138" y2="72" stroke="#2f4b69" stroke-width="1" />
    <polyline points="${pathPoints}" fill="none" stroke="var(--accent-soft)" stroke-width="1.8" />
    <circle cx="${current.x.toFixed(2)}" cy="${current.y.toFixed(2)}" r="3" fill="var(--accent)" />
  `
}

function moveStick(container: HTMLElement, point: Point) {
  const thumb = container.querySelector("span")
  if (!thumb) return
  const x = point.x * 13
  const y = point.y * 13
  ;(thumb as HTMLElement).style.transform = `translate(${x}px, ${y}px)`
}
