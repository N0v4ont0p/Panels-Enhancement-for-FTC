export type ConnectionStatus = "connected" | "degraded" | "offline"

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
  connection: ConnectionStatus
  latencyMs: number
  voltage: number
  cpuTempC: number
  telemetry: TelemetryEntry[]
  opModes: OpModeInfo[]
  widgets: WidgetInfo[]
  graphSeries: number[]
  fieldPath: Point[]
  gamepad: {
    leftStick: Point
    rightStick: Point
    triggers: { left: number; right: number }
    buttons: GamepadButtonState
  }
}

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value))
}

const randomBetween = (min: number, max: number): number => {
  return min + Math.random() * (max - min)
}

const randomBool = (chance = 0.5): boolean => Math.random() < chance

export class MockPanelsService {
  private heading = 0
  private speed = 0.7
  private position = { x: 72, y: 72 }
  private graph: number[] = Array.from({ length: 48 }, (_, i) =>
    42 + Math.sin(i / 6) * 12
  )
  private connection: ConnectionStatus = "connected"

  getSnapshot(): MockSnapshot {
    this.updateConnection()
    this.updateGraph()
    this.updateRobotPose()

    const voltage = 13.1 + Math.sin(Date.now() / 3700) * 0.35
    const cpuTempC = 47 + Math.sin(Date.now() / 2200) * 3.8
    const path = this.generatePath()

    return {
      nowIso: new Date().toISOString(),
      connection: this.connection,
      latencyMs: this.connection === "offline" ? 0 : Math.round(randomBetween(17, 86)),
      voltage,
      cpuTempC,
      telemetry: this.buildTelemetry(voltage, cpuTempC),
      opModes: this.buildOpModes(),
      widgets: this.buildWidgets(),
      graphSeries: [...this.graph],
      fieldPath: path,
      gamepad: this.buildGamepad(),
    }
  }

  private updateConnection() {
    const roll = Math.random()
    if (roll > 0.985) {
      this.connection = "offline"
      return
    }
    if (roll > 0.93) {
      this.connection = "degraded"
      return
    }
    this.connection = "connected"
  }

  private updateGraph() {
    const newest = 44 + Math.sin(Date.now() / 1400) * 15 + randomBetween(-2.2, 2.2)
    this.graph = [...this.graph.slice(1), newest]
  }

  private updateRobotPose() {
    this.heading += randomBetween(-0.22, 0.22)
    this.speed = clamp(this.speed + randomBetween(-0.18, 0.18), 0.2, 1.2)
    this.position.x = clamp(this.position.x + Math.cos(this.heading) * this.speed, 6, 138)
    this.position.y = clamp(this.position.y + Math.sin(this.heading) * this.speed, 6, 138)
  }

  private generatePath(): Point[] {
    const points: Point[] = []
    for (let i = 0; i < 26; i++) {
      const drift = i * 0.35
      points.push({
        x: clamp(this.position.x + Math.cos(this.heading + drift) * i * 0.8, 0, 144),
        y: clamp(this.position.y + Math.sin(this.heading + drift) * i * 0.8, 0, 144),
      })
    }
    return points
  }

  private buildTelemetry(voltage: number, cpuTempC: number): TelemetryEntry[] {
    const xIn = this.position.x - 72
    const yIn = this.position.y - 72

    return [
      { key: "Robot State", value: this.connection === "offline" ? "DISCONNECTED" : "ACTIVE" },
      { key: "Pose X", value: `${xIn.toFixed(1)} in` },
      { key: "Pose Y", value: `${yIn.toFixed(1)} in` },
      { key: "Heading", value: `${((this.heading * 180) / Math.PI).toFixed(1)} deg` },
      { key: "Battery", value: `${voltage.toFixed(2)} V` },
      { key: "Control Hub Temp", value: `${cpuTempC.toFixed(1)} C` },
      { key: "Loop Time", value: `${Math.round(randomBetween(15, 34))} ms` },
      { key: "Detected AprilTags", value: `${Math.round(randomBetween(0, 6))}` },
    ]
  }

  private buildOpModes(): OpModeInfo[] {
    const autoRunning = this.connection !== "offline" && randomBool(0.15)

    return [
      { name: "TeleOp_Main", type: "TeleOp", state: autoRunning ? "idle" : "running" },
      { name: "TeleOp_DriveOnly", type: "TeleOp", state: "queued" },
      { name: "Auto_Blue_Left", type: "Autonomous", state: autoRunning ? "running" : "idle" },
      { name: "Auto_Red_Right", type: "Autonomous", state: "idle" },
      { name: "Vision_Tuner", type: "TeleOp", state: "idle" },
    ]
  }

  private buildWidgets(): WidgetInfo[] {
    return [
      { name: "Telemetry", plugin: "com.bylazar.telemetry", health: "ok", fps: Math.round(randomBetween(42, 60)) },
      { name: "Graph", plugin: "com.bylazar.graph", health: "ok", fps: Math.round(randomBetween(35, 55)) },
      { name: "Field", plugin: "com.bylazar.field", health: "ok", fps: Math.round(randomBetween(40, 60)) },
      {
        name: "Gamepad",
        plugin: "com.bylazar.gamepad",
        health: this.connection === "degraded" ? "warning" : "ok",
        fps: Math.round(randomBetween(28, 60)),
      },
      {
        name: "Camera Stream",
        plugin: "com.bylazar.camerastream",
        health: this.connection === "offline" ? "error" : "warning",
        fps: Math.round(randomBetween(20, 45)),
      },
      { name: "OpMode Control", plugin: "com.bylazar.opmodecontrol", health: "ok", fps: Math.round(randomBetween(45, 60)) },
    ]
  }

  private buildGamepad() {
    return {
      leftStick: {
        x: randomBetween(-1, 1),
        y: randomBetween(-1, 1),
      },
      rightStick: {
        x: randomBetween(-1, 1),
        y: randomBetween(-1, 1),
      },
      triggers: {
        left: clamp(randomBetween(0, 1), 0, 1),
        right: clamp(randomBetween(0, 1), 0, 1),
      },
      buttons: {
        a: randomBool(0.2),
        b: randomBool(0.12),
        x: randomBool(0.16),
        y: randomBool(0.1),
        leftBumper: randomBool(0.14),
        rightBumper: randomBool(0.14),
      },
    }
  }
}
