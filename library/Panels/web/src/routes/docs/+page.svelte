<script lang="ts">
  import { global } from "$lib"
</script>

<h1>Docs</h1>
<a href="https://panels.bylazar.com" target="_blank" rel="noopener noreferrer"
  >Official Docs</a
>

<style>
  h1 {
    margin: var(--space-2) var(--space-1) var(--space-2);
    font-size: clamp(1.35rem, 0.6vw + 1.15rem, 1.9rem);
    letter-spacing: 0.02em;
  }
  a {
    margin: 0 var(--space-1);
    padding: 0.35rem 0.65rem;
    border-radius: var(--radius-sm);
    border: 1px solid color-mix(in srgb, var(--primary) 45%, transparent);
    background-color: color-mix(in srgb, var(--bgLight) 30%, transparent);
    text-decoration: none;
  }
  a:hover {
    background-color: color-mix(in srgb, var(--primary) 16%, var(--bgLight) 84%);
  }
</style>
