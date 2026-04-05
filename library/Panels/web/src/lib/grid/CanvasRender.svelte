<script lang="ts">
  import type { Template } from "ftc-panels"
  import { global } from "$lib"

  import CanvasRenderLoader from "./CanvasRenderLoader.svelte"

  let {
    t,
    pID,
    show = true,
  }: { t: Template; pID: string; show?: boolean } = $props()

  const cacheKey = $derived(`${pID}/${t.name}`)

  let imageDataUrl: string | undefined = $derived(
    global.pluginsTemplatesPreviews[cacheKey]
  )
</script>

{#if imageDataUrl != undefined}
  {#if show}
    <img src={imageDataUrl} alt="Rendered Component" />
  {/if}
{:else}
  {#if show}
    <div class="preview-loading">Generating preview…</div>
  {/if}
  <CanvasRenderLoader {t} {pID} />
{/if}

<style>
  img {
    width: 100%;
    height: auto;
  }
</style>
