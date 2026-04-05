<script lang="ts">
  import Resize from "$lib/icons/Resize.svelte"
  import { getContext } from "svelte"
  import type { ExtendedWidgetGroup, Manager } from "../widgets.svelte"
  const manager = getContext("manager") as Manager
  let {
    widget = $bindable(),
    isPossible = $bindable(),
  }: { widget: ExtendedWidgetGroup; isPossible: boolean } = $props()

  let startX = $state(0)
  let startY = $state(0)

  function startResize(e: MouseEvent) {
    if (!manager.enableInteractions) return
    if (isPossible) return
    widget.isMoving = true
    widget.offset = {
      x: 0,
      y: 0,
    }
    startX = e.clientX
    startY = e.clientY
    manager.updateResize(widget.id)
    window.addEventListener("mousemove", onResize)
    window.addEventListener("mouseup", stopResize)
  }

  function onResize(e: MouseEvent) {
    if (!manager.enableInteractions) return
    e.preventDefault()
    widget.offset = {
      x: e.clientX - startX,
      y: e.clientY - startY,
    }

    manager.updateResize(widget.id)
  }

  function stopResize() {
    if (!manager.enableInteractions) return
    widget.isMoving = false
    window.removeEventListener("mousemove", onResize)
    window.removeEventListener("mouseup", stopResize)
    manager.finishResizeWidget(widget.id)
    widget.offset = {
      x: 0,
      y: 0,
    }
  }
</script>

<button class="icon resize" onmousedown={startResize}>
  <Resize />
</button>

<style>
  .icon {
    all: unset;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    border: 1px solid transparent;
    color: color-mix(in srgb, var(--mutedText) 88%, white 12%);
  }
  .resize {
    position: absolute;
    right: var(--space-1);
    bottom: var(--space-1);
  }
  .icon:hover {
    background-color: color-mix(in srgb, var(--bgLight) 60%, transparent);
    border-color: color-mix(in srgb, var(--primary) 36%, transparent);
    color: var(--text);
  }
</style>
