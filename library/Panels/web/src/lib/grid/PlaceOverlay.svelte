<script lang="ts">
  import { getContext } from "svelte"
  import type { Manager } from "./widgets.svelte"
  const manager = getContext("manager") as Manager
</script>

{#if manager.place != null}
  <div
    class:invalid={!manager.isValid}
    style="--x:{manager.place.x};--y:{manager.place.y};--w:{manager.place
      .w};--h:{manager.place.h};"
  ></div>
{/if}

<style>
  div {
    position: absolute;
    background-color: color-mix(in srgb, var(--primary) 20%, var(--bgLight) 80%);
    color: inherit;
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--primary) 40%, transparent);
    top: calc(var(--y) * var(--height));
    left: calc(var(--x) * var(--width));
    height: calc(var(--height) * var(--h));
    width: calc(var(--width) * var(--w));
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
  div.invalid {
    background-color: rgba(230, 0, 18, 0.32);
    border-color: rgba(230, 0, 18, 0.8);
  }
</style>
