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
    background-color: var(--bgMedium);
    padding: var(--space-3);
    border-radius: var(--radius-lg);
    overflow: auto;
    position: relative;
    border: 1px solid #505151;
    border: 1px solid color-mix(in srgb, var(--bgLight) 85%, white 15%);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  }
  section.transparent {
    background-color: transparent;
  }
  section.margin {
    margin-bottom: var(--space-2);
  }
</style>
