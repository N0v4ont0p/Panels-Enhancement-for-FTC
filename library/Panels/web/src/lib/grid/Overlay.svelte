<script lang="ts">
  import { getContext } from "svelte"
  import type { Manager } from "./widgets.svelte"
  const manager = getContext("manager") as Manager

  let {
    x,
    y,
    isMouse = false,
  }: { x: number; y: number; isMouse?: boolean } = $props()

  function handleMouseMove() {
    if (manager.placeStart == null) return
    manager.updatePlace(x, y)
  }

  function handleMouseLeave() {
    cleanup()
    manager.resetPlace()
  }

  function handleMouseOut(e: MouseEvent) {
    var from = e.relatedTarget as HTMLElement | null
    if (!from || from.nodeName == "HTML") {
      handleMouseLeave()
    }
  }

  function cleanup() {
    window.removeEventListener("mouseout", handleMouseOut)
    window.removeEventListener("blur", handleMouseLeave)
  }
</script>

{#if isMouse}
  <button
    oncontextmenu={(e) => e.preventDefault()}
    onmousedown={(e) => {
      if (e.button != 0) return
      manager.startPlace(x, y)

      window.addEventListener("mouseout", handleMouseOut)
      window.addEventListener("blur", handleMouseLeave)
    }}
    onmouseup={(e) => {
      if (e.button != 0) return
      manager.endPlace(x, y)
      cleanup()
    }}
    onmousemove={handleMouseMove}
    style="--x:{x};--y:{y};">+</button
  >
{:else}
  <div style="--x:{x};--y:{y};"></div>
{/if}

<style>
  div,
  button {
    position: absolute;
    background-color: transparent;
    color: inherit;
    border: 1px solid var(--bgLight);
    top: calc(var(--y) * var(--height));
    left: calc(var(--x) * var(--width));
    height: calc(var(--height));
    width: calc(var(--width));
    display: grid;
    place-content: center;
  }
  button {
    font-size: 1.15rem;
    font-weight: 600;
    cursor: crosshair;
    color: color-mix(in srgb, var(--text) 85%, var(--primary) 15%);
    background-color: color-mix(in srgb, var(--bgMedium) 65%, transparent);
  }
  button:hover {
    border-color: var(--primary);
    background-color: rgba(0, 91, 172, 0.14);
    background-color: color-mix(in srgb, var(--primary) 14%, var(--bgMedium) 86%);
    color: #fff;
  }
  button:active {
    background-color: rgba(0, 91, 172, 0.24);
    background-color: color-mix(in srgb, var(--primary) 24%, var(--bgMedium) 76%);
  }
</style>
