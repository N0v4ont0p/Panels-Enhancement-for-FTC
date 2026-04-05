<script lang="ts">
  import { global } from "$lib"
  import { Button } from "ftc-panels"
</script>

{#each global.notifications
  .slice()
  .sort((a, b) => b.timestamp - a.timestamp) as notif, index}
  {#if notif.actions.length == 0}
    <div class="notif" class:notLast={index != global.notifications.length - 1}>
      <p>{notif.text}</p>
    </div>
  {:else}
    <div class="notif" class:notLast={index != global.notifications.length - 1}>
      <p class="center">{notif.text}</p>
      <div class="flex">
        {#each notif.actions as action}
          <Button
            onclick={() => {
              action.task()
            }}
          >
            {action.text}
          </Button>
        {/each}
      </div>
    </div>
  {/if}
{/each}

<style>
  .notif {
    width: 100%;
    padding-block: var(--space-2);
    padding-inline: var(--space-1);
  }
  p {
    max-width: 100%;
    overflow-x: auto;
    line-height: 1.4;
  }
  .notLast {
    border-bottom: 1px solid color-mix(in srgb, var(--border-subtle) 65%, transparent);
  }
  p.center {
    text-align: center;
  }
  .flex {
    display: flex;
    gap: var(--space-2);
    justify-content: center;
    flex-wrap: wrap;
    margin-top: var(--space-2);
  }
</style>
