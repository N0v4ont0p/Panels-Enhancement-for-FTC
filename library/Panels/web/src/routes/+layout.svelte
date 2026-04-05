<script lang="ts">
  import { setContext, type Snippet } from "svelte"
  import Topbar from "$lib/Topbar.svelte"
  import { global } from "$lib"
  import "./global.css"

  import NotificationsUi from "$lib/NotificationsUI.svelte"
  import { manager } from "$lib/grid/widgets.svelte"
  import CanvasRender from "$lib/grid/CanvasRender.svelte"

  setContext("manager", manager.manager)

  let { children }: { children?: Snippet } = $props()
</script>

<NotificationsUi />
<section>
  <Topbar />

  {#if global.isPrepared || global.plugins.filter((it) => it.details.id != "com.bylazar.panels").length > 0}
    {@render children?.()}
  {/if}

  {#if global.isConnected}
    {#each global.allTemplates as t}
      <CanvasRender {t} pID={t.pluginID} show={false} />
    {/each}
  {/if}
</section>

<style>
  section {
    overflow: hidden;
    width: 100%;
    height: 100dvh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--console-content-gutter);
    max-width: var(--console-max-width);
    margin: 0 auto;
  }

  @supports not (height: 100dvh) {
    section {
      height: 100vh;
    }
  }
</style>
