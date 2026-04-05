<script lang="ts">
  import { global } from "$lib"
  import PluginsWidget from "$lib/plugins/PluginsWidget.svelte"
  import Section from "$lib/Section.svelte"
</script>

<h1>Plugins</h1>
<section class="plugins-grid">
  {#each global.plugins as plugin}
    <PluginsWidget {plugin} isDev={global.devPlugins.includes(plugin.details.id)} />
  {/each}

  {#each global.skippedPlugins as plugin}
    <Section>
      <h2>
        {plugin.name}
        <span>Skipped</span>
      </h2>
      <p class="meta">{plugin.id}</p>
      <p class="meta">{plugin.author}</p>
      {#if plugin.websiteURL}
        <a href={plugin.websiteURL} target="_blank" rel="noreferrer">
          Website: {plugin.websiteURL}
        </a>
      {:else}
        <span style="opacity: 0.6;">No website</span>
      {/if}
      <p>{plugin.description}</p>
    </Section>
  {/each}
</section>

<style>
  h1 {
    margin: var(--space-2) var(--space-2) var(--space-3);
    font-size: clamp(1.35rem, 0.6vw + 1.15rem, 1.9rem);
    letter-spacing: 0.02em;
  }
  h2,
  p {
    margin: 0;
  }
  h2 {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: 1.06rem;
  }
  h2 span {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.18rem 0.46rem;
    border-radius: 999px;
    background: rgba(230, 0, 18, 0.18);
    border: 1px solid rgba(230, 0, 18, 0.55);
  }
  p {
    margin: var(--space-1);
    line-height: 1.45;
  }
  p.meta {
    color: var(--mutedText);
    font-size: 0.86rem;
  }
  .plugins-grid {
    display: grid;
    gap: var(--space-3);
    padding: 0 var(--space-1) var(--space-2);
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }
</style>
