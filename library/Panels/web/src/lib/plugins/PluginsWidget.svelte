<script lang="ts">
  import { Button, type PluginInfo } from "ftc-panels"
  import Section from "$lib/Section.svelte"
  import { goto } from "$app/navigation"
  import { PluginDetails } from "ftc-panels-docs"

  let {
    plugin,
    isDev = false,
  }: {
    plugin: PluginInfo
    isDev?: boolean
  } = $props()
</script>

<Section>
  {#if isDev}
    <span>DEV</span>
  {/if}
  <PluginDetails
    plugin={plugin.details}
    transparent={true}
    showIncludedPlugins={false}
  >
    <div class="main-buttons">
      <Button
        onclick={() => {
          goto(`/plugins/${plugin.details.id}`)
        }}
        >Details
      </Button>
    </div>
  </PluginDetails>
</Section>

<style>
  .main-buttons {
    display: flex;
    flex-direction: column;
    margin-top: var(--space-3);
    gap: var(--space-2);
  }
  span {
    position: absolute;
    top: var(--space-2);
    right: var(--space-2);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.72rem;
    padding: 0.22rem 0.48rem;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--primary) 20%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 45%, transparent);
  }
</style>
