<script lang="ts">
  import type { Snippet } from "svelte"

  let { children, margin = false, transparent = false }: { children?: Snippet; margin?: boolean; transparent?: boolean } =
    $props()
</script>

<section class:margin class:transparent>
  {@render children?.()}
</section>

<style>
  section {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--bgMedium) 92%, #111c2a 8%),
      color-mix(in srgb, var(--bgMedium) 98%, #111c2a 2%)
    );
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    overflow: auto;
    position: relative;
    border: 1px solid color-mix(in srgb, var(--border-subtle) 88%, white 12%);
    box-shadow: var(--shadow-sm);
  }
  section.transparent {
    background-color: transparent;
  }
  section.margin {
    margin-bottom: var(--space-2);
  }
</style>
