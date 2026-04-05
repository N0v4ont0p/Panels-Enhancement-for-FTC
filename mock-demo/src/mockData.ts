export type ConnectionStatus = "connected" | "degraded"

export type TelemetryEntry = {
  key: string
  value: string
}

export type OpModeInfo = {
  name: string
  type: "TeleOp" | "Autonomous"
  state: "running" | "queued" | "idle"
}

export type WidgetInfo = {
  name: string
  plugin: string
  health: "ok" | "warning" | "error"
  fps: number
}

export type Point = {
  x: number
  y: number
}

export type GamepadButtonState = {
  a: boolean
  b: boolean
  x: boolean
  y: boolean
  leftBumper: boolean
  rightBumper: boolean
}

export type MockSnapshot = {
  nowIso: string
  cycleSeconds: number
  connection: ConnectionStatus
  latencyMs: number
  voltage: number
  cpuTempC: number
  pingMs: number
  telemetry: TelemetryEntry[]
  opModes: OpModeInfo[]
  widgets: WidgetInfo[]
  graphSeries: number[]
  fieldPath: Point[]
  configurables: Array<{ key: string; value: string; changed: boolean }>
  notifications: string[]
  gamepad: {
    leftStick: Point
    rightStick: Point
    triggers: { left: number; right: number }
    buttons: GamepadButtonState
  }
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value))

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export class MockPanelsService {
  private time = 0
  private heading = Math.PI / 6
  private speed = 0.82
  private position = { x: 72, y: 72 }
  private graph: number[] = Array.from({ length: 64 }, (_, i) => 38 + Math.sin(i / 7) * 10)
  private connection: ConnectionStatus = "connected"
  private notifications: string[] = [
    "Panels mock runtime booted",
    "Loaded profile: FullPanels baseline",
    "Telemetry stream established",
  ]

  tick(dtMs: number) {
    const dt = clamp(dtMs / 1000, 0, 1)
    this.time += dt
    this.updateConnection()
    this.updateGraph()
    this.updateRobotPose(dt)
    this.updateNotifications()
  }

  getSnapshot(): MockSnapshot {
    const voltage = 13.05 + Math.sin(this.time / 4.2) * 0.16
    const cpuTempC = 46.5 + Math.sin(this.time / 5.7) * 1.8
    const pingMs = 22 + Math.sin(this.time / 3.6) * 3
    const latencyMs = this.connection === "degraded" ? 65 + Math.sin(this.time / 1.8) * 8 : 29 + Math.sin(this.time / 2.8) * 4
    const path = this.generatePath()

    return {
      nowIso: new Date().toISOString(),
      cycleSeconds: this.time,
      connection: this.connection,
      latencyMs: Math.round(latencyMs),
      voltage,
      cpuTempC,
      pingMs,
      telemetry: this.buildTelemetry(voltage, cpuTempC),
      opModes: this.buildOpModes(),
      widgets: this.buildWidgets(),
      graphSeries: [...this.graph],
      fieldPath: path,
      configurables: this.buildConfigurables(),
      notifications: [...this.notifications],
      gamepad: this.buildGamepad(),
    }
  }

  private updateConnection() {
    const window = (Math.sin(this.time / 14) + 1) / 2
    if (window > 0.87) {
      this.connection = "degraded"
      return
    }
    this.connection = "connected"
  }

  private updateGraph() {
    const newest =
      38 +
      Math.sin(this.time * 1.6) * 8 +
      Math.sin(this.time * 0.53) * 4 +
      (this.connection === "degraded" ? 5 : 0)
    this.graph = [...this.graph.slice(1), newest]
  }

  private updateRobotPose(dt: number) {
    const steering = Math.sin(this.time / 2.4) * 0.34 + Math.sin(this.time / 6.8) * 0.21
    const speedTarget = 0.72 + Math.sin(this.time / 2) * 0.12
    this.heading += steering * dt
    this.speed = lerp(this.speed, speedTarget, 0.2)
    this.position.x = clamp(this.position.x + Math.cos(this.heading) * this.speed, 8, 136)
    this.position.y = clamp(this.position.y + Math.sin(this.heading) * this.speed, 8, 136)
  }

  private updateNotifications() {
    const phase = Math.floor(this.time) % 20
    if (phase === 5 && !this.notifications[0].includes("vision")) {
      this.notifications.unshift("Vision confidence updated: 0.91")
    }
    if (phase === 10 && !this.notifications[0].includes("loop")) {
      this.notifications.unshift("Loop watchdog: stable")
    }
    if (phase === 15 && !this.notifications[0].includes("template")) {
      this.notifications.unshift("Template autosave complete")
    }
    this.notifications = this.notifications.slice(0, 6)
  }

  private generatePath(): Point[] {
    const points: Point[] = []
    for (let i = 0; i < 34; i++) {
      const drift = i * 0.24
      points.push({
        x: clamp(this.position.x - Math.cos(this.heading + drift) * i * 0.75, 0, 144),
        y: clamp(this.position.y - Math.sin(this.heading + drift) * i * 0.75, 0, 144),
      })
    }
    return points
  }

  private buildTelemetry(voltage: number, cpuTempC: number): TelemetryEntry[] {
    const xIn = this.position.x - 72
    const yIn = this.position.y - 72

    return [
      { key: "Robot State", value: this.connection === "degraded" ? "ACTIVE (DEGRADED)" : "ACTIVE" },
      { key: "Pose X", value: `${xIn.toFixed(1)} in` },
      { key: "Pose Y", value: `${yIn.toFixed(1)} in` },
      { key: "Heading", value: `${((this.heading * 180) / Math.PI).toFixed(1)} deg` },
      { key: "Battery", value: `${voltage.toFixed(2)} V` },
      { key: "Control Hub Temp", value: `${cpuTempC.toFixed(1)} C` },
      { key: "Loop Time", value: `${(18 + Math.sin(this.time * 1.35) * 2.5).toFixed(1)} ms` },
      { key: "Detected AprilTags", value: `${Math.max(0, Math.round(2 + Math.sin(this.time / 2.6) * 2))}` },
    ]
  }

  private buildOpModes(): OpModeInfo[] {
    const autoRunning = Math.sin(this.time / 9) > 0.82

    return [
      { name: "TeleOp_Main", type: "TeleOp", state: autoRunning ? "idle" : "running" },
      { name: "TeleOp_DriveOnly", type: "TeleOp", state: "idle" },
      { name: "Auto_Blue_Left", type: "Autonomous", state: autoRunning ? "running" : "idle" },
      { name: "Auto_Red_Right", type: "Autonomous", state: "queued" },
      { name: "Vision_Tuner", type: "TeleOp", state: "idle" },
    ]
  }

  private buildWidgets(): WidgetInfo[] {
    const connectionHealth = this.connection === "degraded" ? "warning" : "ok"

    return [
      { name: "Telemetry", plugin: "com.bylazar.telemetry", health: "ok", fps: Math.round(54 + Math.sin(this.time * 0.8) * 3) },
      { name: "Graph", plugin: "com.bylazar.graph", health: "ok", fps: Math.round(47 + Math.sin(this.time * 0.9) * 3) },
      { name: "Field", plugin: "com.bylazar.field", health: "ok", fps: Math.round(58 + Math.sin(this.time * 0.7) * 2) },
      {
        name: "Gamepad",
        plugin: "com.bylazar.gamepad",
        health: connectionHealth,
        fps: Math.round(50 + Math.sin(this.time * 0.6) * 5),
      },
      {
        name: "Camera Stream",
        plugin: "com.bylazar.camerastream",
        health: this.connection === "degraded" ? "warning" : "ok",
        fps: Math.round(33 + Math.sin(this.time * 0.8) * 6),
      },
      { name: "OpMode Control", plugin: "com.bylazar.opmodecontrol", health: "ok", fps: Math.round(59 + Math.sin(this.time * 0.58)) },
    ]
  }

  private buildConfigurables() {
    const p = this.time
    return [
      { key: "Drive PID kP", value: (0.083 + Math.sin(p / 8) * 0.002).toFixed(4), changed: true },
      { key: "Arm Feedforward", value: (0.215 + Math.sin(p / 6) * 0.005).toFixed(4), changed: false },
      { key: "Intake Power", value: (0.76 + Math.sin(p / 3.2) * 0.08).toFixed(2), changed: true },
      { key: "Vision Threshold", value: (0.65 + Math.sin(p / 5) * 0.04).toFixed(2), changed: false },
    ]
  }

  private buildGamepad() {
    const p = this.time
    return {
      leftStick: {
        x: Math.sin(p / 1.9) * 0.8,
        y: Math.cos(p / 2.2) * 0.76,
      },
      rightStick: {
        x: Math.sin(p / 2.8) * 0.7,
        y: Math.cos(p / 3.1) * 0.62,
      },
      triggers: {
        left: clamp((Math.sin(p / 1.7) + 1) / 2, 0, 1),
        right: clamp((Math.cos(p / 2.3) + 1) / 2, 0, 1),
      },
      buttons: {
        a: Math.sin(p * 1.6) > 0.85,
        b: Math.cos(p * 1.4) > 0.9,
        x: Math.sin(p * 1.2) < -0.85,
        y: Math.cos(p * 1.1) < -0.9,
        leftBumper: Math.sin(p * 0.7) > 0.92,
        rightBumper: Math.cos(p * 0.75) > 0.92,
      },
    }
  }
}
