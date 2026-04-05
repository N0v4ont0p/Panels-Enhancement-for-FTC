import "./styles.css"
import { MockPanelsService, type ConnectionStatus, type Point } from "./mockData"

const service = new MockPanelsService()

const app = document.querySelector<HTMLDivElement>("#app")
if (!app) {
  throw new Error("Missing #app root element")
}

app.innerHTML = `
  <main class="shell">
    <header class="topbar card">
      <div>
        <p class="eyebrow">FTC Team 19859</p>
        <h1>Panels Mock Demo</h1>
        <p class="subtle">Standalone UI sandbox for frontend testing without robot hardware.</p>
      </div>
      <div class="status-wrap">
        <span class="badge" id="connection-badge">Connecting</span>
        <p class="mono" id="runtime-clock">--</p>
      </div>
    </header>

    <section class="grid">
      <article class="card telemetry-card">
        <h2>Telemetry</h2>
        <div id="telemetry-grid" class="telemetry-grid"></div>
      </article>

      <article class="card">
        <h2>OpModes</h2>
        <ul id="opmodes" class="list"></ul>
      </article>

      <article class="card">
        <h2>Widget Health</h2>
        <ul id="widgets" class="list"></ul>
      </article>

      <article class="card graph-card">
        <h2>Graph (Loop Metric)</h2>
        <svg id="graph" viewBox="0 0 600 200" preserveAspectRatio="none" aria-label="Mock graph"></svg>
      </article>

      <article class="card">
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
    </section>

    <footer class="card footer">
      <p>This demo uses generated mock services for telemetry, opmodes, widgets, graph, field, and gamepad state.</p>
      <p class="subtle">Production FTC runtime in library/ and examples/ is untouched.</p>
    </footer>
  </main>
`

const connectionBadge = getById<HTMLElement>("connection-badge")
const runtimeClock = getById<HTMLElement>("runtime-clock")
const telemetryGrid = getById<HTMLElement>("telemetry-grid")
const opmodes = getById<HTMLElement>("opmodes")
const widgets = getById<HTMLElement>("widgets")
const graph = getById<SVGSVGElement>("graph")
const field = getById<SVGSVGElement>("field")
const leftStick = getById<HTMLElement>("left-stick")
const rightStick = getById<HTMLElement>("right-stick")
const leftTrigger = getById<HTMLProgressElement>("left-trigger")
const rightTrigger = getById<HTMLProgressElement>("right-trigger")
const buttons = getById<HTMLElement>("buttons")

const update = () => {
  const snapshot = service.getSnapshot()

  runtimeClock.textContent = `${snapshot.nowIso} | ${snapshot.latencyMs} ms`
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

const interval = setInterval(update, 450)
update()

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
        <stop offset="0%" stop-color="rgba(243, 179, 91, 0.8)"/>
        <stop offset="100%" stop-color="rgba(243, 179, 91, 0)"/>
      </linearGradient>
    </defs>
    <polyline fill="none" stroke="#f3b35b" stroke-width="3" points="${points}" />
  `
}

function drawField(path: Point[]) {
  const pathPoints = path.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ")
  const current = path[0]

  field.innerHTML = `
    <rect x="0" y="0" width="144" height="144" fill="#0f1414" rx="4" />
    <rect x="6" y="6" width="132" height="132" fill="none" stroke="#35565a" stroke-dasharray="3 2" />
    <line x1="72" y1="6" x2="72" y2="138" stroke="#274247" stroke-width="1" />
    <line x1="6" y1="72" x2="138" y2="72" stroke="#274247" stroke-width="1" />
    <polyline points="${pathPoints}" fill="none" stroke="#80f2ff" stroke-width="1.6" />
    <circle cx="${current.x.toFixed(2)}" cy="${current.y.toFixed(2)}" r="3" fill="#f3b35b" />
  `
}

function moveStick(container: HTMLElement, point: Point) {
  const thumb = container.querySelector("span")
  if (!thumb) return
  const x = point.x * 13
  const y = point.y * 13
  ;(thumb as HTMLElement).style.transform = `translate(${x}px, ${y}px)`
}
