<script lang="ts">
  import { onMount, setContext, tick, untrack, type Snippet } from "svelte"
  import html2canvas from "html2canvas"
  import Layout from "./Layout.svelte"
  import { Manager } from "./widgets.svelte"
  import type { Template } from "ftc-panels"
  import { global } from "$lib"

  import Topbar from "$lib/Topbar.svelte"

  let { t, pID }: { t: Template; pID: string } = $props()

  const cacheKey = $derived(`${pID}/${t.name}`)

  let m: Manager = $state(untrack(() => new Manager(t)))
  let targetElement: HTMLDivElement
  let imageDataUrl: string = $state("")

  setContext("manager", untrack(() => m))

  async function renderAsImage() {
    if (!targetElement) return

    const renderedCanvas = await html2canvas(targetElement, {
      backgroundColor: null,
    })

    imageDataUrl = renderedCanvas.toDataURL("image/png")
    targetElement.remove()

    global.pluginsTemplatesPreviews[cacheKey] = imageDataUrl
  }

  async function waitForStableRender(ticks = 3) {
    for (let i = 0; i < ticks; i++) {
      await tick()
    }
  }

  onMount(async () => {
    await waitForStableRender(6)
    await renderAsImage()
  })
</script>

<div
  bind:this={targetElement}
  style="width: 1400px; height: 600px; position: absolute; top: -9999px; left: -9999px;"
>
  <section>
    <Topbar />

    <Layout bind:manager={m} enableInteractions={false} />
  </section>
</div>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
</style>
