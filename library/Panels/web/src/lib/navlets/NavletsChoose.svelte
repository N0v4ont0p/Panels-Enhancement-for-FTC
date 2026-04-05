<script lang="ts">
  import { global } from "$lib"
  import PreviewBox from "$lib/grid/PreviewBox.svelte"
  import { Button, Overlay } from "ftc-panels"
  import NavletContent from "./NavletContent.svelte"
  import { getContext } from "svelte"
  import type { Manager } from "$lib/grid/widgets.svelte"
  const manager = getContext("manager") as Manager

  let { set }: { set: (pID: string, wID: string) => void } = $props()
</script>

<Overlay>
  {#snippet trigger()}
    <Button>Choose</Button>
  {/snippet}
  {#snippet overlay({ close }: { close: () => void })}
    <div class="possibilities">
      {#each global.plugins as p}
        {#each p.details.components.filter(it => it.type === "navlet") as w}
          <button
            class="choose"
            onclick={() => {
              close()
              set(p.details.id, w.id)
              manager.save()
            }}
          >
            <p>{p.details.name}</p>
            <h4>{w.id}</h4>
            <PreviewBox scale={1.75}>
              <NavletContent pluginID={p.details.id} widgetID={w.id} />
            </PreviewBox>
          </button>
        {/each}
      {/each}
    </div>
  {/snippet}
</Overlay>

<style>
  h4,
  p {
    margin: 0;
    text-align: center;
  }
  p {
    font-size: 0.86rem;
    opacity: 0.8;
  }
  h4 {
    margin-bottom: var(--space-2);
    font-size: 1rem;
  }
  .possibilities {
    width: min(920px, calc(100vw - 2rem));
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: var(--space-3);
    padding: var(--space-3);
    max-height: min(78vh, 760px);
    overflow: auto;
  }
  button.choose {
    all: unset;
    cursor: pointer;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--bgMedium) 90%, #111b2a 10%),
      color-mix(in srgb, var(--bgMedium) 96%, #111b2a 4%)
    );
    padding: var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 84%, white 16%);
    box-shadow: var(--shadow-sm);
  }
  button.choose:hover {
    border-color: color-mix(in srgb, var(--primary) 35%, var(--bgLight));
    transform: translateY(-1px);
  }
</style>
