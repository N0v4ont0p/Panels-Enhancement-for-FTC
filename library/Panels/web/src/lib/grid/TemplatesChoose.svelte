<script lang="ts">
  import { Button, Overlay } from "ftc-panels"
  import CanvasRender from "./CanvasRender.svelte"
  import type { Template } from "ftc-panels"
  import { global } from "$lib"

  let { set }: { set: (t: Template) => void } = $props()
</script>

<Overlay triggerStyle={"flex-grow: 1;"}>
  {#snippet trigger()}
    <Button style={"width: 100%;"}>Templates</Button>
  {/snippet}
  {#snippet overlay({ close }: { close: () => void })}
    <div class="possibilities">
      {#each global.allTemplates as t}
        <button
          class="choose"
          disabled={t.missingPlugins.length > 0}
          onclick={() => {
            close()
            set(t)
          }}
        >
          <p>
            {global.plugins.find((it) => it.details.id == t.pluginID)?.details
              .name}
          </p>
          <h4>{t.name}</h4>
          <CanvasRender {t} pID={t.pluginID} />
        </button>
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
    width: min(960px, calc(100vw - 2rem));
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-3);
    padding: var(--space-3);
    max-height: min(78vh, 760px);
    overflow: auto;
  }
  button.choose {
    all: unset;
    cursor: pointer;
    background-color: var(--bgLight);
    padding: var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid color-mix(in srgb, var(--bgLight) 80%, white 20%);
  }
  button.choose:hover:not(:disabled) {
    border-color: color-mix(in srgb, var(--primary) 35%, var(--bgLight));
  }
  button:disabled {
    opacity: 0.45;
  }
</style>
