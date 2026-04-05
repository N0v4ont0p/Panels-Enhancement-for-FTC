<script lang="ts">
  import { global } from "$lib"
  import { Button, type Notification } from "ftc-panels"
  import { fly } from "svelte/transition"

  let date = $state(Date.now())

  $effect(() => {
    const interval = setInterval(() => {
      date = Date.now()
    }, 250)

    return () => {
      clearInterval(interval)
    }
  })

  function getSimple(notifications: Notification[]) {
    return notifications.filter((it) => it.actions.length <= 0)
  }
  function getActions(notifications: Notification[]) {
    return notifications
      .filter((it) => it.actions.length > 0)
      .filter((it) => !it.executedAction)
  }
</script>

<section>
  {#each getSimple(global.notifications).filter((it) => date - it.timestamp <= 3000) as notif}
    <div
      class="notif"
      in:fly={{ y: -10, opacity: 0, duration: 200 }}
      out:fly={{ y: -10, opacity: 0, duration: 300 }}
    >
      <p>{notif.text}</p>
    </div>
  {/each}
</section>
<section>
  {#each getActions(global.notifications) as notif}
    <div
      class="notif"
      in:fly={{ y: -10, opacity: 0, duration: 200 }}
      out:fly={{ y: -10, opacity: 0, duration: 300 }}
    >
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
  {/each}
</section>

<style>
  section {
    position: absolute;
    top: var(--padding);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 100;
  }
  .notif {
    border: 1px solid #505151;
    border: 1px solid color-mix(in srgb, var(--bgLight) 85%, white 15%);
    background-color: rgba(33, 34, 34, 0.88);
    background-color: color-mix(in srgb, var(--bgMedium) 88%, transparent);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 0.55em 1.1em;
    border-radius: var(--radius-md);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
    margin-bottom: var(--space-2);
    min-width: 200px;
  }
  p.center {
    text-align: center;
  }
  .flex {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
  }
</style>
