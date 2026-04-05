<script lang="ts">
  import type { Snippet } from "svelte"

  let { children }: { children?: Snippet } = $props()
</script>

<section>
  {@render children?.()}
</section>

<style>
  section {
    margin: var(--space-1);
    overflow-y: auto;
    padding: var(--space-1);
    border-radius: var(--radius-md);
    background-color: color-mix(in srgb, var(--bgDark) 28%, transparent);
    border: 1px solid color-mix(in srgb, var(--border-subtle) 55%, transparent);
  }
</style>
