<script lang="ts">
  import Options from "$lib/icons/Options.svelte"
  import { Button, Overlay } from "ftc-panels"
  import NavletContent from "$lib/navlets/NavletContent.svelte"
  import NavletsChoose from "./NavletsChoose.svelte"
  import { setContext } from "svelte"
  import type { Manager } from "$lib/grid/widgets.svelte"
  import Add from "$lib/icons/Add.svelte"
  import Delete from "$lib/icons/Delete.svelte"

  let {
    manager = $bindable(),
  }: {
    manager: Manager
  } = $props()

  setContext("manager", manager)
</script>

<div class="main">
  {#each manager.navlets as navlet}
    {#if manager.isValidNavlet(navlet.pluginID, navlet.navletID)}
      <div class="navlet">
        <NavletContent pluginID={navlet.pluginID} widgetID={navlet.navletID} />
      </div>
    {/if}
  {/each}

  <Overlay triggerStyle={"margin-top: 6px;"}>
    {#snippet trigger()}
      <div class="options">
        <Options />
      </div>
    {/snippet}
    {#snippet overlay({ close }: { close: () => void })}
      <div class="menu">
        {#each manager.navlets as navlet, index}
          {#if manager.isValidNavlet(navlet.pluginID, navlet.navletID)}
            <Button>{navlet.pluginID} / {navlet.navletID}</Button>

            <Button
              transparent={true}
              onclick={() => manager.removeNavlet(index)}
            >
              <Delete />
            </Button>
          {:else}
            <NavletsChoose
              set={(pID, wID) => {
                navlet.pluginID = pID
                navlet.navletID = wID
              }}
            />
          {/if}
        {/each}

        <Button
          style="grid-column-start: span 2;"
          onclick={() => {
            manager.addNavlet()
          }}
        >
          <Add />
        </Button>
      </div>
    {/snippet}
  </Overlay>
</div>

<style>
  .main {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    height: 100%;
    flex-grow: 1;
    min-width: 0;
    overflow-x: auto;
    padding-block: var(--space-1);
  }
  .navlet {
    min-width: 0;
    display: flex;
    align-items: center;
  }
  .menu {
    display: grid;
    gap: var(--space-2);
    padding: var(--space-2);
    grid-template-columns: auto 32px;
    border-radius: var(--radius-md);
    background: color-mix(in srgb, var(--bgRaised) 94%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 88%, white 12%);
    box-shadow: var(--shadow-md);
  }

  .options {
    width: 2rem;
    height: 2rem;
    border-radius: var(--radius-sm);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 70%, transparent);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color-mix(in srgb, var(--bgDark) 48%, transparent);
  }
</style>
